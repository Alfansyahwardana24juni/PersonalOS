import re

with open('js/crud.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Extract the beforeinstallprompt block
before_install = '''    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      const installBtns = document.querySelectorAll('#install-pwa-btn');
      installBtns.forEach(btn => btn.classList.remove('hidden'));
      
      if (!localStorage.getItem('pwaPromptShown')) {
        setTimeout(() => {
            if (typeof window.showConfirmModal === 'function') {
                window.showConfirmModal('Ingin install aplikasi Personal OS ini di perangkat Anda?', () => {
                    installPWA();
                });
            } else if(confirm('Ingin install aplikasi Personal OS ini di perangkat Anda?')) {
                installPWA();
            }
            localStorage.setItem('pwaPromptShown', 'true');
        }, 3000);
      }
    });'''

# It's currently indented inside DOMContentLoaded. 
# We remove it from there.
if "window.addEventListener('beforeinstallprompt'" in js:
    js = re.sub(r"    window\.addEventListener\('beforeinstallprompt'.*?\}\);", "", js, flags=re.DOTALL)
    
    # Also remove window.deferredPrompt = null; and serviceWorker registration from DOMContentLoaded
    js = re.sub(r"    // 1\. Setup PWA.*?navigator\.serviceWorker\.register\('service-worker\.js'\);\n    \}", "", js, flags=re.DOTALL)

# Now we inject it at the very top, after the first comment
top_level_pwa = '''
// Global PWA Setup
window.deferredPrompt = null;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    
    // Un-hide install buttons if they exist
    const installBtns = document.querySelectorAll('#install-pwa-btn');
    installBtns.forEach(btn => btn.classList.remove('hidden'));
    
    if (!localStorage.getItem('pwaPromptShown')) {
        setTimeout(() => {
            if (typeof window.showConfirmModal === 'function') {
                window.showConfirmModal('Ingin install aplikasi Personal OS ini di perangkat Anda?', () => {
                    if (window.deferredPrompt) {
                        window.deferredPrompt.prompt();
                        window.deferredPrompt.userChoice.then(() => { window.deferredPrompt = null; });
                    }
                });
            } else if(confirm('Ingin install aplikasi Personal OS ini di perangkat Anda?')) {
                if (window.deferredPrompt) {
                    window.deferredPrompt.prompt();
                    window.deferredPrompt.userChoice.then(() => { window.deferredPrompt = null; });
                }
            }
            localStorage.setItem('pwaPromptShown', 'true');
        }, 3000);
    }
});
'''

# Check if it was already injected
if '// Global PWA Setup' not in js:
    js = js.replace('// crud.js - Handles LocalStorage Persistence for UI prototypes\n', '// crud.js - Handles LocalStorage Persistence for UI prototypes\n' + top_level_pwa)

with open('js/crud.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("crud.js patched for top-level beforeinstallprompt")
