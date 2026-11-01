import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173/#practicals')
    page.wait_for_selector('.practical-card-item', timeout=10000)
    
    # Inject style to fix pointer-events
    page.evaluate("""() => {
        const style = document.createElement('style');
        style.innerHTML = '.practicals-main-content, .practicals-main-content * { pointer-events: auto !important; }';
        document.head.appendChild(style);
    }""")
    
    btn = page.locator('.practical-card-item').first.locator('.btn-start-practical')
    btn.scroll_into_view_if_needed()
    bRect = btn.bounding_box()
    
    hit = page.evaluate("""(box) => {
        const el = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
        return el ? `${el.tagName}.${el.className}` : 'none';
    }""", bRect)
    print("With pointer-events: auto, elementFromPoint hits:", hit)
    
    # Now try clicking the button with normal click:
    btn.click(timeout=3000)
    page.wait_for_timeout(500)
    print("Normal click succeeded! URL:", page.url)
    print("Workspace visible:", page.locator('.workspace-root').is_visible())
    
    browser.close()

