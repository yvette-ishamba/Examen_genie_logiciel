"""
test_vendeurs.py - Unit tests for Vendeur endpoints.

Tested endpoints:
  POST /vendeurs/          (create a vendeur)
  GET  /vendeurs/          (list all vendeurs with status)
  GET  /vendeurs/{id}      (get a single vendeur)
"""


class TestCreateVendeur:
    """Tests for POST /vendeurs/"""

    def test_create_vendeur_success(self, client):
        """Create a new vendeur with valid data."""
        resp = client.post(
            "/vendeurs/",
            json={
                "nom": "Mbala",
                "prenom": "Jean",
                "identifiant_national": "CD-VD-001",
                "telephone": "0812345678",
                "emplacement": "Marché Central",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["nom"] == "Mbala"
        assert data["prenom"] == "Jean"
        assert data["identifiant_national"] == "CD-VD-001"
        assert "id" in data

    def test_create_vendeur_duplicate_id_nat_rejected(self, client):
        """Creating two vendeurs with the same identifiant_national returns 400."""
        payload = {
            "nom": "Dup",
            "prenom": "Vendeur",
            "identifiant_national": "CD-VD-DUP",
            "telephone": "0800000001",
            "emplacement": "Zone A",
        }
        client.post("/vendeurs/", json=payload)
        resp = client.post("/vendeurs/", json=payload)
        assert resp.status_code == 400
        assert "already registered" in resp.json()["detail"]


class TestGetVendeurs:
    """Tests for GET /vendeurs/ and GET /vendeurs/{id}"""

    def test_list_vendeurs_empty(self, client):
        """Empty database returns an empty list."""
        resp = client.get("/vendeurs/")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_list_vendeurs_returns_all(self, client):
        """All created vendeurs appear in the list."""
        client.post("/vendeurs/", json={"nom": "Alpha", "prenom": "A", "identifiant_national": "CD-A", "telephone": "0800000001", "emplacement": "Zone A"})
        client.post("/vendeurs/", json={"nom": "Beta", "prenom": "B", "identifiant_national": "CD-B", "telephone": "0800000002", "emplacement": "Zone B"})

        resp = client.get("/vendeurs/")
        assert resp.status_code == 200
        assert len(resp.json()) == 2

    def test_get_single_vendeur(self, client):
        """Fetch a single vendeur by its ID."""
        created = client.post(
            "/vendeurs/",
            json={"nom": "Solo", "prenom": "Test", "identifiant_national": "CD-SOLO", "telephone": "0812000000", "emplacement": "Marché Est"},
        ).json()
        vid = created["id"]

        resp = client.get(f"/vendeurs/{vid}")
        assert resp.status_code == 200
        assert resp.json()["nom"] == "Solo"

    def test_get_nonexistent_vendeur_returns_404(self, client):
        """Requesting an unknown vendeur ID returns 404."""
        resp = client.get("/vendeurs/99999")
        assert resp.status_code == 404

    def test_vendeur_status_fields_present(self, client):
        """Each item in the list contains status_daily, status_monthly, status_yearly."""
        client.post("/vendeurs/", json={"nom": "Status", "prenom": "Test", "identifiant_national": "CD-ST", "telephone": "0800099999", "emplacement": "Zone S"})

        resp = client.get("/vendeurs/")
        assert resp.status_code == 200
        item = resp.json()[0]
        assert "status_daily" in item
        assert "status_monthly" in item
        assert "status_yearly" in item
