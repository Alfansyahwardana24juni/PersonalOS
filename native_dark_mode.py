import os
import re

replacements = {
    r'\bbg-white\b(?! dark:bg-)': 'bg-white dark:bg-surface',
    r'\bbg-gray-50\b(?!/| dark:bg-)': 'bg-gray-50 dark:bg-[#09090b]',
    r'\bbg-gray-100\b(?! dark:bg-)': 'bg-gray-100 dark:bg-[#18181b]',
    r'\bbg-gray-50/50\b(?! dark:bg-)': 'bg-gray-50/50 dark:bg-[#09090b]/50',
    r'\bbg-surface\b(?! dark:bg-)': 'bg-surface dark:bg-surface',
    r'\btext-gray-900\b(?! dark:text-)': 'text-gray-900 dark:text-gray-100',
    r'\btext-gray-800\b(?! dark:text-)': 'text-gray-800 dark:text-gray-200',
    r'\btext-gray-700\b(?! dark:text-)': 'text-gray-700 dark:text-gray-300',
    r'\btext-gray-600\b(?! dark:text-)': 'text-gray-600 dark:text-gray-400',
    r'\btext-gray-500\b(?! dark:text-)': 'text-gray-500 dark:text-gray-400',
    r'\bborder-gray-100\b(?! dark:border-)': 'border-gray-100 dark:border-[#27272a]',
    r'\bborder-gray-200\b(?! dark:border-)': 'border-gray-200 dark:border-[#27272a]',
    r'\bborder-gray-300\b(?! dark:border-)': 'border-gray-300 dark:border-[#3f3f46]',
    r'\bhover:bg-gray-50\b(?! dark:hover:bg-)': 'hover:bg-gray-50 dark:hover:bg-[#27272a]',
    r'\bhover:bg-gray-100\b(?! dark:hover:bg-)': 'hover:bg-gray-100 dark:hover:bg-[#27272a]',
    
    # Specific note card colors
    r'\bbg-yellow-50\b(?! dark:bg-)': 'bg-yellow-50 dark:bg-yellow-500/10 dark:border-yellow-500/20',
    r'\bbg-blue-50\b(?! dark:bg-)': 'bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/20',
    r'\bbg-green-50\b(?! dark:bg-)': 'bg-green-50 dark:bg-green-500/10 dark:border-green-500/20',
    r'\bbg-red-50\b(?! dark:bg-)': 'bg-red-50 dark:bg-red-500/10 dark:border-red-500/20',
    r'\bbg-purple-50\b(?! dark:bg-)': 'bg-purple-50 dark:bg-purple-500/10 dark:border-purple-500/20',
    r'\bbg-orange-50\b(?! dark:bg-)': 'bg-orange-50 dark:bg-orange-500/10 dark:border-orange-500/20',
}

for root, dirs, files in os.walk('D:/PersonalOS'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            for old_pattern, new_string in replacements.items():
                content = re.sub(old_pattern, new_string, content)
                
            # Bump cache just in case
            content = re.sub(r'css/style\.css\?v=\d+', 'css/style.css?v=5', content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Processed {file}')
