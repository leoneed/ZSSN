from django.test import TestCase, Client
from zssn.models import Survivor


class SurvivorTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.client = Client()

    def test_create_survivor(self):
        response = self.client.post(
            "/api/survivors",
            {
                "name": "John Doe",
                "age": 30,
                "gender": "male",
                "latitude": 40.7128,
                "longitude": -74.0060,
                "inventory": [{"item_id": 1, "quantity": 2}],
            },
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Survivor.objects.count(), 1)

    def test_get_survivors(self):
        Survivor.objects.create(
            name="Alice",
            age_on_registration=25,
            gender="female",
            latitude=51.5074,
            longitude=-0.1278,
        )
        response = self.client.get("/api/survivors")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_update_survivor_location(self):
        survivor = Survivor.objects.create(
            name="Bob",
            age_on_registration=40,
            gender="male",
            latitude=10.0,
            longitude=20.0,
        )

        response = self.client.put(
            f"/api/survivors/{survivor.id}/location",
            {"latitude": 15.0, "longitude": 25.0},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        survivor.refresh_from_db()
        self.assertEqual(survivor.latitude, 15.0)
        self.assertEqual(survivor.longitude, 25.0)

    def test_report_infection(self):
        reporter = Survivor.objects.create(
            name="John",
            age_on_registration=30,
            gender="male",
            latitude=40.7128,
            longitude=-74.0060,
        )
        infected = Survivor.objects.create(
            name="Zombie",
            age_on_registration=40,
            gender="other",
            latitude=40.7128,
            longitude=-74.0060,
        )

        response = self.client.post(
            f"/api/survivors/{infected.id}/report-infection",
            {"reporter_id": reporter.id},
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 200)
        infected.refresh_from_db()
        self.assertEqual(infected.infected_reported_by.count(), 1)
