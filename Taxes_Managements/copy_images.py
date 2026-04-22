import shutil
import os

src_dir = r"C:\Users\Metre Yves\.gemini\antigravity\brain\c0eff7be-c343-4d2c-b7e2-05d8f0ef24e2"
dest_dir = r"c:\Users\Metre Yves\Music\Examen_genie_logiciel\Taxes_Managements\screenshots"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

files = {
    "dashboard_screenshot_1776805317355.png": "dashboard.png",
    "vendeurs_screenshot_final_1776805341691.png": "vendeurs.png",
    "rapports_screenshot_full_1776805348276.png": "rapports.png",
    "taxes_screenshot_full_1776805360816.png": "taxes.png",
    "collecte_screenshot_full_1776805365828.png": "collecte.png"
}

for src_name, dest_name in files.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} to {dest_name}")
    else:
        print(f"Source not found: {src_path}")
