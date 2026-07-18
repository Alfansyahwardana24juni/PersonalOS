import glob
import re

html_files = glob.glob('*.html')
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # We want to replace this:
    # id="install-pwa-btn" class="hidden flex
    # with
    # onclick="triggerInstallPWA(event)" class="flex
    
    # Since there might be variations, let's use regex
    # The original might be <a href="#" id="install-pwa-btn" class="hidden flex ...">
    # We replace `id="install-pwa-btn" class="hidden flex` with `onclick="triggerInstallPWA(event)" class="flex`
    
    # Regex to catch variations of hidden in the class of the install-pwa-btn
    # <a href="#" id="install-pwa-btn" class="hidden flex items-center
    html = re.sub(
        r'<a\s+href="#"\s+id="install-pwa-btn"\s+class="hidden\s+([^"]+)"',
        r'<a href="#" onclick="triggerInstallPWA(event)" class="\1 text-brand dark:text-brand"',
        html
    )
    
    # In notes.html there was a duplicate block:
    # <a href="#" id="install-pwa-btn" class="hidden flex items-center px-3 py-2 text-sm font-medium text-gray-600 ...">
    # Let's run a more aggressive replacement if the above didn't catch everything
    
    html = html.replace('id="install-pwa-btn" class="hidden ', 'onclick="triggerInstallPWA(event)" class="text-brand dark:text-brand ')
    
    # In notes.html I see a duplicate install-pwa-btn, but replacing it is fine (it just becomes two buttons, one is fine, or we can remove one later)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Patched mobile install button in {filepath}")
