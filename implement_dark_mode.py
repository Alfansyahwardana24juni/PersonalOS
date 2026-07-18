import os

css_append = """
:root {
    --color-primary: #111827;
    --color-background: #F8FAFC;
    --color-surface: #FFFFFF;
    --color-border: #E5E7EB;
    --color-success: #16A34A;
    --color-danger: #DC2626;
    --color-warning: #F59E0B;
}

html.dark {
    --color-primary: #F9FAFB;
    --color-background: #0F172A;
    --color-surface: #1E293B;
    --color-border: #334155;
    
    /* Scrollbar */
    --scrollbar-thumb: #475569;
    --scrollbar-hover: #64748B;
}

/* Scrollbar adjustment */
html.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
}
html.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-hover);
}

/* Universal Dark Mode Overrides */
html.dark .bg-white, html.dark .bg-surface {
    background-color: var(--color-surface) !important;
}
html.dark .bg-gray-50, html.dark .bg-gray-100 {
    background-color: #020617 !important; /* slate-950 */
}
html.dark .text-gray-900, html.dark .text-gray-800, html.dark .text-gray-700, html.dark .text-gray-600 {
    color: #cbd5e1 !important;
}
html.dark .text-gray-500, html.dark .text-gray-400 {
    color: #94a3b8 !important;
}
html.dark .border-gray-100, html.dark .border-gray-200, html.dark .border-gray-300 {
    border-color: var(--color-border) !important;
}
html.dark .shadow-sm, html.dark .shadow-md, html.dark .shadow {
    box-shadow: none !important;
    border-color: var(--color-border) !important;
}
html.dark input, html.dark textarea {
    background-color: #020617 !important;
    color: #f8fafc !important;
    border-color: var(--color-border) !important;
}
html.dark .bg-primary {
    background-color: #3b82f6 !important; /* blue-500 */
    color: #ffffff !important;
}
html.dark .text-primary {
    color: var(--color-primary) !important;
}
html.dark .border-l-primary {
    border-left-color: #3b82f6 !important;
}
html.dark .hover\:bg-gray-50:hover, html.dark .hover\:bg-gray-100:hover {
    background-color: #0f172a !important; /* slate-900 */
}
html.dark .hover\:bg-gray-800:hover {
    background-color: #2563eb !important; /* blue-600 */
}
"""

with open('D:/PersonalOS/css/style.css', 'a', encoding='utf-8') as f:
    f.write(css_append)

tailwind_original = """                        primary: '#111827',
                        background: '#F8FAFC',
                        surface: '#FFFFFF',
                        border: '#E5E7EB',
                        success: '#16A34A',
                        danger: '#DC2626',
                        warning: '#F59E0B',"""

tailwind_new = """                        primary: 'var(--color-primary)',
                        background: 'var(--color-background)',
                        surface: 'var(--color-surface)',
                        border: 'var(--color-border)',
                        success: 'var(--color-success)',
                        danger: 'var(--color-danger)',
                        warning: 'var(--color-warning)',"""

dark_mode_script = """
    <!-- Dark Mode Init -->
    <script>
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>
"""

dark_mode_toggle_function = """
    <script>
        function toggleDarkMode() {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }
        
        // Auto-check the toggle if dark mode is active
        document.addEventListener('DOMContentLoaded', () => {
            const darkToggle = document.getElementById('dark-mode-toggle');
            if (darkToggle && document.documentElement.classList.contains('dark')) {
                darkToggle.checked = true;
            }
        });
    </script>
"""

for root, dirs, files in os.walk('D:/PersonalOS'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # replace tailwind config colors
            content = content.replace(tailwind_original, tailwind_new)
            
            # add darkMode init to head
            if '<!-- Dark Mode Init -->' not in content:
                content = content.replace('</head>', dark_mode_script + '</head>')
                
            # add toggleDarkMode function to body end
            if 'function toggleDarkMode()' not in content:
                content = content.replace('</body>', dark_mode_toggle_function + '</body>')
                
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

# Update profile.html specifically to wire up the checkbox
with open('D:/PersonalOS/profile.html', 'r', encoding='utf-8') as f:
    profile_content = f.read()

# Update the toggle in profile.html
profile_content = profile_content.replace(
    '<input type="checkbox" value="" class="sr-only peer">',
    '<input type="checkbox" value="" id="dark-mode-toggle" class="sr-only peer" onchange="toggleDarkMode()">'
)
with open('D:/PersonalOS/profile.html', 'w', encoding='utf-8') as f:
    f.write(profile_content)

print("Dark mode implemented!")
