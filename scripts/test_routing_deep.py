import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    
    # Case 1: Direct open pathname /practicals
    print("\nCase 1: Direct open pathname http://localhost:5173/practicals ...")
    page.goto('http://localhost:5173/practicals')
    page.wait_for_timeout(1000)
    print("Page title/route detected:", page.locator('.hero-tag-pill').is_visible())
    
    # Case 2: Direct open pathname /practicals/chapter-3/sql-injection
    print("\nCase 2: Direct open pathname http://localhost:5173/practicals/chapter-3/sql-injection ...")
    page.goto('http://localhost:5173/practicals/chapter-3/sql-injection')
    page.wait_for_timeout(1000)
    print("Workspace visible:", page.locator('.workspace-root').is_visible())
    if page.locator('.workspace-root').is_visible():
        print("Breadcrumbs:", page.locator('.workspace-breadcrumbs').inner_text())
    else:
        print("Body text snippet:", page.locator('body').inner_text()[:120])
        
    # Case 3: Unknown practical URL
    print("\nCase 3: Unknown practical http://localhost:5173/#practicals/chapter-99/fake-lab ...")
    page.goto('http://localhost:5173/#practicals/chapter-99/fake-lab')
    page.wait_for_timeout(1000)
    print("Workspace visible:", page.locator('.workspace-root').is_visible())
    print("Not found visible:", page.locator('.practical-not-found').is_visible())
    
    browser.close()

