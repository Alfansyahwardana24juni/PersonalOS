import os
import re

mapping = {
    'bg-white': 'dark:bg-surface',
    'bg-surface': 'dark:bg-surface',
    'bg-gray-50': 'dark:bg-[#09090b]',
    'bg-gray-100': 'dark:bg-[#18181b]',
    'bg-gray-50/50': 'dark:bg-[#09090b]/50',
    'text-gray-900': 'dark:text-gray-100',
    'text-gray-800': 'dark:text-gray-200',
    'text-gray-700': 'dark:text-gray-300',
    'text-gray-600': 'dark:text-gray-400',
    'text-gray-500': 'dark:text-gray-400',
    'border-gray-100': 'dark:border-[#27272a]',
    'border-gray-200': 'dark:border-[#27272a]',
    'border-gray-300': 'dark:border-[#3f3f46]',
    'border-border': 'dark:border-[#27272a]',
    'hover:bg-gray-50': 'dark:hover:bg-[#27272a]',
    'hover:bg-gray-100': 'dark:hover:bg-[#27272a]',
    'bg-yellow-50': 'dark:bg-yellow-500/10 dark:border-yellow-500/20',
    'text-yellow-800': 'dark:text-yellow-300',
    'border-yellow-100': 'dark:border-yellow-500/20',
    'bg-blue-50': 'dark:bg-blue-500/10 dark:border-blue-500/20',
    'text-blue-800': 'dark:text-blue-300',
    'border-blue-100': 'dark:border-blue-500/20',
    'bg-green-50': 'dark:bg-green-500/10 dark:border-green-500/20',
    'text-green-800': 'dark:text-green-300',
    'border-green-100': 'dark:border-green-500/20',
    'bg-red-50': 'dark:bg-red-500/10 dark:border-red-500/20',
    'text-red-800': 'dark:text-red-300',
    'border-red-100': 'dark:border-red-500/20',
    'text-red-700': 'dark:text-red-400',
    'ring-red-600/10': 'dark:ring-red-500/20',
    'bg-purple-50': 'dark:bg-purple-500/10 dark:border-purple-500/20',
    'text-purple-800': 'dark:text-purple-300',
    'border-purple-100': 'dark:border-purple-500/20',
    'bg-orange-50': 'dark:bg-orange-500/10 dark:border-orange-500/20',
    'text-orange-800': 'dark:text-orange-300',
    'border-orange-100': 'dark:border-orange-500/20',
    'bg-brand/10': 'dark:bg-blue-500/10',
    'bg-primary': 'dark:bg-[#FAFAFA]',
}

def clean_and_map_classes(match):
    class_str = match.group(1)
    classes = [c for c in class_str.split() if not c.startswith('dark:')]
    
    new_classes = list(classes)
    for c in classes:
        # Special fixes
        if c == 'bg-gray-100' and 'group' in classes: 
            # Active sidebar link
            new_classes.append('dark:bg-[#27272a]')
        elif c == 'text-white' and 'bg-primary' in classes:
            new_classes.append('dark:text-[#09090b]')
        elif c in mapping:
            # Check if we already applied a special override
            if c == 'bg-gray-100' and 'group' in classes:
                continue # Skip mapping since we handled it
            # Add mapped classes
            for mapped_c in mapping[c].split():
                if mapped_c not in new_classes:
                    new_classes.append(mapped_c)
                    
    return 'class="' + " ".join(new_classes) + '"'

for root, dirs, files in os.walk('D:/PersonalOS'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content = re.sub(r'class="([^"]+)"', clean_and_map_classes, content)
            
            # Manually fix JS arrays
            content = content.replace("'bg-white dark:bg-surface dark:bg-surface'", "'bg-white dark:bg-surface'")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Processed {file}')
