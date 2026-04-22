import shutil
import os

src_dir = r"C:\Users\Metre Yves\.gemini\antigravity\brain\c0eff7be-c343-4d2c-b7e2-05d8f0ef24e2"
dest_dir = r"c:\Users\Metre Yves\Music\Examen_genie_logiciel\Taxes_Managements\screenshots"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

files = {
    "agent_collecte_1776806636873.png": "agent_collecte.png",
    "vendeur_dashboard_1776806696509.png": "vendeur_dashboard.png"
}

for src_name, dest_name in files.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} to {dest_name}")
    else:
        print(f"Source not found: {src_path}")
