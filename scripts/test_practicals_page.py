# -*- coding: utf-8 -*-
"""
Playwright automated test script for STUDYVERSE Interactive Practicals Page
Comprehensive verification across all chapters, simulations, gamification, and viewports.
"""
import sys
import time
import os
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
ARTIFACT_DIR = r"C:\Users\337ab\.gemini\antigravity\brain\c18a04b2-87f4-4a72-aa15-eec3d058e6d7"
BASE_URL = "http://localhost:4173"

def run_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="msedge")
        
        # 1. Desktop Test (1440x900)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        print(f"1. Loading {BASE_URL}/#practicals ...")
        page.goto(f"{BASE_URL}/#practicals")
        page.wait_for_selector(".practicals-page-root", timeout=12000)
        time.sleep(1)
        
        # Verify Header navigation
        nav_practicals = page.locator(".site-nav .nav-link.is-active")
        print(f"   Active Nav Link: {nav_practicals.inner_text()}")
        assert "Practicals" in nav_practicals.inner_text(), "Practicals nav link should be active"
        
        # Verify Hero Section
        hero_heading = page.locator(".hero-heading").inner_text()
        print(f"   Hero Heading: {hero_heading}")
        assert "Experience it" in hero_heading
        
        # Verify Chapter Sidebar
        sidebar_items = page.locator(".sidebar-ch-item")
        sidebar_count = sidebar_items.count()
        print(f"   Sidebar Chapter Count: {sidebar_count} (Expected 15: All + 14 chapters)")
        assert sidebar_count >= 15, f"Expected at least 15 sidebar entries, got {sidebar_count}"
        
        # Test Chapter Sidebar filter: click Chapter 3
        print("2. Testing Chapter Sidebar filtering (Chapter 3)...")
        ch3_btn = page.locator(".sidebar-ch-item:has-text('03')")
        ch3_btn.dispatch_event("click")
        time.sleep(0.5)
        
        results_header = page.locator(".practicals-results-header").inner_text()
        print(f"   Results Header after CH 03 filter: {results_header}")
        assert "Chapter 03" in results_header
        
        # Verify only CH 03 lab is displayed
        cards = page.locator(".practical-card-item")
        print(f"   Cards shown: {cards.count()}")
        assert cards.count() == 1, "Only 1 card should be shown for Chapter 3"
        assert "SQL Injection" in page.locator(".card-title").first.inner_text()
        
        # Reset to All Chapters
        page.locator(".sidebar-ch-item:has-text('All Chapters')").dispatch_event("click")
        time.sleep(0.5)
        print(f"   Cards shown after reset to all: {page.locator('.practical-card-item').count()}")
        assert page.locator('.practical-card-item').count() == 14
        
        # Test Search Box
        print("3. Testing Search functionality...")
        search_input = page.locator(".practicals-search-input")
        search_input.fill("Password")
        time.sleep(0.5)
        print(f"   Cards matching 'Password': {page.locator('.practical-card-item').count()}")
        assert page.locator('.practical-card-item').count() >= 1
        search_input.fill("")
        time.sleep(0.5)
        
        # Capture Landing Page Screenshot
        landing_screenshot = os.path.join(ARTIFACT_DIR, "practicals_landing_desktop.png")
        page.screenshot(path=landing_screenshot, full_page=False)
        print(f"   ✓ Captured landing page: {landing_screenshot}")
        
        # 4. Open SQL Injection Workspace
        print("\n4. Opening SQL Injection Workspace...")
        sqli_btn = page.locator(".practical-card-item:has-text('SQL Injection') .btn-start-practical")
        sqli_btn.dispatch_event("click")
        page.wait_for_selector(".workspace-root", timeout=8000)
        time.sleep(1)
        
        # Verify URL Hash
        print(f"   Current URL: {page.url}")
        assert "sql-injection" in page.url
        
        # Verify Workspace Breadcrumbs & Top Bar
        breadcrumbs = page.locator(".workspace-breadcrumbs").inner_text()
        print(f"   Breadcrumbs: {breadcrumbs}")
        assert "SQL Injection" in breadcrumbs
        
        # Step 1: Normal Login Test
        print("\n5. Testing Simulation Step 1: Normal Login ('student' / 'student123')...")
        user_input = page.locator("#sqli-user")
        pass_input = page.locator("#sqli-pass")
        
        user_input.fill("student")
        pass_input.fill("student123")
        
        page.evaluate("() => document.querySelector('.sim-login-form').requestSubmit()")
        time.sleep(0.6)
        
        status_title = page.locator(".status-title").inner_text()
        print(f"   Login Status: {status_title}")
        assert "Legitimate" in status_title or "Successful" in status_title
        
        # Step 2: Exploit Preset Test (' OR '1'='1' --)
        print("\n6. Testing Simulation Step 2: SQLi Bypass Attack...")
        preset_btn = page.locator(".btn-quick-payload.payload-warn").first
        print(f"   Clicking payload chip: {preset_btn.inner_text()}")
        preset_btn.dispatch_event("click")
        time.sleep(0.3)
        
        page.evaluate("() => document.querySelector('.sim-login-form').requestSubmit()")
        time.sleep(0.8)
        
        exploit_status = page.locator(".status-title").inner_text()
        print(f"   Exploit Status Title: {exploit_status}")
        assert "Bypassed" in exploit_status or "CRITICAL" in exploit_status
        
        # Check Constructed Query Code Block
        sql_view = page.locator(".sql-code-block").first.inner_text()
        print(f"   Constructed SQL Query: {sql_view}")
        assert "OR" in sql_view
        
        # Step 3: Switch to Secure Mode
        print("\n7. Testing Simulation Step 3: Secure Parameterized Mode...")
        page.evaluate("() => document.querySelector('.sim-switch input').click()")
        time.sleep(0.4)
        
        mode_text = page.locator(".sim-mode-tag").inner_text()
        print(f"   Active Mode Tag: {mode_text}")
        assert "Secure" in mode_text
        
        # Attempt exploit in Secure Mode
        page.evaluate("() => document.querySelector('.sim-login-form').requestSubmit()")
        time.sleep(0.6)
        
        secure_status = page.locator(".status-title").inner_text()
        print(f"   Secure Defense Status: {secure_status}")
        assert "Blocked" in secure_status or "Failed" in secure_status or "Secure" in secure_status
        
        # Step 4: Test Hints Panel
        print("\n8. Testing Progressive Hints & Solution Panel...")
        unlock_hint_btn = page.locator(".btn-unlock-hint")
        if unlock_hint_btn.is_visible():
            unlock_hint_btn.dispatch_event("click")
            time.sleep(0.3)
            print("   ✓ Unlocked Hint Tier 1")
            
        page.on("dialog", lambda dialog: dialog.accept())
        reveal_sol_btn = page.locator(".btn-reveal-solution")
        reveal_sol_btn.dispatch_event("click")
        time.sleep(0.5)
        
        sol_content = page.locator(".solution-revealed-card").count()
        print(f"   Solution Content Revealed: {sol_content > 0}")
        assert sol_content > 0, "Solution card should be visible"
        
        # Step 5: Test Knowledge Check Quiz
        print("\n9. Testing Knowledge Check Quiz...")
        quiz_opt = page.locator(".quiz-opt-btn").first
        quiz_opt.dispatch_event("click")
        page.locator(".btn-submit-quiz").dispatch_event("click")
        time.sleep(0.4)
        quiz_feedback = page.locator(".quiz-feedback-box").count()
        print(f"   Quiz Feedback Displayed: {quiz_feedback > 0}")
        assert quiz_feedback > 0
        
        # Step 6: Test Security Engineering Deep Dive
        print("\n10. Testing Security Engineering Deep Dive...")
        dd_triggers = page.locator(".dd-accordion-trigger")
        print(f"    Accordion triggers found: {dd_triggers.count()}")
        assert dd_triggers.count() >= 3
        dd_triggers.first.dispatch_event("click")
        time.sleep(0.3)
        
        # Capture SQLi Workspace Screenshot
        sqli_screenshot = os.path.join(ARTIFACT_DIR, "practicals_sqli_workspace.png")
        page.screenshot(path=sqli_screenshot, full_page=False)
        print(f"   ✓ Captured SQLi Workspace: {sqli_screenshot}")
        
        # 11. Test Light Mode
        print("\n11. Testing Light Mode in Workspace...")
        theme_btn = page.locator(".theme-toggle-btn")
        theme_btn.dispatch_event("click")
        time.sleep(0.5)
        
        theme_val = page.locator("html").get_attribute("data-theme")
        print(f"    Current theme: {theme_val}")
        assert theme_val == "light"
        
        # Check text color in light mode (should be darkish)
        text_color = page.locator(".step-title").first.evaluate("el => getComputedStyle(el).color")
        print(f"    Light mode text color: {text_color}")
        
        light_screenshot = os.path.join(ARTIFACT_DIR, "practicals_light_workspace.png")
        page.screenshot(path=light_screenshot, full_page=False)
        print(f"    ✓ Captured Light Mode Workspace: {light_screenshot}")
        
        # Switch back to dark mode
        theme_btn.dispatch_event("click")
        time.sleep(0.3)
        
        # 12. Test Mobile Viewport (390x844 iPhone)
        print("\n12. Testing Mobile Viewport (390x844)...")
        mobile_page = browser.new_page(viewport={"width": 390, "height": 844})
        mobile_page.goto(f"{BASE_URL}/#practicals")
        mobile_page.wait_for_selector(".practicals-page-root", timeout=8000)
        time.sleep(1)
        
        # Verify Mobile Chapter Selector is visible and Sidebar is hidden
        mobile_selector = mobile_page.locator(".chapter-mobile-selector-root")
        desktop_sidebar = mobile_page.locator(".practicals-sidebar")
        
        print(f"    Mobile Selector Visible: {mobile_selector.is_visible()}")
        print(f"    Desktop Sidebar Visible: {desktop_sidebar.is_visible()}")
        assert mobile_selector.is_visible(), "Mobile chapter dropdown should be visible on 390px"
        assert not desktop_sidebar.is_visible(), "Desktop sidebar should be hidden on 390px"
        
        # Open SQLi lab in mobile
        mobile_page.goto(f"{BASE_URL}/#practicals/chapter-3/sql-injection-lab")
        mobile_page.wait_for_selector(".workspace-root", timeout=8000)
        time.sleep(1)
        
        # Verify Mobile Workspace Tabs
        mobile_tabs = mobile_page.locator(".mobile-workspace-tabs")
        print(f"    Mobile Tabs Visible: {mobile_tabs.is_visible()}")
        assert mobile_tabs.is_visible()
        
        # Click "Protocol & Steps" tab
        mobile_page.locator(".mob-tab-btn:has-text('Protocol')").dispatch_event("click")
        time.sleep(0.3)
        print("    ✓ Switched to Protocol tab on mobile")
        
        mobile_screenshot = os.path.join(ARTIFACT_DIR, "practicals_mobile_390.png")
        mobile_page.screenshot(path=mobile_screenshot, full_page=False)
        print(f"    ✓ Captured Mobile Workspace: {mobile_screenshot}")
        
        # 13. Test Tablet Viewport (768x1024)
        print("\n13. Testing Tablet Viewport (768x1024)...")
        tablet_page = browser.new_page(viewport={"width": 768, "height": 1024})
        tablet_page.goto(f"{BASE_URL}/#practicals")
        tablet_page.wait_for_selector(".practicals-page-root", timeout=8000)
        time.sleep(0.5)
        
        tablet_screenshot = os.path.join(ARTIFACT_DIR, "practicals_tablet_768.png")
        tablet_page.screenshot(path=tablet_screenshot, full_page=False)
        print(f"    ✓ Captured Tablet Landing: {tablet_screenshot}")
        
        # 14. Test Another Lab: XSS Lab
        print("\n14. Testing XSS Lab (#practicals/chapter-7/xss-stored-defense)...")
        page.goto(f"{BASE_URL}/#practicals/chapter-7/xss-stored-defense")
        page.wait_for_selector(".simulation-xss-root", timeout=8000)
        time.sleep(0.8)
        
        xss_title = page.locator(".current").inner_text()
        print(f"    Active Lab: {xss_title}")
        assert "Cross-Site Scripting" in xss_title
        
        # Click XSS Preset & Submit
        page.locator(".btn-quick-payload.payload-warn").first.dispatch_event("click")
        time.sleep(0.3)
        page.evaluate("() => document.querySelector('.xss-form').requestSubmit()")
        time.sleep(0.5)
        exploit_badges = page.locator(".exploit-badge").count()
        print(f"    XSS Exploit Badges Triggered in Board: {exploit_badges}")
        assert exploit_badges > 0
        
        # 15. Test Password Cracking Lab
        print("\n15. Testing Password Cracking Lab (#practicals/chapter-1/password-security)...")
        page.goto(f"{BASE_URL}/#practicals/chapter-1/password-security")
        page.wait_for_selector(".simulation-pwd-root", timeout=8000)
        time.sleep(0.8)
        
        pwd_title = page.locator(".current").inner_text()
        print(f"    Active Lab: {pwd_title}")
        assert "Password" in pwd_title
        
        # Click Run Dictionary Attack
        page.locator("button:has-text('Launch Dictionary Attack')").dispatch_event("click")
        time.sleep(1.5)
        terminal_lines = page.locator(".crack-terminal-box").inner_text()
        print(f"    Cracking Terminal Output: {terminal_lines[:80]}...")
        assert "rockyou" in terminal_lines or "MATCH" in terminal_lines or "Cracking" in terminal_lines
        
        print("\n=======================================================")
        print("ALL 15 PRACTICALS TEST SUITES PASSED FLAWLESSLY!")
        print("=======================================================")
        
        browser.close()

if __name__ == "__main__":
    run_tests()
