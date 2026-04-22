"""
test_paiements.py - Unit tests for Paiements endpoints.

Tested endpoints:
  POST /paiements/    (create a paiement - requires auth)
  GET  /paiements/    (list paiements - public)
"""
from tests.conftest import make_user, get_token


def _create_taxe(client):
    """Helper: create a taxe and return its ID."""
    resp = client.post(
        "/taxes/",
        json={"nom": "Taxe Test", "montant_base": 1000.0, "frequence": "Journalière", "description": "", "prix_libre": False},
    )
    return resp.json()["id"]


def _create_vendeur(client, id_nat="CD-PAY-001"):
    """Helper: create a vendeur and return its ID."""
    resp = client.post(
        "/vendeurs/",
        json={"nom": "Payeur", "prenom": "Test", "identifiant_national": id_nat, "telephone": "0812000001", "emplacement": "Zone A"},
    )
    return resp.json()["id"]


class TestCreatePaiement:
    """Tests for POST /paiements/"""

    def test_create_paiement_success(self, client, db):
        """An authenticated agent can create a paiement."""
        make_user(db, email="agent@pay.com", password="agentpass")
        token = get_token(client, "agent@pay.com", "agentpass")
        taxe_id = _create_taxe(client)
        vendeur_id = _create_vendeur(client)

        resp = client.post(
            "/paiements/",
            json={
                "vendeur_id": vendeur_id,
                "taxe_id": taxe_id,
                "montant": 1000.0,
                "reference": "REF-001",
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["reference"] == "REF-001"
        assert data["montant"] == 1000.0

    def test_create_paiement_duplicate_reference_rejected(self, client, db):
        """Two paiements with the same reference are not allowed."""
        make_user(db, email="agent2@pay.com", password="agentpass")
        token = get_token(client, "agent2@pay.com", "agentpass")
        taxe_id = _create_taxe(client)
        vendeur_id = _create_vendeur(client, id_nat="CD-PAY-002")

        payload = {
            "vendeur_id": vendeur_id,
            "taxe_id": taxe_id,
            "montant": 500.0,
            "reference": "REF-DUP",
        }
        client.post("/paiements/", json=payload, headers={"Authorization": f"Bearer {token}"})
        resp = client.post("/paiements/", json=payload, headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 400
        assert "already exists" in resp.json()["detail"]

    def test_create_paiement_unauthenticated(self, client):
        """Creating a paiement without a token returns 401."""
        resp = client.post(
            "/paiements/",
            json={"vendeur_id": 1, "taxe_id": 1, "montant": 500.0, "reference": "NOAUTH"},
        )
        assert resp.status_code == 401


class TestListPaiements:
    """Tests for GET /paiements/"""

    def test_list_paiements_empty(self, client):
        """No paiements in DB returns empty list."""
        resp = client.get("/paiements/")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_list_paiements_returns_all(self, client, db):
        """Paiements appear in the list after creation."""
        make_user(db, email="listagent@pay.com", password="listpass")
        token = get_token(client, "listagent@pay.com", "listpass")
        taxe_id = _create_taxe(client)
        vendeur_id = _create_vendeur(client, id_nat="CD-PAY-003")

        client.post("/paiements/", json={"vendeur_id": vendeur_id, "taxe_id": taxe_id, "montant": 200.0, "reference": "REF-L1"}, headers={"Authorization": f"Bearer {token}"})
        client.post("/paiements/", json={"vendeur_id": vendeur_id, "taxe_id": taxe_id, "montant": 300.0, "reference": "REF-L2"}, headers={"Authorization": f"Bearer {token}"})

        resp = client.get("/paiements/")
        assert resp.status_code == 200
        assert len(resp.json()) == 2
