# Local Storage Schema

Semua data disimpan menggunakan Browser Local Storage.

Tidak memerlukan:

- Backend
- Database
- Login
- API

Seluruh data berada di perangkat pengguna.

---

## Storage Keys

lifeos-user

lifeos-tasks

lifeos-daily-match

lifeos-history

lifeos-statistics

lifeos-achievements

lifeos-settings

lifeos-reflections

lifeos-character

lifeos-level

lifeos-streak

---

## Example

lifeos-tasks

```json
[
  {
    "id": 1,
    "title": "Workout",
    "category": "good",
    "point": 20,
    "completed": true,
    "createdAt": "2026-06-27"
  }
]
```

---

lifeos-history

```json
[
  {
    "date": "2026-06-27",
    "score": 180,
    "good": 8,
    "natural": 5,
    "bad": 1
  }
]
```
