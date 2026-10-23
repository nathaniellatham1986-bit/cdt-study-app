"""Playwright check: Listen mode plays a recorded clip and advances question -> answer -> next item.
Usage: python tests/audio_e2e.py [base_url]  (default serves the repo on :8765)."""
import sys, subprocess, time, os
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
base = sys.argv[1] if len(sys.argv) > 1 else None
srv = None
if not base:
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765'], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1); base = 'http://localhost:8765/'
try:
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg = b.new_context(**p.devices['iPhone 13']).new_page(); pg.on('console', lambda m: print('console:', m.text)); pg.on('pageerror', lambda e: print('pageerror:', e))
        mp3 = []
        pg.on('response', lambda r: r.url.endswith('.mp3') and mp3.append((r.status, r.headers.get('content-type'), r.url)))
        pg.goto(base); pg.wait_for_selector('[data-e="ceramics"]'); pg.click('[data-e="ceramics"]')
        pg.click('#au'); pg.wait_for_selector('#dl button', timeout=15000)
        print('offline box:', pg.inner_text('#dls'))
        pg.eval_on_selector('#pause', 'e=>{e.value=2;e.dispatchEvent(new Event("input"))}')
        pg.eval_on_selector('#rate', 'e=>{e.value=1.6;e.dispatchEvent(new Event("input"))}')
        pg.click('text=▶ Start')
        pg.wait_for_selector('text=recorded voice', timeout=10000)
        pg.wait_for_function('()=>{const a=document.querySelector("#cdt-player")||window.__a;return true}')
        pg.wait_for_selector('text=🔊 Answer', timeout=60000)
        pg.wait_for_function('()=>document.querySelector("#title").textContent.startsWith("Listening 2/")', timeout=60000)
        print('advanced to:', pg.inner_text('#title'))
        ok = [m for m in mp3 if m[0] in (200, 206)]
        print('clip responses:', ok[:3])
        assert ok and 'audio' in (ok[0][1] or ''), mp3
        pg.screenshot(path=os.path.join(ROOT, 'screenshots', '20-listen-recorded.png'))
        pg.click('text=■ Stop'); pg.wait_for_selector('#dl button')
        pg.click('text=⬇ Download audio for offline')
        pg.wait_for_selector('#dls:has-text("saved for offline")', timeout=120000); print('offline:', pg.inner_text('#dls'))
        b.close()
    print('PASS')
finally:
    srv and srv.terminate()
