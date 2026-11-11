/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Lightbulb, 
  SlidersHorizontal, 
  Flame, 
  Plus, 
  Trash2, 
  Gauge, 
  HelpCircle,
  Move
} from 'lucide-react';
import { PlacedComponent, Wire, ComponentType, VoltmeterProbe } from './types';
import { analyzeCircuit, getComponentTerminals } from './circuitSolver';
import { CircuitComponent } from './CircuitComponent';
import { CircuitWires } from './CircuitWires';
import { sounds } from '../../../services/sound';
import { storage } from '../../../services/storage';

export type CircuitMode = 'bebas' | 'seri' | 'paralel' | 'tantangan';

export const CircuitLab: React.FC = () => {
  const [mode, setMode] = useState<CircuitMode>('bebas');
  const [components, setComponents] = useState<PlacedComponent[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedTerminalId, setSelectedTerminalId] = useState<string | null>(null);
  const [activeWireColor, setActiveWireColor] = useState<'red' | 'black' | 'blue' | 'yellow'>('red');
  
  // Dragging components on canvas
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // In-progress wire drawing
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Voltmeter tool
  const [showVoltmeter, setShowVoltmeter] = useState<boolean>(false);
  const [redProbe, setRedProbe] = useState<{ x: number; y: number; terminalId: string | null }>({ x: 140, y: 390, terminalId: null });
  const [blackProbe, setBlackProbe] = useState<{ x: number; y: number; terminalId: string | null }>({ x: 280, y: 390, terminalId: null });
  const [draggingProbe, setDraggingProbe] = useState<'red' | 'black' | null>(null);

  // Challenges
  const [challengeStep, setChallengeStep] = useState<number>(1);
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Default initial placement for each mode
  useEffect(() => {
    loadModePreset(mode);
  }, [mode]);

  const loadModePreset = (targetMode: CircuitMode) => {
    setSelectedTerminalId(null);
    setSelectedComponentId(null);
    setChallengeCompleted(false);

    if (targetMode === 'seri') {
      // 1 Battery, 1 Switch, 2 Bulbs arranged in series
      const initialComps: PlacedComponent[] = [
        { id: 'bat1', type: 'battery', x: 210, y: 360, rotation: 0, name: 'Baterai 3.0V', voltage: 3.0 },
        { id: 'sw1', type: 'switch', x: 210, y: 120, rotation: 0, name: 'Saklar Utama', isOpen: false },
        { id: 'bulb1', type: 'bulb', x: 440, y: 120, rotation: 0, name: 'Lampu 1', isBroken: false },
        { id: 'bulb2', type: 'bulb', x: 620, y: 220, rotation: 0, name: 'Lampu 2', isBroken: false },
      ];
      const initialWires: Wire[] = [
        { id: 'w1', fromTerminalId: 'bat1_pos', toTerminalId: 'sw1_in', color: 'red' },
        { id: 'w2', fromTerminalId: 'sw1_out', toTerminalId: 'bulb1_t1', color: 'red' },
        { id: 'w3', fromTerminalId: 'bulb1_t2', toTerminalId: 'bulb2_t1', color: 'yellow' },
        { id: 'w4', fromTerminalId: 'bulb2_t2', toTerminalId: 'bat1_neg', color: 'black' },
      ];
      setComponents(initialComps);
      setWires(initialWires);
    } else if (targetMode === 'paralel') {
      // 1 Battery, 1 Main Switch, 2 Bulbs in parallel branches
      const initialComps: PlacedComponent[] = [
        { id: 'bat1', type: 'battery', x: 190, y: 240, rotation: 0, name: 'Baterai 3.0V', voltage: 3.0 },
        { id: 'sw1', type: 'switch', x: 350, y: 110, rotation: 0, name: 'Saklar', isOpen: false },
        { id: 'bulb1', type: 'bulb', x: 540, y: 120, rotation: 0, name: 'Lampu Cabang 1', isBroken: false },
        { id: 'bulb2', type: 'bulb', x: 540, y: 320, rotation: 0, name: 'Lampu Cabang 2', isBroken: false },
      ];
      const initialWires: Wire[] = [
        { id: 'w1', fromTerminalId: 'bat1_pos', toTerminalId: 'sw1_in', color: 'red' },
        { id: 'w2', fromTerminalId: 'sw1_out', toTerminalId: 'bulb1_t1', color: 'red' },
        { id: 'w3', fromTerminalId: 'sw1_out', toTerminalId: 'bulb2_t1', color: 'red' },
        { id: 'w4', fromTerminalId: 'bulb1_t2', toTerminalId: 'bat1_neg', color: 'black' },
        { id: 'w5', fromTerminalId: 'bulb2_t2', toTerminalId: 'bat1_neg', color: 'black' },
      ];
      setComponents(initialComps);
      setWires(initialWires);
    } else if (targetMode === 'tantangan') {
      // Clean workbench for student to build from scratch
      setComponents([
        { id: 'bat1', type: 'battery', x: 200, y: 350, rotation: 0, name: 'Baterai 3.0V', voltage: 3.0 },
        { id: 'sw1', type: 'switch', x: 260, y: 120, rotation: 0, name: 'Saklar', isOpen: true },
        { id: 'bulb1', type: 'bulb', x: 520, y: 150, rotation: 0, name: 'Lampu 1', isBroken: false },
        { id: 'bulb2', type: 'bulb', x: 520, y: 320, rotation: 0, name: 'Lampu 2', isBroken: false },
      ]);
      setWires([]);
    } else {
      // Mode Bebas default layout
      setComponents([
        { id: 'bat1', type: 'battery', x: 190, y: 340, rotation: 0, name: 'Baterai 3.0V', voltage: 3.0 },
        { id: 'sw1', type: 'switch', x: 260, y: 120, rotation: 0, name: 'Saklar SPST', isOpen: false },
        { id: 'bulb1', type: 'bulb', x: 500, y: 150, rotation: 0, name: 'Lampu Bohlam 1', isBroken: false },
        { id: 'bulb2', type: 'bulb', x: 500, y: 310, rotation: 0, name: 'Lampu Bohlam 2', isBroken: false },
      ]);
      setWires([]);
    }
  };

  // Build terminal position map
  const terminalsMap = new Map<string, { id: string; x: number; y: number }>();
  components.forEach(comp => {
    const list = getComponentTerminals(comp);
    list.forEach(t => terminalsMap.set(t.id, { id: t.id, x: t.x, y: t.y }));
  });

  // Circuit analysis
  const circuitState = analyzeCircuit(components, wires);

  // Play sound & notify on state changes
  useEffect(() => {
    if (circuitState.isClosedCircuit) {
      sounds.playSuccess();
      storage.markLabCompleted('kelistrikan');

      if (mode === 'tantangan') {
        if (challengeStep === 1 && circuitState.litBulbIds.length === 1) {
          setChallengeCompleted(true);
        } else if (challengeStep === 2 && circuitState.isSeries && circuitState.litBulbIds.length >= 2) {
          setChallengeCompleted(true);
        } else if (challengeStep === 3 && circuitState.isParallel && circuitState.litBulbIds.length >= 2) {
          setChallengeCompleted(true);
        }
      }
    } else if (circuitState.isShortCircuit) {
      sounds.playShortCircuit();
    }
  }, [circuitState.isClosedCircuit, circuitState.isShortCircuit, circuitState.isSeries, circuitState.isParallel]);

  // Pointer dragging handler for components & probes
  const getCanvasCoords = (e: React.PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 480 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDownComponent = (e: React.PointerEvent, compId: string) => {
    e.stopPropagation();
    sounds.playClick();
    setSelectedComponentId(compId);
    setDraggingCompId(compId);

    const coords = getCanvasCoords(e);
    const comp = components.find(c => c.id === compId);
    if (comp) {
      dragOffsetRef.current = {
        x: coords.x - comp.x,
        y: coords.y - comp.y
      };
    }
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    const coords = getCanvasCoords(e);
    setMousePos(coords);

    if (draggingCompId) {
      const newX = Math.max(60, Math.min(740, coords.x - dragOffsetRef.current.x));
      const newY = Math.max(50, Math.min(430, coords.y - dragOffsetRef.current.y));

      setComponents(prev => prev.map(c => c.id === draggingCompId ? { ...c, x: newX, y: newY } : c));
    } else if (draggingProbe) {
      if (draggingProbe === 'red') {
        setRedProbe(prev => ({ ...prev, x: coords.x, y: coords.y }));
      } else {
        setBlackProbe(prev => ({ ...prev, x: coords.x, y: coords.y }));
      }
    }
  };

  const handleCanvasPointerUp = () => {
    setDraggingCompId(null);
    setDraggingProbe(null);
  };

  // Terminal connection logic
  const handleTerminalClick = (terminalId: string) => {
    sounds.playClick();
    if (!selectedTerminalId) {
      setSelectedTerminalId(terminalId);
    } else {
      if (selectedTerminalId === terminalId) {
        setSelectedTerminalId(null);
        return;
      }

      // Check if wire already exists between these terminals
      const exists = wires.some(
        w => (w.fromTerminalId === selectedTerminalId && w.toTerminalId === terminalId) ||
             (w.fromTerminalId === terminalId && w.toTerminalId === selectedTerminalId)
      );

      if (!exists) {
        const newWire: Wire = {
          id: `wire_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          fromTerminalId: selectedTerminalId,
          toTerminalId: terminalId,
          color: activeWireColor
        };
        setWires(prev => [...prev, newWire]);
      }
      setSelectedTerminalId(null);
    }
  };

  const handleRemoveWire = (wireId: string) => {
    sounds.playClick();
    setWires(prev => prev.filter(w => w.id !== wireId));
  };

  const handleToggleSwitch = (compId: string) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return;
    const nextState = !comp.isOpen;
    sounds.playSwitch(nextState);
    setComponents(prev => prev.map(c => c.id === compId ? { ...c, isOpen: nextState } : c));
  };

  const handleToggleBulbFilament = (compId: string) => {
    sounds.playClick();
    setComponents(prev => prev.map(c => c.id === compId ? { ...c, isBroken: !c.isBroken } : c));
  };

  const handleAddComponent = (type: ComponentType) => {
    sounds.playClick();
    const id = `${type}_${Date.now()}`;
    const newComp: PlacedComponent = {
      id,
      type,
      x: 350 + Math.random() * 80,
      y: 200 + Math.random() * 60,
      rotation: 0,
      name: type === 'battery' ? 'Baterai 3.0V' : type === 'switch' ? 'Saklar' : type === 'bulb' ? `Lampu ${components.filter(c => c.type === 'bulb').length + 1}` : 'Resistor',
      voltage: type === 'battery' ? 3.0 : undefined,
      isOpen: type === 'switch' ? false : undefined,
      isBroken: type === 'bulb' ? false : undefined,
    };
    setComponents(prev => [...prev, newComp]);
  };

  const handleDeleteComponent = (compId: string) => {
    sounds.playClick();
    setComponents(prev => prev.filter(c => c.id !== compId));
    setWires(prev => prev.filter(w => !w.fromTerminalId.startsWith(compId) && !w.toTerminalId.startsWith(compId)));
    if (selectedComponentId === compId) setSelectedComponentId(null);
  };

  const handleClearWires = () => {
    sounds.playClick();
    setWires([]);
    setSelectedTerminalId(null);
  };

  const handleResetWorkbench = () => {
    sounds.playClick();
    loadModePreset(mode);
  };

  const nextChallengeStep = () => {
    sounds.playClick();
    if (challengeStep < 3) {
      setChallengeStep(prev => prev + 1);
      setWires([]);
      setChallengeCompleted(false);
    }
  };

  // Challenges information
  const challenges = [
    {
      step: 1,
      title: 'Tantangan 1: Rangkaian Tertutup 1 Lampu',
      instruction: 'Hubungkan kabel dari Baterai (+) ke Saklar, dari Saklar ke Lampu 1, dan dari Lampu 1 kembali ke Baterai (-). Tutup saklar agar lampu menyala!',
      hint: 'Arus listrik memerlukan jalur melingkar utuh tanpa terputus.'
    },
    {
      step: 2,
      title: 'Tantangan 2: Rangkaian 2 Lampu Seri',
      instruction: 'Susun kedua lampu berurutan dalam satu lintasan tunggal (seri). Amati nyala lampu yang meredup karena tegangan terbagi dua!',
      hint: 'Jalur: Baterai (+) -> Saklar -> Lampu 1 -> Lampu 2 -> Baterai (-).'
    },
    {
      step: 3,
      title: 'Tantangan 3: Rangkaian 2 Lampu Paralel',
      instruction: 'Susun kedua lampu secara bercabang (paralel). Buktikan bahwa kedua lampu menyala sama terang benderang dengan tegangan penuh!',
      hint: 'Masing-masing lampu memiliki sambungan langsung ke kutub positif dan negatif baterai.'
    }
  ];

  // Voltmeter voltage calculation: probe terminals
  const getVoltmeterReading = (): number => {
    // Check if red probe and black probe are near terminals
    let nearRedT: string | null = null;
    let nearBlackT: string | null = null;

    for (const [tId, pt] of terminalsMap.entries()) {
      if (Math.hypot(pt.x - redProbe.x, pt.y - redProbe.y) < 26) {
        nearRedT = tId;
      }
      if (Math.hypot(pt.x - blackProbe.x, pt.y - blackProbe.y) < 26) {
        nearBlackT = tId;
      }
    }

    if (!nearRedT || !nearBlackT) return 0.0;
    const redId: string = nearRedT;
    const blackId: string = nearBlackT;

    if (redId === blackId) return 0.0;

    // If probing across battery directly
    if (
      (redId.includes('_pos') && blackId.includes('_neg')) ||
      (redId.includes('_neg') && blackId.includes('_pos'))
    ) {
      return 3.0;
    }

    // If probing across a lit bulb
    for (const bulbId of circuitState.litBulbIds) {
      const bT1 = `${bulbId}_t1`;
      const bT2 = `${bulbId}_t2`;
      if (
        (redId === bT1 && blackId === bT2) ||
        (redId === bT2 && blackId === bT1)
      ) {
        return circuitState.voltages[bulbId] || 3.0;
      }
    }

    return circuitState.isClosedCircuit ? 1.5 : 0.0;
  };

  const measuredVoltage = getVoltmeterReading();

  return (
    <div className="space-y-6 select-none">
      {/* Top Header & Lab Mode Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Laboratorium Rangkaian Listrik</h2>
            <p className="text-xs text-slate-500">Meja Praktik Virtual: Geser komponen, pasang kabel antar terminal, dan uji sirkuit</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setMode('bebas');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'bebas' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mode Bebas
          </button>
          <button
            onClick={() => {
              setMode('seri');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'seri' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rangkaian Seri
          </button>
          <button
            onClick={() => {
              setMode('paralel');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'paralel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rangkaian Paralel
          </button>
          <button
            onClick={() => {
              setMode('tantangan');
              sounds.playClick();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'tantangan' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tantangan Kuis
          </button>
        </div>
      </div>

      {/* Challenge Alert if in challenge mode */}
      {mode === 'tantangan' && (
        <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                Tantangan {challengeStep} dari 3
              </span>
              <h4 className="text-sm font-bold text-amber-950">{challenges[challengeStep - 1].title}</h4>
            </div>
            <p className="text-xs text-amber-900 mt-1">{challenges[challengeStep - 1].instruction}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {challengeCompleted ? (
              <button
                onClick={nextChallengeStep}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                {challengeStep < 3 ? 'Lanjut Tantangan Berikutnya' : 'Selamat! Semua Selesai'}
              </button>
            ) : (
              <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {challenges[challengeStep - 1].hint}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Component Toolbox Drawer */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-teal-600" />
                Kotak Komponen (Toolbox)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Klik untuk menambahkan ke meja praktik</p>
            </div>

            {/* Component Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
              <button
                onClick={() => handleAddComponent('battery')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left text-xs font-semibold text-slate-800"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  🔋
                </div>
                <div>
                  <span className="block text-slate-900">Baterai 3.0V</span>
                  <span className="text-[10px] text-slate-400 font-normal">Sumber Energi (+) (-)</span>
                </div>
              </button>

              <button
                onClick={() => handleAddComponent('bulb')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left text-xs font-semibold text-slate-800"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                  💡
                </div>
                <div>
                  <span className="block text-slate-900">Lampu Bohlam</span>
                  <span className="text-[10px] text-slate-400 font-normal">Beban Listrik 6V</span>
                </div>
              </button>

              <button
                onClick={() => handleAddComponent('switch')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left text-xs font-semibold text-slate-800"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  🔌
                </div>
                <div>
                  <span className="block text-slate-900">Saklar SPST</span>
                  <span className="text-[10px] text-slate-400 font-normal">Pemutus/Penyambung</span>
                </div>
              </button>

              <button
                onClick={() => handleAddComponent('resistor')}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-all text-left text-xs font-semibold text-slate-800"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <span className="block text-slate-900">Resistor 100Ω</span>
                  <span className="text-[10px] text-slate-400 font-normal">Hambatan Listrik</span>
                </div>
              </button>
            </div>

            {/* Wire Color Chooser */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">Warna Kabel Pasang:</span>
              <div className="flex items-center gap-2">
                {[
                  { color: 'red', label: 'Merah (+)', bg: 'bg-red-500' },
                  { color: 'black', label: 'Hitam (-)', bg: 'bg-slate-900' },
                  { color: 'blue', label: 'Biru', bg: 'bg-sky-500' },
                  { color: 'yellow', label: 'Kuning', bg: 'bg-amber-400' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => {
                      setActiveWireColor(c.color as any);
                      sounds.playClick();
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      activeWireColor === c.color
                        ? 'border-slate-800 bg-slate-100 ring-2 ring-teal-500'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${c.bg}`}></span>
                    <span className="text-slate-700">{c.color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voltmeter / Multimeter Toggle */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowVoltmeter(!showVoltmeter);
                  sounds.playClick();
                }}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                  showVoltmeter
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Gauge className="w-3.5 h-3.5 text-teal-600" />
                <span>{showVoltmeter ? 'Sembunyikan Voltmeter' : 'Alat Ukur Voltmeter'}</span>
              </button>
            </div>
          </div>

          {/* Quick Instructions Card */}
          <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-2xl text-[11px] text-teal-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-teal-950">
              <Move className="w-3.5 h-3.5 text-teal-600" />
              Cara Mengoperasikan:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-teal-800">
              <li>Geser komponen ke posisi mana pun di meja.</li>
              <li>Klik terminal awal lalu terminal tujuan untuk pasang kabel.</li>
              <li>Klik kabel untuk melepasnya.</li>
              <li>Klik tuas saklar untuk ON/OFF.</li>
            </ul>
          </div>
        </div>

        {/* Center / Right: Interactive Circuit SVG Canvas (Virtual Workbench) */}
        <div className="lg:col-span-9 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-md border border-slate-800 flex flex-col justify-between min-h-[500px]">
          {/* Top Bar inside Workbench */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <span className="text-slate-200 font-semibold">Meja Praktik Rangkaian Listrik Virtual</span>
              <span className="text-slate-500 hidden sm:inline">· Komponen dapat digeser bebas</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClearWires}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="Lepas semua kabel penghubung"
              >
                Lepas Semua Kabel
              </button>
              <button
                onClick={handleResetWorkbench}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="Kembalikan susunan meja praktik ke awal"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Meja
              </button>
            </div>
          </div>

          {/* SVG Canvas for Draggable Components, Terminals, and Wires */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] flex items-center justify-center my-auto">
            <svg
              ref={svgRef}
              viewBox="0 0 800 480"
              className="w-full h-full select-none"
              onPointerMove={handleCanvasPointerMove}
              onPointerUp={handleCanvasPointerUp}
              style={{ touchAction: 'none' }}
            >
              <defs>
                <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="16" result="blur1" />
                  <feGaussianBlur stdDeviation="32" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="bulbRadialGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#facc15" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                </radialGradient>
                {/* Workbench dot grid */}
                <pattern id="workbenchGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="1.2" fill="#334155" opacity="0.6" />
                </pattern>
              </defs>

              <rect width="800" height="480" fill="url(#workbenchGrid)" />

              {/* RENDER WIRES */}
              <CircuitWires
                wires={wires}
                terminalsMap={terminalsMap}
                isCurrentFlowing={circuitState.isClosedCircuit}
                isSeries={circuitState.isSeries}
                onRemoveWire={handleRemoveWire}
                inProgressWire={
                  selectedTerminalId && terminalsMap.has(selectedTerminalId)
                    ? {
                        fromX: terminalsMap.get(selectedTerminalId)!.x,
                        fromY: terminalsMap.get(selectedTerminalId)!.y,
                        toX: mousePos.x,
                        toY: mousePos.y,
                        color: activeWireColor === 'red' ? '#ef4444' : activeWireColor === 'black' ? '#1e293b' : activeWireColor === 'blue' ? '#38bdf8' : '#facc15'
                      }
                    : null
                }
              />

              {/* RENDER DRAGGABLE PLACED COMPONENTS */}
              {components.map((comp) => {
                const isLit = circuitState.litBulbIds.includes(comp.id);
                const voltage = circuitState.voltages[comp.id];
                const brightness = circuitState.isSeries ? 0.45 : 1.0;

                return (
                  <CircuitComponent
                    key={comp.id}
                    component={comp}
                    isLit={isLit}
                    brightness={brightness}
                    voltage={voltage}
                    isSelected={selectedComponentId === comp.id}
                    selectedTerminalId={selectedTerminalId}
                    onPointerDown={handlePointerDownComponent}
                    onTerminalClick={handleTerminalClick}
                    onToggleSwitch={handleToggleSwitch}
                    onToggleBulbFilament={handleToggleBulbFilament}
                    onDeleteComponent={handleDeleteComponent}
                  />
                );
              })}

              {/* RENDER VOLTMETER PROBES IF TOOL ACTIVE */}
              {showVoltmeter && (
                <g>
                  {/* Voltmeter Device Display Box */}
                  <g transform="translate(640, 40)">
                    <rect x="0" y="0" width="130" height="65" rx="8" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
                    <rect x="10" y="10" width="110" height="30" rx="4" fill="#0f172a" />
                    <text x="65" y="32" fill="#38bdf8" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      {measuredVoltage.toFixed(1)} V
                    </text>
                    <text x="65" y="55" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
                      VOLTMETER DIGITAL
                    </text>
                  </g>

                  {/* Wire leads to probes */}
                  <path d={`M 670 105 Q 670 200 ${redProbe.x} ${redProbe.y}`} fill="none" stroke="#ef4444" strokeWidth="2.5" />
                  <path d={`M 730 105 Q 730 200 ${blackProbe.x} ${blackProbe.y}`} fill="none" stroke="#1e293b" strokeWidth="2.5" />

                  {/* Red Probe Pin */}
                  <g
                    transform={`translate(${redProbe.x}, ${redProbe.y})`}
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setDraggingProbe('red');
                    }}
                  >
                    <polygon points="0,0 -4,-18 4,-18" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    <rect x="-3" y="-35" width="6" height="17" fill="#ef4444" rx="2" />
                    <text x="0" y="-40" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">Probe (+)</text>
                  </g>

                  {/* Black Probe Pin */}
                  <g
                    transform={`translate(${blackProbe.x}, ${blackProbe.y})`}
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setDraggingProbe('black');
                    }}
                  >
                    <polygon points="0,0 -4,-18 4,-18" fill="#334155" stroke="#ffffff" strokeWidth="1" />
                    <rect x="-3" y="-35" width="6" height="17" fill="#1e293b" rx="2" />
                    <text x="0" y="-40" fill="#cbd5e1" fontSize="8" fontWeight="bold" textAnchor="middle">Probe (-)</text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Live Diagnostic Bar */}
          <div className={`mt-3 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border ${
            circuitState.statusType === 'success'
              ? 'bg-emerald-950/70 border-emerald-700/50 text-emerald-200'
              : circuitState.statusType === 'error'
              ? 'bg-rose-950/70 border-rose-700/50 text-rose-200'
              : circuitState.statusType === 'warning'
              ? 'bg-amber-950/70 border-amber-700/50 text-amber-200'
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              {circuitState.statusType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {circuitState.statusType === 'error' && <Flame className="w-4 h-4 text-rose-400 shrink-0" />}
              {circuitState.statusType === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {circuitState.statusType === 'info' && <Info className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className="font-medium leading-relaxed">{circuitState.statusMessage}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-300">
              <span>Lampu Menyala: <strong className="text-emerald-400 font-bold">{circuitState.litBulbIds.length}</strong></span>
              <span>Kabel: <strong className="text-slate-200 font-bold">{wires.length}</strong></span>
              {circuitState.isSeries && <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">Rangkaian Seri</span>}
              {circuitState.isParallel && <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">Rangkaian Paralel</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
