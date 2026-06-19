"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, LayoutDashboard, Cloud, Zap, Target, ChevronRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export default function SmartKeywordsPage() {
  const [downloads, setDownloads] = useState<number | null>(null);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        if (typeof window !== "undefined" && db) {
          const statsRef = doc(db, "statistics", "smart-keywords");
          const docSnap = await getDoc(statsRef);
          if (docSnap.exists()) {
            setDownloads(docSnap.data().downloads || 0);
          }
        }
      } catch (err) {
        console.warn("Gagal membaca statistik download:", err);
      }
    };
    fetchDownloads();
  }, []);

  const handleDownloadClick = async () => {
    try {
      if (typeof window !== "undefined" && db) {
        const statsRef = doc(db, "statistics", "smart-keywords");
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          await updateDoc(statsRef, {
            downloads: increment(1),
            lastDownloadedAt: new Date().toISOString()
          });
          setDownloads(prev => (prev !== null ? prev + 1 : 1));
        } else {
          await setDoc(statsRef, {
            downloads: 1,
            lastDownloadedAt: new Date().toISOString()
          });
          setDownloads(1);
        }
      }
    } catch (err) {
      console.warn("Gagal memperbarui statistik download:", err);
    }
  };
  return (
    <main style={{ paddingBottom: '100px' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '100px', paddingBottom: '80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1 }}></div>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '6px 16px', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" width={16} height={16}/> 
               <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg" alt="Edge" width={16} height={16}/> 
               Ekstensi Chrome & Edge
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2, letterSpacing: '-0.03em', maxWidth: '700px', margin: '0 auto 20px' }}>
            Berhenti Membuang Waktu<br />Hanya Untuk Isi Judul & Keyword{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}>Adobe Stock.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Memperkenalkan <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Smart Keyword for Adobe Stock Contributor</strong>. Biar AI yang memikirkan metadata, kategori, hingga mencegah upload ganda. Ekstensi ini mengisi form Anda secara otomatis hanya dalam 3 detik.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="https://chromewebstore.google.com/detail/jcmlbmjbeihjpakneiokafpicoffnkge?utm_source=item-share-cb" target="_blank" rel="noopener noreferrer" onClick={handleDownloadClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent)', color: 'white', padding: '16px 32px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 10px 25px rgba(139,92,246,0.4)', transition: 'transform 0.2s' }}>
              <Download size={24} /> Download Ekstensi (v2.7.29)
            </Link>
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            ⭐⭐⭐⭐⭐ {downloads !== null ? `Telah di-download sebanyak ${downloads.toLocaleString('id-ID')} kali!` : 'Digunakan oleh ratusan kontributor cerdas.'}
          </p>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '50px' }}>Fitur Utama Kami</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Target size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>AI SEO-Optimized</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Menggunakan strategi <i>Layered SEO</i> (Subject, Action, Context, Style). Keyword relevan dengan algoritma pencarian pembeli.</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Cloud size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Team Sync & Smart Hashing</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Berbagi 1 database antar banyak akun (Team Pool). Fitur <i>Partial Hashing</i> memindai video Gigabytes dalam milidetik tanpa membebani RAM browser!</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Zap size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>1-Click Auto Fill</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Judul, Kategori, Checkbox Fictional Property terisi instan. Anda hanya perlu klik tombol Submit.</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <LayoutDashboard size={32} color="var(--accent)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Fleksibel & Murah</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Gunakan API Key sendiri (Gratis) atau langganan API kami hanya seharga kopi saset per bulan (Rp 10.000).</p>
          </div>

        </div>
      </section>

      {/* Comparison Section */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <div style={{ background: 'var(--glass-strong)', borderRadius: '24px', padding: '50px', border: '1px solid var(--border)', overflowX: 'auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '40px' }}>Mengapa Harus Beralih?</h2>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Aktivitas</th>
                <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Tanpa Ekstensi</th>
                <th style={{ padding: '15px', color: 'var(--accent)', fontSize: '1.1rem' }}>Dengan Smart Keywords</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Isi Judul & Keyword</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>5 - 10 Menit per foto</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Kurang dari 5 detik</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Pilih Kategori</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Scroll panjang manual</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Terpilih otomatis oleh AI</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Cek Duplikat & Multi-Akun</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Buka folder / ingat-ingat</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Deteksi instan (Sinkronasi Cloud Antar-Tim)</td>
              </tr>
              <tr>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Kualitas Keyword</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Kata acak / filler (Spam)</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Terstruktur Buyer-Intent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Pricing / Upsell Section */}
      <section className="container">
        <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(0,0,0,0))', borderRadius: '24px', padding: '50px', border: '1px solid rgba(139,92,246,0.3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px' }}>Tidak Paham Cara Buat API Key?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px' }}>
            Jangan khawatir! Kami menyediakan layanan <b>Sewa API Premium</b> yang siap pakai. Hanya dengan <b>Rp 10.000 / 30 Hari</b>, Anda sudah mendapatkan:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 auto 40px', maxWidth: '400px', textAlign: 'left' }}>
            <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><CheckCircle color="var(--accent)" /> Load Balancing 3 Ronde (Anti-Timeout)</li>
            <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><CheckCircle color="var(--accent)" /> Tanpa perlu pakai Kartu Kredit</li>
            <li style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}><CheckCircle color="var(--accent)" /> Bisa dipakai di 2 perangkat berbeda</li>
            <li style={{ display: 'flex', gap: '10px' }}><CheckCircle color="var(--accent)" /> Kecepatan prioritas Gemini 2.5 Flash, Llama 4, & Mistral AI</li>
          </ul>
          <Link href="https://chromewebstore.google.com/detail/jcmlbmjbeihjpakneiokafpicoffnkge?utm_source=item-share-cb" target="_blank" rel="noopener noreferrer" onClick={handleDownloadClick} style={{ display: 'inline-block', background: 'white', color: 'black', padding: '14px 28px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', transition: 'transform 0.2s' }}>
            Mulai Sekarang!
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container" style={{ marginTop: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '40px' }}>Pertanyaan yang Sering Diajukan (FAQ)</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <details style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}>Apakah ekstensi ini gratis?</summary>
            <p style={{ marginTop: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Ya, Anda bisa menggunakan ekstensi ini secara gratis jika menggunakan API Key Anda sendiri (misalnya dari Google Gemini). Kami juga menyediakan layanan Sewa API dengan harga sangat terjangkau jika Anda tidak repot mendaftar API sendiri.</p>
          </details>
          <details style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}>Bagaimana cara kerja fitur Anti-Duplikasi?</summary>
            <p style={{ marginTop: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Ekstensi ini menggunakan teknologi <b>Partial Hashing</b> yang membaca potongan kecil dari file (awal, tengah, akhir) sehingga prosesnya instan dan sangat ringan (0% RAM), bahkan untuk video berukuran besar. Histori upload disimpan di cloud, dan jika Anda punya banyak akun Adobe, cukup masukkan "Email Tim" yang sama di pengaturan untuk saling berbagi database secara real-time!</p>
          </details>
          <details style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}>Apakah keyword yang dihasilkan cukup bagus untuk SEO?</summary>
            <p style={{ marginTop: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Tentu! AI kami dilatih khusus untuk menganalisis gambar menggunakan strategi Layered SEO (Subject, Action, Context, Style) sehingga menghasilkan keyword dengan "buyer intent" (niat pembeli) yang tinggi, bukan sekadar kata-kata acak.</p>
          </details>
        </div>
      </section>

    </main>
  );
}
