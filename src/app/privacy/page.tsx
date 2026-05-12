import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy - Vidgram",
  description: "Read Vidgram's privacy policy to understand how we handle your data and protect your privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '6rem', paddingBottom: '8rem' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Kebijakan Privasi</h1>
      <p style={{ color: 'var(--text-tertiary)', marginBottom: '4rem' }}>Terakhir diperbarui: 12 Mei 2026</p>

      <div className="blog-content">
        <p>Di Vidgram, privasi Anda adalah prioritas utama kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan platform dan alat kami.</p>

        <h2>1. Informasi yang Kami Kumpulkan</h2>
        <p>Kami meminimalkan pengumpulan data untuk melindungi privasi Anda:</p>
        <ul>
          <li><strong>Data Penggunaan Alat:</strong> Kami mengumpulkan data anonim tentang frekuensi penggunaan alat (misal: jumlah download TikTok) untuk tujuan statistik dan peningkatan layanan.</li>
          <li><strong>Log Teknis:</strong> Seperti kebanyakan layanan web, kami mengumpulkan informasi standar seperti alamat IP, jenis browser, dan waktu akses untuk keamanan dan pemeliharaan server.</li>
        </ul>

        <h2>2. Bagaimana Kami Menggunakan Data Anda</h2>
        <p>Data yang dikumpulkan digunakan semata-mata untuk:</p>
        <ul>
          <li>Menyediakan dan memelihara layanan kami.</li>
          <li>Meningkatkan fungsionalitas dan pengalaman pengguna.</li>
          <li>Mencegah penyalahgunaan dan serangan keamanan.</li>
        </ul>

        <h2>3. Privasi Video</h2>
        <p>Penting untuk diketahui bahwa Vidgram <strong>tidak menyimpan salinan video</strong> yang Anda proses melalui alat kami (TikTok Downloader atau AI Upscaler) di server permanen kami. Semua pemrosesan dilakukan secara real-time atau di browser Anda (untuk AI Upscaler).</p>

        <h2>4. Cookie dan Teknologi Pelacakan</h2>
        <p>Kami menggunakan cookie fungsional untuk mengingat preferensi Anda dan alat analisis pihak ketiga (seperti Google Analytics) untuk memahami lalu lintas situs kami. Anda dapat mengelola preferensi cookie Anda melalui pengaturan browser.</p>

        <h2>5. Kontak Kami</h2>
        <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui email di support@vidgram.web.id.</p>
      </div>
    </div>
  );
}
