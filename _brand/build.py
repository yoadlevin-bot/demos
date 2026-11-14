"""Fills shared brand pieces (logo lockup, CTA, icons) into the *.tpl.html templates."""
import sys
def logo(dark, style='', img=None, cls='logo'):
    img = img or ('mark-light.svg' if dark else 'mark-dark.svg')
    return f'<div class="logo" style="{style}"><img src="{img}" alt=""><span class="wm"><b>LEVIN</b><small>WEB DESIGN</small></span></div>'
ARROW_PATH = '<path d="M4 20 L10 13 L14 16 L21 7 M15 6 H21.5 V12.5" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
def arrow(color): return f'<svg viewBox="0 0 24 24" stroke="{color}">{ARROW_PATH}</svg>'
WA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 000-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 001.8-1.2 2.2 2.2 0 00.1-1.2c0-.1-.2-.2-.5-.3z"/></svg>'
CTA = f'<div class="cta">{WA}<span>לסקיצה חינם בוואטסאפ</span></div>'
CK = '<span class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>'
SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="#5f6b7a" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>'
def icon(p): return f'<svg class="ico" viewBox="0 0 64 64" fill="none" stroke="var(--acc-d)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">{p}</svg>'
REP = {
 '{{LOGO_D}}': logo(True), '{{LOGO_W}}': logo(True, img='mark-white.svg'), '{{LOGO_L}}': logo(False), '{{CTA}}': CTA, '{{CK}}': CK, '{{SEARCH}}': SEARCH, '{{WA}}': WA,
 '{{ARROW}}': arrow('#3F95F6'), '{{ARROW_B}}': arrow('#2563EB'), '{{ARROW_W}}': arrow('#FFFFFF'),
 '{{ICON_GLOBE}}': icon('<circle cx="32" cy="32" r="22"/><path d="M10 32h44M32 10c7 7 7 37 0 44M32 10c-7 7-7 37 0 44"/><path d="M12 12l40 40" stroke-width="3.4"/>'),
 '{{ICON_PIN}}': icon('<path d="M32 56s-17-15-17-29a17 17 0 0134 0c0 14-17 29-17 29z"/><circle cx="32" cy="27" r="6" stroke-dasharray="3 3"/>'),
 '{{ICON_PHONE}}': icon('<rect x="18" y="6" width="28" height="52" rx="6"/><path d="M28 50h8"/><circle cx="31" cy="26" r="7"/><path d="M36 31l6 6"/>'),
}
for src in sys.argv[1:]:
    s = open(src, encoding='utf-8').read()
    for k, v in REP.items(): s = s.replace(k, v)
    if '%%SITE%%' in s:
        s = s.replace('%%SITE%%', open('site-mock.html', encoding='utf-8').read())
    out = src.replace('.tpl', '')
    open(out, 'w', encoding='utf-8').write(s)
    print(out)
