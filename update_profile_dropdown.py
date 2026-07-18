import os

directory = 'D:/PersonalOS'

target = """                <div class="h-8 w-8 rounded-full border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-gray-100 transition-all">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Avatar" class="h-full w-full object-cover">
                </div>"""

target2 = """                <div class="h-8 w-8 rounded-full border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-gray-100 transition-all">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Avatar" class="h-full w-full object-cover" />
                </div>"""

replacement = """                <div class="relative" id="profile-menu-container">
                    <div class="h-8 w-8 rounded-full border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-gray-100 transition-all" onclick="document.getElementById('profile-dropdown').classList.toggle('opacity-0'); document.getElementById('profile-dropdown').classList.toggle('invisible'); document.getElementById('profile-dropdown').classList.toggle('scale-95'); document.getElementById('profile-dropdown').classList.toggle('scale-100'); event.stopPropagation();">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Avatar" class="h-full w-full object-cover">
                    </div>
                    
                    <!-- Dropdown -->
                    <div id="profile-dropdown" class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible transition-all transform scale-95 origin-top-right z-50">
                        <div class="p-4 border-b border-gray-50 flex items-center gap-3">
                            <div class="h-10 w-10 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Avatar" class="h-full w-full object-cover">
                            </div>
                            <div>
                                <p class="text-sm font-bold text-gray-800">Felix</p>
                                <p class="text-[10px] text-gray-500">felix@example.com</p>
                            </div>
                        </div>
                        <div class="p-2">
                            <a href="profile.html" class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Edit Profil
                            </a>
                            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors">
                                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                Pengaturan Akun
                            </a>
                        </div>
                        <div class="p-2 border-t border-gray-50">
                            <button onclick="alert('Anda telah keluar.')" class="w-full flex items-center px-3 py-2 text-sm font-medium text-danger hover:bg-red-50 rounded-lg transition-colors">
                                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>"""

# add a script to close the dropdown when clicking outside
js_code = """
    <script>
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('profile-dropdown');
            const container = document.getElementById('profile-menu-container');
            if (dropdown && container && !container.contains(event.target)) {
                if (!dropdown.classList.contains('opacity-0')) {
                    dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                    dropdown.classList.remove('scale-100');
                }
            }
        });
    </script>
</body>
"""

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            if target in content:
                content = content.replace(target, replacement)
                modified = True
            elif target2 in content:
                content = content.replace(target2, replacement)
                modified = True
                
            if modified:
                if '</body>' in content and 'profile-dropdown' not in content.split('</body>')[0].split('<script>')[-1]:
                     content = content.replace('</body>', js_code)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file}")
