"""
test_signalements.py - Unit tests for Signalements endpoints.

Tested endpoints:
  POST /signalements/                 (create - requires auth)
  GET  /signalements/                 (list - public)
  PATCH /signalements/{id}/statut     (update status - Autorité Locale only)

Note: SignalementCreate uses 'sujet' (not 'titre') and no 'statut' field.
"""
from tests.conftest import make_user, get_token


class TestCreateSignalement:
    """Tests for POST /signalements/"""

    def test_create_signalement_success(self, client, db):
        """An authenticated user can submit a signalement."""
        make_user(db, email="reporter@test.com", password="reppass")
        token = get_token(client, "reporter@test.com", "reppass")

        resp = client.post(
            "/signalements/",
            json={
                "sujet": "Fraude detectee",
                "description": "Un vendeur refuse de payer la taxe journaliere.",
            },
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["sujet"] == "Fraude detectee"
        assert data["statut"] is not None
        assert "id" in data

    def test_create_signalement_unauthenticated(self, client):
        """Creating a signalement without a token returns 401."""
        resp = client.post(
            "/signalements/",
            json={"sujet": "Test", "description": "Desc"},
        )
        assert resp.status_code == 401


class TestListSignalements:
    """Tests for GET /signalements/"""

    def test_list_signalements_returns_list(self, client):
        """Endpoint returns a JSON list (may already contain existing data)."""
        resp = client.get("/signalements/")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_list_signalements_count_increases(self, client, db):
        """Count increases by 2 after creating 2 signalements."""
        make_user(db, email="lister@sig.com", password="listpass")
        token = get_token(client, "lister@sig.com", "listpass")

        count_before = len(client.get("/signalements/").json())

        client.post("/signalements/", json={"sujet": "S1", "description": "D1"}, headers={"Authorization": f"Bearer {token}"})
        client.post("/signalements/", json={"sujet": "S2", "description": "D2"}, headers={"Authorization": f"Bearer {token}"})

        count_after = len(client.get("/signalements/").json())
        assert count_after == count_before + 2


class TestUpdateSignalementStatut:
    """Tests for PATCH /signalements/{id}/statut"""

    def test_update_statut_as_autorite_locale(self, client, db):
        """Autorité Locale can change the status of a signalement."""
        # Agent submits
        make_user(db, email="rep2@sig.com", password="reppass2", role="Agent de Collect")
        rep_token = get_token(client, "rep2@sig.com", "reppass2")
        sig_resp = client.post(
            "/signalements/",
            json={"sujet": "Fraude", "description": "Desc"},
            headers={"Authorization": f"Bearer {rep_token}"},
        )
        assert sig_resp.status_code == 200, sig_resp.text
        sig_id = sig_resp.json()["id"]

        # Admin resolves it
        make_user(db, email="admin@sig.com", password="adminpass", role="Autorité Locale")
        admin_token = get_token(client, "admin@sig.com", "adminpass")
        resp = client.patch(
            f"/signalements/{sig_id}/statut",
            json={"statut": "résolu"},
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert resp.status_code == 200
        assert resp.json()["statut"] == "résolu"

    def test_update_statut_non_admin_forbidden(self, client, db):
        """A non-admin user cannot change the status of a signalement."""
        make_user(db, email="agent3@sig.com", password="agentpass3", role="Agent de Collect")
        agent_token = get_token(client, "agent3@sig.com", "agentpass3")

        sig_resp = client.post(
            "/signalements/",
            json={"sujet": "Probleme", "description": "Desc"},
            headers={"Authorization": f"Bearer {agent_token}"},
        )
        assert sig_resp.status_code == 200, sig_resp.text
        sig_id = sig_resp.json()["id"]

        resp = client.patch(
            f"/signalements/{sig_id}/statut",
            json={"statut": "résolu"},
            headers={"Authorization": f"Bearer {agent_token}"},
        )
        assert resp.status_code == 403
