# Personal OS

Version: 1.0

---

# Overview

Personal OS adalah aplikasi produktivitas pribadi yang menggabungkan Notes, Tasks, Calendar, Personal Finance, dan Dashboard ke dalam satu sistem.

Target aplikasi bukan untuk banyak pengguna, tetapi menjadi "Second Brain" yang digunakan setiap hari oleh pemiliknya.

Prinsip utama aplikasi adalah:

- Fast
- Clean
- Minimal
- Offline First
- Keyboard Friendly
- Mobile & Desktop
- PWA
- Modern

---

# Core Philosophy

Setiap data harus saling terhubung.

Contoh

Project
│
├── Notes
├── Tasks
├── Expense
├── Income
├── Journal
└── Activity

Bukan data yang berdiri sendiri.

---

# Design Principle

Gunakan gaya modern minimal.

Inspirasi:

- Linear
- Raycast
- Notion
- Arc Browser
- Apple Human Interface
- Vercel Dashboard

Hindari:

❌ terlalu banyak warna

❌ icon berlebihan

❌ card besar

❌ dashboard penuh

Gunakan banyak whitespace.

---

# Color

Primary

#111827

Background

#F8FAFC

Surface

#FFFFFF

Border

#E5E7EB

Success

#16A34A

Danger

#DC2626

Warning

#F59E0B

---

# Typography

Font

Inter

Heading

Semibold

Body

Regular

Gunakan ukuran yang konsisten.

---

# Layout

Desktop

Sidebar kiri

Content kanan

Topbar tipis

Search di bagian atas

Mobile

Bottom Navigation

Floating Action Button

---

# Main Navigation

Dashboard

Inbox

Tasks

Notes

Calendar

Finance

Settings

---

# User Flow

Login

↓

Dashboard

↓

Quick Action

↓

Tambah Data

↓

Data otomatis tersimpan lokal

↓

Sinkron ketika online

↓

Dashboard Update

---

# Dashboard

Dashboard adalah halaman utama.

Berisi:

Today's Tasks

Upcoming Deadline

Today's Expense

Monthly Income

Recent Notes

Recent Activity

Quick Add

Search

Shortcut

Tidak boleh penuh.

Dashboard harus bisa dipahami dalam 5 detik.

---

# Inbox

Semua ide baru masuk ke Inbox.

User tidak dipaksa memilih kategori.

Contoh:

Ide Website

↓

Inbox

Nanti bisa dipindahkan menjadi:

Task

Note

Bookmark

Finance

---

# Notes

Fitur

- Folder
- Tag
- Favorite
- Markdown
- Checklist
- Attachment
- Pin
- Archive

Setiap note memiliki:

Title

Content

Tags

Created At

Updated At

---

# Tasks

Task memiliki:

Title

Priority

Status

Deadline

Reminder

Project

Subtask

Attachment

Progress

Status

Todo

In Progress

Done

Cancelled

---

# Calendar

Menampilkan:

Task

Deadline

Reminder

Daily View

Weekly View

Monthly View

Klik tanggal akan menampilkan semua aktivitas.

---

# Finance

Menu

Income

Expense

Kategori

Ringkasan

Fitur

Tambah pemasukan

Tambah pengeluaran

Filter bulan

Grafik

Cash Flow

Kategori default

Food

Transport

Hosting

Domain

Shopping

Investment

Salary

Other

---

# Search

Ctrl + K

Harus bisa mencari:

Task

Notes

Finance

Project

Shortcut

Halaman

---

# Quick Add

Floating Button

Desktop

Ctrl + N

Mobile

Floating Button

Isi

Tambah Task

Tambah Note

Tambah Expense

Tambah Income

Harus selesai kurang dari 10 detik.

---

# Activity Timeline

Semua aktivitas dicatat.

Contoh

Hari Ini

✔ Task selesai

✔ Note dibuat

✔ Expense ditambah

✔ Income ditambah

---

# Offline Strategy

Semua data pertama kali disimpan ke Local Database.

Status

Pending Sync

↓

Ketika internet tersedia

↓

Sinkron ke Server

↓

Status berubah menjadi Synced.

User tidak perlu menekan tombol Sync.

---

# Notification

Reminder Deadline

Reminder Habit

Reminder Review

Daily Review

Weekly Review

---

# Settings

Theme

Dark

Light

System

Backup

Restore

Export

Import

Shortcut

PWA

---

# Future Feature

Habit Tracker

Goal Tracker

Journal

AI Assistant

Bookmark

Password Vault

Document

Inventory

CRM

Business Dashboard

---

# Development Rules

Selalu mobile responsive.

Gunakan Tailwind CSS.

Gunakan komponen reusable.

Jangan membuat halaman yang berbeda style.

Gunakan spacing konsisten.

Gunakan animasi halus.

Hindari popup yang berlebihan.

Prioritaskan keyboard shortcut.

Semua operasi CRUD harus mendukung Offline First.

Loading maksimal sederhana.

Semua tabel memiliki Search.

Semua form memiliki Auto Save jika memungkinkan.

Gunakan Command Palette sebagai pusat navigasi.

Seluruh desain harus terasa ringan, cepat, dan modern seperti aplikasi desktop profesional.