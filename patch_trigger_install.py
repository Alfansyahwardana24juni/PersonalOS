import glob

script_to_inject = """
<script>
function triggerInstallPWA(e) {
    if(e) e.preventDefault();
    if (typeof window.showConfirmModal === 'function') {
        window.showConfirmModal('Ingin menginstal aplikasi Personal OS di perangkat Anda?', () => {
            if (typeof window.showToast === 'function') {
                window.showToast('Aplikasi sedang diinstal... (Simulasi PWA)', 'success');
            } else {
                alert('Aplikasi sedang diinstal... (Simulasi PWA)');
            }
            // Logic asli PWA jika berjalan di environment HTTPS / localhost yang valid:
            if (typeof window.deferredPrompt !== 'undefined' && window.deferredPrompt) {
                window.deferredPrompt.prompt();
                window.deferredPrompt.userChoice.then((choiceResult) => {
                    window.deferredPrompt = null;
                });
            }
        });
    } else if(confirm('Ingin menginstal aplikasi Personal OS di perangkat Anda?')) {
        alert('Aplikasi sedang diinstal... (Simulasi PWA)');
    }
}
</script>
</body>
"""

html_files = glob.glob('*.html')
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    if 'function triggerInstallPWA' not in html:
        html = html.replace('</body>', script_to_inject)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Injected triggerInstallPWA in {filepath}")
