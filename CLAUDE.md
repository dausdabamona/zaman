# ZAMAN — Eisenhower Matrix PWA

## Deskripsi
Aplikasi manajemen waktu personal berbasis Eisenhower Matrix dengan integrasi jadwal shalat. PWA untuk Android, offline-first.

## Stack
- React 19 + Vite 6 + TypeScript
- Dexie.js v4 (IndexedDB — offline-first)
- Tailwind CSS v4
- Recharts (chart)
- Aladhan API (jadwal shalat)
- vite-plugin-pwa

## Target
- Device: Android (Chrome), low-end
- User: Firdaus Dabamona (personal use)
- Deploy: https://dausdabamona.github.io/zaman/

## Konvensi Koding
- Bahasa UI: Bahasa Indonesia
- Naming: kebab-case file, PascalCase komponen, camelCase fungsi
- Selalu handle: loading / error / empty state
- Offline-first: semua data di IndexedDB via Dexie

## Perintah
- dev: `npm run dev`
- build: `npm run build`
- deploy: `npm run deploy` (ke GitHub Pages)

## Struktur Database (Dexie)
- tasks: id, title, description, quadrant, tag, deadline, reminderAt,
         isCompleted, completedAt, createdAt, updatedAt
- daily_reflections: id, date, note, mood, createdAt
- settings: key, value

## Warna Kuadran
- Q1 (Do Now): #EF4444 (merah)
- Q2 (Schedule): #3B82F6 (biru)
- Q3 (Delegate): #F97316 (oranye)
- Q4 (Eliminate): #9CA3AF (abu)

## Catatan Penting
- Koordinat default Sorong: lat=-0.8833, lon=131.2500
- Shalat method: 11 (Singapore/Kemenag RI)
- Kalender Hijriyah: hitung manual atau gunakan library hijri-date
- vite.config.ts base: '/zaman/'
