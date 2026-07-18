import os

for root, dirs, files in os.walk('D:/PersonalOS'):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'css/style.css' not in content:
                content = content.replace('</head>', '    <link rel="stylesheet" href="css/style.css">\n</head>')
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Added style.css to {file}')
