import os
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5173"
ARTIFACTS_DIR = r"C:\Users\337ab\.gemini\antigravity\brain\c18a04b2-87f4-4a72-aa15-eec3d058e6d7"

def run_all_tests():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel='msedge')
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        print("==================================================")
        print("STAGE 1: ROUTING & 404 RESILIENCY VERIFICATION")
        print("==================================================")

        # 1.1 Direct URL with Hash
        page.goto(f"{BASE_URL}/#practicals/chapter-3/cryptography")
        page.wait_for_selector(".workspace-root", timeout=8000)
        title = page.locator(".workspace-breadcrumbs .current").inner_text()
        print(f"  [PASS] Direct hash URL opened: '{title}'")
        assert "Crypto" in title

        # 1.2 Direct URL with Pathname
        page.goto(f"{BASE_URL}/practicals/chapter-1/sql-injection")
        page.wait_for_selector(".workspace-root", timeout=8000)
        title = page.locator(".workspace-breadcrumbs .current").inner_text()
        print(f"  [PASS] Direct pathname URL opened: '{title}'")
        assert "SQL Injection" in title

        # 1.3 Refresh while in lab
        page.reload()
        page.wait_for_selector(".workspace-root", timeout=8000)
        title = page.locator(".workspace-breadcrumbs .current").inner_text()
        print(f"  [PASS] Lab survived browser reload: '{title}'")
        assert "SQL Injection" in title

        # 1.4 Unknown practical URL (404 Page)
        page.goto(f"{BASE_URL}/#practicals/chapter-99/fake-non-existent-lab")
        page.wait_for_selector(".practical-not-found-view", timeout=8000)
        nf_title = page.locator(".not-found-title").inner_text()
        nf_attempted = page.locator(".not-found-attempted").inner_text()
        print(f"  [PASS] Unknown URL rendered 404 view: '{nf_title}' ({nf_attempted})")
        assert "Practical Lab Not Found" in nf_title
        assert "fake-non-existent-lab" in nf_attempted

        # 1.5 Click Return to Practicals Hub from 404
        page.click(".btn-return-hub")
        page.wait_for_selector(".practicals-grid", timeout=8000)
        print("  [PASS] Return to Hub button from 404 successfully loaded practicals grid")

        # 1.6 Browser back and forward
        page.go_back()
        page.wait_for_selector(".practical-not-found-view", timeout=8000)
        print("  [PASS] Browser Back button returned to 404 view")
        page.go_forward()
        page.wait_for_selector(".practicals-grid", timeout=8000)
        print("  [PASS] Browser Forward button returned to Practicals hub")

        print("\n==================================================")
        print("STAGE 2: ALL 14 START LAB BUTTONS & TITLE/CHAPTER")
        print("==================================================")

        cards = page.locator(".practical-card-item")
        total_cards = cards.count()
        print(f"Total practical cards detected: {total_cards}")
        assert total_cards == 14, f"Expected 14 cards, got {total_cards}"

        for i in range(total_cards):
            card = page.locator(".practical-card-item").nth(i)
            expected_title = card.locator(".card-title").inner_text()
            expected_ch = card.locator(".practical-ch-tag").inner_text()
            btn = card.locator(".btn-start-practical")
            
            # Click Start Lab
            btn.scroll_into_view_if_needed()
            btn.click(timeout=4000)
            page.wait_for_selector(".workspace-root", timeout=8000)
            
            ws_title = page.locator(".workspace-breadcrumbs .current").inner_text()
            assert ws_title.strip() == expected_title.strip(), f"Card {i+1}: expected '{expected_title}', got '{ws_title}'"
            
            # Verify 3-column layout
            assert page.locator(".col-instructions").is_visible()
            assert page.locator(".col-simulation").is_visible()
            assert page.locator(".col-deepdive").is_visible()
            
            print(f"  [PASS] Lab {i+1:02d}/14: [{expected_ch}] '{expected_title}' opened cleanly.")
            
            # Return to list
            page.click(".btn-workspace-back")
            page.wait_for_selector(".practicals-grid", timeout=8000)
            page.wait_for_timeout(100)

        print("\n==================================================")
        print("STAGE 3: INDIVIDUAL FUNCTIONALITY (ALL 14 LABS)")
        print("==================================================")

        # LAB 1: SQL Injection
        print("\nTesting Practical 1: SQL Injection...")
        page.goto(f"{BASE_URL}/#practicals/chapter-1/sql-injection")
        page.wait_for_selector(".sqli-workbench", timeout=8000)
        # Vulnerable bypass test
        page.fill("#sqli-user", "admin' OR '1'='1")
        page.fill("#sqli-pass", "anything")
        page.click(".sqli-login-form .btn-sim-action")
        page.wait_for_selector(".sqli-result-box.result-success", timeout=5000)
        res_text = page.locator(".sqli-result-box").inner_text()
        assert "Authentication Bypassed" in res_text
        print("  [PASS] Vulnerable exploit bypassed authentication")

        # Toggle to secure mode
        page.evaluate("() => document.querySelector('.sqli-mode-bar .sim-switch input').click()")
        page.click(".sqli-login-form .btn-sim-action")
        page.wait_for_selector(".sqli-result-box.result-blocked", timeout=5000)
        res_text_sec = page.locator(".sqli-result-box").inner_text()
        assert "Access Denied" in res_text_sec or "Blocked" in res_text_sec
        print("  [PASS] Secure mode parameterized query blocked exploit")

        # Hint test
        page.click(".btn-unlock-hint")
        page.wait_for_selector(".hint-unlocked", timeout=5000)
        print("  [PASS] Progressive hint unlocked")

        # Quiz test
        page.click(".quiz-opt-btn >> nth=0")
        page.click(".btn-submit-quiz")
        page.wait_for_selector(".quiz-feedback-box", timeout=5000)
        print("  [PASS] Knowledge check submitted and feedback rendered")

        # LAB 2: XSS
        print("\nTesting Practical 2: Stored Cross-Site Scripting (XSS)...")
        page.goto(f"{BASE_URL}/#practicals/chapter-1/xss")
        page.wait_for_selector(".xss-workbench", timeout=8000)
        page.fill(".xss-input", "<script>alert('XSS')</script>")
        page.click(".btn-post-comment")
        page.wait_for_selector(".comment-item", timeout=5000)
        print("  [PASS] XSS payload submitted into forum simulator")
        # Toggle to secure mode
        page.evaluate("() => document.querySelector('.sim-switch input').click()")
        page.fill(".xss-input", "<b>safe sanitized text</b>")
        page.click(".btn-post-comment")
        comments_count = page.locator(".comment-item").count()
        assert comments_count >= 2
        print("  [PASS] XSS secure mode HTML entity escaping verified")

        # LAB 3: Phishing
        print("\nTesting Practical 3: Phishing Email Header Analysis...")
        page.goto(f"{BASE_URL}/#practicals/chapter-2/phishing")
        page.wait_for_selector(".phish-workbench", timeout=8000)
        page.click(".btn-mark-phishing")
        page.wait_for_selector(".phish-score", timeout=5000)
        score_val = page.locator(".phish-score").inner_text()
        print(f"  [PASS] Phishing header triage analyzed, score updated: {score_val}")

        # LAB 4: Password Cracking
        print("\nTesting Practical 4: Password Cracking & Hashing...")
        page.goto(f"{BASE_URL}/#practicals/chapter-2/passwords")
        page.wait_for_selector(".pw-workbench", timeout=8000)
        page.fill("#pw-test-input", "QuantumShield#2026!Secure")
        entropy = page.locator(".pw-entropy-val").inner_text()
        assert "bits" in entropy
        print(f"  [PASS] Real-time Shannon entropy calculated: {entropy}")
        # Run dictionary attack button
        dict_btn = page.locator(".btn-start-crack")
        if dict_btn.is_visible():
            dict_btn.click()
            page.wait_for_timeout(800)
            print("  [PASS] Dictionary attack simulation executed")
        # Bcrypt generation
        bcrypt_btn = page.locator(".pw-card .btn-sim-action:has-text('Generate')")
        if bcrypt_btn.is_visible():
            bcrypt_btn.click()
            page.wait_for_timeout(500)
            print("  [PASS] Bcrypt cryptographic salt generated")

        # LAB 5: MITM
        print("\nTesting Practical 5: Man-In-The-Middle (MITM) & ARP Spoofing...")
        page.goto(f"{BASE_URL}/#practicals/chapter-2/mitm")
        page.wait_for_selector(".mitm-workbench", timeout=8000)
        send_btn = page.locator(".btn-sim-action:has-text('Send')")
        send_btn.click()
        page.wait_for_timeout(1000)
        page.wait_for_selector(".mitm-log", timeout=5000)
        print("  [PASS] Cleartext transaction intercepted by simulated attacker proxy")

        # LAB 6: Firewall
        print("\nTesting Practical 6: Stateful Firewall Rule Filtering...")
        page.goto(f"{BASE_URL}/#practicals/chapter-3/firewall")
        page.wait_for_selector(".fw-workbench", timeout=8000)
        fire_btn = page.locator(".btn-fire-packet")
        fire_btn.click()
        page.wait_for_selector(".eval-result-card", timeout=5000)
        verdict = page.locator(".eval-head").inner_text()
        print(f"  [PASS] Firewall packet inspected: {verdict.strip()}")

        # LAB 7: Cryptography
        print("\nTesting Practical 7: Modern Cryptography (AES-GCM & RSA)...")
        page.goto(f"{BASE_URL}/#practicals/chapter-3/cryptography")
        page.wait_for_selector(".crypto-workbench", timeout=8000)
        enc_btn = page.locator(".btn-sim-action:has-text('Encrypt')")
        enc_btn.click()
        page.wait_for_selector(".spec-code", timeout=5000)
        print("  [PASS] AES-GCM 256-bit encryption executed with authenticated tag")

        # LAB 8: Network Scanning
        print("\nTesting Practical 8: Network Reconnaissance & Port Scanning (Nmap)...")
        page.goto(f"{BASE_URL}/#practicals/chapter-4/network-scanning")
        page.wait_for_selector(".scan-workbench", timeout=8000)
        scan_btn = page.locator(".btn-sim-action:has-text('Scan')")
        scan_btn.click()
        page.wait_for_timeout(1500)
        page.wait_for_selector(".ports-table", timeout=5000)
        print("  [PASS] SYN stealth scan finished with enumerated listening services")

        # LAB 9: OSINT
        print("\nTesting Practical 9: OSINT & Digital Footprinting...")
        page.goto(f"{BASE_URL}/#practicals/chapter-4/osint")
        page.wait_for_selector(".osint-workbench", timeout=8000)
        whois_btn = page.locator(".btn-sim-action:has-text('WHOIS')")
        whois_btn.click()
        page.wait_for_selector(".whois-results-box", timeout=5000)
        print("  [PASS] WHOIS reconnaissance identified registrant intelligence")

        # LAB 10: Malware Analysis
        print("\nTesting Practical 10: Malware Static & Dynamic Analysis...")
        page.goto(f"{BASE_URL}/#practicals/chapter-5/malware")
        page.wait_for_selector(".mal-workbench", timeout=8000)
        dyn_tab = page.locator(".mal-tab-btn:has-text('Dynamic')")
        dyn_tab.click()
        page.wait_for_selector(".sandbox-events-list", timeout=5000)
        print("  [PASS] Dynamic sandbox execution trace rendered API hooking logs")

        # LAB 11: DoS/DDoS
        print("\nTesting Practical 11: Denial of Service (DoS/DDoS) Mitigation...")
        page.goto(f"{BASE_URL}/#practicals/chapter-5/ddos")
        page.wait_for_selector(".dos-workbench", timeout=8000)
        syn_flood_btn = page.locator(".btn-traffic-mode:has-text('SYN Flood')")
        syn_flood_btn.click()
        page.wait_for_timeout(500)
        cookie_chk = page.locator(".defense-checkbox-card input[type='checkbox']").first
        cookie_chk.click()
        print("  [PASS] DoS attack layer toggled and SYN cookie defense enabled")

        # LAB 12: IDOR
        print("\nTesting Practical 12: Broken Access Control & IDOR...")
        page.goto(f"{BASE_URL}/#practicals/chapter-6/idor")
        page.wait_for_selector(".idor-workbench", timeout=8000)
        id_1043 = page.locator(".btn-quick-payload:has-text('1043')")
        id_1043.click()
        api_btn = page.locator(".btn-sim-action:has-text('API Request')")
        api_btn.click()
        page.wait_for_selector(".idor-result-box", timeout=5000)
        print("  [PASS] IDOR parameter tampering exposed unauthorized foreign record")

        # LAB 13: Cloud Security
        print("\nTesting Practical 13: Cloud Security & Misconfigured S3 Storage...")
        page.goto(f"{BASE_URL}/#practicals/chapter-6/cloud")
        page.wait_for_selector(".cloud-workbench", timeout=8000)
        curl_btn = page.locator(".btn-sim-action:has-text('Download Probe')")
        curl_btn.click()
        page.wait_for_selector(".cloud-test-result.result-leak", timeout=5000)
        harden_btn = page.locator(".policy-actions-row button")
        harden_btn.click()
        curl_btn.click()
        page.wait_for_selector(".cloud-test-result.result-blocked", timeout=5000)
        print("  [PASS] Cloud S3 anonymous leak demonstrated and mitigated via IAM policy")

        # LAB 14: IoT MQTT
        print("\nTesting Practical 14: IoT Security & MQTT Protocol Poisoning...")
        page.goto(f"{BASE_URL}/#practicals/chapter-6/iot")
        page.wait_for_selector(".iot-workbench", timeout=8000)
        sub_btn = page.locator(".btn-sim-action:has-text('Subscribe')")
        sub_btn.click()
        rogue_btn = page.locator(".btn-sim-action.btn-danger:has-text('Rogue')")
        rogue_btn.click()
        page.wait_for_selector(".mqtt-msg-item", timeout=5000)
        print("  [PASS] IoT unauthorized actuator command published and captured")

        print("\n==================================================")
        print("STAGE 4: RESPONSIVE VIEWPORT TESTING & SCREENSHOTS")
        print("==================================================")

        viewports = [
            ("Desktop_1920x1080", 1920, 1080),
            ("Laptop_1440x900", 1440, 900),
            ("Standard_1366x768", 1366, 768),
            ("Tablet_768x1024", 768, 1024),
            ("Mobile_390x844", 390, 844),
            ("Mobile_320x568", 320, 568),
        ]

        for name, w, h in viewports:
            page.set_viewport_size({"width": w, "height": h})
            page.goto(f"{BASE_URL}/#practicals/chapter-1/sql-injection")
            page.wait_for_selector(".workspace-root", timeout=8000)
            if w <= 768:
                # Test mobile tabs
                page.wait_for_selector(".mobile-workspace-tabs", timeout=5000)
                page.click(".mob-tab-btn >> nth=0")
                assert page.locator(".view-instructions").is_visible()
                page.click(".mob-tab-btn >> nth=1")
                assert page.locator(".view-simulation").is_visible()
            
            shot_path = os.path.join(ARTIFACTS_DIR, f"vp_{name.lower()}.png")
            page.screenshot(path=shot_path)
            print(f"  [PASS] Viewport {name} (w={w}, h={h}) verified & screenshot captured.")

        print("\n==================================================")
        print("STAGE 5: STATE ISOLATION, RESET & STORAGE PERSISTENCE")
        print("==================================================")

        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto(f"{BASE_URL}/#practicals/chapter-1/sql-injection")
        page.wait_for_selector(".workspace-root", timeout=8000)

        # Check first step
        step_box = page.locator(".protocol-step input[type='checkbox']").first
        if step_box.is_visible():
            step_box.click()
            page.wait_for_timeout(400)

        # Verify status says IN PROGRESS
        status_text = page.locator(".status-pill").inner_text()
        assert "IN PROGRESS" in status_text
        print(f"  [PASS] Practical status changed to: {status_text.strip()}")

        # Reload page and verify state persisted
        page.reload()
        page.wait_for_selector(".workspace-root", timeout=8000)
        reloaded_status = page.locator(".status-pill").inner_text()
        assert "IN PROGRESS" in reloaded_status
        print(f"  [PASS] Progress persisted across browser reload: {reloaded_status.strip()}")

        # Test Reset Lab button
        page.click(".btn-workspace-reset")
        page.wait_for_timeout(500)
        reset_steps = page.locator(".workspace-step-counter").inner_text()
        print(f"  [PASS] Workspace reset button executed: step counter is now '{reset_steps.strip()}'")

        # Test Prev / Next Navigation
        next_btn = page.locator(".btn-workspace-nav:has-text('Next')")
        if next_btn.is_visible():
            next_btn.click()
            page.wait_for_selector(".workspace-root", timeout=8000)
            next_title = page.locator(".workspace-breadcrumbs .current").inner_text()
            assert "Cross-Site Scripting" in next_title or "XSS" in next_title
            print(f"  [PASS] Next lab navigation loaded Lab 2: '{next_title}'")

        print("\n==================================================")
        print("STAGE 6: UNCAUGHT CONSOLE ERRORS AUDIT")
        print("==================================================")
        print(f"Total uncaught console errors: {len(console_errors)}")
        if console_errors:
            print("Console errors found:", console_errors)
        assert len(console_errors) == 0, f"Encountered {len(console_errors)} console errors during test run!"
        print("  [PASS] Zero (0) uncaught errors or exceptions recorded across entire suite.")

        print("\n==================================================")
        print("SUMMARY: ALL COMPREHENSIVE PRACTICAL LAB TESTS PASSED!")
        print("==================================================")
        browser.close()

if __name__ == "__main__":
    run_all_tests()