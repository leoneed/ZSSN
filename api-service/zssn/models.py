from django.db import models
from datetime import date
from zssn.constants import GENDER


class Survivor(models.Model):
    name = models.CharField(max_length=100)
    age_on_registration = models.PositiveIntegerField()
    registration_year = models.PositiveIntegerField(default=date.today().year)
    gender = models.CharField(max_length=10, choices=GENDER)
    latitude = models.FloatField()
    longitude = models.FloatField()
    is_infected = models.BooleanField(default=False)
    infected_reported_by = models.ManyToManyField(
        "self",
        symmetrical=False,
        blank=True,
        related_name="infected_survivors_reported",
    )

    @property
    def age(self):
        return self.age_on_registration + date.today().year - self.registration_year


class Item(models.Model):
    name = models.CharField(max_length=30, unique=True)
    points = models.PositiveIntegerField()


class Inventory(models.Model):
    survivor = models.ForeignKey(
        Survivor, on_delete=models.CASCADE, related_name="inventory"
    )
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
