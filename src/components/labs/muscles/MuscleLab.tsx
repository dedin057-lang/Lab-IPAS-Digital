/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, Sliders, Sparkles, Info, Play, Pause, RotateCcw } from 'lucide-react';
import { sounds } from '../../../services/sound';
import { storage } from '../../../services/storage';

export const MuscleLab: React.FC = () => {
  // Arm bend angle: 0 deg = straight, 130 deg = fully flexed
  const [armAngle, setArmAngle] = useState<number>(30);
  const [isAutoFlexing, setIsAutoFlexing] = useState<boolean>(false);
  const [activeMuscle, setActiveMuscle] = useState<'biceps' | 'triceps' | 'tendon' | 'joint'>('biceps');

  useEffect(() => {
    storage.markLabCompleted('otot');
  }, []);

  // Automatic flexion animation loop
  useEffect(() => {
    if (!isAutoFlexing) return;
    let forward = true;
    const interval = setInterval(() => {
      setArmAngle((prev) => {
        if (prev >= 120) forward = false;
        if (prev <= 15) forward = true;
        return forward ? prev + 3 : prev - 3;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isAutoFlexing]);

  // Antagonistic calculations
  // Flexion ratio: 0 (straight) to 1 (bent)
  const flexRatio = armAngle / 130;
  // Biceps swells thicker as angle increases (thickness 18px -> 38px)
  const bicepsThickness = 18 + flexRatio * 20;
  // Triceps stretches thinner as angle increases (thickness 28px -> 14px)
  const tricepsThickness = 28 - flexRatio * 14;

  const isBicepsContracted = armAngle > 50;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Laboratorium Sistem Otot & Antagonis</h2>
            <p className="text-xs text-slate-500">Mekanisme fleksi-ekstensi siku: Kontraksi bisep, relaksasi trisep, dan peran sendi engsel</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsAutoFlexing(!isAutoFlexing);
              sounds.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              isAutoFlexing
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            {isAutoFlexing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoFlexing ? 'Jeda Gerak Otomatis' : 'Putar Animasi Berulang'}
          </button>

          <button
            onClick={() => {
              setArmAngle(30);
              setIsAutoFlexing(false);
              sounds.playClick();
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Arm Flexion Visualizer */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-[480px]">
          {/* Status Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-200 font-medium">Simulasi Otot Lengan Atas & Bawah</span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">Sudut Siku: {Math.round(armAngle)}°</span>
          </div>

          {/* SVG Anatomical Arm Simulation */}
          <div className="relative w-full aspect-[16/10] flex items-center justify-center my-auto">
            <svg viewBox="0 0 540 360" className="w-full h-full select-none">
              <defs>
                <linearGradient id="bicepsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <linearGradient id="tricepsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
              </defs>

              {/* Background grid */}
              <pattern id="muscleGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="#334155" opacity="0.3" />
              </pattern>
              <rect width="540" height="360" fill="url(#muscleGrid)" />

              {/* Shoulder base bone & joint */}
              <circle cx="140" cy="100" r="22" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="3" />
              <text x="140" y="70" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                Sendi Bahu (Sendi Peluru)
              </text>

              {/* Upper Arm Bone: Humerus (Fixed horizontally from shoulder to elbow) */}
              {/* Elbow is at (300, 100) */}
              <line x1="140" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="18" strokeLinecap="round" />
              <text x="220" y="88" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">
                Tulang Humerus
              </text>

              {/* TRICEPS MUSCLE (Bottom of humerus) */}
              <path
                d={`M 155 110 Q 220 ${110 + tricepsThickness * 1.5} 285 110 Q 220 ${110 + tricepsThickness * 0.5} 155 110`}
                fill={activeMuscle === 'triceps' ? '#fda4af' : 'url(#tricepsGrad)'}
                stroke="#e11d48"
                strokeWidth="2"
                className="cursor-pointer"
                onClick={() => {
                  setActiveMuscle('triceps');
                  sounds.playClick();
                }}
              />
              <text 
                x="220" 
                y={130 + tricepsThickness * 0.9} 
                fill="#fda4af" 
                fontSize="10" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                Otot Trisep ({!isBicepsContracted ? 'KONTRAKSI' : 'RELAKSASI'})
              </text>

              {/* BICEPS MUSCLE (Top of humerus) */}
              <path
                d={`M 155 90 Q 220 ${90 - bicepsThickness * 1.5} 285 90 Q 220 ${90 - bicepsThickness * 0.5} 155 90`}
                fill={activeMuscle === 'biceps' ? '#fda4af' : 'url(#bicepsGrad)'}
                stroke="#e11d48"
                strokeWidth="2"
                className="cursor-pointer"
                onClick={() => {
                  setActiveMuscle('biceps');
                  sounds.playClick();
                }}
              />
              <text 
                x="220" 
                y={70 - bicepsThickness * 0.9} 
                fill="#fecdd3" 
                fontSize="10" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                Otot Bisep ({isBicepsContracted ? 'KONTRAKSI' : 'RELAKSASI'})
              </text>

              {/* Tendons (White connective bands) */}
              <line x1="145" y1="95" x2="165" y2="92" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
              <line x1="275" y1="92" x2="295" y2="96" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

              {/* Elbow Joint (Sendi Engsel) at (300, 100) */}
              <circle 
                cx="300" 
                cy="100" 
                r="16" 
                fill="#0ea5e9" 
                stroke="#0284c7" 
                strokeWidth="3" 
                className="cursor-pointer"
                onClick={() => {
                  setActiveMuscle('joint');
                  sounds.playClick();
                }}
              />
              <text x="300" y="132" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">
                Sendi Engsel
              </text>

              {/* Rotating Forearm (Radius & Ulna + Hand) */}
              {/* Forearm pivots at (300, 100). Angle rotates forearm upwards */}
              {(() => {
                const rad = (armAngle * Math.PI) / 180;
                // Forearm points rightwards and angles upwards (counter-clockwise)
                const armLength = 150;
                const endX = 300 + armLength * Math.cos(rad);
                const endY = 100 + armLength * Math.sin(rad);

                return (
                  <g>
                    {/* Lower arm bone */}
                    <line 
                      x1="300" 
                      y1="100" 
                      x2={endX} 
                      y2={endY} 
                      stroke="#f1f5f9" 
                      strokeWidth="14" 
                      strokeLinecap="round" 
                    />
                    {/* Tendon connecting biceps to radius */}
                    <line 
                      x1="285" 
                      y1="90" 
                      x2={300 + 35 * Math.cos(rad)} 
                      y2={100 + 35 * Math.sin(rad)} 
                      stroke="#ffffff" 
                      strokeWidth="4" 
                    />
                    {/* Hand palm */}
                    <circle cx={endX} cy={endY} r="14" fill="#cbd5e1" />
                    <text x={endX + 10} y={endY + 4} fill="#cbd5e1" fontSize="9" fontWeight="bold">
                      Telapak Tangan
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Interactive Flexion Slider */}
          <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-semibold text-slate-200">Sudut Gerakan Lengan:</span>
            </div>

            <input
              type="range"
              min="0"
              max="130"
              value={armAngle}
              onChange={(e) => {
                setArmAngle(Number(e.target.value));
                setIsAutoFlexing(false);
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />

            <span className="text-xs font-mono font-bold text-rose-300 shrink-0">
              {armAngle < 40 ? 'Lengan Lurus (Ekstensi)' : 'Lengan Menekuk (Fleksi)'}
            </span>
          </div>
        </div>

        {/* Right: Explanation of Antagonist Muscle System */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md">
                Prinsip Fisiologi Otot
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Kerja Otot Antagonis (Berlawanan)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Otot bekerja secara berpasangan karena otot hanya dapat menarik tulang!</p>
            </div>

            {/* Antagonistic state table */}
            <div className="space-y-2.5">
              <div className={`p-3 rounded-2xl border transition-all ${
                isBicepsContracted ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Otot Bisep (Depan Lengan)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isBicepsContracted ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isBicepsContracted ? 'KONTRAKSI (MEMENDEK)' : 'RELAKSASI'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saat menekuk siku, otot bisep memendek, membesar (menggembung), dan menarik tulang lengan bawah ke atas.
                </p>
              </div>

              <div className={`p-3 rounded-2xl border transition-all ${
                !isBicepsContracted ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">Otot Trisep (Belakang Lengan)</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    !isBicepsContracted ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {!isBicepsContracted ? 'KONTRAKSI (MEMENDEK)' : 'RELAKSASI (MEMANJANG)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saat meluruskan lengan kembali, otot trisep berkontraksi menarik tulang hasta ke bawah, sementara otot bisep berelaksasi.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-900 space-y-1">
                <span className="font-bold block flex items-center gap-1.5 text-teal-950">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Mengapa Otot Tidak Bisa Mendorong Tulang?
                </span>
                <p className="text-[11px] leading-relaxed text-teal-800">
                  Serat otot bekerja seperti tali mikroskopis yang hanya dapat memendek menarik beban (kontraksi). Oleh karena itu, tubuh selalu membutuhkan dua otot berlawanan (antagonis) untuk menggerakkan sendi bolak-balik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
