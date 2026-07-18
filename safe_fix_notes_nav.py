import re

with open('D:/PersonalOS/notes.html', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_link(match):
    full_tag = match.group(0)
    # Check what text it contains
    if 'Dasbor' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="index.html"', full_tag)
    elif 'Kotak Masuk' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="inbox.html"', full_tag)
    elif 'Tugas' in full_tag:
        # Check if it's the mobile top-bar inbox button (which I accidentally turned into Tasks earlier)
        # Mobile top bar inbox has 'md:hidden relative p-2'
        if 'md:hidden relative p-2' in full_tag:
            return re.sub(r'href="[^"]*"', 'href="inbox.html"', full_tag)
        return re.sub(r'href="[^"]*"', 'href="tasks.html"', full_tag)
    elif 'Kalender' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="calendar.html"', full_tag)
    elif 'Catatan' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="notes.html"', full_tag)
    elif 'Keuangan' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="finance.html"', full_tag)
    elif 'Pengaturan' in full_tag and 'Pengaturan Akun' not in full_tag:
        return re.sub(r'href="[^"]*"', 'href="#"', full_tag)
    elif 'Edit Profil' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="profile.html"', full_tag)
    elif 'Pengaturan Akun' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="#"', full_tag)
    elif 'Beranda' in full_tag:
        return re.sub(r'href="[^"]*"', 'href="index.html"', full_tag)
    return full_tag

# Find all <a> tags non-greedily (assuming they don't contain nested <a> tags)
content = re.sub(r'<a\s+[^>]*>[\s\S]*?</a>', replace_link, content)

with open('D:/PersonalOS/notes.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Safe link replacement done!")
