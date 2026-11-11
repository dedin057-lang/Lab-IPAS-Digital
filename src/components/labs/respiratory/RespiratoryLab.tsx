/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Info, 
  Sliders, 
  CheckCircle2, 
  ArrowDown, 
  ArrowUp 
} from 'lucide-react';
import { RESPIRATORY_ORGANS } from '../../../data/curriculumData';
import { AnatomyPart } from '../../../types/ipas';
import { sounds } from '../../../services/sound';
import { storage } from '../../../services/storage';

export const RespiratoryLab: React.FC = () => {
  const [selectedOrgan, setSelectedOrgan] = useState<AnatomyPart>(RESPIRATORY_ORGANS[4]); // Lungs default
  // Breathing phase: 0 = fully exhaled, 1 = fully inhaled
  const [breathPhase, setBreathPhase] = useState<number>(0.8);
  const [isAutoBreathing, setIsAutoBreathing] = useState<boolean>(true);
  const [activeSubView, setActiveSubView] = useState<'macro' | 'alveoli'>('macro');

  useEffect(() => {
    storage.markLabCompleted('pernapasan');
  }, []);

  // Continuous realistic breathing rhythm (12-16 breaths per min)
  useEffect(() => {
    if (!isAutoBreathing) return;

    let inhale = true;
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev >= 1) inhale = false;
        if (prev <= 0.15) inhale = true;
        return inhale ? prev + 0.05 : prev - 0.05;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isAutoBreathing]);

  const isInhaling = breathPhase > 0.5;

  // Visual scaling factors
  // Lung expansion: scale from 0.88 to 1.15
  const lungScale = 0.9 + breathPhase * 0.22;
  // Diaphragm curvature: 0 (flat/contracted on inhale) to 25 (curved up/relaxed on exhale)
  const diaphragmCurve = 25 - breathPhase * 25;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Laboratorium Sistem Pernapasan</h2>
            <p className="text-xs text-slate-500">Mekanisme Inspirasi-Ekspirasi, pemuaian paru-paru, pergerakan diafragma, dan difusi alveolus</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setActiveSubView('macro');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeSubView === 'macro' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rongga Dada & Paru-paru
            </button>
            <button
              onClick={() => {
                setActiveSubView('alveoli');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeSubView === 'alveoli' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mikroskop Alveolus (Gas O2 & CO2)
            </button>
          </div>

          <button
            onClick={() => {
              setIsAutoBreathing(!isAutoBreathing);
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              isAutoBreathing 
                ? 'bg-teal-50 text-teal-700 border-teal-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isAutoBreathing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            Irama Napas: {isAutoBreathing ? 'Otomatis' : 'Manual'}
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Respiratory Simulation Graphics */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-[500px]">
          {/* Phase Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isInhaling ? 'bg-cyan-400' : 'bg-rose-400'}`}></span>
              <span className="text-slate-200 font-semibold">
                Fase: {isInhaling ? 'INSPIRASI (Menghirup Oksigen O2)' : 'EKSPIRASI (Menghembuskan CO2)'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              {isInhaling ? (
                <span className="flex items-center gap-1 text-cyan-300">
                  <ArrowDown className="w-3.5 h-3.5" /> Diafragma Mendatar & Turun
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-300">
                  <ArrowUp className="w-3.5 h-3.5" /> Diafragma Melengkung Naik
                </span>
              )}
            </div>
          </div>

          {activeSubView === 'macro' ? (
            /* --- MACRO VIEW: LUNGS & DIAPHRAGM --- */
            <div className="relative w-full aspect-[16/11] flex items-center justify-center my-auto">
              <svg viewBox="0 0 460 380" className="w-full h-full select-none">
                <defs>
                  <radialGradient id="lungGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity="0.9" />
                    <stop offset="80%" stopColor="#ec4899" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#db2777" stopOpacity="1" />
                  </radialGradient>
                </defs>

                {/* Chest Cavity / Rib cage Outline */}
                <path
                  d="M 120 100 Q 80 180 110 270 Q 230 300 350 270 Q 380 180 340 100 Z"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="3"
                  strokeDasharray="4 6"
                />

                {/* 1. NOSE & PHARYNX */}
                <g 
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedOrgan(RESPIRATORY_ORGANS[0]);
                    sounds.playClick();
                  }}
                >
                  <rect x="215" y="20" width="30" height="35" rx="6" fill={selectedOrgan.id === 'nasal_cavity' ? '#38bdf8' : '#64748b'} />
                  <text x="230" y="15" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Rongga Hidung
                  </text>
                </g>

                {/* 2. LARYNX & TRACHEA (Tenggorokan dengan cincin tulang rawan) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedOrgan(RESPIRATORY_ORGANS[2]);
                    sounds.playClick();
                  }}
                >
                  <rect x="220" y="55" width="20" height="75" rx="4" fill={selectedOrgan.id === 'trachea' ? '#38bdf8' : '#e2e8f0'} stroke="#94a3b8" strokeWidth="1.5" />
                  {/* Cartilage rings */}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line key={i} x1="220" y1={65 + i * 11} x2="240" y2={65 + i * 11} stroke="#64748b" strokeWidth="2" />
                  ))}
                  <text x="265" y="95" fill="#94a3b8" fontSize="9" fontWeight="bold">
                    Trakea (Cincin Rawan)
                  </text>
                </g>

                {/* 3. BRONCHIAL TREE (Bronkus Kiri & Kanan) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedOrgan(RESPIRATORY_ORGANS[3]);
                    sounds.playClick();
                  }}
                >
                  <path d="M 230 130 L 180 165" stroke={selectedOrgan.id === 'bronchi' ? '#38bdf8' : '#cbd5e1'} strokeWidth="10" strokeLinecap="round" />
                  <path d="M 230 130 L 280 165" stroke={selectedOrgan.id === 'bronchi' ? '#38bdf8' : '#cbd5e1'} strokeWidth="10" strokeLinecap="round" />
                  <text x="230" y="145" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Bronkus
                  </text>
                </g>

                {/* 4. EXPANDING LUNGS (Paru-paru Kanan & Kiri) */}
                {/* Right Lung (on viewer's left) */}
                <g 
                  transform={`translate(170, 205) scale(${lungScale}) translate(-170, -205)`}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedOrgan(RESPIRATORY_ORGANS[4]);
                    sounds.playClick();
                  }}
                >
                  <path
                    d="M 175 160 Q 115 160 120 230 Q 130 270 180 265 Q 195 210 175 160 Z"
                    fill={selectedOrgan.id === 'lungs' ? '#38bdf8' : 'url(#lungGrad)'}
                    stroke={selectedOrgan.id === 'lungs' ? '#0284c7' : '#be185d'}
                    strokeWidth="3"
                  />
                  <text x="145" y="215" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Paru Kanan
                  </text>
                </g>

                {/* Left Lung (on viewer's right - with cardiac notch for heart) */}
                <g 
                  transform={`translate(290, 205) scale(${lungScale}) translate(-290, -205)`}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedOrgan(RESPIRATORY_ORGANS[4]);
                    sounds.playClick();
                  }}
                >
                  <path
                    d="M 285 160 Q 345 160 340 230 Q 330 270 280 265 Q 265 220 285 160 Z"
                    fill={selectedOrgan.id === 'lungs' ? '#38bdf8' : 'url(#lungGrad)'}
                    stroke={selectedOrgan.id === 'lungs' ? '#0284c7' : '#be185d'}
                    strokeWidth="3"
                  />
                  <text x="315" y="215" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Paru Kiri
                  </text>
                </g>

                {/* 5. MOVING DIAPHRAGM (Diafragma di dasar rongga dada) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedOrgan(RESPIRATORY_ORGANS[6]);
                    sounds.playClick();
                  }}
                >
                  <path
                    d={`M 110 300 Q 230 ${285 - diaphragmCurve} 350 300 Q 230 ${305 - diaphragmCurve} 110 300 Z`}
                    fill={selectedOrgan.id === 'diaphragm' ? '#38bdf8' : '#f59e0b'}
                    stroke="#d97706"
                    strokeWidth="3"
                  />
                  <text x="230" y={325 - diaphragmCurve * 0.5} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Diafragma ({isInhaling ? 'Mendatar / Kontraksi' : 'Melengkung / Relaksasi'})
                  </text>
                </g>

                {/* AIRFLOW ARROW PARTICLES */}
                <g transform="translate(230, 40)">
                  {isInhaling ? (
                    // Inhaling O2 (blue flowing downwards)
                    <>
                      <circle cx="0" cy="15" r="4" fill="#38bdf8" />
                      <circle cx="0" cy="35" r="4" fill="#38bdf8" />
                      <text x="-35" y="25" fill="#38bdf8" fontSize="9" fontWeight="bold">Udara O2 Masuk</text>
                    </>
                  ) : (
                    // Exhaling CO2 (rose flowing upwards)
                    <>
                      <circle cx="0" cy="15" r="4" fill="#f43f5e" />
                      <circle cx="0" cy="35" r="4" fill="#f43f5e" />
                      <text x="35" y="25" fill="#f43f5e" fontSize="9" fontWeight="bold">Udara CO2 Keluar</text>
                    </>
                  )}
                </g>
              </svg>
            </div>
          ) : (
            /* --- SUBVIEW: ALVEOLI GAS EXCHANGE --- */
            <div className="relative w-full aspect-[16/11] flex items-center justify-center my-auto">
              <svg viewBox="0 0 460 340" className="w-full h-full select-none">
                <rect width="460" height="340" fill="#0f172a" />

                {/* Alveolar Sac Cluster */}
                <g transform="translate(180, 160)">
                  {/* Bubble alveoli */}
                  <circle cx="-40" cy="-30" r="45" fill="#fbcfe8" fillOpacity="0.4" stroke="#f472b6" strokeWidth="2" />
                  <circle cx="35" cy="-25" r="48" fill="#fbcfe8" fillOpacity="0.4" stroke="#f472b6" strokeWidth="2" />
                  <circle cx="-10" cy="40" r="50" fill="#fbcfe8" fillOpacity="0.4" stroke="#f472b6" strokeWidth="2" />

                  {/* Air inside */}
                  <text x="0" y="0" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Rongga Alveolus
                  </text>
                  <text x="0" y="16" fill="#94a3b8" fontSize="9" textAnchor="middle">
                    Kantung Udara Berdinding Tipis
                  </text>
                </g>

                {/* Blood Capillary Vessel hugging the alveolus */}
                <path
                  d="M 40 280 Q 230 320 420 260"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="28"
                  strokeLinecap="round"
                />
                <text x="70" y="260" fill="#fca5a5" fontSize="10" fontWeight="bold">
                  Kapiler Darah
                </text>

                {/* Red blood cells (Eritrosit) */}
                {[90, 160, 230, 300, 370].map((cx, idx) => (
                  <circle key={idx} cx={cx} cy={290 - Math.sin((cx / 460) * Math.PI) * 15} r="8" fill="#b91c1c" stroke="#fca5a5" strokeWidth="2" />
                ))}

                {/* Gas Diffusion Molecules: O2 and CO2 arrows */}
                {/* O2 diffuse into capillary */}
                <g transform="translate(190, 215)">
                  <line x1="0" y1="0" x2="0" y2="35" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
                  <circle cx="0" cy="18" r="7" fill="#0284c7" />
                  <text x="0" y="21" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">O₂</text>
                  <text x="18" y="20" fill="#38bdf8" fontSize="9" fontWeight="bold">Oksigen Masuk Darah</text>
                </g>

                {/* CO2 diffuse out of capillary */}
                <g transform="translate(260, 250)">
                  <line x1="0" y1="0" x2="0" y2="-35" stroke="#f43f5e" strokeWidth="3" />
                  <circle cx="0" cy="-18" r="7" fill="#be123c" />
                  <text x="0" y="-15" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">CO₂</text>
                  <text x="18" y="-18" fill="#f43f5e" fontSize="9" fontWeight="bold">Karbon Dioksida Dilepas</text>
                </g>
              </svg>
            </div>
          )}

          {/* Interactive Manual Breathing Slider */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 mt-2">
            <div className="flex items-center gap-2 shrink-0">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-semibold text-slate-200">Kontrol Siklus Tarik/Hembus:</span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={breathPhase}
              onChange={(e) => {
                setBreathPhase(Number(e.target.value));
                setIsAutoBreathing(false);
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />

            <span className="text-xs font-mono font-bold text-teal-300 shrink-0">
              {isInhaling ? 'Paru Mengembang (Inspirasi)' : 'Paru Mengempis (Ekspirasi)'}
            </span>
          </div>
        </div>

        {/* Right: Rich Scientific Factsheet */}
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
                <Wind className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Fungsi Pernapasan
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedOrgan.function}
                </p>
              </div>

              {selectedOrgan.funFact && (
                <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5 flex items-center gap-1 text-amber-950">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Fakta Ilmiah Pernapasan:
                  </span>
                  {selectedOrgan.funFact}
                </div>
              )}
            </div>

            {/* Quick Organ Directory */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-600 block mb-2">
                Pilih Organ Pernapasan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {RESPIRATORY_ORGANS.map((organ) => (
                  <button
                    key={organ.id}
                    onClick={() => {
                      setSelectedOrgan(organ);
                      sounds.playClick();
                    }}
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
