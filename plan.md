# Personal OS - Strategic System Plan & Action Architecture (Standalone Local-First Edition)

## 1. Executive Summary & Purpose (Tujuan Utama System)

### Background & Core Problem
Penggunaan banyak aplikasi terpisah (*context switching*) seperti Google Calendar, Google Keep, Google Tasks, Notion, dan aplikasi keuangan terpisah menyebabkan fragmentasi perhatian, lambatnya *capture* informasi, dan ketiadaan keterhubungan antar data (*data silos*).

### Main Goal
**Personal OS** diciptakan sebagai **Second Brain Standalone & No-Login** yang menyatukan seluruh elemen produktivitas (Notes, Tasks, Calendar, Finance, Projects) dalam satu sistem PWA berkecepatan tinggi.

### Core Objectives & Architecture Principles
1. **Zero Login / Zero Server Dependency:** Aplikasi berjalan 100% di browser tanpa autentikasi, tanpa akun, dan tanpa server database terpusat.
2. **Device-Isolated Local Storage:** Setiap device (HP, Laptop, Tablet) menyimpan datanya masing-masing secara privat dan terisolasi menggunakan **IndexedDB**.
3. **Frictionless Manual Data Portability:** Pengguna memiliki kendali penuh atas datanya via fitur **Export / Import JSON & Backup File** untuk memindahkan atau mencadangkan data antar device.
4. **Unified Entity Relation:** Setiap Task, Note, Expense, dan Income tidak berdiri sendiri, melainkan terhubung langsung ke sebuah **Project**.
5. **Ultra Fast Capture:** Menangkap ide, tugas, atau pengeluaran dalam waktu kurang dari 5-10 detik.

---

## 2. Global App Flow (Alur Kerja Utama Sistem)

Sistem beroperasi dalam **3 Tahap Siklus Utama**:

```
[ CAPTURE ] ─────────────► [ PROCESS & ORGANIZE ] ─────────────► [ EXECUTE & REVIEW ]
• Quick Add (Ctrl+N)        • Inbox Triage                      • Today's Dashboard
• Command Palette (Ctrl+K)  • Convert Item to Task/Note/Expense • Time Blocking Calendar
• Voice/Text Micro Notes   • Link Item to Project/Tag          • Daily/Weekly Review
```

### Flow Lifecycle
1. **Capture (Penangkapan Cepat):**
   - User mendapat ide, tugas mendadak, atau pengeluaran.
   - Tanpa memilih kategori/folder rumit, user menggunakan `Ctrl + N` atau `Ctrl + K` untuk memasukkan raw text ke **Inbox**.
2. **Process & Organize (Pengolahan):**
   - Saat waktu luang atau *Daily Review*, user membuka halaman **Inbox**.
   - User memindahkan (*triage*) raw item menjadi **Task** (dengan deadline & prioritas), **Note** (dengan tag & markdown), atau **Expense/Income** (dengan nominal & kategori).
   - Menghubungkan elemen tersebut ke **Project** tertentu.
3. **Execute & Review (Eksekusi & Evaluasi):**
   - User mengeksekusi hari kerja melalui **Dashboard** dan **Calendar** (Time Blocking).
   - Di akhir hari, user menjalankan fungsi **Daily Review** untuk mengevaluasi task yang selesai, pencatatan keuangan harian, serta rencana esok hari.

---

## 3. Page-by-Page Specification & Local Actions

### 3.1. Dashboard (`/dashboard`)
*Halaman pusat informasi harian yang bersih, dapat dipahami dalam 5 detik.*

* **Aksi Utama di Halaman:**
  - **Quick Action Trigger:** Menjalankan `Daily Review` mode.
  - **Task Completion Check:** Tandai task hari ini langsung dari dashboard.
  - **Time Blocking Shortcut:** Drag task hari ini ke slot kalender mini.
  - **Financial Summary Toggle:** Sembunyikan/tampilkan nominal keuangan (*privacy mode*).
  - **Search & Jump:** Akses cepat ke halaman lain via `Ctrl + K`.
* **Komponen & Visual:**
  - Today's Focus Tasks (Maksimal 5 task prioritas tinggi).
  - Upcoming Calendar Events & Deadlines.
  - Daily Financial Snapshot (Total Expense Today vs Monthly Budget).
  - Recent Notes & Recent Activity Feed.

### 3.2. Inbox (`/inbox`)
*Tempat penampungan sementara seluruh data raw mentah.*

* **Aksi Utama di Halaman:**
  - **Convert to Task:** Mengubah raw text menjadi Task (buka modal/drawer untuk tanggal & prioritas).
  - **Convert to Note:** Mengubah raw text menjadi Note terstruktur.
  - **Convert to Finance:** Mengubah raw text menjadi transaksi Expense/Income.
  - **Direct Project Assignment:** Menghubungkan item di Inbox langsung ke Project.
  - **Batch Delete / Archive:** Membersihkan inbox yang tidak relevan.

### 3.3. Tasks (`/tasks`)
*Manajemen tugas berorientasi tindakan cepat.*

* **Aksi Utama di Halaman:**
  - **View Switcher:** Kategori tampilan (List View, Kanban Board, Today, Upcoming, Project View).
  - **Inline Editing:** Mengubah judul, deadline, prioritas (`P1`, `P2`, `P3`), dan status langsung tanpa membuka modal.
  - **Subtask Management:** Menambah & melakukan reorder subtask (drag-and-drop).
  - **Natural Language Parsing Input:** Menambah task baru dengan format otomatis (contoh: `Rapat klien esok 14:00 !p1 #ProjectA`).
  - **Filter & Grouping:** Filter berdasarkan Project, Priority, Due Date, dan Tag.

### 3.4. Notes (`/notes`)
*Ruang kerja pencatatan berbasis Markdown.*

* **Aksi Utama di Halaman:**
  - **Markdown Editor:** Dukungan WYSIWYG / Markdown split mode, checklist, code block, table.
  - **Pin & Favorite:** Menyematkan catatan penting di bagian atas.
  - **Folder & Tag Navigation:** Mengatur hierarki catatan berdasarkan folder dan tag.
  - **Link to Entity:** Menghubungkan catatan ke Task atau Project tertentu via mention `@Project` atau `@Task`.
  - **Export Note:** Export catatan spesifik ke format Markdown (`.md`) atau PDF.

### 3.5. Calendar (`/calendar`)
*Visualisasi waktu, jadwal rapat, dan deadline tugas.*

* **Aksi Utama di Halaman:**
  - **View Toggle:** Tampilan Daily, Weekly, dan Monthly.
  - **Time Blocking Drag-and-Drop:** Menggeser Task dari sidebar unassigned task langsung ke slot jam kalender.
  - **Event Creation:** Membuat event jadwal baru atau pengingat.
  - **Click-to-Date Detail:** Klik tanggal tertentu untuk melihat summary Task, Event, dan Expense pada tanggal tersebut.

### 3.6. Finance (`/finance`)
*Pencatatan cashflow harian dan pelacakan anggaran.*

* **Aksi Utama di Halaman:**
  - **Add Transaction:** Log Income atau Expense secara cepat.
  - **Project Financial Linking:** Alokasikan pengeluaran ke Project tertentu (misal: Beli Domain/Hosting untuk Project X).
  - **Category Management:** Custom kategori (Food, Transport, Hosting, Domain, Investment, etc.).
  - **Filter & Analytics:** Visualisasi grafik pemasukan vs pengeluaran per bulan/tahun.
  - **Budget Alerting:** Indikator visual jika pengeluaran kategori tertentu mendekati limit.

### 3.7. Projects (`/projects`)
*Hub terpusat tempat seluruh data terintegrasi.*

* **Aksi Utama di Halaman:**
  - **Project Dashboard:** Melihat seluruh Tasks, Notes, Expenses, dan Activity yang terikat pada 1 Project.
  - **Project Status Toggle:** Active, On Hold, Completed, Archived.
  - **Project Financial P&L:** Melihat akumulasi pengeluaran vs pemasukan khusus project tersebut.
  - **Progress Bar Tracking:** Persentase penyelesaian task dalam project.

### 3.8. Settings & Local Storage Management (`/settings`)
*Konfigurasi sistem, tema, dan manajemen cadangan data lokal.*

* **Aksi Utama di Halaman:**
  - **Full Data Backup (Export JSON):** Mengunduh seluruh isi database IndexedDB menjadi 1 file `.json` untuk dicadangkan atau dipindah ke device lain.
  - **Restore Data (Import JSON):** Memuat file `.json` backup ke browser device ini (Opsi: Overwrite / Merge Data).
  - **Clear Local Storage:** Menghapus seluruh data lokal di browser device ini (*Reset Application*).
  - **Theme Switcher:** Light Mode, Dark Mode, System Default.
  - **Keyboard Shortcut Config:** Melihat dan menyesuaikan tombol pintas.
  - **Storage Usage Indicator:** Menampilkan estimasi ukuran MB data yang terpakai di IndexedDB device.

---

## 4. Cross-Page Connectivity & Inter-Entity Actions (Aksi Lintas Halaman)

Keunggulan utama Personal OS adalah **Relasi Lintas Modul**:

| Aksi Sumber (Source Action) | Modul Asal | Modul Terhubung (Target) | Hasil / Efek pada Sistem |
| :--- | :--- | :--- | :--- |
| **Pencatatan Expense Project** | Finance | Projects | Mengurangi saldo project dan menambah akumulasi cost di Project Overview. |
| **Assign Task Deadline** | Tasks | Calendar | Task otomatis muncul di slot Calendar pada tanggal tersebut. |
| **Convert Note to Task** | Notes | Tasks | Blok teks/checklist di Note diubah menjadi Task terpisah sambil menyertakan link balik ke Note asal. |
| **Drag Unassigned Task** | Calendar | Tasks | Mengubah properti time-slot task secara otomatis. |
| **Quick Command (`Ctrl + K`)** | Mana saja | All Modules | Dapat menjalankan aksi langsung (misal: `+exp 50k`, `+task Beli Susu`, `goto finance`) tanpa pindah halaman manual. |
| **Finish Daily Review** | Dashboard | Tasks, Notes, Finance | Menutup task hari ini, mencatat summary aktivitas di Activity Log harian. |

---

## 5. Keyboard Shortcuts & Efficiency Map

| Shortcut | Scope | Aksi |
| :--- | :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Global | Membuka Universal Command Palette / Search |
| `Ctrl + N` / `Cmd + N` | Global | Membuka Quick Add Drawer (Task/Note/Expense) |
| `G` lalu `D` | Global | Pindah ke Dashboard |
| `G` lalu `T` | Global | Pindah ke Tasks |
| `G` lalu `N` | Global | Pindah ke Notes |
| `G` lalu `C` | Global | Pindah ke Calendar |
| `G` lalu `F` | Global | Pindah ke Finance |
| `G` lalu `P` | Global | Pindah ke Projects |
| `Escape` | Modals / Drawers | Menutup overlay yang sedang aktif |

---

## 6. Standalone Local-First Storage Lifecycle

```
[ User Action (Add Task / Expense / Note) ]
                    │
                    ▼
[ Direct Local Write to IndexedDB (Dexie.js) ]
                    │
                    ▼
[ Instant UI Render (< 5ms) - No Server Network Request ]
                    │
                    ▼
[ Stored Permanently in Device Browser Storage ]
```

### Keuntungan Model Standalone / No-Login:
1. **Kecepatan Maksimal:** Tidak ada jeda loading network, spinner HTTP request, atau masalah koneksi internet mati.
2. **Privasi Total:** Data keuangan dan catatan 100% berada di perangkat lokal user, tidak pernah terkirim ke server mana pun.
3. **PWA Standalone:** Dapat di-install langsung ke HomeScreen Android/iOS/Desktop via fitur *Add to Home Screen*.