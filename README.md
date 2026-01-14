# Dynamic Toast - Dynamic Island Style Notification

Library JavaScript sederhana untuk membuat notifikasi bergaya Dynamic Island dengan 6 posisi penempatan yang dapat dikustomisasi.

## Fitur

- **6 Posisi Penempatan**: Top/Bottom × Left/Center/Right
- **4 Tipe Notifikasi**: Success, Error, Info, dan Loading
- **Auto-close dengan Counter**: Timer visual yang dapat dikustomisasi
- **Animasi Smooth**: Transisi dan animasi yang halus
- **Responsive**: Bekerja di semua ukuran layar
- **Tanpa Dependencies**: Pure JavaScript dan CSS, tidak perlu framework atau Tailwind
- **Ringan**: Total < 15KB (JS + CSS)
- **CSS Independen**: Styling lengkap tanpa perlu Tailwind CSS

## Prerequisites

- Browser modern dengan dukungan ES6 (Chrome, Firefox, Safari, Edge)
- Tidak ada dependencies eksternal yang diperlukan

## Instalasi via npm

```bash
npm install dynamic-toast
# atau
yarn add dynamic-toast
# atau
pnpm add dynamic-toast
```

### Import (Bundler)

```javascript
import DynamicIsland from "dynamic-toast";

// CSS default sudah di-inject oleh JS.
// Import file ini jika ingin override lewat stylesheet.
import "dynamic-toast/lib/dynatoast.css";
```

## Cara Penggunaan

Untuk penggunaan via bundler/npm, lihat bagian "Instalasi via npm".

### 1. Include Library (tanpa bundler)

Tambahkan CSS dan JavaScript ke dalam HTML Anda:

```html
<link rel="stylesheet" href="lib/dynatoast.css">
<script src="lib/dynatoast.js"></script>
```

### 2. Inisialisasi

Buat instance baru dari `DynamicIsland`:

```javascript
const island = new DynamicIsland({
    duration: 3000,      // Durasi tampil dalam milidetik (default: 5000)
    position: "top-center"  // Posisi awal (default: "top-center")
});
```

### 3. Tampilkan Notifikasi

Gunakan method `notify()` untuk menampilkan notifikasi:

```javascript
// Notifikasi success
island.notify({
    type: 'success',
    title: 'Berhasil!',
    message: 'Data berhasil disimpan.'
});

// Notifikasi error
island.notify({
    type: 'error',
    title: 'Error!',
    message: 'Gagal menyimpan data.'
});

// Notifikasi info
island.notify({
    type: 'info',
    title: 'Informasi',
    message: 'Ada pembaruan tersedia.'
});

// Loading state (tanpa auto-close)
island.notify({
    type: 'loading',
    title: 'Memproses',
    message: 'Mohon tunggu...'
});
```

### 4. Ubah Posisi

Anda dapat mengubah posisi notifikasi secara dinamis:

```javascript
island.setPosition('bottom-right');
```

**Posisi yang tersedia:**
- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`

### 5. Menutup Notifikasi

Tutup notifikasi secara manual:

```javascript
island.close();
```

## API Reference

### Constructor Options

```javascript
new DynamicIsland(options)
```

| Option | Type | Default | Deskripsi |
|--------|------|---------|-----------|
| `duration` | Number | 5000 | Durasi tampil notifikasi (ms) |
| `position` | String | "top-center" | Posisi awal notifikasi |

### Methods

#### `notify(config)`

Menampilkan notifikasi baru.

**Parameters:**
```javascript
{
    type: 'success' | 'error' | 'info' | 'loading',
    title: string,
    message: string
}
```

#### `setPosition(position)`

Mengubah posisi notifikasi.

**Parameters:**
- `position` (String): Salah satu dari 6 posisi yang tersedia

#### `close()`

Menutup notifikasi secara manual.

## Contoh Penggunaan

### Contoh 1: Form Submission

```javascript
const island = new DynamicIsland({ duration: 3000 });

document.getElementById('myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Tampilkan loading
    island.notify({
        type: 'loading',
        title: 'Mengirim',
        message: 'Menyimpan data...'
    });
    
    try {
        await saveData();
        
        // Tampilkan success
        island.notify({
            type: 'success',
            title: 'Berhasil',
            message: 'Data berhasil disimpan!'
        });
    } catch (error) {
        // Tampilkan error
        island.notify({
            type: 'error',
            title: 'Gagal',
            message: 'Terjadi kesalahan saat menyimpan data.'
        });
    }
});
```

### Contoh 2: Multiple Notifications

```javascript
const island = new DynamicIsland({
    duration: 2000,
    position: 'bottom-right'
});

// Notifikasi pertama
island.notify({
    type: 'info',
    title: 'Selamat Datang',
    message: 'Aplikasi siap digunakan'
});

// Setelah beberapa detik, notifikasi kedua
setTimeout(() => {
    island.notify({
        type: 'success',
        title: 'Update',
        message: 'Data telah dimuat'
    });
}, 3000);
```

## Kustomisasi

Library ini menggunakan CSS yang dapat di-override dengan mudah. Anda dapat:

1. **Mengubah warna icon**: Edit class `.di-icon-success`, `.di-icon-error`, `.di-icon-info` di `dynatoast.css`
2. **Mengubah posisi**: Sesuaikan class `.di-pos-*` untuk mengubah jarak dari tepi layar
3. **Mengubah animasi**: Edit keyframes `di-float`, `di-pulse`, dan `di-spin`
4. **Mengubah ukuran**: Sesuaikan `.di-base.active` untuk dimensi toast yang lebih besar/kecil

### Contoh Kustomisasi

```css
/* Ubah warna success menjadi hijau lebih terang */
.di-icon-success {
  background-color: #22c55e;
}
```

## Demo

Buka `index.html` di browser untuk melihat demo interaktif:

```bash
# Dengan Python
python -m http.server 8000

# Dengan Node.js
npx serve

# Atau langsung buka file
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

Kemudian buka browser di `http://localhost:8000`

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Opera 74+

Library menggunakan ResizeObserver, CSS Custom Properties, dan modern JavaScript features.

Struktur folder:

```
dynamic-toast/
├── index.html              # File demo
├── lib/
│   ├── dynatoast.js        # Library JavaScript
│   └── dynatoast.css       # Styling independen (tanpa Tailwind)
└── README.md               # Dokumentasi
```

## Testing

Buka `index.html` di browser untuk melihat demo interaktif:

```bash
# Dengan Python
python -m http.server 8000

# Dengan Node.js
npx serve

# Atau langsung buka file
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

Kemudian buka browser di `http://localhost:8000`

## FAQ

**Q: Apakah perlu Tailwind CSS?**  
A: Tidak. Library ini sudah include CSS independen (`dynatoast.css`) yang tidak memerlukan Tailwind.

**Q: Bisakah menampilkan multiple toast sekaligus?**  
A: Saat ini library menampilkan satu toast pada satu waktu. Toast baru akan menggantikan yang lama dengan animasi pulse.

**Q: Bagaimana cara mengubah durasi timer?**  
A: Set option `duration` saat inisialisasi (dalam milidetik).

**Q: Loading state tidak auto-close?**  
A: Ya, loading state harus ditutup manual dengan `island.close()` atau dengan menampilkan notifikasi baru.

## License

MIT License - Bebas digunakan untuk proyek pribadi maupun komersial.

## Kontributor

Kontribusi dan pull request sangat diterima. Silakan buat issue untuk bug report atau feature request.
