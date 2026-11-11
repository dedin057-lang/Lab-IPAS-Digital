/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass as CompassIcon, 
  RotateCw, 
  RotateCcw, 
  Sparkles, 
  Info, 
  HelpCircle,
  Eye, 
  EyeOff, 
  Package, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { TEST_MATERIALS_DATA } from '../../../data/curriculumData';
import { sounds } from '../../../services/sound';
import { storage } from '../../../services/storage';

interface MagnetState {
  x: number;
  y: number;
  angle: number; // in degrees
}

interface CompassState {
  x: number;
  y: number;
}

export const MagnetLab: React.FC = () => {
  // Magnet 1 (Left Magnet)
  const [magnet1, setMagnet1] = useState<MagnetState>({ x: 260, y: 220, angle: 0 });
  // Magnet 2 (Right Magnet)
  const [magnet2, setMagnet2] = useState<MagnetState>({ x: 540, y: 220, angle: 0 });
  // Free Floating Compass
  const [compass, setCompass] = useState<CompassState>({ x: 400, y: 350 });

  // Material testing
  const [testedMaterials, setTestedMaterials] = useState(TEST_MATERIALS_DATA);
  const [activeMaterialId, setActiveMaterialId] = useState<string | null>(null);
  const [materialFeedback, setMaterialFeedback] = useState<string | null>(null);

  // Field lines toggle
  const [showFieldLines, setShowFieldLines] = useState<boolean>(true);
  const [showFieldArrows, setShowFieldArrows] = useState<boolean>(true);

  // Dragging states
  const [draggingTarget, setDraggingTarget] = useState<'m1' | 'm2' | 'compass' | string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Distance between magnets
  const dx = magnet2.x - magnet1.x;
  const dy = magnet2.y - magnet1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Check poles facing each other:
  // Angle 0: North is Right (+X), South is Left (-X)
  // Angle 180: South is Right (+X), North is Left (-X)
  const m1FacingPole = Math.cos((magnet1.angle * Math.PI) / 180) > 0 ? 'N' : 'S';
  const m2FacingPole = Math.cos((magnet2.angle * Math.PI) / 180) > 0 ? 'S' : 'N';
  const isAttractive = (m1FacingPole === 'N' && m2FacingPole === 'S') || (m1FacingPole === 'S' && m2FacingPole === 'N');
  const isTooClose = dist < 170;

  useEffect(() => {
    storage.markLabCompleted('magnet');
  }, []);

  // Compute magnetic field vector B(x, y) at any point due to both dipole magnets
  const calculateBField = (px: number, py: number) => {
    let Bx = 0;
    let By = 0;

    const addDipoleField = (mag: MagnetState) => {
      const rad = (mag.angle * Math.PI) / 180;
      const poleDist = 55; // distance from center to pole

      // North Pole coordinates
      const nx = mag.x + poleDist * Math.cos(rad);
      const ny = mag.y + poleDist * Math.sin(rad);

      // South Pole coordinates
      const sx = mag.x - poleDist * Math.cos(rad);
      const sy = mag.y - poleDist * Math.sin(rad);

      // Vector from North pole to point P
      const dnx = px - nx;
      const dny = py - ny;
      const distN = Math.hypot(dnx, dny) + 12; // softening

      // Vector from South pole to point P
      const dsx = px - sx;
      const dsy = py - sy;
      const distS = Math.hypot(dsx, dsy) + 12;

      // Field originates from North (repels test north) and converges into South (attracts test north)
      const forceN = 50000 / (distN * distN * distN);
      const forceS = 50000 / (distS * distS * distS);

      Bx += dnx * forceN - dsx * forceS;
      By += dny * forceN - dsy * forceS;
    };

    addDipoleField(magnet1);
    addDipoleField(magnet2);

    return { Bx, By, angleRad: Math.atan2(By, Bx) };
  };

  // Compass needle orientation based on local magnetic field
  const compassField = calculateBField(compass.x, compass.y);
  const compassAngleDeg = (compassField.angleRad * 180) / Math.PI;

  // Generate magnetic field line grid samples for visualization
  const fieldGrid: { x: number; y: number; angle: number; strength: number }[] = [];
  if (showFieldLines) {
    const step = 45;
    for (let x = 60; x <= 740; x += step) {
      for (let y = 60; y <= 420; y += step) {
        // avoid drawing inside the physical magnet body
        const d1 = Math.hypot(x - magnet1.x, y - magnet1.y);
        const d2 = Math.hypot(x - magnet2.x, y - magnet2.y);
        if (d1 > 40 && d2 > 40) {
          const field = calculateBField(x, y);
          const strength = Math.min(Math.hypot(field.Bx, field.By), 1);
          fieldGrid.push({
            x,
            y,
            angle: (field.angleRad * 180) / Math.PI,
            strength
          });
        }
      }
    }
  }

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent, target: 'm1' | 'm2' | 'compass' | string) => {
    e.preventDefault();
    sounds.playClick();
    setDraggingTarget(target);

    const rect = e.currentTarget.parentElement?.getBoundingClientRect() || { left: 0, top: 0 };
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (target === 'm1') {
      dragOffset.current = { x: curX - magnet1.x, y: curY - magnet1.y };
    } else if (target === 'm2') {
      dragOffset.current = { x: curX - magnet2.x, y: curY - magnet2.y };
    } else if (target === 'compass') {
      dragOffset.current = { x: curX - compass.x, y: curY - compass.y };
    } else {
      // test material
      const mat = testedMaterials.find(m => m.id === target);
      if (mat) {
        dragOffset.current = { x: curX - mat.x, y: curY - mat.y };
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    if (draggingTarget === 'm1') {
      const newX = Math.max(90, Math.min(380, curX - dragOffset.current.x));
      const newY = Math.max(80, Math.min(400, curY - dragOffset.current.y));
      setMagnet1(prev => ({ ...prev, x: newX, y: newY }));
    } else if (draggingTarget === 'm2') {
      const newX = Math.max(420, Math.min(710, curX - dragOffset.current.x));
      const newY = Math.max(80, Math.min(400, curY - dragOffset.current.y));
      setMagnet2(prev => ({ ...prev, x: newX, y: newY }));
    } else if (draggingTarget === 'compass') {
      const newX = Math.max(50, Math.min(750, curX - dragOffset.current.x));
      const newY = Math.max(50, Math.min(430, curY - dragOffset.current.y));
      setCompass({ x: newX, y: newY });
    } else {
      // Dragging a test material object
      const matId = draggingTarget;
      const newX = Math.max(40, Math.min(760, curX - dragOffset.current.x));
      const newY = Math.max(40, Math.min(440, curY - dragOffset.current.y));

      setTestedMaterials(prev => prev.map(m => {
        if (m.id === matId) {
          // Check proximity to magnets
          const dM1 = Math.hypot(newX - magnet1.x, newY - magnet1.y);
          const dM2 = Math.hypot(newX - magnet2.x, newY - magnet2.y);
          const nearestDist = Math.min(dM1, dM2);

          if (nearestDist < 90) {
            if (m.type === 'feromagnetik') {
              setMaterialFeedback(`✓ ${m.name} adalah bahan feromagnetik! Ditarik sangat kuat dan menempel erat pada kutub magnet.`);
              sounds.playSnap();
            } else if (m.type === 'paramagnetik') {
              setMaterialFeedback(`ℹ️ ${m.name} adalah bahan paramagnetik. Tarikan gaya magnet sangat lemah hingga hampir tidak menempel.`);
            } else {
              setMaterialFeedback(`✕ ${m.name} adalah bahan diamagnetik/non-magnetik. Sama sekali tidak ditarik oleh magnet.`);
            }
          }

          return { ...m, x: newX, y: newY };
        }
        return m;
      }));
    }
  };

  const handlePointerUp = () => {
    setDraggingTarget(null);
  };

  const rotateMagnet = (magnetNum: 1 | 2, deltaDeg: number) => {
    sounds.playClick();
    if (magnetNum === 1) {
      setMagnet1(prev => ({ ...prev, angle: (prev.angle + deltaDeg + 360) % 360 }));
    } else {
      setMagnet2(prev => ({ ...prev, angle: (prev.angle + deltaDeg + 360) % 360 }));
    }
  };

  const resetPositions = () => {
    sounds.playClick();
    setMagnet1({ x: 260, y: 220, angle: 0 });
    setMagnet2({ x: 540, y: 220, angle: 0 });
    setCompass({ x: 400, y: 350 });
    setTestedMaterials(TEST_MATERIALS_DATA);
    setMaterialFeedback(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <CompassIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Laboratorium Magnet & Garis Gaya</h2>
            <p className="text-xs text-slate-500">Geser & putar magnet batang, amati interaksi kutub, kompas, dan uji sifat bahan</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFieldLines(!showFieldLines)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              showFieldLines 
                ? 'bg-teal-50 text-teal-700 border-teal-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {showFieldLines ? <Eye className="w-3.5 h-3.5 text-teal-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            Garis Gaya Magnet: {showFieldLines ? 'Aktif' : 'Nonaktif'}
          </button>

          <button
            onClick={resetPositions}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Posisi
          </button>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Magnet Canvas Area */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-md border border-slate-800 relative overflow-hidden flex flex-col">
          {/* Canvas Sub-header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <span className="text-slate-200 font-medium">Area Interaksi Kutub & Kompas</span>
              <span className="text-slate-500">· Sentuh & geser objek</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500"></span>
                <span>Utara (U / N)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-500"></span>
                <span>Selatan (S)</span>
              </div>
            </div>
          </div>

          {/* SVG Magnet Interactive Simulation Surface */}
          <div 
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] flex items-center justify-center my-auto cursor-crosshair select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <svg viewBox="0 0 800 480" className="w-full h-full">
              {/* Field Grid Arrows Vector Field */}
              {showFieldLines && fieldGrid.map((p, idx) => (
                <g key={idx} transform={`translate(${p.x}, ${p.y}) rotate(${p.angle})`}>
                  {/* Subtle directional needle arrow */}
                  <line 
                    x1="-10" 
                    y1="0" 
                    x2="10" 
                    y2="0" 
                    stroke="#0284c7" 
                    strokeWidth="1.2" 
                    strokeOpacity={0.35 + p.strength * 0.45} 
                  />
                  <polygon 
                    points="10,0 6,-3 6,3" 
                    fill="#38bdf8" 
                    fillOpacity={0.4 + p.strength * 0.5} 
                  />
                </g>
              ))}

              {/* Force Interaction Waves between the two magnets if close */}
              {isTooClose && (
                <g transform={`translate(${(magnet1.x + magnet2.x) / 2}, ${(magnet1.y + magnet2.y) / 2})`}>
                  {isAttractive ? (
                    // Attraction springs / glow
                    <>
                      <line x1="-35" y1="0" x2="35" y2="0" stroke="#10b981" strokeWidth="4" strokeDasharray="4 4" />
                      <circle cx="0" cy="0" r="16" fill="#10b981" fillOpacity="0.2" />
                      <text x="0" y="24" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
                        TARIK-MENARIK (Kutub Berlawanan)
                      </text>
                    </>
                  ) : (
                    // Repulsion waves
                    <>
                      <line x1="-25" y1="-20" x2="-25" y2="20" stroke="#f43f5e" strokeWidth="3" />
                      <line x1="25" y1="-20" x2="25" y2="20" stroke="#f43f5e" strokeWidth="3" />
                      <path d="M -15 -12 Q 0 0 -15 12" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                      <path d="M 15 -12 Q 0 0 15 12" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                      <text x="0" y="28" fill="#fb7185" fontSize="11" fontWeight="bold" textAnchor="middle">
                        TOLAK-MENOLAK (Kutub Senama)
                      </text>
                    </>
                  )}
                </g>
              )}

              {/* MAGNET 1 (Left Magnet) */}
              <g 
                transform={`translate(${magnet1.x}, ${magnet1.y}) rotate(${magnet1.angle})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown(e, 'm1')}
              >
                {/* Glow ring on hover */}
                <rect x="-65" y="-25" width="130" height="50" rx="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
                
                {/* South Half (Blue) */}
                <path d="M -60 -20 L 0 -20 L 0 20 L -60 20 Z" fill="#2563eb" rx="4" />
                <rect x="-60" y="-20" width="60" height="40" rx="4" fill="#2563eb" />
                <text x="-30" y="6" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">S</text>

                {/* North Half (Red) */}
                <rect x="0" y="-20" width="60" height="40" rx="4" fill="#dc2626" />
                <text x="30" y="6" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">U</text>

                {/* Metallic divider band */}
                <line x1="0" y1="-20" x2="0" y2="20" stroke="#94a3b8" strokeWidth="2" />
                <text x="0" y="-28" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">MAGNET BATANG 1</text>
              </g>

              {/* MAGNET 2 (Right Magnet) */}
              <g 
                transform={`translate(${magnet2.x}, ${magnet2.y}) rotate(${magnet2.angle})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown(e, 'm2')}
              >
                <rect x="-65" y="-25" width="130" height="50" rx="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
                
                {/* South Half (Blue) */}
                <rect x="-60" y="-20" width="60" height="40" rx="4" fill="#2563eb" />
                <text x="-30" y="6" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">S</text>

                {/* North Half (Red) */}
                <rect x="0" y="-20" width="60" height="40" rx="4" fill="#dc2626" />
                <text x="30" y="6" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">U</text>

                <line x1="0" y1="-20" x2="0" y2="20" stroke="#94a3b8" strokeWidth="2" />
                <text x="0" y="-28" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">MAGNET BATANG 2</text>
              </g>

              {/* INTERACTIVE COMPASS */}
              <g 
                transform={`translate(${compass.x}, ${compass.y})`}
                className="cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => handlePointerDown(e, 'compass')}
              >
                {/* Brass Casing */}
                <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#d97706" strokeWidth="3" />
                <circle cx="0" cy="0" r="28" fill="#1e293b" />
                
                {/* Dial marks */}
                <circle cx="0" cy="0" r="25" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 6" />
                <text x="0" y="-17" fill="#f87171" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
                <text x="0" y="24" fill="#60a5fa" fontSize="8" fontWeight="bold" textAnchor="middle">S</text>
                <text x="21" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">E</text>
                <text x="-21" y="3" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">W</text>

                {/* Rotating Magnetic Needle aligned with B field */}
                <g transform={`rotate(${compassAngleDeg})`}>
                  {/* North pointer (red) */}
                  <polygon points="0,0 3,-3 0,-22 -3,-3" fill="#ef4444" />
                  {/* South pointer (blue/silver) */}
                  <polygon points="0,0 3,3 0,22 -3,3" fill="#94a3b8" />
                  {/* Center brass pivot pin */}
                  <circle cx="0" cy="0" r="3" fill="#fbbf24" />
                </g>
                <text x="0" y="42" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">Kompas Penunjuk</text>
              </g>

              {/* TEST MATERIALS ON THE BENCH */}
              {testedMaterials.map((mat) => (
                <g 
                  key={mat.id}
                  transform={`translate(${mat.x}, ${mat.y})`}
                  className="cursor-grab active:cursor-grabbing group"
                  onPointerDown={(e) => handlePointerDown(e, mat.id)}
                >
                  <circle cx="0" cy="0" r="18" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  {/* Object representation */}
                  {mat.id === 'paku_besi' && (
                    <line x1="-10" y1="-10" x2="10" y2="10" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                  )}
                  {mat.id === 'klip_baja' && (
                    <rect x="-8" y="-10" width="16" height="20" rx="6" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
                  )}
                  {mat.id === 'kaleng_aluminium' && (
                    <rect x="-7" y="-9" width="14" height="18" rx="2" fill="#64748b" />
                  )}
                  {mat.id === 'balok_kayu' && (
                    <rect x="-8" y="-8" width="16" height="16" rx="2" fill="#b45309" />
                  )}
                  {mat.id === 'penggaris_plastik' && (
                    <rect x="-12" y="-5" width="24" height="10" rx="1" fill="#06b6d4" opacity="0.8" />
                  )}

                  <text x="0" y="27" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">
                    {mat.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Bottom Controls inside Canvas Card */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Magnet 1 Rotation */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Putar Magnet 1:</span>
              <button 
                onClick={() => rotateMagnet(1, -45)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Putar kiri 45°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => rotateMagnet(1, 45)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Putar kanan 45°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-500 font-mono text-[11px]">{magnet1.angle}°</span>
            </div>

            {/* Magnet 2 Rotation */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Putar Magnet 2:</span>
              <button 
                onClick={() => rotateMagnet(2, -45)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Putar kiri 45°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => rotateMagnet(2, 45)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Putar kanan 45°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-500 font-mono text-[11px]">{magnet2.angle}°</span>
            </div>

            {/* Field Status */}
            <div className="text-emerald-400 font-medium text-[11px]">
              {isAttractive ? '✓ Kutub berlawanan saling menarik' : '✓ Kutub senama saling menolak'}
            </div>
          </div>
        </div>

        {/* Right Panel: Material Testing Laboratory */}
        <div className="space-y-4">
          {/* Material Test Bench */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-teal-600" />
              Meja Uji Sifat Kemagnetan Benda
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tarik salah satu benda di area meja praktik mendekati magnet batang untuk melihat reaksi tarikannya!
            </p>

            {/* Material List with scientific labels */}
            <div className="space-y-2">
              {testedMaterials.map((mat) => {
                const badgeColor = {
                  feromagnetik: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                  paramagnetik: 'text-amber-700 bg-amber-50 border-amber-200',
                  diamagnetik: 'text-slate-700 bg-slate-100 border-slate-200'
                }[mat.type];

                return (
                  <div 
                    key={mat.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{mat.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                        {mat.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{mat.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Material Feedback notification */}
            {materialFeedback && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 leading-relaxed animate-in fade-in">
                {materialFeedback}
              </div>
            )}
          </div>

          {/* Quick Scientific Note */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-600" />
              Garis Medan & Jarum Kompas
            </h4>
            <p className="text-[11px] leading-relaxed">
              Jarum merah kompas menunjuk arah garis medan magnet. Garis gaya selalu keluar dari kutub <strong>Utara (Merah)</strong> dan berputar masuk menuju kutub <strong>Selatan (Biru)</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
