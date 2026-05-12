import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cookie Policy - Vidgram",
  description: "Learn about how Vidgram uses cookies and similar technologies to improve your experience.",
};

export default function CookiePage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '6rem', paddingBottom: '8rem' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Kebijakan Cookie</h1>
      <p style={{ color: 'var(--text-tertiary)', marginBottom: '4rem' }}>Terakhir diperbarui: 12 Mei 2026</p>

      <div className="blog-content">
        <p>Kebijakan Cookie ini menjelaskan apa itu cookie, bagaimana Vidgram menggunakannya, dan bagaimana Anda dapat mengontrol penggunaannya.</p>

        <h2>1. Apa itu Cookie?</h2>
        <p>Cookie adalah file teks kecil yang disimpan di browser Anda saat Anda mengunjungi sebuah situs web. Mereka membantu situs web mengingat informasi tentang kunjungan Anda, seperti bahasa pilihan dan pengaturan lainnya.</p>

        <h2>2. Bagaimana Kami Menggunakan Cookie</h2>
        <p>Kami menggunakan cookie untuk tujuan berikut:</p>
        <ul>
          <li><strong>Cookie Esensial:</strong> Diperlukan agar situs web berfungsi dengan benar (misalnya, untuk sesi login).</li>
          <li><strong>Cookie Analitik:</strong> Membantu kami memahami bagaimana pengunjung berinteraksi dengan situs kami sehingga kami dapat memperbaikinya.</li>
          <li><strong>Cookie Preferensi:</strong> Mengingat pilihan Anda (seperti mode gelap/terang).</li>
        </ul>

        <h2>3. Layanan Pihak Ketiga</h2>
        <p>Kami mungkin menggunakan layanan pihak ketiga seperti Google Analytics atau Microsoft Clarity yang juga dapat menempatkan cookie di browser Anda untuk mengumpulkan data anonim tentang penggunaan situs.</p>

        <h2>4. Mengontrol Cookie</h2>
        <p>Anda memiliki kontrol penuh atas cookie. Sebagian besar browser memungkinkan Anda untuk menolak atau menghapus cookie melalui pengaturannya. Namun, perlu dicatat bahwa menonaktifkan cookie tertentu dapat memengaruhi fungsionalitas situs web kami.</p>
      </div>
    </div>
  );
}
