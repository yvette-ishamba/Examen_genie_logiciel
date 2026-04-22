"""
test_taxes.py - Unit tests for Taxes endpoints.

Tested endpoints:
  POST /taxes/          (create a tax)
  GET  /taxes/          (list all taxes)
  GET  /taxes/{id}      (get a single tax)
  DELETE /taxes/{id}    (delete a tax)

Note: The MySQL DB may already have data, so list assertions are relative.
"""
import uuid


def _unique_nom():
    return f"Taxe-{uuid.uuid4().hex[:8]}"


class TestCreateTaxe:
    """Tests for POST /taxes/"""

    def test_create_taxe_success(self, client):
        """Create a new taxe with valid data."""
        resp = client.post(
            "/taxes/",
            json={
                "nom": _unique_nom(),
                "montant_base": 1500.0,
                "frequence": "Journalière",
                "description": "Taxe journalière du marché",
                "prix_libre": False,
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["montant_base"] == 1500.0
        assert data["frequence"] == "Journalière"
        assert "id" in data

    def test_create_taxe_prix_libre(self, client):
        """Create a taxe with free price enabled."""
        resp = client.post(
            "/taxes/",
            json={
                "nom": _unique_nom(),
                "montant_base": 0.0,
                "frequence": "Mensuelle",
                "description": "Montant variable",
                "prix_libre": True,
            },
        )
        assert resp.status_code == 200
        assert resp.json()["prix_libre"] is True


class TestGetTaxes:
    """Tests for GET /taxes/ and GET /taxes/{id}"""

    def test_list_taxes_returns_list(self, client):
        """Endpoint always returns a JSON list."""
        resp = client.get("/taxes/")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_list_taxes_count_increases(self, client):
        """Count increases by 2 after adding 2 taxes."""
        count_before = len(client.get("/taxes/").json())

        client.post("/taxes/", json={"nom": _unique_nom(), "montant_base": 100, "frequence": "Journalière", "description": "", "prix_libre": False})
        client.post("/taxes/", json={"nom": _unique_nom(), "montant_base": 200, "frequence": "Mensuelle", "description": "", "prix_libre": False})

        count_after = len(client.get("/taxes/").json())
        assert count_after == count_before + 2

    def test_get_single_taxe(self, client):
        """Fetch a single taxe by its ID."""
        nom = _unique_nom()
        created = client.post(
            "/taxes/",
            json={"nom": nom, "montant_base": 500, "frequence": "Annuelle", "description": "D", "prix_libre": False},
        ).json()
        taxe_id = created["id"]

        resp = client.get(f"/taxes/{taxe_id}")
        assert resp.status_code == 200
        assert resp.json()["nom"] == nom

    def test_get_nonexistent_taxe_returns_404(self, client):
        """Requesting a non-existent taxe ID returns 404."""
        resp = client.get("/taxes/9999999")
        assert resp.status_code == 404


class TestDeleteTaxe:
    """Tests for DELETE /taxes/{id}"""

    def test_delete_taxe_success(self, client):
        """A taxe with no payments can be deleted."""
        created = client.post(
            "/taxes/",
            json={"nom": _unique_nom(), "montant_base": 100, "frequence": "Journalière", "description": "", "prix_libre": False},
        ).json()
        taxe_id = created["id"]

        resp = client.delete(f"/taxes/{taxe_id}")
        assert resp.status_code == 200
        assert resp.json()["ok"] is True

        # Confirm it is gone
        assert client.get(f"/taxes/{taxe_id}").status_code == 404

    def test_delete_nonexistent_taxe_returns_404(self, client):
        """Deleting a non-existent taxe returns 404."""
        resp = client.delete("/taxes/88888888")
        assert resp.status_code == 404
