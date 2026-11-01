import sys, os
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
ARTIFACT_DIR = r'C:\Users\337ab\.gemini\antigravity\brain\c18a04b2-87f4-4a72-aa15-eec3d058e6d7'

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.add_init_script("localStorage.setItem('studyverse-theme', 'light')")
    page.goto('http://localhost:5173/')
    page.wait_for_timeout(1000)
    
    # Scroll to 45% (AWA sequence)
    total_height = page.evaluate("document.body.scrollHeight")
    page.evaluate(f"window.scrollTo(0, {total_height * 0.45})")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(ARTIFACT_DIR, 'homepage_light_awa.png'))
    print('Captured homepage_light_awa.png')
    
    # Scroll to bottom (footer)
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(ARTIFACT_DIR, 'homepage_light_footer.png'))
    print('Captured homepage_light_footer.png')
    
    browser.close()
