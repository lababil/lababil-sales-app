# TODO - Perbaikan Bug Print

## ✅ SELESAI - Masalah Print Price dan Total Tumpang Tindih

### Masalah:
- Kolom "Unit Price" dan "Total" pada receipt print saling tumpang tindih
- Format Rupiah Indonesia terlalu panjang untuk ruang yang tersedia

### Perbaikan yang Dilakukan:
1. **Perbaiki posisi header tabel** di `src/lib/printUtils.js`:
   - Unit Price: `pageWidth - 60` → `pageWidth - 70` (tambah jarak 10 unit)

2. **Perbaiki posisi data tabel** di `src/lib/printUtils.js`:
   - Unit Price: `pageWidth - 60` → `pageWidth - 70` (tambah jarak 10 unit)

### Layout Baru:
- **No**: margin + 5
- **Description**: margin + 25
- **Qty**: pageWidth - 80
- **Unit Price**: pageWidth - 70 ← **DIPERBAIKI**
- **Total**: pageWidth - 25

### Jarak yang Ditambahkan:
- Jarak antara Unit Price dan Total: 35 unit → 45 unit (+10 unit)
- Cukup untuk format Rupiah: "Rp 1.000.000,00"

### Status:
✅ **Perbaikan selesai dan siap ditest**
✅ Tidak ada lagi instance `pageWidth - 60` yang menyebabkan masalah
✅ Layout totals section tetap konsisten

### Testing yang Diperlukan:
- [ ] Test print receipt dengan berbagai nilai Rupiah
- [ ] Verifikasi tidak ada tumpang tindih lagi
- [ ] Pastikan layout terlihat rapi dan mudah dibaca
