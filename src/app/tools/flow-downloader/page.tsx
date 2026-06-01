"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, LayoutDashboard, Cloud, Zap, Target, Image as ImageIcon, FastForward, Settings, ShieldCheck, ChevronRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export default function FlowDownloaderPage() {
  const [downloads, setDownloads] = useState<number | null>(null);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        if (typeof window !== "undefined" && db) {
          const statsRef = doc(db, "statistics", "flow-downloader");
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
        const statsRef = doc(db, "statistics", "flow-downloader");
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
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: -1 }}></div>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <span style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '6px 16px', borderRadius: '50px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
               <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" width={16} height={16}/> 
               <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Microsoft_Edge_logo_%282019%29.svg" alt="Edge" width={16} height={16}/> 
               Ekstensi Chrome & Edge
            </span>
          </div>
          
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2, letterSpacing: '-0.03em', maxWidth: '800px', margin: '0 auto 20px' }}>
            Download Massal Aset<br />Google Flow {' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}>Tanpa Klik Pegal.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: 1.6 }}>
            Ekstensi peramban (browser extension) revolusioner yang dapat mengunduh seluruh gambar dan video di galeri Google Flow Labs secara otomatis dengan resolusi pilihan Anda. 
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="https://lynk.id/aronisme/e2q04q0kj7ld" target="_blank" rel="noopener noreferrer" onClick={handleDownloadClick} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent)', color: 'white', padding: '16px 32px', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 10px 25px rgba(59,130,246,0.4)', transition: 'transform 0.2s' }}>
              <Download size={24} /> Download Ekstensi (v1.0)
            </Link>
          </div>
          <p style={{ marginTop: '15px', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            ⭐⭐⭐⭐⭐ {downloads !== null ? `Telah di-download sebanyak ${downloads.toLocaleString('id-ID')} kali!` : 'Menyelamatkan ribuan jam kerja.'}
          </p>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '50px' }}>Fitur Utama Kami</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <FastForward size={32} color="#3b82f6" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Auto Scroll & Scan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Ekstensi akan secara otomatis menyusuri (scroll) halaman Anda ke paling bawah untuk mendeteksi seluruh media secara menyeluruh sebelum mulai mengunduh.</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <Settings size={32} color="#3b82f6" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Pilihan Resolusi Pintar</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Pilih kualitas gambar (1K, 2K, 4K) dan kualitas video (1080p, 4K, GIF) secara terpisah di menu pengaturan. Unduh gambar dan video sekaligus secara berurutan.</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <ShieldCheck size={32} color="#3b82f6" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Smart Skip Duplicates</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Mencatat setiap aset yang sudah Anda unduh. Jika proses terputus, Anda bisa melanjutkannya dan AI akan melewati aset yang sudah pernah diunduh.</p>
          </div>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <LayoutDashboard size={32} color="#3b82f6" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>Atur Jeda Waktu</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Sesuaikan kecepatan unduhan (*Batch Delay*) untuk mencegah browser crash atau diblokir oleh limit keamanan server Google.</p>
          </div>

        </div>
      </section>

      {/* Comparison Section */}
      <section className="container" style={{ marginBottom: '100px' }}>
        <div style={{ background: 'var(--glass-strong)', borderRadius: '24px', padding: '50px', border: '1px solid var(--border)', overflowX: 'auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '40px' }}>Bagaimana Ia Bekerja?</h2>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Aktivitas</th>
                <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Cara Manual</th>
                <th style={{ padding: '15px', color: '#60a5fa', fontSize: '1.1rem' }}>Flow Downloader</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Unduh 100 Gambar</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Hover &#8594; Klik Titik 3 &#8594; Pilih Resolusi &#8594; 100x Ulangi</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Hanya 1 Klik &quot;Start Mass Download&quot;</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Organisasi File</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Berantakan di folder Downloads bawaan</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Tersusun rapi di dalam sub-folder kustom</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Menghindari Duplikat</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Mengingat secara manual mana yang sudah diunduh</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Memori pintar otomatis men-skip file yang sama</td>
              </tr>
              <tr>
                <td style={{ padding: '20px 15px', fontWeight: 500 }}>Pop-up Notifikasi</td>
                <td style={{ padding: '20px 15px', color: 'var(--text-secondary)' }}>Harus klik tombol &quot;Tutup/Dismiss&quot; berulang kali</td>
                <td style={{ padding: '20px 15px', color: 'var(--green)', fontWeight: 600 }}><CheckCircle size={16} style={{ display: 'inline', marginBottom: '-3px' }}/> Ekstensi klik otomatis latar belakang tiap detik</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      {/* Installation Section */}
      <section className="container">
        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(0,0,0,0))', borderRadius: '24px', padding: '50px', border: '1px solid rgba(59,130,246,0.3)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px' }}>Cara Memasang Ekstensi</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 30px' }}>
            Karena ini adalah ekstensi premium eksklusif, pemasangannya sangat mudah melalui mode pengembang:
          </p>
          <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto', background: 'var(--bg-secondary)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <ol style={{ lineHeight: 1.8, margin: 0, paddingLeft: '20px', color: 'var(--text-primary)' }}>
              <li>Ekstrak file <code style={{color: '#60a5fa'}}>flow 2k downloader.zip</code> yang telah Anda unduh.</li>
              <li>Buka halaman ekstensi di browser Anda: <code style={{background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px'}}>chrome://extensions/</code> (Chrome) atau <code style={{background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px'}}>edge://extensions/</code> (Edge).</li>
              <li>Aktifkan <b>Developer mode</b> (Mode Pengembang) di pojok kanan atas halaman.</li>
              <li>Klik tombol <b>Load unpacked</b> (Muat yang tidak dikemas) di pojok kiri atas.</li>
              <li>Pilih folder hasil ekstrakan tadi (pastikan memilih folder yang di dalamnya terdapat file <code style={{color: 'var(--text-secondary)'}}>manifest.json</code>).</li>
              <li>Selesai! Buka halaman project Google Flow dan klik ikon ekstensi ini.</li>
            </ol>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container" style={{ marginTop: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '40px' }}>Pertanyaan yang Sering Diajukan (FAQ)</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <details style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}>Bagaimana cara download banyak gambar sekaligus?</summary>
            <p style={{ marginTop: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Dengan menggunakan ekstensi Flow Downloader kami, cukup buka project Google Flow Anda, pilih resolusi yang diinginkan (1K, 2K, 4K), lalu klik "Start Mass Download". Ekstensi akan otomatis melakukan scroll dan menyimpan semua gambar secara berurutan tanpa klik manual.</p>
          </details>
          <details style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}>Apakah saya bisa mendownload video dari Google Flow?</summary>
            <p style={{ marginTop: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Tentu saja! Flow Mass Downloader dapat mengekspor video yang dihasilkan AI dari Google Flow dalam berbagai kualitas, termasuk 1080p, 4K, dan juga format GIF secara otomatis.</p>
          </details>
          <details style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '1.1rem', fontWeight: 600, outline: 'none' }}>Apakah ekstensi ini aman digunakan?</summary>
            <p style={{ marginTop: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Sangat aman. Ekstensi ini berjalan sepenuhnya di browser lokal Anda (client-side) dan hanya berinteraksi dengan elemen visual (DOM) di halaman Google Flow. Kami tidak mengumpulkan data pribadi atau kredensial login Anda.</p>
          </details>
        </div>
      </section>

    </main>
  );
}
