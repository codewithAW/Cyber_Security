import os
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
BASE_URL = "http://localhost:5173"
ARTIFACTS_DIR = r"C:\Users\337ab\.gemini\antigravity\brain\c18a04b2-87f4-4a72-aa15-eec3d058e6d7"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    page = browser.new_page(viewport={"width": 1440, "height": 900})

    # 1. 404 View
    page.goto(f"{BASE_URL}/#practicals/chapter-99/fake-lab")
    page.wait_for_selector(".practical-not-found-view")
    page.screenshot(path=os.path.join(ARTIFACTS_DIR, "practicals_404_view.png"))

    # 2. Hub View
    page.click(".btn-return-hub")
    page.wait_for_selector(".practicals-grid")
    page.screenshot(path=os.path.join(ARTIFACTS_DIR, "practicals_hub_verified.png"))

    # 3. Light Mode 404 & Workspace
    page.click(".theme-toggle-btn") # toggle to light mode
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(ARTIFACTS_DIR, "practicals_hub_light_mode.png"))

    # 4. Open Lab in Light Mode
    page.click(".btn-start-practical >> nth=0")
    page.wait_for_selector(".workspace-root")
    page.screenshot(path=os.path.join(ARTIFACTS_DIR, "practicals_workspace_light_mode.png"))

    browser.close()
    print("Evidence screenshots captured successfully.")

