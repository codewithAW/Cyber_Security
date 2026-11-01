import sys
import os
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
ARTIFACT_DIR = r"C:\Users\337ab\.gemini\antigravity\brain\c18a04b2-87f4-4a72-aa15-eec3d058e6d7"

def run_suite():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 1. Homepage in Light Mode
        print("Navigating to Homepage in Light Mode...")
        page.add_init_script("localStorage.setItem('studyverse-theme', 'light')")
        page.goto("http://localhost:5173/#home")
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_home_hero.png"))
        print("Captured final_light_home_hero.png")

        # Scroll to midway AWA formation
        total_h = page.evaluate("document.body.scrollHeight")
        page.evaluate(f"window.scrollTo(0, {total_h * 0.45})")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_home_awa.png"))
        print("Captured final_light_home_awa.png")

        # 2. Practicals Hub in Light Mode
        print("Navigating to Practicals Hub in Light Mode...")
        page.goto("http://localhost:5173/#practicals")
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_practicals_hub.png"))
        print("Captured final_light_practicals_hub.png")

        # Scroll down in practicals hub to see practical cards & start lab buttons
        page.evaluate("window.scrollBy(0, 500)")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_practicals_cards.png"))
        print("Captured final_light_practicals_cards.png")

        # 3. Practical Workspace in Light Mode
        print("Navigating to SQLi Workspace in Light Mode...")
        page.goto("http://localhost:5173/#practicals/chapter-1/sql-injection")
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_workspace_sqli.png"))
        print("Captured final_light_workspace_sqli.png")

        # Scroll down in workspace to see hints, quiz, deep dive
        page.evaluate("window.scrollBy(0, 600)")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_workspace_quiz.png"))
        print("Captured final_light_workspace_quiz.png")

        # 4. Complete Notes in Light Mode
        print("Navigating to Complete Notes in Light Mode...")
        page.goto("http://localhost:5173/#notes")
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_notes_chapter.png"))
        print("Captured final_light_notes_chapter.png")

        # Scroll down in notes
        page.evaluate("window.scrollBy(0, 950)")
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_light_notes_content.png"))
        print("Captured final_light_notes_content.png")

        # 5. Check Dark Mode preservation
        print("Switching back to Dark Mode to confirm zero regressions...")
        page.evaluate("document.querySelector('.theme-toggle-btn').click()")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(ARTIFACT_DIR, "final_dark_mode_preservation.png"))
        print("Captured final_dark_mode_preservation.png")

        browser.close()
        print("All inspection screenshots captured successfully!")

if __name__ == "__main__":
    run_suite()

