with open('D:/PersonalOS/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace main content
start_marker = '<!-- Scrollable Dashboard Content -->'
end_marker = '</main>'

main_content = """
        <!-- Scrollable Profile Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 p-6">
            <div class="max-w-4xl mx-auto space-y-6">
                <!-- Header Title -->
                <div>
                    <h2 class="text-2xl font-bold text-primary">Profil & Pengaturan</h2>
                    <p class="text-sm text-gray-500 mt-1">Kelola informasi pribadi dan pengaturan keamanan akun Anda.</p>
                </div>
                
                <!-- Main Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <!-- Left Sidebar (Navigation/Summary) -->
                    <div class="md:col-span-1 space-y-6">
                        <!-- Profile Card -->
                        <div class="bg-white rounded-2xl border border-border p-6 flex flex-col items-center text-center shadow-sm">
                            <div class="relative group cursor-pointer">
                                <div class="h-24 w-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-50 mb-4">
                                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=F8FAFC" alt="Profile" class="h-full w-full object-cover">
                                </div>
                                <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                            </div>
                            <h3 class="text-lg font-bold text-primary">Felix</h3>
                            <p class="text-sm text-gray-500">UI/UX Designer</p>
                            
                            <div class="w-full border-t border-gray-100 mt-5 pt-5 flex justify-between text-sm">
                                <div class="text-center w-full">
                                    <span class="block font-bold text-primary">12</span>
                                    <span class="text-[10px] text-gray-500 uppercase tracking-wider">Tugas Selesai</span>
                                </div>
                                <div class="border-l border-gray-100"></div>
                                <div class="text-center w-full">
                                    <span class="block font-bold text-primary">5</span>
                                    <span class="text-[10px] text-gray-500 uppercase tracking-wider">Proyek Aktif</span>
                                </div>
                            </div>
                        </div>

                        <!-- Menu Links -->
                        <div class="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                            <a href="#" class="flex items-center px-5 py-4 bg-gray-50 text-sm font-semibold text-primary border-l-4 border-l-primary">
                                <svg class="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Data Pribadi
                            </a>
                            <a href="#" class="flex items-center px-5 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Keamanan & Sandi
                            </a>
                            <a href="#" class="flex items-center px-5 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors">
                                <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                Notifikasi
                            </a>
                        </div>
                    </div>
                    
                    <!-- Right Content (Forms) -->
                    <div class="md:col-span-2 space-y-6">
                        <!-- Edit Form -->
                        <div class="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <h3 class="text-base font-bold text-primary mb-5">Informasi Dasar</h3>
                            <div class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Depan</label>
                                        <input type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" value="Felix">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nama Belakang</label>
                                        <input type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" value="Doe">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                                    <input type="email" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" value="felix@example.com">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Pekerjaan / Jabatan</label>
                                    <input type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" value="UI/UX Designer">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Bio Singkat</label>
                                    <textarea class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-y min-h-[100px]">Saya adalah seorang desainer antarmuka yang antusias dengan minimalisme dan pengalaman pengguna yang mulus.</textarea>
                                </div>
                            </div>
                            
                            <div class="mt-8 pt-5 border-t border-gray-100 flex justify-end gap-3">
                                <button class="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                                <button class="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-gray-800 transition-colors shadow-sm" onclick="alert('Profil berhasil diperbarui!')">Simpan Perubahan</button>
                            </div>
                        </div>

                        <!-- Preferences Section -->
                        <div class="bg-white rounded-2xl border border-border p-6 shadow-sm">
                            <h3 class="text-base font-bold text-primary mb-5">Preferensi Aplikasi</h3>
                            <div class="space-y-5">
                                <!-- Toggle 1 -->
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-semibold text-primary">Tema Gelap (Dark Mode)</p>
                                        <p class="text-xs text-gray-500 mt-0.5">Tampilan menjadi gelap untuk mengurangi ketegangan mata</p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" value="" class="sr-only peer">
                                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div class="border-t border-gray-100"></div>
                                <!-- Toggle 2 -->
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-semibold text-primary">Laporan Mingguan</p>
                                        <p class="text-xs text-gray-500 mt-0.5">Terima email rekap aktivitas tugas dan keuangan</p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                      <input type="checkbox" value="" class="sr-only peer" checked>
                                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
"""

new_html = html.split(start_marker)[0] + main_content + '\n' + '    ' + end_marker + html.split(end_marker)[1]
new_html = new_html.replace('Dashboard</h1>', 'Edit Profil</h1>')

with open('D:/PersonalOS/profile.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Created profile.html")
