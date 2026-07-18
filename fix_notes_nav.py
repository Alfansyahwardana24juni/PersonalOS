import re

with open('D:/PersonalOS/notes.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Desktop Navbar Replacements
# We will look for <a href="#" ... Dasbor </a> and replace the href="#" with href="index.html"
desktop_links = [
    (r'href="#"([^>]+>[\s\S]*?Dasbor\s*</a>)', r'href="index.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?Kotak Masuk\s*<span[\s\S]*?</a>)', r'href="inbox.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?Tugas\s*</a>)', r'href="tasks.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?Kalender\s*</a>)', r'href="calendar.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?Catatan\s*</a>)', r'href="notes.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?Keuangan\s*</a>)', r'href="finance.html"\1'),
]

# Mobile Navbar Replacements
mobile_links = [
    (r'href="#"([^>]+>[\s\S]*?<span[^>]*>Beranda</span>\s*</a>)', r'href="index.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?<span[^>]*>Tugas</span>\s*</a>)', r'href="tasks.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?<span[^>]*>Kalender</span>\s*</a>)', r'href="calendar.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?<span[^>]*>Catatan</span>\s*</a>)', r'href="notes.html"\1'),
    (r'href="#"([^>]+>[\s\S]*?<span[^>]*>Keuangan</span>\s*</a>)', r'href="finance.html"\1'),
]

for pattern, repl in desktop_links + mobile_links:
    content = re.sub(pattern, repl, content)

with open('D:/PersonalOS/notes.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Navigation links updated in notes.html!")
