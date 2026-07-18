import re

with open('D:/PersonalOS/notes.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the textarea content
bad_text = r'Beberapa ide untuk aplikasi B2B yang fokus pada produktivitas tim kecil tanpa framework yang berat. ## Mengapa Vanilla JS?'
good_text = '''Beberapa ide untuk aplikasi B2B yang fokus pada produktivitas tim kecil tanpa framework yang berat.

## Mengapa Vanilla JS?'''
content = content.replace(bad_text, good_text)

# Also fix the line breaks for the rest of the list
content = content.replace('- **Kecepatan**:', '\n- **Kecepatan**:')
content = content.replace('- **Kemandirian**:', '\n- **Kemandirian**:')
content = content.replace('- **Kemudahan Maintain**:', '\n- **Kemudahan Maintain**:')
content = content.replace('## Rencana Fitur', '\n\n## Rencana Fitur\n')
content = content.replace('1. Modul Tasks', '\n1. Modul Tasks')
content = content.replace('2. Modul Notes', '\n2. Modul Notes')
content = content.replace('3. Habit tracker', '\n3. Habit tracker')
content = content.replace('4. Keuangan', '\n4. Keuangan')

# Fix the title class if it was broken
title_pattern = r'id="editor-title" class="([^"]+)"'
def fix_title(m):
    c = m.group(1)
    if 'dark:text-gray-100' not in c:
        c += ' dark:text-gray-100'
    return f'id="editor-title" class="{c}"'
content = re.sub(title_pattern, fix_title, content)

# Fix the selected card
bad_card = 'bg-primary md:bg-gray-100 border border-transparent md:border-border p-3 md:p-4 rounded-xl cursor-pointer hover:shadow-sm transition-all dark:bg-[#FAFAFA]'
good_card = 'bg-primary md:bg-gray-100 border border-transparent md:border-border p-3 md:p-4 rounded-xl cursor-pointer hover:shadow-sm transition-all dark:bg-[#27272a] dark:md:bg-[#27272a]'
content = content.replace(bad_card, good_card)

# Fix selected card text
bad_card_title = 'class="text-sm font-semibold text-white md:text-primary mb-1 line-clamp-2"'
good_card_title = 'class="text-sm font-semibold text-white md:text-primary dark:text-white dark:md:text-white mb-1 line-clamp-2"'
content = content.replace(bad_card_title, good_card_title)

# Fix selected card text color 2
bad_card_desc = 'class="text-[11px] md:text-xs text-gray-300 md:text-gray-500 line-clamp-4 md:line-clamp-2 mb-3 leading-relaxed"'
good_card_desc = 'class="text-[11px] md:text-xs text-gray-300 md:text-gray-500 dark:text-gray-400 dark:md:text-gray-400 line-clamp-4 md:line-clamp-2 mb-3 leading-relaxed"'
content = content.replace(bad_card_desc, good_card_desc)

# Fix the editor area background
bad_editor_bg = 'class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 pb-24 md:pb-12 bg-white dark:bg-surface"'
good_editor_bg = 'class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 pb-24 md:pb-12 bg-white dark:bg-[#09090b]"'
content = content.replace(bad_editor_bg, good_editor_bg)

with open('D:/PersonalOS/notes.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Notes fixed!")
