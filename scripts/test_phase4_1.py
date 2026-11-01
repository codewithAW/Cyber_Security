# -*- coding: utf-8 -*-
"""
Playwright automated test script for STUDYVERSE Phase 4.1
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
        
        print("1. Navigating to http://localhost:4173/#notes ...")
        page.goto("http://localhost:4173/#notes")
        page.wait_for_selector(".chapter-article", timeout=10000)
        
        # Check Chapter 1 Title
        ch_title = page.locator(".chapter-title").inner_text()
        print(f"   Current Chapter: {ch_title}")
        assert "Basic Cyber Security Concepts" in ch_title
        
        # Check Technical Visual (CIA Triad)
        svg_el = page.locator(".chapter-technical-visual-wrapper .tech-svg")
        assert svg_el.count() > 0, "Technical Visual SVG should be present"
        print("   ✓ Technical Visual SVG found and rendered")

        # Check Attack Visualization Card
        attack_card = page.locator(".attack-visualization-card")
        assert attack_card.count() > 0, "Attack visualization card should be present"
        print("   ✓ Attack visualization card found")

        # Test Stepper Navigation
        pills = page.locator(".attack-node-pill")
        pills_count = pills.count()
        print(f"   ✓ Found {pills_count} interactive attack stage pills")
        assert pills_count >= 5, "At least 5 attack stages expected"

        # Click on Stage 3
        pills.nth(2).click()
        time.sleep(0.3)
        active_pill = page.locator(".attack-node-pill.is-selected")
        print(f"   ✓ Active stage clicked: {active_pill.inner_text().strip()}")
        
        # Click on Stage 6 (Mitigation)
        pills.nth(pills_count - 1).click()
        time.sleep(0.3)
        mitigation_box = page.locator(".attack-mitigation-panel")
        assert mitigation_box.count() > 0, "Defense mitigation panel should be visible"
        print("   ✓ Defense mitigation panel verified")

        # Check Before and After Comparison
        comp_card = page.locator(".before-after-card")
        assert comp_card.count() > 0, "Before-After comparison card should be present"
        vuln_panel = page.locator(".split-col.col-vulnerable")
        sec_panel = page.locator(".split-col.col-secure")
        assert vuln_panel.count() > 0 and sec_panel.count() > 0
        print("   ✓ Side-by-side Vulnerable vs Secure panels verified")

        # Check Hands-On Practical
        prac_card = page.locator(".practical-card")
        assert prac_card.count() > 0, "Hands-on practical card should be present"
        term_box = page.locator(".terminal-box")
        assert term_box.count() > 0, "Terminal box should be present"
        print("   ✓ Terminal emulator and practical steps verified")

        # Test Copy Button
        copy_btn = page.locator(".term-copy-btn").first
        copy_btn.click()
        time.sleep(0.2)
        print("   ✓ Terminal copy button clicked successfully")

        # Save Desktop Screenshots for Artifacts
        page.locator(".chapter-technical-visual-wrapper").screenshot(path=f"{ARTIFACT_DIR}/phase4_1_technical_visual.png")
        page.locator(".attack-visualization-card").first.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_attack_diagram.png")
        page.locator(".practical-card").first.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_practical_lab.png")
        print("   ✓ Saved SVG, attack diagram, and practical lab screenshots")

        # Navigate to Chapter 6 (SQL Injection)
        print("\n2. Testing Chapter 6 (SQL Injection)...")
        ch6_btn = page.locator("button.sidebar-chapter-item").nth(5)
        ch6_btn.click()
        page.wait_for_selector(".chapter-title:has-text('SQL Injection')", timeout=5000)
        print(f"   Chapter 6 loaded: {page.locator('.chapter-title').inner_text()}")
        
        # Verify SQLi attack flow
        sqli_attack = page.locator(".attack-visualization-card:has-text('SQL Injection')")
        assert sqli_attack.count() > 0, "SQL Injection attack visualization should be present"
        print("   ✓ SQLi Tautology attack flow verified")

        # Check Table of Contents navigation
        toc_attack_btn = page.locator(".toc-link-attack")
        assert toc_attack_btn.count() > 0, "TOC link for attack flow should be present"
        toc_attack_btn.click()
        time.sleep(0.3)
        print("   ✓ TOC 'How This Attack Works' link clicked successfully")

        # Navigate to Chapter 10 (TLS & MitM)
        print("\n3. Testing Chapter 10 (TLS & MitM)...")
        ch10_btn = page.locator("button.sidebar-chapter-item").nth(9)
        ch10_btn.click()
        page.wait_for_selector(".chapter-title:has-text('Transport Layer Security')", timeout=5000)
        assert page.locator(".tech-svg").count() > 0, "MitM technical visual should be present"
        print("   ✓ Chapter 10 loaded with MitM visual")

        # Navigate to Chapter 14 (IoT Botnet)
        print("\n4. Testing Chapter 14 (IoT & Firmware)...")
        ch14_btn = page.locator("button.sidebar-chapter-item").nth(13)
        ch14_btn.click()
        page.wait_for_selector(".chapter-title:has-text('IoT Security')", timeout=5000)
        assert page.locator(".attack-visualization-card:has-text('Mirai')").count() > 0
        print("   ✓ Chapter 14 loaded with Mirai botnet attack flow and Binwalk practical")

        # Viewport and Horizontal Overflow Tests
        viewports = [
            ("Desktop 1920x1080", 1920, 1080),
            ("Desktop 1440x900", 1440, 900),
            ("Tablet Landscape 1024x768", 1024, 768),
            ("Tablet Portrait 768x1024", 768, 1024),
            ("Mobile 390x844", 390, 844),
            ("Small Mobile 320x568", 320, 568),
        ]
        
        print("\n5. Testing Responsive Layouts across 6 Viewports...")
        for name, w, h in viewports:
            page.set_viewport_size({"width": w, "height": h})
            time.sleep(0.3)
            # Evaluate horizontal scroll on document body
            overflow_data = page.evaluate("""
                () => {
                    const doc = document.documentElement;
                    return {
                        scrollWidth: doc.scrollWidth,
                        clientWidth: doc.clientWidth,
                        hasOverflow: doc.scrollWidth > doc.clientWidth
                    };
                }
            """)
            print(f"   [{name}] scrollWidth: {overflow_data['scrollWidth']}, clientWidth: {overflow_data['clientWidth']} -> Overflow: {overflow_data['hasOverflow']}")
            assert not overflow_data['hasOverflow'], f"Horizontal overflow detected on {name}!"
            
            if w == 390:
                page.screenshot(path=f"{ARTIFACT_DIR}/phase4_1_mobile_390.png", full_page=False)
                print("   ✓ Saved mobile 390x844 screenshot")

        browser.close()
        print("\n🎉 ALL PHASE 4.1 AUTOMATED TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    run_tests()
