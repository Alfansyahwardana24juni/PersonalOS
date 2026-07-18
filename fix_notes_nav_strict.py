import re

with open('D:/PersonalOS/notes.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Desktop Sidebar Links
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?Dasbor\s*</a>)',
    r'\g<1>index.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?Kotak Masuk\s*<span[\s\S]*?</a>)',
    r'\g<1>inbox.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?Tugas\s*</a>)',
    r'\g<1>tasks.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?Kalender\s*</a>)',
    r'\g<1>calendar.html\g<2>', content
)
# Make sure we don't accidentally match the bottom nav by requiring mr-3 for desktop links
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*class="[^"]*mr-3[^"]*"[^>]*>\s*<svg[^>]*>[\s\S]*?Catatan\s*</a>)',
    r'\g<1>notes.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*class="[^"]*mr-3[^"]*"[^>]*>\s*<svg[^>]*>[\s\S]*?Keuangan\s*</a>)',
    r'\g<1>finance.html\g<2>', content
)
# Pengaturan
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?Pengaturan\s*</a>)',
    r'\g<1>#\g<2>', content
)

# 2. Top bar inbox (md:hidden relative p-2)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*class="md:hidden relative p-2[^>]*>)',
    r'\g<1>inbox.html\g<2>', content
)

# 3. Profile dropdown
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?Edit Profil\s*</a>)',
    r'\g<1>profile.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?Pengaturan Akun\s*</a>)',
    r'\g<1>#\g<2>', content
)

# 4. Mobile Bottom Navigation
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?<span[^>]*>Beranda</span>\s*</a>)',
    r'\g<1>index.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?<span[^>]*>Tugas</span>\s*</a>)',
    r'\g<1>tasks.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?<span[^>]*>Kalender</span>\s*</a>)',
    r'\g<1>calendar.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?<span[^>]*>Catatan</span>\s*</a>)',
    r'\g<1>notes.html\g<2>', content
)
content = re.sub(
    r'(<a[^>]+href=")[^"]+("[^>]*>\s*<svg[^>]*>[\s\S]*?<span[^>]*>Keuangan</span>\s*</a>)',
    r'\g<1>finance.html\g<2>', content
)

with open('D:/PersonalOS/notes.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Links strictly fixed!")
