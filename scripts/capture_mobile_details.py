# -*- coding: utf-8 -*-
import time
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\337ab\.gemini\antigravity\brain\c18a04b2-87f4-4a72-aa15-eec3d058e6d7"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="msedge")
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:4173/#notes/chapter-06")
    page.wait_for_selector(".chapter-title:has-text('SQL Injection')", timeout=5000)
    
    # Scroll to attack flow
    page.locator("#how-attacks-work").scroll_into_view_if_needed()
    time.sleep(0.5)
    page.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_mobile_attack_sqli.png")
    
    # Scroll to practical
    page.locator("#hands-on-practicals").scroll_into_view_if_needed()
    time.sleep(0.5)
    page.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_mobile_practical_sqli.png")
    
    browser.close()
    print("Mobile detail screenshots captured successfully!")

