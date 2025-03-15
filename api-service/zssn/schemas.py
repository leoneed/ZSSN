from typing import List, Literal
from ninja import Schema

from zssn.constants import GENDER


class InventoryCreateSchema(Schema):
    item_id: int
    quantity: int


class InventorySchema(Schema):
    item_id: int
    item_name: str
    quantity: int


class SurvivorCreateSchema(Schema):
    name: str
    age: int
    gender: Literal[
        "male", "female", "other"
    ]  # TODO: find a way to connect with GENDER constant
    latitude: float
    longitude: float
    inventory: List[InventoryCreateSchema]


class SurvivorSchema(Schema):
    id: int
    name: str
    age: int
    gender: str
    latitude: float
    longitude: float
    is_infected: bool
    inventory: List[InventorySchema]


class ItemSchema(Schema):
    id: int
    name: str
