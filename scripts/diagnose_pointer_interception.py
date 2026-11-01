import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='msedge')
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('http://localhost:5173/#practicals')
    page.wait_for_selector('.practical-card-item', timeout=10000)
    
    details = page.evaluate("""() => {
        const wrap = document.querySelector('.practicals-body-wrap');
        const main = document.querySelector('.practicals-main-content');
        const grid = document.querySelector('.practicals-grid');
        const card = document.querySelector('.practical-card-item');
        const btn = document.querySelector('.btn-start-practical');
        
        function getInfo(el, name) {
            if (!el) return { name, exists: false };
            const rect = el.getBoundingClientRect();
            const cs = window.getComputedStyle(el);
            return {
                name,
                exists: true,
                tag: el.tagName,
                class: el.className,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                position: cs.position,
                zIndex: cs.zIndex,
                overflow: cs.overflow,
                pointerEvents: cs.pointerEvents,
                display: cs.display
            };
        }
        
        // Find what element is at the center of the button:
        btn.scrollIntoView();
        const bRect = btn.getBoundingClientRect();
        const hitEl = document.elementFromPoint(bRect.left + bRect.width / 2, bRect.top + bRect.height / 2);
        
        return {
            wrap: getInfo(wrap, 'wrap'),
            main: getInfo(main, 'main'),
            grid: getInfo(grid, 'grid'),
            card: getInfo(card, 'card'),
            btn: getInfo(btn, 'btn'),
            hit: hitEl ? { tag: hitEl.tagName, class: hitEl.className, id: hitEl.id } : null,
            elementsAtPoint: document.elementsFromPoint(bRect.left + bRect.width / 2, bRect.top + bRect.height / 2).map(e => `${e.tagName}.${e.className}`)
        };
    }""")
    
    import json
    print(json.dumps(details, indent=2))
    browser.close()

