import glob

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
        
    # Let's add the Install button at the bottom of the sidebar nav
    # Find </nav> inside the Sidebar
    # The sidebar nav is wrapped in <nav class="space-y-1">
    
    # We can inject it right before </nav> in the sidebar
    install_btn_html = '''
            <div class="my-4 border-t border-border dark:border-[#27272a]"></div>
            <a href="#" onclick="triggerInstallPWA(event)" class="flex items-center px-3 py-2 bg-brand/10 text-brand hover:bg-brand/20 rounded-md text-sm font-semibold transition-colors group dark:bg-brand/20 dark:text-brand dark:hover:bg-brand/30">
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Install Aplikasi
            </a>'''
            
    if 'Install Aplikasi' not in html or 'triggerInstallPWA' not in html:
        # Avoid duplicating if already present
        # Find </nav> in the Sidebar. In all our HTML files, the sidebar nav ends with </nav>
        # Let's target the exact closing tag of the <nav class="space-y-1"> block.
        # It's usually followed by </div> then </aside>
        
        # We can split by `</nav>` and insert it before the FIRST `</nav>` because the sidebar is the first nav in the file
        parts = html.split('</nav>', 1)
        if len(parts) == 2:
            html = parts[0] + install_btn_html + '\n</nav>' + parts[1]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f"Patched sidebar nav in {filepath}")
        
