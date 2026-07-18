import os
import re

files = {
    'index.html': 'Dashboard',
    'finance.html': 'Keuangan',
    'tasks.html': 'Tugas',
    'notes.html': 'Catatan',
    'calendar.html': 'Kalender',
    'inbox.html': 'Kotak Masuk'
}

base_dir = r"D:\PersonalOS"

for filename, title in files.items():
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        pattern = re.compile(r'(<div class="flex-1 max-w-lg">).*?(</div>\s*<div class="flex items-center)', re.DOTALL)
        
        replacement = f'\\1\n                <h1 class="text-xl font-bold text-primary">{title}</h1>\n            \\2'
        
        new_content, count = pattern.subn(replacement, content)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"Failed to match in {filename}")
