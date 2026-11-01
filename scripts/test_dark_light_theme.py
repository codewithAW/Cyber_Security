# -*- coding: utf-8 -*-
"""
Playwright automated test script for STUDYVERSE Dark/Light Mode
"""
import sys
import time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
ARTIFACT_DIR = r"C:\Users\337ab\.gemini\antigravity\brain\c18a04b2-87f4-4a72-aa15-eec3d058e6d7"

def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="msedge")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        print("1. Loading http://localhost:4173/#notes ...")
        page.goto("http://localhost:4173/#notes")
        page.wait_for_selector(".chapter-article", timeout=10000)
        
        # Verify default theme is dark
        initial_theme = page.locator("html").get_attribute("data-theme")
        print(f"   Initial Theme: {initial_theme}")
        assert initial_theme == "dark", "Default theme should be dark as requested"
        
        # Verify dark mode text color
        title_color_dark = page.locator(".chapter-title").evaluate("el => getComputedStyle(el).color")
        print(f"   Dark Mode Title Color: {title_color_dark}")
        assert "255, 255, 255" in title_color_dark or "232, 242, 255" in title_color_dark, "Dark mode text should be light"
        
        # Test Theme Toggle Button
        toggle_btn = page.locator(".theme-toggle-btn")
        assert toggle_btn.count() > 0, "Theme toggle button should be present in header"
        print("   ✓ Found theme toggle button in header")
        
        # Toggle to LIGHT MODE
        print("\n2. Toggling to LIGHT MODE...")
        toggle_btn.click()
        time.sleep(0.5)
        
        light_theme = page.locator("html").get_attribute("data-theme")
        print(f"   Theme after click: {light_theme}")
        assert light_theme == "light", "Theme should switch to light"
        
        # Verify light mode text color (should be darkish!)
        title_color_light = page.locator(".chapter-title").evaluate("el => getComputedStyle(el).color")
        p_color_light = page.locator(".content-p").first.evaluate("el => getComputedStyle(el).color")
        bg_color_light = page.locator(".complete-notes-page").evaluate("el => getComputedStyle(el).backgroundColor")
        sidebar_bg_light = page.locator(".notes-sidebar").evaluate("el => getComputedStyle(el).backgroundColor")
        
        print(f"   Light Mode Title Color: {title_color_light} (should be dark slate rgb(15, 23, 42))")
        print(f"   Light Mode Paragraph Color: {p_color_light} (should be dark slate rgb(30, 41, 59))")
        print(f"   Light Mode Page Background: {bg_color_light}")
        print(f"   Light Mode Sidebar Background: {sidebar_bg_light}")
        
        assert "15, 23, 42" in title_color_light, "Light mode title should be darkish #0F172A"
        assert "30, 41, 59" in p_color_light, "Light mode paragraph should be darkish #1E293B"
        
        # Check Technical Visual in Light Mode
        print("\n3. Capturing Light Mode Visual Artifacts...")
        tech_vis = page.locator(".chapter-technical-visual-wrapper")
        tech_vis.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_light_technical_visual.png")
        print("   ✓ Captured light mode Technical SVG screenshot")
        
        # Check Attack Visualization in Light Mode
        attack_vis = page.locator(".attack-visualization-card").first
        attack_vis.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_light_attack_diagram.png")
        print("   ✓ Captured light mode Attack Diagram screenshot")
        
        # Check Practical Lab in Light Mode
        prac_vis = page.locator(".practical-card").first
        prac_vis.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_light_practical_lab.png")
        print("   ✓ Captured light mode Practical Lab screenshot")
        
        # Check Notes Page Hero in Light Mode
        page.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_light_notes_page.png")
        print("   ✓ Captured light mode Complete Notes page screenshot")
        
        # Check Homepage in Light Mode
        print("\n4. Testing Homepage in Light Mode...")
        page.locator(".site-header a.brand").click()
        time.sleep(0.5)
        page.wait_for_selector(".hero-headline", timeout=5000)
        hero_title_light = page.locator(".hero-headline").evaluate("el => getComputedStyle(el).color")
        print(f"   Homepage Hero Title Color in Light Mode: {hero_title_light}")
        assert "15, 23, 42" in hero_title_light, "Homepage hero title should be darkish in light mode"
        page.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_light_homepage.png")
        print("   ✓ Captured light mode Homepage screenshot")
        
        # Toggle back to DARK MODE
        print("\n5. Toggling back to DARK MODE...")
        page.locator(".theme-toggle-btn").click()
        time.sleep(0.5)
        back_to_dark = page.locator("html").get_attribute("data-theme")
        print(f"   Theme after second click: {back_to_dark}")
        assert back_to_dark == "dark", "Theme should toggle back to dark mode"
        
        hero_title_dark = page.locator(".hero-headline").evaluate("el => getComputedStyle(el).color")
        print(f"   Homepage Hero Title Color back in Dark Mode: {hero_title_dark}")
        assert "255, 255, 255" in hero_title_dark or "232, 242, 255" in hero_title_dark, "Dark mode text should be restored to light"
        
        # Test Mobile Viewport in Light Mode
        print("\n6. Testing Mobile Viewport (390x844) in Light Mode...")
        page.set_viewport_size({"width": 390, "height": 844})
        page.locator(".theme-toggle-btn").click() # Switch to light
        time.sleep(0.5)
        page.goto("http://localhost:4173/#notes")
        page.wait_for_selector(".chapter-article", timeout=5000)
        page.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_light_mobile_notes.png")
        print("   ✓ Captured light mode mobile 390x844 screenshot")
        
        browser.close()
        print("\n🎉 ALL DARK AND LIGHT MODE TESTS PASSED FLAWLESSLY!")

if __name__ == "__main__":
    run_tests()
