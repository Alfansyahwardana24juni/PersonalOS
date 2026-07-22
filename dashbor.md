# Dashboard Personal OS

## Objective

Redesign halaman Dashboard Personal OS menjadi dashboard modern, premium, minimalis, dan sangat informatif.

Dashboard merupakan halaman pertama yang dilihat setiap user membuka aplikasi.

Dalam waktu kurang dari 5 detik, user harus mengetahui kondisi finansial dan produktivitas hari ini.

Dashboard harus memiliki tampilan seperti aplikasi mobile modern (Linear, Arc Browser, Apple Wallet, Notion, Revolut), bukan seperti dashboard admin.

Gunakan pendekatan card yang clean dengan animasi halus.

---

# Design Style

Style:

- Modern
- Minimal
- Premium
- Clean
- Dark Mode Friendly
- Rounded Card
- Soft Shadow
- Smooth Animation
- Banyak whitespace
- Tidak terlalu banyak warna

Gunakan TailwindCSS.

Jangan menggunakan border tebal.

Gunakan border tipis dengan opacity rendah.

Card harus memiliki radius besar (rounded-2xl atau rounded-3xl).

Gunakan icon Lucide React.

Animasi menggunakan Framer Motion.

Hover effect sangat halus.

---

# Layout

Dashboard memiliki urutan berikut.

Header

↓

Financial Overview

↓

Quick Actions

↓

Today's Summary

↓

Productivity Overview

↓

Recent Activity

↓

Upcoming Deadline

↓

Recent Notes

---

# Header

Bagian atas berisi

Selamat Pagi

Nama User

Tanggal Hari Ini

Avatar

Notification Button

Search Button

Contoh

Good Morning

Alfa Wardana

Monday, 22 July 2026

---

# Financial Overview

Ini merupakan section paling penting.

Gunakan horizontal scroll pada mobile.

Tampilkan beberapa card.

Card 1

Total Wealth

Icon Wallet

Isi

Total seluruh saldo

Contoh

Rp 25.500.000

Tambahkan indikator

+12%

warna hijau

Card memiliki mini sparkline chart.

---

Card 2

Income This Month

Icon Trending Up

Rp 8.500.000

Progress dibanding bulan lalu.

Mini chart.

---

Card 3

Expense This Month

Icon Trending Down

Rp 2.300.000

Mini chart.

---

Card 4

Cash Flow

Income

Expense

Net Profit

Mini Line Chart.

---

Card 5

Saving Goal

Progress Bar

Target

Rp 20.000.000

Saat ini

Rp 13.500.000

67%

---

Card 6

Investment

Total investasi

Keuntungan

Mini Chart.

Jika belum ada data tampilkan Empty State.

---

Card 7

Debt & Receivable

Piutang

Hutang

Status

---

Semua card memiliki:

Icon

Title

Value

Percentage

Mini Chart

Hover Animation

---

# Quick Actions

Grid 2 x 2

Tambah Task

Tambah Note

Tambah Income

Tambah Expense

Gunakan icon besar.

Card kecil.

Klik langsung membuka modal.

---

# Today's Summary

Card berisi

Task Hari Ini

Deadline Hari Ini

Reminder

Habit

Meeting

Contoh

Today's Tasks

6

Deadline

2

Completed

4

Progress Ring

67%

---

# Productivity Overview

Card besar.

Menampilkan

Task Completed

Task Pending

Task Overdue

Habit Progress

Goal Progress

Gunakan Progress Ring.

---

# Expense Analytics

Card besar.

Isi

Pie Chart

Kategori Pengeluaran

Food

Transport

Hosting

Shopping

Investment

Other

---

# Income Analytics

Bar Chart

Pendapatan per bulan.

---

# Cash Flow

Line Chart

Income vs Expense.

Gunakan gradient.

Animasi halus.

---

# Recent Activity

Timeline

Hari Ini

08.30

Tambah Expense

Rp120.000

Hosting

09.00

Task Selesai

Landing Page

10.10

Tambah Note

Ide AI

---

# Upcoming Deadline

List

Deadline Besok

Deadline Minggu Ini

Overdue

Gunakan badge warna.

---

# Recent Notes

Card kecil.

5 note terakhir.

Klik membuka editor.

---

# Empty State

Jika belum memiliki data.

Tampilkan ilustrasi sederhana.

Contoh

Belum ada transaksi.

Tambahkan pemasukan pertama.

---

# Chart

Gunakan Recharts.

Chart harus responsive.

Gunakan animasi.

Chart:

Line

Area

Pie

Bar

Sparkline

---

# Theme

Background

#F8FAFC

Card

White

Primary

#2563EB

Success

#16A34A

Danger

#DC2626

Warning

#F59E0B

Text

#111827

Border

#E5E7EB

---

# UX Rules

Dashboard harus bisa dipahami dalam 5 detik.

Tidak boleh ada tabel.

Tidak boleh ada card yang terlalu besar.

Prioritaskan visual.

Jangan memenuhi layar.

Semua informasi penting harus berada pada fold pertama.

Scroll ke bawah hanya untuk informasi tambahan.

---

# Animation

Gunakan Framer Motion.

Card muncul dengan fade + slide.

Chart animate ketika data berubah.

Hover card sedikit membesar.

Progress bar animate.

Counter menggunakan count up animation.

---

# Responsive

Desktop

4 card per row.

Tablet

2 card per row.

Mobile

Horizontal scroll untuk Financial Overview.

Grid tetap nyaman disentuh.

---

# Performance

Dashboard harus tetap ringan.

Lazy load chart.

Gunakan skeleton loading.

Target render kurang dari 1 detik.

---

# Final Goal

Dashboard harus terasa seperti aplikasi premium modern.

Ketika user membuka aplikasi, ia langsung mengetahui:

- Total kekayaan
- Saldo saat ini
- Total pemasukan bulan ini
- Total pengeluaran bulan ini
- Cash Flow
- Progress target tabungan
- Aktivitas terakhir
- Deadline terdekat
- Task hari ini
- Ringkasan produktivitas

Semua informasi harus ditampilkan dengan visual yang bersih, elegan, modern, dan mudah dipahami tanpa membuat pengguna merasa kewalahan.


jika bisa di buat seperti di bawah ini
┌──────────────────────────────────────┐
│ Good Morning, Alfa 👋                │
│ Monday, 22 July 2026                 │
└──────────────────────────────────────┘

══════════ Swipe Financial Cards ══════════

┌──────────────────────────────────────┐
│ 💰 Total Wealth                      │
│ Rp 28.450.000                        │
│ ▲ +12.5%                             │
│      📈 Sparkline                    │
└──────────────────────────────────────┘

Swipe →

┌──────────────────────────────────────┐
│ 📈 Income This Month                 │
│ Rp 8.500.000                         │
│ ▲ +25%                               │
│      📊 Area Chart                   │
└──────────────────────────────────────┘

Swipe →

┌──────────────────────────────────────┐
│ 📉 Expense This Month                │
│ Rp 2.300.000                         │
│ ▼ -8%                                │
│      📉 Area Chart                   │
└──────────────────────────────────────┘

Swipe →

┌──────────────────────────────────────┐
│ 🎯 Saving Goal                       │
│ Rp 13.500.000 / 20.000.000           │
│ ███████████░░░ 67%                   │
└──────────────────────────────────────┘