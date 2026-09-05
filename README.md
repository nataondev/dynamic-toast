# Dynamic Toast

Notifikasi bergaya Dynamic Island dengan 6 posisi penempatan. Pure JavaScript + CSS, tanpa dependency, tanpa Tailwind.

## Instalasi

```bash
npm install dynamic-toast
```

```javascript
import DynamicIsland from "dynamic-toast";

// CSS sudah di-inject oleh JS. Import ini hanya jika ingin override via stylesheet.
import "dynamic-toast/lib/dynatoast.css";
```

Tanpa bundler:

```html
<link rel="stylesheet" href="lib/dynatoast.css">
<script src="lib/dynatoast.js"></script>
```

## Penggunaan

```javascript
const island = new DynamicIsland({ duration: 3000, position: "top-center" });

island.notify({ type: "success", title: "Berhasil!", message: "Data tersimpan." });
island.notify({ type: "error",   title: "Error!",   message: "Gagal menghubungi server." });
island.notify({ type: "info",    title: "Informasi", message: "Ada pembaruan tersedia." });
island.notify({ type: "loading", title: "Memproses", message: "Mohon tunggu..." });

island.setPosition("bottom-right");
island.close();
```

Satu toast pada satu waktu: `notify()` baru menggantikan yang lama. Tipe `loading` tidak auto-close — tutup dengan `close()` atau `notify()` berikutnya.

## API

| Option | Type | Default | Deskripsi |
|--------|------|---------|-----------|
| `duration` | Number | 5000 | Durasi tampil notifikasi (ms) |
| `position` | String | `"top-center"` | Posisi awal notifikasi |

Method: `notify({ type, title, message })`, `setPosition(position)`, `close()`.

- `type`: `'success' | 'error' | 'info' | 'loading'`
- `position`: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`

## Contoh: form submission

```javascript
const island = new DynamicIsland({ duration: 3000 });

document.getElementById('myForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    island.notify({ type: 'loading', title: 'Mengirim', message: 'Menyimpan data...' });
    try {
        await saveData();
        island.notify({ type: 'success', title: 'Berhasil', message: 'Data tersimpan!' });
    } catch {
        island.notify({ type: 'error', title: 'Gagal', message: 'Terjadi kesalahan.' });
    }
});
```

## Kustomisasi

Override lewat stylesheet setelah CSS library:

- Warna icon: `.di-icon-success`, `.di-icon-error`, `.di-icon-info`
- Jarak dari tepi layar: `.di-pos-*`
- Ukuran toast: `.di-base.active`
- Animasi: keyframes `di-float` dan `di-spin`

```css
.di-icon-success {
  background-color: #22c55e;
}
```

## Demo & Testing

Buka `index.html` di browser, atau serve dulu: `python -m http.server 8000`.
Smoke test (butuh `chromium` di PATH): `node test/smoke.mjs`.

## Browser Support

Chrome/Edge 88+, Firefox 87+, Safari 14+, Opera 74+ — butuh ResizeObserver dan Web Animations API.

## License

MIT.
