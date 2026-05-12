import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us - Vidgram Support",
  description: "Get in touch with the Vidgram team for support, feedback, or business inquiries.",
};

export default function ContactPage() {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '6rem' }}>
      <section style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Hubungi <span style={{ color: 'var(--accent)' }}>Kami</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Punya pertanyaan atau masukan? Kami senang mendengar dari Anda.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent)', padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)' }}><Mail size={24} /></div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Email</h3>
              <p style={{ color: 'var(--text-secondary)' }}>support@vidgram.web.id</p>
            </div>
          </div>
          <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent)', padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)' }}><MessageSquare size={24} /></div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Bantuan Live</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Tersedia di Dashboard</p>
            </div>
          </div>
          <div className="card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent)', padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)' }}><MapPin size={24} /></div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Lokasi</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Jakarta, Indonesia</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card" style={{ padding: '3rem' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Nama Lengkap</label>
                <input type="text" placeholder="John Doe" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email</label>
                <input type="email" placeholder="john@example.com" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Subjek</label>
              <input type="text" placeholder="Tanya tentang fitur..." style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Pesan</label>
              <textarea placeholder="Tuliskan pesan Anda di sini..." rows={5} style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', outline: 'none', resize: 'none' }}></textarea>
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '1.25rem', fontSize: '1.125rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
              Kirim Pesan <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
