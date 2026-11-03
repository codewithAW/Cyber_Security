import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

def test_screens():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        
        viewports = [
            ("mobile_notes_light", 390, 844, "http://localhost:5175/#notes/chapter-01", "light"),
            ("mobile_notes_dark", 390, 844, "http://localhost:5175/#notes/chapter-01", "dark"),
            ("tablet_notes_light", 768, 1024, "http://localhost:5175/#notes/chapter-01", "light"),
            ("mobile_practicals_hub", 390, 844, "http://localhost:5175/#practicals", "light"),
            ("mobile_practicals_sqli", 390, 844, "http://localhost:5175/#practicals/sql-injection", "light"),
            ("tablet_practicals_sqli", 768, 1024, "http://localhost:5175/#practicals/sql-injection", "light"),
            ("desktop_notes_light", 1440, 900, "http://localhost:5175/#notes/chapter-01", "light"),
        ]
        
        for name, w, h, url, theme in viewports:
            page = browser.new_page(viewport={"width": w, "height": h})
            page.goto(url)
            page.wait_for_load_state("networkidle")
            time.sleep(1.0)
            
            # Set theme
            page.evaluate(f"""() => {{
                document.documentElement.setAttribute('data-theme', '{theme}');
                localStorage.setItem('studyverse-theme', '{theme}');
            }}""")
            time.sleep(1.0)
            
            # Take screenshot of viewport
            screenshot_path = f"C:/Users/337ab/.gemini/antigravity/brain/c18a04b2-87f4-4a72-aa15-eec3d058e6d7/{name}.png"
            page.screenshot(path=screenshot_path)
            print(f"Captured {name} at {w}x{h} ({theme}) -> {screenshot_path}")
            
            # If notes, scroll down to the CIA Triad and capture it
            if "notes" in name:
                cia = page.locator(".technical-visual-container")
                if cia.count() > 0:
                    cia.first.scroll_into_view_if_needed()
                    time.sleep(0.5)
                    page.screenshot(path=f"C:/Users/337ab/.gemini/antigravity/brain/c18a04b2-87f4-4a72-aa15-eec3d058e6d7/{name}_cia.png")
                    print(f"Captured {name}_cia")
                    
                diag = page.locator(".diagram-card")
                if diag.count() > 0:
                    diag.first.scroll_into_view_if_needed()
                    time.sleep(0.5)
                    page.screenshot(path=f"C:/Users/337ab/.gemini/antigravity/brain/c18a04b2-87f4-4a72-aa15-eec3d058e6d7/{name}_diag.png")
                    print(f"Captured {name}_diag")
            
            page.close()
            
        browser.close()

if __name__ == "__main__":
    test_screens()

