import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service - Vidgram",
  description: "Read Vidgram's terms of service to understand the rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '6rem', paddingBottom: '8rem' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.04em' }}>Ketentuan Layanan</h1>
      <p style={{ color: 'var(--text-tertiary)', marginBottom: '4rem' }}>Terakhir diperbarui: 12 Mei 2026</p>

      <div className="blog-content">
        <p>Selamat datang di Vidgram. Dengan mengakses atau menggunakan situs web kami, Anda setuju untuk terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak diperbolehkan menggunakan layanan kami.</p>

        <h2>1. Penggunaan Layanan</h2>
        <p>Vidgram menyediakan alat pengunduhan video dan pengolahan AI untuk penggunaan pribadi dan non-komersial. Anda setuju untuk tidak menggunakan layanan kami untuk tujuan ilegal atau melanggar hak kekayaan intelektual orang lain.</p>

        <h2>2. Hak Kekayaan Intelektual</h2>
        <p>Anda bertanggung jawab penuh atas konten yang Anda unduh atau proses menggunakan Vidgram. Kami tidak memiliki hak atas video yang Anda unduh, dan kami mendorong Anda untuk menghormati hak cipta dari pemilik konten asli.</p>

        <h2>3. Pembatasan Tanggung Jawab</h2>
        <p>Layanan Vidgram disediakan "apa adanya" tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan layanan kami.</p>

        <h2>4. Perubahan Layanan</h2>
        <p>Kami berhak untuk mengubah atau menghentikan bagian mana pun dari layanan kami kapan saja tanpa pemberitahuan sebelumnya.</p>

        <h2>5. Hukum yang Berlaku</h2>
        <p>Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia.</p>
      </div>
    </div>
  );
}
