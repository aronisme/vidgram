"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from "lucide-react";

export default function ImageGallery({ images }: { images: { url: string; cloudinaryId: string }[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setZoomLevel(1); // Reset zoom on image change
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setZoomLevel(1);
    };

    const toggleZoom = () => {
        setZoomLevel(prev => prev === 1 ? 2 : prev === 2 ? 3 : 1);
    };

    if (!images || images.length === 0) return null;

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Main Image Display (Carousel) */}
            <div 
                style={{ 
                    width: '100%', 
                    aspectRatio: '1', 
                    background: '#000', 
                    borderRadius: 'var(--radius-lg)', 
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--border)'
                }}
                className="group"
            >
                <img
                    src={images[currentIndex].url}
                    alt={`Image ${currentIndex + 1}`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transition: 'opacity 0.3s ease'
                    }}
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={handlePrev} 
                            style={navBtnStyle('left')}
                            className="hover:bg-white/20 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={handleNext} 
                            style={navBtnStyle('right')}
                            className="hover:bg-white/20 transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                        
                        {/* Dots */}
                        <div style={{
                            position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
                            display: 'flex', gap: '0.375rem', background: 'rgba(0,0,0,0.5)', padding: '0.375rem 0.5rem', 
                            borderRadius: '1rem', backdropFilter: 'blur(4px)'
                        }}>
                            {images.map((_, idx) => (
                                <div key={idx} style={{
                                    width: '6px', height: '6px', borderRadius: '50%',
                                    background: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.4)',
                                    transition: 'all 0.2s'
                                }} />
                            ))}
                        </div>
                    </>
                )}

                {/* View Full Size Button */}
                <button 
                    onClick={() => setIsLightboxOpen(true)}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', 
                        color: 'white', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', 
                        backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Tampilkan Ukuran Asli"
                >
                    <Maximize2 size={18} />
                </button>
            </div>

            {/* Lightbox / Zoom Modal */}
            {isLightboxOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    {/* Controls Top Right */}
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem', zIndex: 50 }}>
                        <button 
                            onClick={toggleZoom}
                            style={{ 
                                background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0.75rem 1rem', 
                                borderRadius: '2rem', cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center', 
                                fontWeight: 600, fontSize: '0.875rem', backdropFilter: 'blur(4px)'
                            }}
                        >
                            <ZoomIn size={20} /> Zoom {zoomLevel}x
                        </button>
                        <button 
                            onClick={() => { setIsLightboxOpen(false); setZoomLevel(1); }}
                            style={{ 
                                background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '0.75rem', 
                                borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)', display: 'flex'
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation inside Lightbox */}
                    {images.length > 1 && (
                        <>
                            <button onClick={handlePrev} style={{...navBtnStyle('left'), width: '3.5rem', height: '3.5rem', background: 'rgba(255,255,255,0.1)'}}><ChevronLeft size={32} /></button>
                            <button onClick={handleNext} style={{...navBtnStyle('right'), width: '3.5rem', height: '3.5rem', background: 'rgba(255,255,255,0.1)'}}><ChevronRight size={32} /></button>
                        </>
                    )}

                    {/* Zoomable Image Container */}
                    <div style={{
                        width: '100%', height: '100%', overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
                    }}>
                        <img 
                            src={images[currentIndex].url} 
                            alt={`Full size ${currentIndex + 1}`}
                            style={{
                                maxWidth: zoomLevel === 1 ? '100%' : 'none',
                                maxHeight: zoomLevel === 1 ? '100%' : 'none',
                                objectFit: 'contain',
                                transform: `scale(${zoomLevel})`,
                                transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in',
                                transformOrigin: 'center center'
                            }}
                            onClick={toggleZoom}
                        />
                    </div>
                    
                    {/* Image Counter */}
                    <div style={{
                        position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
                        color: 'white', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem',
                        fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em'
                    }}>
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </div>
    );
}

const navBtnStyle = (side: 'left' | 'right') => ({
    position: 'absolute' as const,
    [side]: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.5)',
    color: 'white',
    border: 'none',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'background 0.2s',
    zIndex: 10
});
