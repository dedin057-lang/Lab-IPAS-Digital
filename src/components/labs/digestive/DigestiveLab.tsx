/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { DIGESTIVE_ORGANS } from '../../../data/curriculumData';
import { AnatomyPart } from '../../../types/ipas';
import { sounds } from '../../../services/sound';
import { storage } from '../../../services/storage';

export const DigestiveLab: React.FC = () => {
  const [selectedOrgan, setSelectedOrgan] = useState<AnatomyPart>(DIGESTIVE_ORGANS[0]);
  const [isJourneyRunning, setIsJourneyRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Steps correspond directly to DIGESTIVE_ORGANS array:
  // 0: Mouth, 1: Esophagus, 2: Stomach, 3: Liver, 4: Pancreas, 5: Small Intestine, 6: Large Intestine, 7: Rectum/Anus
  const journeySequence = [0, 1, 2, 5, 6, 7]; // main food pipeline

  useEffect(() => {
    storage.markLabCompleted('pencernaan');
  }, []);

  // Journey animation timer
  useEffect(() => {
    if (!isJourneyRunning) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= journeySequence.length - 1) {
          setIsJourneyRunning(false);
          sounds.playSuccess();
          return prev;
        }
        const nextIdx = prev + 1;
        setSelectedOrgan(DIGESTIVE_ORGANS[journeySequence[nextIdx]]);
        sounds.playClick();
        return nextIdx;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isJourneyRunning, journeySequence]);

  const handleOrganClick = (organ: AnatomyPart) => {
    sounds.playClick();
    setSelectedOrgan(organ);
    const stepIdx = journeySequence.indexOf(DIGESTIVE_ORGANS.findIndex(o => o.id === organ.id));
    if (stepIdx !== -1) {
      setCurrentStepIndex(stepIdx);
    }
  };

  const handleStartJourney = () => {
    sounds.playClick();
    if (currentStepIndex >= journeySequence.length - 1) {
      setCurrentStepIndex(0);
      setSelectedOrgan(DIGESTIVE_ORGANS[journeySequence[0]]);
    }
    setIsJourneyRunning(true);
  };

  const handlePauseJourney = () => {
    sounds.playClick();
    setIsJourneyRunning(false);
  };

  const handleResetJourney = () => {
    sounds.playClick();
    setIsJourneyRunning(false);
    setCurrentStepIndex(0);
    setSelectedOrgan(DIGESTIVE_ORGANS[0]);
  };

  const handleNextStep = () => {
    sounds.playClick();
    setCurrentStepIndex((prev) => {
      const nextIdx = (prev + 1) % journeySequence.length;
      setSelectedOrgan(DIGESTIVE_ORGANS[journeySequence[nextIdx]]);
      return nextIdx;
    });
  };

  // Food bolus animated coordinates on canvas based on current step
  const bolusPositions = [
    { x: 170, y: 55, label: 'Mulut (Kunyah & Enzim Ptialin)' },
    { x: 170, y: 120, label: 'Kerongkongan (Gerak Peristaltik)' },
    { x: 195, y: 185, label: 'Lambung (HCl & Pepsin Mengaduk Kimus)' },
    { x: 170, y: 290, label: 'Usus Halus (Penyerapan Sari Makanan)' },
    { x: 170, y: 235, label: 'Usus Besar (Penyerapan Air & Pembusukan)' },
    { x: 170, y: 355, label: 'Rektum & Anus (Pengeluaran Feses)' }
  ];

  const currentBolus = bolusPositions[currentStepIndex] || bolusPositions[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Laboratorium Sistem Pencernaan</h2>
            <p className="text-xs text-slate-500">Perjalanan makanan dari mulut hingga anus: Klik organ atau putar simulasi animasi</p>
          </div>
        </div>

        {/* Animation Playback Controls */}
        <div className="flex items-center gap-2">
          {!isJourneyRunning ? (
            <button
              onClick={handleStartJourney}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Mulai Perjalanan
            </button>
          ) : (
            <button
              onClick={handlePauseJourney}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              Jeda
            </button>
          )}

          <button
            onClick={handleNextStep}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Langkah berikutnya"
          >
            <StepForward className="w-3.5 h-3.5" />
            Langkah Maju
          </button>

          <button
            onClick={handleResetJourney}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Kembali ke awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ulangi
          </button>
        </div>
      </div>

      {/* Main Grid: Anatomy Model & Organ Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Digestive Track SVG */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col items-center justify-center relative min-h-[500px]">
          {/* Header indicator */}
          <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              Jalur Saluran Pencernaan Makanan
            </span>
            <span className="text-teal-400 font-medium text-[11px]">
              Tahap: {currentBolus.label}
            </span>
          </div>

          <div className="w-full max-w-[340px] aspect-[9/14] relative">
            <svg viewBox="0 0 340 460" className="w-full h-full select-none">
              {/* Head & Neck silhouette */}
              <path
                d="M 120 40 Q 170 15 210 40 Q 220 75 195 90 L 195 140 L 145 140 L 145 90 Q 120 75 120 40 Z"
                fill="#1e293b"
                opacity="0.4"
              />

              {/* 1. MOUTH & TEETH */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[0])}
              >
                <circle 
                  cx="170" 
                  cy="55" 
                  r="20" 
                  fill={selectedOrgan.id === 'mouth' ? '#38bdf8' : '#fda4af'} 
                  stroke={selectedOrgan.id === 'mouth' ? '#0284c7' : '#f43f5e'}
                  strokeWidth="2.5"
                />
                <path d="M 160 55 Q 170 65 180 55" fill="none" stroke="#be123c" strokeWidth="2" />
                <text x="170" y="30" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Mulut & Kelenjar Ludah
                </text>
              </g>

              {/* 2. ESOPHAGUS (Kerongkongan) */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[1])}
              >
                <rect 
                  x="164" 
                  y="75" 
                  width="12" 
                  height="80" 
                  rx="6" 
                  fill={selectedOrgan.id === 'esophagus' ? '#38bdf8' : '#f43f5e'} 
                  stroke={selectedOrgan.id === 'esophagus' ? '#0284c7' : '#be123c'}
                  strokeWidth="2"
                />
                <text x="130" y="115" fill="#94a3b8" fontSize="8" fontWeight="bold">
                  Kerongkongan
                </text>
              </g>

              {/* 3. LIVER & GALLBLADDER (Hati - Kanan tubuh, kiri gambar) */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[3])}
              >
                <path 
                  d="M 115 155 Q 155 145 165 170 Q 150 195 115 185 Z" 
                  fill={selectedOrgan.id === 'liver_gallbladder' ? '#38bdf8' : '#b45309'} 
                  stroke={selectedOrgan.id === 'liver_gallbladder' ? '#0284c7' : '#92400e'}
                  strokeWidth="2"
                />
                <circle cx="140" cy="180" r="5" fill="#15803d" /> {/* Gallbladder */}
                <text x="105" y="150" fill="#94a3b8" fontSize="8" fontWeight="bold">
                  Hati
                </text>
              </g>

              {/* 4. STOMACH (Lambung - Kiri tubuh, kanan gambar) */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[2])}
              >
                <path 
                  d="M 172 155 Q 225 155 220 190 Q 215 215 175 210 Q 165 190 172 155 Z" 
                  fill={selectedOrgan.id === 'stomach' ? '#38bdf8' : '#fb7185'} 
                  stroke={selectedOrgan.id === 'stomach' ? '#0284c7' : '#e11d48'}
                  strokeWidth="2.5"
                />
                <text x="235" y="180" fill="#cbd5e1" fontSize="9" fontWeight="bold">
                  Lambung (Ventrikulus)
                </text>
              </g>

              {/* 5. PANCREAS (Pankreas - di bawah lambung) */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[4])}
              >
                <path 
                  d="M 160 205 Q 195 200 205 215 Q 170 218 160 205 Z" 
                  fill={selectedOrgan.id === 'pancreas' ? '#38bdf8' : '#facc15'} 
                  stroke="#ca8a04" 
                  strokeWidth="1.5"
                />
                <text x="215" y="215" fill="#94a3b8" fontSize="8" fontWeight="bold">
                  Pankreas
                </text>
              </g>

              {/* 6. LARGE INTESTINE (Usus Besar - Kolon mengelilingi usus halus) */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[6])}
              >
                <path 
                  d="M 120 280 L 120 220 Q 170 210 220 220 L 220 280" 
                  fill="none" 
                  stroke={selectedOrgan.id === 'large_intestine' ? '#38bdf8' : '#d97706'} 
                  strokeWidth="20" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  opacity="0.85"
                />
                <text x="75" y="245" fill="#cbd5e1" fontSize="9" fontWeight="bold">
                  Usus Besar (Kolon)
                </text>
              </g>

              {/* 7. SMALL INTESTINE (Usus Halus - berkelok di tengah) */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[5])}
              >
                <rect 
                  x="135" 
                  y="240" 
                  width="70" 
                  height="65" 
                  rx="16" 
                  fill={selectedOrgan.id === 'small_intestine' ? '#38bdf8' : '#fb923c'} 
                  stroke={selectedOrgan.id === 'small_intestine' ? '#0284c7' : '#ea580c'}
                  strokeWidth="2"
                  opacity="0.9"
                />
                {/* Intestinal folds */}
                <path d="M 145 255 Q 170 248 195 255" fill="none" stroke="#c2410c" strokeWidth="2" />
                <path d="M 145 272 Q 170 280 195 272" fill="none" stroke="#c2410c" strokeWidth="2" />
                <path d="M 145 290 Q 170 285 195 290" fill="none" stroke="#c2410c" strokeWidth="2" />
                <text x="170" y="275" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Usus Halus (Vili)
                </text>
              </g>

              {/* 8. RECTUM & ANUS (Rektum & Anus) */}
              <g 
                className="cursor-pointer"
                onClick={() => handleOrganClick(DIGESTIVE_ORGANS[7])}
              >
                <rect 
                  x="165" 
                  y="330" 
                  width="10" 
                  height="30" 
                  rx="4" 
                  fill={selectedOrgan.id === 'rectum_anus' ? '#38bdf8' : '#78716c'} 
                  stroke={selectedOrgan.id === 'rectum_anus' ? '#0284c7' : '#57534e'}
                  strokeWidth="2"
                />
                <circle cx="170" cy="365" r="5" fill="#ef4444" />
                <text x="170" y="385" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Anus (Pembuangan)
                </text>
              </g>

              {/* ANIMATED FOOD BOLUS / CHYME */}
              <g transform={`translate(${currentBolus.x}, ${currentBolus.y})`}>
                <circle cx="0" cy="0" r="10" fill="#facc15" stroke="#ffffff" strokeWidth="2">
                  <animate attributeName="r" values="9;12;9" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="4" fill="#ea580c" />
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Rich Scientific Organ Factsheet & Enzymes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                  {selectedOrgan.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1.5">{selectedOrgan.name}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Fungsi & Peran Pencernaan
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedOrgan.function}
                </p>
              </div>

              {selectedOrgan.mechanism && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mekanisme & Enzim yang Terlibat
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedOrgan.mechanism}
                  </p>
                </div>
              )}

              {selectedOrgan.funFact && (
                <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5 flex items-center gap-1 text-amber-950">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Tahukah Kamu?
                  </span>
                  {selectedOrgan.funFact}
                </div>
              )}
            </div>

            {/* Quick Organ Jump Buttons */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-600 block mb-2">
                Pilih Organ Tertentu:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DIGESTIVE_ORGANS.map((organ) => (
                  <button
                    key={organ.id}
                    onClick={() => handleOrganClick(organ)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      selectedOrgan.id === organ.id
                        ? 'bg-teal-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {organ.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
