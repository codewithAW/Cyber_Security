import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.on('console', lambda m: print(f"CONSOLE [{m.type}]: {m.text}"))
    page.on('pageerror', lambda e: print(f"PAGEERROR: {e}"))
    
    print("Navigating to http://localhost:5173/#practicals...")
    page.goto('http://localhost:5173/#practicals')
    page.wait_for_selector('.practical-card-item', timeout=10000)
    
    cards = page.locator('.practical-card-item')
    count = cards.count()
    print(f"Total practical cards found: {count}")
    
    success_count = 0
    for i in range(count):
        # Refresh reference to cards
        card = page.locator('.practical-card-item').nth(i)
        card_title = card.locator('.card-title').inner_text()
        btn = card.locator('.btn-start-practical')
        
        btn.scroll_into_view_if_needed()
        print(f"[{i+1}/{count}] Clicking Start Lab for: {card_title}")
        
        # Real user mouse click!
        btn.click(timeout=4000)
        page.wait_for_selector('.workspace-root', timeout=4000)
        
        ws_title = page.locator('.workspace-breadcrumbs .current').inner_text()
        print(f"      Workspace opened successfully: {ws_title}")
        success_count += 1
        
        # Click back button to return to hub
        back_btn = page.locator('.btn-workspace-back')
        back_btn.click()
        page.wait_for_selector('.practicals-grid', timeout=4000)
        page.wait_for_timeout(200)
        
    print(f"\n==========================================")
    print(f"ALL {success_count}/{count} START LAB BUTTONS CLICKED & OPENED WORKSPACES SUCCESSFULLY!")
    print(f"==========================================")
    browser.close()
