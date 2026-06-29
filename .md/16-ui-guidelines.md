# UI Guidelines

## Overview

LifeOS adalah sebuah **Personal Operating System** untuk membantu saya mengelola kehidupan sehari-hari melalui visualisasi data, habit tracking, checklist, dan analytics.

Aplikasi ini tidak dirancang seperti aplikasi manajemen tugas biasa.

Fokus utamanya adalah membuat saya **ingin membuka dashboard setiap hari**, karena dashboard tersebut mampu menunjukkan perkembangan diri secara visual.

---

# UI Philosophy

Semua keputusan desain harus mengikuti filosofi berikut.

## 1. Dashboard First

Dashboard adalah halaman paling penting.

Dashboard harus memberikan gambaran kondisi hari ini hanya dalam waktu kurang dari 5 detik.

Pengguna tidak perlu membaca banyak teks.

Dashboard harus dapat "bercerita" melalui visual.

---

## 2. Data Over Decoration

Hindari dekorasi yang tidak memiliki fungsi.

Lebih baik menampilkan:

- Progress
- Score
- Trend
- Heatmap
- Chart

daripada ilustrasi yang memenuhi layar.

---

## 3. Visual Motivation

Semakin sering pengguna melihat perkembangan dirinya,

semakin besar kemungkinan pengguna kembali menggunakan aplikasi.

Progress harus terlihat di mana-mana.

Contoh:

- Progress Ring
- XP Bar
- Checklist Progress
- Weekly Progress
- Character Stats

---

## 4. One Screen One Purpose

Satu halaman hanya memiliki satu tujuan utama.

Dashboard

↓

Melihat kondisi hari ini.

Checklist

↓

Menyelesaikan aktivitas.

Analytics

↓

Melihat perkembangan.

Reflection

↓

Evaluasi diri.

---

# Layout Guidelines

## Desktop

Sidebar kiri

Content tengah

Right Panel (optional)

Lebar maksimal content

1400px

Padding

32px

Gap

24px

---

## Sidebar

Selalu tampil.

Berisi:

Dashboard

Today's Match

Checklist

Analytics

Calendar

Achievements

Reflection

Settings

Bagian bawah:

Current Level

XP

Version

---

## Header

Berisi:

Greeting

Today's Date

Current Score

Notification (Future)

Theme Toggle

---

# Dashboard Structure

Dashboard dibagi menjadi beberapa section.

---

## Hero Section

Paling atas.

Menampilkan:

Good Morning, La Awe

Today's Match

Current Rank

Current Score

Current Level

Current Streak

Progress Today

Ini adalah bagian pertama yang dilihat.

---

## Quick Stats

Card kecil.

Contoh

Good Habit

Bad Habit

Completed Checklist

Remaining Task

Mood

Focus Time

---

## Today's Progress

Progress Ring

Checklist Progress

XP Progress

Character Progress

---

## Analytics Preview

Mini Chart

7 Days XP

Good vs Bad

Consistency

Heatmap

---

## Daily Reflection Preview

Card kecil.

Today's MVP

Biggest Enemy

Reflection

Mood

---

# Checklist Page

Fokus hanya pada checklist.

Tidak boleh penuh grafik.

Layout

Header

↓

Today's Progress

↓

Checklist

↓

Completed

↓

Reflection

---

Checklist Item

Checkbox

Icon

Title

Category

XP

Duration

Priority

Hover Effect

Smooth Animation

---

# Analytics Page

Halaman paling visual.

Berisi:

XP Trend

Radar Chart

Heatmap

Bar Chart

Pie Chart

Line Chart

Character Growth

Good vs Bad

Weekly

Monthly

Lifetime

---

Analytics harus menggunakan Card Layout.

Jangan menampilkan grafik tanpa penjelasan.

---

# Reflection Page

Minimalis.

Pertanyaan:

Apa yang berjalan baik?

Apa yang menghambat?

Apa yang bisa diperbaiki?

Mood hari ini?

Target besok?

---

# Calendar

Heatmap

Calendar

Daily Score

Checklist Completion

Mood

Semua tanggal dapat diklik.

---

# Achievement

Grid Layout

Card besar

Locked

Unlocked

Progress

XP Reward

Badge

---

# Settings

Theme

Export JSON

Import JSON

Reset Data

Dark Mode

Storage Usage

Version

---

# Card Design

Semua Card harus memiliki:

Radius

20px

Padding

24px

Soft Shadow

Hover Animation

Transition

200ms

---

# Typography

Display

48px

Heading

32px

Sub Heading

24px

Body

16px

Caption

14px

Small

12px

Gunakan

Inter atau Geist.

---

# Spacing

4

8

12

16

24

32

48

64

Gunakan spacing yang konsisten.

---

# Color Rules

Emerald

Good Habit

Blue

Natural

Orange

Warning

Red

Bad Habit

Purple

Analytics

Yellow

Achievement

Background

Slate

Dark Mode

Glass Card diperbolehkan tetapi jangan berlebihan.

---

# Button

Primary

Filled

Secondary

Outline

Ghost

Icon Button

Floating Action Button

Semua button memiliki radius yang sama.

---

# Icons

Gunakan Lucide React.

Semua icon memiliki ukuran:

18

20

24

Jangan mencampur icon pack.

---

# Animation

Framer Motion

Animation maksimal

250ms

Gunakan:

Fade

Slide

Scale

Hindari animasi yang terlalu panjang.

---

# Empty State

Setiap halaman harus memiliki Empty State.

Contoh

Belum ada Checklist.

Belum ada Reflection.

Belum ada Achievement.

Belum ada Data Analytics.

---

# Loading State

Gunakan Skeleton.

Jangan gunakan Spinner terlalu lama.

---

# UX Rules

Checklist dapat dicentang dengan satu klik.

Tidak boleh ada popup yang tidak penting.

Semua informasi penting terlihat tanpa scroll panjang.

Progress selalu terlihat.

Current Score selalu terlihat.

Current Level selalu terlihat.

Today's Match selalu terlihat.

---

# Accessibility

Contrast minimal WCAG AA.

Keyboard Navigation.

Tooltip pada icon.

Button memiliki ukuran minimal 44px.

---

# Responsive

Desktop

≥1280px

Tablet

768-1279px

Mobile

<768px

Desktop menjadi prioritas utama.

---

# Design Inspiration

Dashboard:

Linear

GitHub

Notion

Raycast

Arc Browser

Apple Fitness

GitHub Contribution Graph

Steam Achievement

Duolingo Progress

Semua inspirasi digunakan hanya sebagai referensi UX, bukan untuk disalin secara langsung.

---

# Definition of Success

UI dianggap berhasil apabila:

- Dashboard dapat dipahami dalam kurang dari 5 detik.
- Pengguna ingin membuka aplikasi setiap hari.
- Progress menjadi fokus utama dibandingkan checklist.
- Semua halaman terasa konsisten.
- Tidak ada elemen yang membingungkan.
- Setiap interaksi terasa cepat dan responsif.
- Pengguna merasa sedang memainkan "game kehidupan", bukan mengisi daftar tugas.

---

# Golden Rule

Jika ada dua pilihan desain,

pilih desain yang membuat progress pengguna lebih terlihat.

Jika ada fitur yang tidak membantu pengguna menjadi lebih disiplin,

fitur tersebut tidak perlu dibuat.
