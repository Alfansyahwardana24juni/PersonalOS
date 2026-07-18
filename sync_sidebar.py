import re

# Read tasks.html to get standard aside
with open('D:/PersonalOS/tasks.html', 'r', encoding='utf-8') as f:
    tasks_content = f.read()

aside_match = re.search(r'<aside.*?</aside>', tasks_content, re.DOTALL)
if not aside_match:
    print('Error finding aside in tasks.html')
    exit(1)

standard_aside = aside_match.group(0)

# Modify standard aside to make Catatan active and Tugas inactive
active_class = 'flex items-center px-3 py-2 bg-gray-100 rounded-md text-sm font-semibold text-primary transition-colors group dark:bg-[#27272a]'
inactive_class = 'flex items-center px-3 py-2 hover:bg-gray-50 rounded-md text-sm font-medium text-gray-500 hover:text-primary transition-colors group dark:hover:bg-[#27272a] dark:text-gray-400'

# First, replace the active class in tasks with inactive class
standard_aside = re.sub(
    r'(<a href="tasks\.html" id="nav-tasks" class=")[^"]+(")',
    r'\g<1>' + inactive_class + r'\g<2>',
    standard_aside
)
# Then replace the inactive class in notes with active class
standard_aside = re.sub(
    r'(<a href="notes\.html" id="nav-notes" class=")[^"]+(")',
    r'\g<1>' + active_class + r'\g<2>',
    standard_aside
)

# Read notes.html
with open('D:/PersonalOS/notes.html', 'r', encoding='utf-8') as f:
    notes_content = f.read()

# Replace aside in notes.html
notes_content = re.sub(r'<aside.*?</aside>', standard_aside, notes_content, count=1, flags=re.DOTALL)

# Now, we also need to fix the Mobile Bottom Navigation because it might be using the Zinc classes and wrong logo too.
# Let's extract the mobile nav from tasks.html
mobile_nav_match = re.search(r'<nav[^>]*md:hidden[^>]*absolute bottom-0[^>]*>.*?</nav>', tasks_content, re.DOTALL)
if mobile_nav_match:
    standard_mobile_nav = mobile_nav_match.group(0)
    
    # Active class for mobile:
    active_mobile_class = 'flex flex-col items-center justify-center w-full h-full text-primary transition-colors'
    inactive_mobile_class = 'flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-primary transition-colors'
    
    # Fix mobile nav active states
    standard_mobile_nav = re.sub(
        r'(<a href="tasks\.html" class=")[^"]+(")',
        r'\g<1>' + inactive_mobile_class + r'\g<2>',
        standard_mobile_nav
    )
    standard_mobile_nav = re.sub(
        r'(<a href="notes\.html" class=")[^"]+(")',
        r'\g<1>' + active_mobile_class + r'\g<2>',
        standard_mobile_nav
    )
    
    # Replace in notes.html
    notes_content = re.sub(r'<nav[^>]*md:hidden[^>]*absolute bottom-0[^>]*>.*?</nav>', standard_mobile_nav, notes_content, count=1, flags=re.DOTALL)

with open('D:/PersonalOS/notes.html', 'w', encoding='utf-8') as f:
    f.write(notes_content)

print('Sidebar and mobile nav updated successfully in notes.html')
