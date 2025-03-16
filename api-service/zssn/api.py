from datetime import date
from typing import List
from django.db.models import QuerySet
from ninja import NinjaAPI
from django.db import IntegrityError, transaction

from zssn.models import Inventory, Item, Survivor
from zssn.schemas import (
    InfectionReportSchema,
    ItemSchema,
    LocationUpdateSchema,
    SurvivorCreateSchema,
    SurvivorSchema,
    TradeItemSchema,
    TradeSchema,
)

api = NinjaAPI()


def format_survivor(survivor):
    return {
        "id": survivor.id,
        "name": survivor.name,
        "age": survivor.age,
        "gender": survivor.gender,
        "latitude": survivor.latitude,
        "longitude": survivor.longitude,
        "is_infected": survivor.is_infected,
        "inventory": [
            {
                "item_id": inv.item.id,
                "item_name": inv.item.name,
                "quantity": inv.quantity,
            }
            for inv in survivor.inventory.all()
        ],
    }


@api.post("survivors", response=SurvivorSchema)
def create_survivor(request, new_survivor: SurvivorCreateSchema):
    if (not (-90 <= new_survivor.latitude <= 90)) or (
        not (-180 <= new_survivor.longitude <= 180)
    ):
        return api.create_response(request, {"error": "Wrong location"}, status=400)

    if new_survivor.age < 1 or new_survivor.age > 130:
        return api.create_response(
            request, {"error": "Survivor age is not realistic"}, status=400
        )

    if not new_survivor.name.strip():
        return api.create_response(
            request, {"error": "Whould be nice to know your name"}, status=400
        )

    try:
        with transaction.atomic():
            survivor = Survivor.objects.create(
                name=new_survivor.name.strip(),
                age_on_registration=new_survivor.age,
                gender=new_survivor.gender,
                latitude=new_survivor.latitude,
                longitude=new_survivor.longitude,
            )

            for inv in new_survivor.inventory:
                item = Item.objects.get(id=inv.item_id)
                Inventory.objects.create(
                    survivor=survivor, item=item, quantity=inv.quantity
                )

            survivor.refresh_from_db()

            return format_survivor(survivor)
    except Item.DoesNotExist:
        return api.create_response(request, {"error": "Invalid item"}, status=400)
    except IntegrityError:
        return api.create_response(
            request, {"error": "Items can't be added to inventory twice"}, status=400
        )


@api.put("/survivors/{survivor_id}/location")
def update_location(request, survivor_id: int, new_location: LocationUpdateSchema):
    try:
        survivor = Survivor.objects.get(id=survivor_id)
    except Survivor.DoesNotExist:
        return api.create_response(request, {"error": "Survivor not found"}, status=404)

    if survivor.is_infected:
        return api.create_response(
            request, {"error": "Survivor infected :("}, status=403
        )

    if (not (-90 <= new_location.latitude <= 90)) or (
        not (-180 <= new_location.longitude <= 180)
    ):
        return api.create_response(request, {"error": "Wrong location"}, status=400)

    if (
        survivor.latitude == new_location.latitude
        and survivor.longitude == new_location.longitude
    ):
        return api.create_response(
            request, {"message": "Location is already up to date"}, status=200
        )

    survivor.latitude = new_location.latitude
    survivor.longitude = new_location.longitude
    survivor.save()

    return api.create_response(
        request, {"message": "Location updated successfully"}, status=200
    )


@api.get("survivors/{survivor_id}", response=SurvivorSchema)
def get_survivor_by_id(request, survivor_id: int):
    try:
        survivor = Survivor.objects.get(id=survivor_id)
        return format_survivor(survivor)
    except Survivor.DoesNotExist:
        return api.create_response(request, {"error": "Survivor not found"}, status=404)


@api.get("survivors", response=List[SurvivorSchema])
def get_survivors_list(request):
    survivors = Survivor.objects.all()

    return [format_survivor(suv) for suv in survivors]


@api.get("items", response=List[ItemSchema])
def get_items_list(request):
    items = Item.objects.all()

    return items


@api.post("/survivors/{survivor_id}/report-infection")
def report_infection(request, survivor_id: int, payload: InfectionReportSchema):
    try:
        with transaction.atomic():
            infected_survivor = Survivor.objects.get(id=survivor_id)
            reporter = Survivor.objects.get(id=payload.reporter_id)

            if infected_survivor.is_infected:
                return api.create_response(
                    request, {"error": "Survivor is already infected"}, status=400
                )

            if infected_survivor.id == reporter.id:
                return api.create_response(
                    request,
                    {"error": "You cannot report yourself as infected"},
                    status=400,
                )

            if reporter in infected_survivor.infected_reported_by.all():
                return api.create_response(
                    request,
                    {"error": "You have already reported this survivor"},
                    status=400,
                )

            infected_survivor.infected_reported_by.add(reporter)
            infected_survivor.refresh_from_db()

            if infected_survivor.infected_reported_by.count() >= 3:
                infected_survivor.is_infected = True
                infected_survivor.date_infected = date.today()
                infected_survivor.save()

            return api.create_response(
                request,
                {"message": "Report submitted successfully"},
                status=200,
            )

    except Survivor.DoesNotExist:
        return api.create_response(request, {"error": "Survivor not found"}, status=404)


def sum_items_points(items: List[TradeItemSchema]) -> int:
    """Sum of all item points in the list"""
    total = 0

    for item in items:
        total += Item.objects.get(id=item.item_id).points * item.quantity

    return total


def transfer_items(
    items: List[TradeItemSchema],
    from_inventory: QuerySet[Inventory],
    to_survivor: Survivor,
):
    """Move items from"""
    for item in items:
        inv_item = from_inventory.get(item_id=item.item_id)
        inv_item.quantity -= item.quantity

        if inv_item.quantity == 0:
            inv_item.delete()
        else:
            inv_item.save()

        survivor_inv, _ = Inventory.objects.get_or_create(
            survivor=to_survivor, item_id=item.item_id, defaults={"quantity": 0}
        )
        survivor_inv.quantity += item.quantity
        survivor_inv.save()


@api.post("/survivors/{survivor_id}/trade")
def trade(request, survivor_id: int, trade: TradeSchema):
    try:
        with transaction.atomic():
            proposer = Survivor.objects.get(id=trade.proposer_id)
            recipient = Survivor.objects.get(id=survivor_id)

            if proposer.is_infected or recipient.is_infected:
                return api.create_response(
                    request, {"error": "Infected survivors cannot trade"}, status=400
                )

            if sum_items_points(trade.propose_items) != sum_items_points(
                trade.requested_items
            ):
                return api.create_response(
                    request, {"error": "This trade is not fair"}, status=400
                )

            proposer_inventory = Inventory.objects.filter(
                survivor=proposer
            ).select_for_update()
            recipient_inventory = Inventory.objects.filter(
                survivor=recipient
            ).select_for_update()

            for item in trade.propose_items:
                invItem = proposer_inventory.filter(item_id=item.item_id).first()

                if not invItem or invItem.quantity < item.quantity:
                    return api.create_response(
                        request,
                        {"error": "Proposer does not have enough items"},
                        status=400,
                    )

            for item in trade.requested_items:
                invItem = recipient_inventory.filter(item_id=item.item_id).first()

                if not invItem or invItem.quantity < item.quantity:
                    return api.create_response(
                        request,
                        {"error": "Recipient does not have enough items"},
                        status=400,
                    )

            transfer_items(trade.propose_items, proposer_inventory, recipient)
            transfer_items(trade.requested_items, recipient_inventory, proposer)

            return api.create_response(
                request, {"message": "Trade successful"}, status=200
            )

    except Survivor.DoesNotExist:
        return api.create_response(request, {"error": "Survivor not found"}, status=404)
    except Item.DoesNotExist:
        return api.create_response(request, {"error": "Item/s not found"}, status=404)
