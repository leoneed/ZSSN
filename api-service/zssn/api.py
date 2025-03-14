from typing import List
from ninja import NinjaAPI
from django.db import transaction

from zssn.models import Inventory, Item, Survivor
from zssn.schemas import SurvivorCreateSchema, SurvivorSchema

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
    try:
        with transaction.atomic():
            survivor = Survivor.objects.create(
                name=new_survivor.name,
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
        return api.create_response(request, {"error": "Invalid item"})


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
