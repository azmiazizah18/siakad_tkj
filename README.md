# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Cara Menghubungkan Proyek ke GitHub

Untuk menyimpan kode Anda dan berkolaborasi dengan orang lain, Anda dapat menghubungkan proyek ini ke repositori GitHub. Berikut adalah langkah-langkahnya:

### Langkah 1: Buat Repositori Baru di GitHub

1.  Buka [GitHub](https://github.com) dan masuk ke akun Anda.
2.  Klik tombol **"+"** di pojok kanan atas, lalu pilih **"New repository"**.
3.  Beri nama repositori Anda (misalnya, `siakad-tkj-app`).
4.  Anda bisa menambahkan deskripsi singkat (opsional).
5.  Pastikan repositori diatur sebagai **"Public"** atau **"Private"** sesuai kebutuhan Anda.
6.  **Penting:** Jangan centang opsi "Initialize this repository with a README", ".gitignore", atau "license". Kita akan menggunakan file yang sudah ada dari proyek ini.
7.  Klik **"Create repository"**.

### Langkah 2: Hubungkan Proyek Lokal ke Repositori GitHub

Setelah repositori dibuat, GitHub akan menampilkan halaman dengan beberapa perintah. Anda hanya perlu menjalankan perintah berikut di terminal Firebase Studio untuk menghubungkan proyek yang sudah ada.

1.  **Inisialisasi Git**
    Buka terminal di Firebase Studio dan jalankan perintah ini untuk memulai repositori Git di direktori proyek Anda.
    ```sh
    git init -b main
    ```

2.  **Tambahkan Semua File**
    Tambahkan semua file proyek ke dalam Git untuk dilacak perubahannya.
    ```sh
    git add .
    ```

3.  **Buat Komit Pertama**
    Simpan perubahan Anda dengan sebuah pesan komit.
    ```sh
    git commit -m "Initial commit: Setup project SIAKAD TKJ"
    ```

4.  **Tambahkan Remote Repository**
    Hubungkan proyek lokal Anda ke repositori yang baru saja Anda buat di GitHub. Ganti `<URL_REPOSITORI_ANDA>` dengan URL yang Anda dapatkan dari GitHub (contoh: `https://github.com/username/nama-repo.git`).
    ```sh
    git remote add origin <URL_REPOSITORI_ANDA>
    ```

5.  **Push ke GitHub**
    Unggah semua kode Anda dari proyek lokal ke repositori di GitHub.
    ```sh
    git push -u origin main
    ```

Setelah selesai, refresh halaman repositori Anda di GitHub. Semua file proyek Anda sekarang seharusnya sudah muncul di sana. Selamat, proyek Anda sudah terhubung!

### Langkah 3: Deploy ke Firebase App Hosting

Setelah proyek Anda terhubung ke GitHub, Anda dapat dengan mudah men-deploy aplikasi ini ke **Firebase App Hosting**. App Hosting akan secara otomatis membangun (build) dan men-deploy aplikasi Anda setiap kali ada perubahan di branch `main`.

1.  **Buka Firebase Console**
    Buka [Firebase Console](https://console.firebase.google.com/) dan pilih proyek Anda (`siakad-tkjfix-23741013-98633`).

2.  **Masuk ke App Hosting**
    Di menu sebelah kiri, klik **Build** > **App Hosting**.

3.  **Hubungkan GitHub**
    Klik **"Get started"** dan ikuti proses untuk menghubungkan akun GitHub Anda dan memilih repositori yang baru saja Anda buat (`siakad-tkj-app`).

4.  **Konfigurasi Deployment**
    Anda akan diminta untuk mengonfirmasi pengaturan deployment. Cukup gunakan pengaturan default dan setujui. Firebase akan secara otomatis mendeteksi bahwa ini adalah aplikasi Next.js.

5.  **Deployment Pertama**
    Setelah terhubung, Firebase akan secara otomatis memulai proses deployment pertama dari branch `main` Anda. Anda dapat melihat progresnya di dasbor App Hosting.

6.  **Selesai!**
    Setelah deployment selesai, Anda akan mendapatkan URL publik untuk aplikasi Anda (contoh: `nama-aplikasi.web.app`). Setiap kali Anda melakukan `git push` ke branch `main`, Firebase akan secara otomatis men-deploy versi terbarunya.
