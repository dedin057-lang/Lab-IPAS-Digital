/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Activity, Play, Pause, Sparkles, Info, RefreshCw } from 'lucide-react';
import { sounds } from '../../../services/sound';
import { storage } from '../../../services/storage';

export const CirculatoryLab: React.FC = () => {
  const [circulationType, setCirculationType] = useState<'besar' | 'kecil'>('besar');
  const [isBeating, setIsBeating] = useState<boolean>(true);
  const [selectedChamber, setSelectedChamber] = useState<string>('bilik_kiri');

  useEffect(() => {
    storage.markLabCompleted('peredaran_darah');
  }, []);

  const chambers: Record<string, { title: string; subtitle: string; desc: string; bloodType: string }> = {
    serambi_kanan: {
      title: 'Serambi Kanan (Atrium Dekster)',
      subtitle: 'Menerima Darah Kotor dari Seluruh Tubuh',
      desc: 'Menerima darah kaya karbon dioksida (CO2) dari vena cava superior dan vena cava inferior yang kembali dari seluruh organ tubuh.',
      bloodType: 'Kaya CO₂ (Warna Biru / Gelap)'
    },
    bilik_kanan: {
      title: 'Bilik Kanan (Ventrikel Dekster)',
      subtitle: 'Memompa Darah Kotor ke Paru-Paru',
      desc: 'Memompa darah kotor menuju paru-paru melalui arteri pulmonalis untuk dibersihkan dan menyerap oksigen baru.',
      bloodType: 'Kaya CO₂ (Warna Biru / Gelap)'
    },
    serambi_kiri: {
      title: 'Serambi Kiri (Atrium Sinister)',
      subtitle: 'Menerima Darah Bersih dari Paru-Paru',
      desc: 'Menerima darah bersih kaya oksigen (O2) yang baru saja kembali dari pertukaran gas di alveolus paru-paru melalui vena pulmonalis.',
      bloodType: 'Kaya O₂ (Warna Merah Terang)'
    },
    bilik_kiri: {
      title: 'Bilik Kiri (Ventrikel Sinister)',
      subtitle: 'Dinding Tertebal - Memompa Darah ke Seluruh Tubuh',
      desc: 'Memiliki lapisan otot miokardium paling tebal dan kuat karena harus menghasilkan tekanan tinggi untuk memompa darah ke seluruh tubuh melalui pembuluh nadi utama (Aorta).',
      bloodType: 'Kaya O₂ (Warna Merah Terang)'
    }
  };

  const currentChamber = chambers[selectedChamber] || chambers.bilik_kiri;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Laboratorium Sistem Peredaran Darah</h2>
            <p className="text-xs text-slate-500">Jantung 4 ruang, sirkulasi peredaran darah besar & kecil, dan aliran arteri/vena</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setCirculationType('besar');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                circulationType === 'besar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peredaran Darah Besar
            </button>
            <button
              onClick={() => {
                setCirculationType('kecil');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                circulationType === 'kecil' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peredaran Darah Kecil
            </button>
          </div>

          <button
            onClick={() => {
              setIsBeating(!isBeating);
              sounds.playClick();
            }}
            className={`p-2 rounded-xl border transition-colors ${
              isBeating ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title="Pompa Denyut Jantung"
          >
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive 4-Chamber Heart & Circulation Flow */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-200 font-semibold">
                Aliran: {circulationType === 'besar' ? 'Jantung (Bilik Kiri) ➔ Seluruh Tubuh ➔ Jantung (Serambi Kanan)' : 'Jantung (Bilik Kanan) ➔ Paru-paru ➔ Jantung (Serambi Kiri)'}
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">Detak: ~75 bpm</span>
          </div>

          {/* SVG Heart Diagram */}
          <div className="relative w-full aspect-[16/11] flex items-center justify-center my-auto">
            <svg viewBox="0 0 480 360" className="w-full h-full select-none">
              {/* Outer Loop Circulation Pathways */}
              {circulationType === 'besar' ? (
                // Great Circulation (to systemic body)
                <g>
                  {/* Oxygenated Aorta path to body */}
                  <path d="M 280 140 Q 380 40 400 180 Q 380 320 280 260" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                  {/* Deoxygenated Vena Cava path back from body */}
                  <path d="M 200 260 Q 80 320 60 180 Q 80 40 200 140" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                  <rect x="360" y="160" width="80" height="40" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
                  <text x="400" y="185" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle">Seluruh Tubuh</text>
                </g>
              ) : (
                // Small Circulation (to lungs)
                <g>
                  {/* Blue Pulmonary Artery to lungs */}
                  <path d="M 200 140 Q 140 60 240 40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                  {/* Red Pulmonary Vein from lungs to left atrium */}
                  <path d="M 240 40 Q 340 60 280 140" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" opacity="0.75" />
                  <rect x="200" y="20" width="80" height="35" rx="8" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                  <text x="240" y="42" fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">Paru-Paru</text>
                </g>
              )}

              {/* Heart Muscle Body with Beating Animation */}
              <g 
                transform="translate(240, 200)"
                className={isBeating ? "animate-[pulse_1s_ease-in-out_infinite]" : ""}
              >
                {/* Heart Base Silhouette */}
                <path
                  d="M 0 -80 Q 60 -120 100 -70 Q 130 -10 0 100 Q -130 -10 -100 -70 Q -60 -120 0 -80 Z"
                  fill="#881337"
                  stroke="#be123c"
                  strokeWidth="6"
                />

                {/* Vertical Septum (Sekat Pemisah Jantung) */}
                <line x1="0" y1="-70" x2="0" y2="85" stroke="#ffffff" strokeWidth="6" opacity="0.9" />
                {/* Horizontal Valve Line */}
                <line x1="-80" y1="0" x2="80" y2="0" stroke="#ffffff" strokeWidth="4" strokeDasharray="6 4" opacity="0.6" />

                {/* 1. SERAMBI KANAN (Top Left from viewer's perspective) */}
                <rect 
                  x="-85" 
                  y="-65" 
                  width="80" 
                  height="60" 
                  rx="10" 
                  fill={selectedChamber === 'serambi_kanan' ? '#38bdf8' : '#1d4ed8'}
                  fillOpacity="0.85"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedChamber('serambi_kanan');
                    sounds.playClick();
                  }}
                />
                <text x="-45" y="-35" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Serambi Kanan
                </text>
                <text x="-45" y="-20" fill="#bfdbfe" fontSize="8" textAnchor="middle">(Kaya CO₂)</text>

                {/* 2. BILIK KANAN (Bottom Left from viewer) */}
                <rect 
                  x="-85" 
                  y="5" 
                  width="80" 
                  height="65" 
                  rx="10" 
                  fill={selectedChamber === 'bilik_kanan' ? '#38bdf8' : '#1e40af'}
                  fillOpacity="0.85"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedChamber('bilik_kanan');
                    sounds.playClick();
                  }}
                />
                <text x="-45" y="35" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Bilik Kanan
                </text>
                <text x="-45" y="50" fill="#bfdbfe" fontSize="8" textAnchor="middle">(Kaya CO₂)</text>

                {/* 3. SERAMBI KIRI (Top Right from viewer) */}
                <rect 
                  x="5" 
                  y="-65" 
                  width="80" 
                  height="60" 
                  rx="10" 
                  fill={selectedChamber === 'serambi_kiri' ? '#38bdf8' : '#dc2626'}
                  fillOpacity="0.85"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedChamber('serambi_kiri');
                    sounds.playClick();
                  }}
                />
                <text x="45" y="-35" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Serambi Kiri
                </text>
                <text x="45" y="-20" fill="#fecaca" fontSize="8" textAnchor="middle">(Kaya O₂)</text>

                {/* 4. BILIK KIRI (Bottom Right from viewer - Thicker Wall) */}
                <rect 
                  x="5" 
                  y="5" 
                  width="80" 
                  height="65" 
                  rx="10" 
                  fill={selectedChamber === 'bilik_kiri' ? '#38bdf8' : '#b91c1c'}
                  fillOpacity="0.9"
                  stroke="#fb7185"
                  strokeWidth="3"
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedChamber('bilik_kiri');
                    sounds.playClick();
                  }}
                />
                <text x="45" y="35" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Bilik Kiri
                </text>
                <text x="45" y="50" fill="#fecaca" fontSize="8" textAnchor="middle">(Dinding Tertebal)</text>
              </g>
            </svg>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-xs text-slate-300 flex items-center justify-between">
            <span>Klik ruang jantung untuk melihat peran pemompaan darah!</span>
            <span className="text-teal-400 font-medium">Bilik Kiri = Pompa Tekanan Tertinggi</span>
          </div>
        </div>

        {/* Right: Chamber Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md">
                {currentChamber.subtitle}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{currentChamber.title}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Sifat Darah: {currentChamber.bloodType}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentChamber.desc}
            </div>

            <div className="p-3 bg-teal-50 border border-teal-100 rounded-2xl text-xs text-teal-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-teal-950">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Perbedaan Pembuluh Arteri dan Vena:
              </span>
              <p className="text-[11px] leading-relaxed text-teal-800">
                <strong>Arteri (Nadi):</strong> Berdinding tebal, elastis, dan membawa darah keluar dari jantung dengan tekanan kuat.<br />
                <strong>Vena (Balik):</strong> Memiliki katup di sepanjang saluran untuk mencegah darah mengalir balik saat kembali ke jantung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
