import os
import re

new_logo = '<img src="logo.png" alt="Logo" class="w-8 h-8 object-contain mr-2">'
# We will match the specific div block with the OS text
pattern = r'<div class="w-6 h-6 bg-primary rounded-md flex items-center justify-center mr-3">\s*<span class="text-white text-xs font-bold">OS</span>\s*</div>'

for root, dirs, files in os.walk('D:/PersonalOS'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Sub the OS block with new logo
            content = re.sub(pattern, new_logo, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Processed {file}')
