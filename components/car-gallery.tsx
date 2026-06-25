'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import CrownVicIcon from '@/components/crown-vic-icon';
import {
  ChevronLeft,
  ChevronRight,
  Car,
  Gauge,
  Paintbrush,
  Armchair,
  Flag,
  Calendar,
  Fuel,
  Settings2,
} from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/auto/principal.jpeg', alt: 'Ford LTD Crown Victoria - Vista lateral' },
  { src: '/auto/frontal.jpeg', alt: 'Ford LTD Crown Victoria - Vista frontal' },
  { src: '/auto/trasera.jpeg', alt: 'Ford LTD Crown Victoria - Vista trasera' },
  { src: '/auto/interior.jpeg', alt: 'Ford LTD Crown Victoria - Interior' },
  { src: '/auto/asientos.jpeg', alt: 'Ford LTD Crown Victoria - Asientos' },
  { src: '/auto/rin.jpeg', alt: 'Ford LTD Crown Victoria - Rin' },
  { src: '/auto/lateral.jpeg', alt: 'Ford LTD Crown Victoria - Vista lateral superior' },
  { src: '/auto/trasera2.jpeg', alt: 'Ford LTD Crown Victoria - Vista trasera ángulo' },
  { src: '/auto/motor.jpeg', alt: 'Ford LTD Crown Victoria - Motor' },
];

const CAR_SPECS = [
  { icon: CrownVicIcon, label: 'Modelo', value: 'Ford LTD Crown Victoria' },
  { icon: Calendar, label: 'Año', value: 'Modelo 82' },
  { icon: Paintbrush, label: 'Color', value: 'Blanco' },
  { icon: Armchair, label: 'Interior', value: 'Vestiduras rojas de velour' },
  { icon: Fuel, label: 'Motor', value: 'V8' },
  { icon: Settings2, label: 'Transmisión', value: 'Automática' },
  { icon: Flag, label: 'Origen', value: 'Nacional Mexicano' },
  { icon: Gauge, label: 'Tipo', value: 'Sedán 2 puertas' },
];

export default function CarGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-8"
    >
      {/* Section title */}
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-4 h-4 text-accent-cyan" />
        <h2 className="text-base font-bold text-text-primary">El Premio</h2>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {/* Main image carousel */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-bg-elevated overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={GALLERY_IMAGES[currentIndex].src}
                alt={GALLERY_IMAGES[currentIndex].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority={currentIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent pointer-events-none" />

          {/* Nav arrows */}
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-primary/70 backdrop-blur-md border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-primary/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-primary/70 backdrop-blur-md border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-primary/90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Siguiente foto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Counter badge */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-bg-primary/70 backdrop-blur-md border border-border-subtle text-[10px] font-semibold text-text-secondary">
            {currentIndex + 1} / {GALLERY_IMAGES.length}
          </div>

          {/* Car name overlay */}
          <div className="absolute bottom-3 left-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-white drop-shadow-lg leading-tight">
              Ford LTD Crown Victoria
            </h3>
            <p className="text-xs text-white/70 font-medium drop-shadow-md">
              Nacional Mexicano
            </p>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-hide">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                i === currentIndex
                  ? 'ring-2 ring-accent-cyan ring-offset-1 ring-offset-bg-primary scale-105'
                  : 'opacity-50 hover:opacity-80'
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>

        {/* Car Specs Grid */}
        <div className="p-4 sm:p-5 border-t border-border-subtle">
          <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-accent-purple" />
            Características del Vehículo
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CAR_SPECS.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-2.5 bg-bg-elevated/50 rounded-xl px-3 py-2.5 border border-border-subtle/50"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 flex items-center justify-center flex-shrink-0">
                  {spec.icon && <spec.icon className={spec.label === 'Modelo' ? "w-6 h-auto" : "w-4 h-4 text-accent-cyan"} />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    {spec.label}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-text-primary leading-tight truncate">
                    {spec.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
