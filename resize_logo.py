import os

old_class = 'class="w-8 h-8 object-contain mr-2"'
new_class = 'class="w-12 h-12 object-contain mr-3"'

for root, dirs, files in os.walk('D:/PersonalOS'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content = content.replace(old_class, new_class)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Processed {file}')
