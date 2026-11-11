/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bone, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  Box, 
  Layers, 
  Flame 
} from 'lucide-react';
import * as THREE from 'three';
import { SKELETON_PARTS } from '../../../data/curriculumData';
import { AnatomyPart } from '../../../types/ipas';
import { sounds } from '../../../services/sound';
import { storage } from '../../../services/storage';

export const SkeletonLab: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<AnatomyPart>(SKELETON_PARTS[0]);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [targetQuizBone, setTargetQuizBone] = useState<AnatomyPart | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // 3D Three.js container
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    storage.markLabCompleted('kerangka');
  }, []);

  // Start new quiz round
  const startQuiz = () => {
    sounds.playClick();
    setIsQuizMode(true);
    setQuizScore(0);
    pickNextQuizBone();
  };

  const pickNextQuizBone = () => {
    const randomIndex = Math.floor(Math.random() * SKELETON_PARTS.length);
    setTargetQuizBone(SKELETON_PARTS[randomIndex]);
    setQuizFeedback(null);
  };

  const handleBoneClick = (part: AnatomyPart) => {
    sounds.playClick();
    setSelectedPart(part);

    if (isQuizMode && targetQuizBone) {
      if (part.id === targetQuizBone.id) {
        sounds.playSuccess();
        setQuizScore(prev => prev + 10);
        setQuizFeedback(`✓ Hebat! Kamu berhasil menemukan ${part.name} (${part.latinName}).`);
        setTimeout(() => {
          pickNextQuizBone();
        }, 1400);
      } else {
        setQuizFeedback(`Bukan, itu adalah ${part.name}. Coba cari ${targetQuizBone.name}!`);
      }
    }
  };

  // Initialize Three.js 3D Mannequin Skeleton when in 3D mode
  useEffect(() => {
    if (viewMode !== '3d' || !canvasMountRef.current) return;

    const width = canvasMountRef.current.clientWidth || 400;
    const height = canvasMountRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvasMountRef.current.innerHTML = '';
    canvasMountRef.current.appendChild(renderer.domElement);

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0xe2e8f0, 0x1e293b, 1.2);
    scene.add(fillLight);

    const skeletonGroup = new THREE.Group();
    skeletonGroup.position.y = 0.2;
    scene.add(skeletonGroup);

    // Bone PBR Material
    const boneMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.05
    });

    const jointMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.4
    });

    // Procedural Anatomical Skeleton Assembly (Multi-part THREE.Group)
    // 1. Skull
    const skullGeo = new THREE.SphereGeometry(0.38, 24, 24);
    skullGeo.scale(1, 1.15, 1.1);
    const skullMesh = new THREE.Mesh(skullGeo, boneMaterial);
    skullMesh.position.y = 2.4;
    skeletonGroup.add(skullMesh);

    // 2. Jaw / Mandible
    const jawGeo = new THREE.BoxGeometry(0.25, 0.12, 0.22);
    const jawMesh = new THREE.Mesh(jawGeo, boneMaterial);
    jawMesh.position.set(0, 2.12, 0.08);
    skeletonGroup.add(jawMesh);

    // 3. Spine / Vertebrae
    const spineGeo = new THREE.CylinderGeometry(0.08, 0.09, 1.1, 16);
    const spineMesh = new THREE.Mesh(spineGeo, boneMaterial);
    spineMesh.position.y = 1.45;
    skeletonGroup.add(spineMesh);

    // 4. Clavicles (collar bones)
    const clavGeo = new THREE.BoxGeometry(1.2, 0.06, 0.08);
    const clavMesh = new THREE.Mesh(clavGeo, boneMaterial);
    clavMesh.position.set(0, 1.95, 0);
    skeletonGroup.add(clavMesh);

    // 5. Ribcage (Sangkar Dada)
    for (let r = 0; r < 5; r++) {
      const ringGeo = new THREE.TorusGeometry(0.36 + r * 0.03, 0.035, 12, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, boneMaterial);
      ringMesh.position.set(0, 1.82 - r * 0.14, 0);
      skeletonGroup.add(ringMesh);
    }

    // Sternum (tulang dada tengah)
    const sternumGeo = new THREE.BoxGeometry(0.08, 0.65, 0.04);
    const sternumMesh = new THREE.Mesh(sternumGeo, boneMaterial);
    sternumMesh.position.set(0, 1.55, 0.38);
    skeletonGroup.add(sternumMesh);

    // 6. Pelvis (Panggul)
    const pelvisGeo = new THREE.BoxGeometry(0.9, 0.35, 0.45);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, boneMaterial);
    pelvisMesh.position.set(0, 0.85, 0);
    skeletonGroup.add(pelvisMesh);

    // 7. Arms (Humerus, Radius, Ulna)
    [-0.7, 0.7].forEach(side => {
      // Shoulder joint
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), jointMaterial);
      shoulder.position.set(side, 1.95, 0);
      skeletonGroup.add(shoulder);

      // Humerus (Lengan Atas)
      const humerus = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.65, 12), boneMaterial);
      humerus.position.set(side, 1.55, 0);
      skeletonGroup.add(humerus);

      // Elbow joint
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), jointMaterial);
      elbow.position.set(side, 1.2, 0);
      skeletonGroup.add(elbow);

      // Forearm
      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.6, 12), boneMaterial);
      forearm.position.set(side, 0.85, 0);
      skeletonGroup.add(forearm);
    });

    // 8. Legs (Femur, Tibia, Fibula)
    [-0.26, 0.26].forEach(side => {
      // Hip joint
      const hip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), jointMaterial);
      hip.position.set(side, 0.72, 0);
      skeletonGroup.add(hip);

      // Femur (Paha)
      const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.85, 14), boneMaterial);
      femur.position.set(side, 0.28, 0);
      skeletonGroup.add(femur);

      // Knee joint (Patella)
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 14), jointMaterial);
      knee.position.set(side, -0.16, 0.02);
      skeletonGroup.add(knee);

      // Lower Leg (Tibia & Fibula)
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.8, 12), boneMaterial);
      shin.position.set(side, -0.6, 0);
      skeletonGroup.add(shin);
    });

    // Interactive Drag Orbiting
    let isDragging = false;
    let prevMouseX = 0;
    const canvasEl = renderer.domElement;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevMouseX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevMouseX;
      prevMouseX = clientX;
      skeletonGroup.rotation.y += deltaX * 0.012;
    };
    const onUp = () => { isDragging = false; };

    canvasEl.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvasEl.addEventListener('touchstart', onDown);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);

    // Animation Loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      if (!isDragging) {
        skeletonGroup.rotation.y += 0.003; // gentle auto-rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameIdRef.current);
      canvasEl.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvasEl.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      renderer.dispose();
    };
  }, [viewMode]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
            <Bone className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Laboratorium Kerangka Manusia</h2>
            <p className="text-xs text-slate-500">Eksplorasi anatomi 206 tulang penopang tubuh, klik untuk melihat fungsi dan jenisnya</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 2D vs 3D Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setViewMode('2d');
                sounds.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === '2d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diagram Interaktif 2D
            </button>
            <button
              onClick={() => {
                setViewMode('3d');
                sounds.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === '3d' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              Model 3D Putar
            </button>
          </div>

          <button
            onClick={() => {
              if (isQuizMode) {
                setIsQuizMode(false);
                setTargetQuizBone(null);
              } else {
                startQuiz();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
              isQuizMode 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {isQuizMode ? 'Keluar Tantangan' : 'Tantangan Tebak Tulang'}
          </button>
        </div>
      </div>

      {/* Quiz Banner if active */}
      {isQuizMode && targetQuizBone && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
              Tantangan Anatomi
            </span>
            <h4 className="text-sm font-bold text-amber-950 mt-1">
              Temukan dan Klik: <span className="underline text-teal-800">{targetQuizBone.name} ({targetQuizBone.latinName})</span>
            </h4>
            <p className="text-xs text-amber-900 mt-0.5">Petunjuk fungsi: {targetQuizBone.function}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-900">
              Skor: <span className="text-teal-700 text-base">{quizScore}</span>
            </span>
            <button
              onClick={pickNextQuizBone}
              className="px-3 py-1.5 text-xs font-medium text-amber-800 bg-amber-200/50 hover:bg-amber-200 rounded-lg transition-colors"
            >
              Lewati Soal
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Visual Skeleton + Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Skeleton Area (2D SVG or 3D Three.js) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col items-center justify-center relative min-h-[520px]">
          {viewMode === '2d' ? (
            <div className="w-full max-w-[340px] aspect-[9/16] relative">
              <svg viewBox="0 0 300 580" className="w-full h-full select-none">
                {/* Background Grid Pattern */}
                <pattern id="boneGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="#334155" opacity="0.4" />
                </pattern>
                <rect width="300" height="580" fill="url(#boneGrid)" />

                {/* --- 2D Interactive Anatomical Bones (Frontal View) --- */}

                {/* 1. SKULL & MANDIBLE */}
                <g 
                  className="cursor-pointer group"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'skull')!)}
                >
                  <circle 
                    cx="150" 
                    cy="50" 
                    r="34" 
                    fill={selectedPart.id === 'skull' ? '#38bdf8' : '#f1f5f9'}
                    stroke={selectedPart.id === 'skull' ? '#0284c7' : '#94a3b8'}
                    strokeWidth="2.5"
                    className="transition-colors"
                  />
                  {/* Eye orbits */}
                  <ellipse cx="138" cy="50" rx="6" ry="7" fill="#0f172a" />
                  <ellipse cx="162" cy="50" rx="6" ry="7" fill="#0f172a" />
                  {/* Nasal cavity */}
                  <polygon points="150,56 146,65 154,65" fill="#0f172a" />
                </g>

                {/* Jaw / Mandible */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'mandible')!)}
                >
                  <path 
                    d="M 132 72 Q 150 92 168 72 Z" 
                    fill={selectedPart.id === 'mandible' ? '#38bdf8' : '#e2e8f0'}
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                  />
                </g>

                {/* Spine / Neck (Vertebrae servikal) */}
                <line x1="150" y1="88" x2="150" y2="108" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />

                {/* 2. CLAVICLE (Tulang Selangka) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'clavicle')!)}
                >
                  <path 
                    d="M 95 110 Q 120 102 150 110 Q 180 102 205 110" 
                    fill="none" 
                    stroke={selectedPart.id === 'clavicle' ? '#38bdf8' : '#f8fafc'} 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                  />
                </g>

                {/* 3. STERNUM & RIBS (Tulang Dada & Rusuk) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'ribs')!)}
                >
                  {/* Ribs arcs */}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <path
                      key={i}
                      d={`M 150 ${125 + i * 14} Q ${105 - i * 2} ${130 + i * 14} ${115 + i * 2} ${145 + i * 14}`}
                      fill="none"
                      stroke={selectedPart.id === 'ribs' ? '#38bdf8' : '#e2e8f0'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  ))}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <path
                      key={i}
                      d={`M 150 ${125 + i * 14} Q ${195 + i * 2} ${130 + i * 14} ${185 - i * 2} ${145 + i * 14}`}
                      fill="none"
                      stroke={selectedPart.id === 'ribs' ? '#38bdf8' : '#e2e8f0'}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  ))}
                </g>

                {/* Sternum (Tulang Dada) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'sternum')!)}
                >
                  <rect 
                    x="145" 
                    y="118" 
                    width="10" 
                    height="75" 
                    rx="4" 
                    fill={selectedPart.id === 'sternum' ? '#38bdf8' : '#f8fafc'}
                    stroke="#94a3b8" 
                    strokeWidth="1.5" 
                  />
                </g>

                {/* Spine trunk */}
                <line x1="150" y1="195" x2="150" y2="245" stroke="#cbd5e1" strokeWidth="8" strokeDasharray="5 3" />

                {/* 4. ARMS: HUMERUS (Lengan Atas) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'humerus')!)}
                >
                  {/* Left Arm Humerus */}
                  <line 
                    x1="95" 
                    y1="118" 
                    x2="80" 
                    y2="200" 
                    stroke={selectedPart.id === 'humerus' ? '#38bdf8' : '#f8fafc'} 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                  />
                  {/* Right Arm Humerus */}
                  <line 
                    x1="205" 
                    y1="118" 
                    x2="220" 
                    y2="200" 
                    stroke={selectedPart.id === 'humerus' ? '#38bdf8' : '#f8fafc'} 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                  />
                </g>

                {/* 5. RADIUS & ULNA (Pengumpil & Hasta) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'radius_ulna')!)}
                >
                  {/* Left Lower Arm */}
                  <line 
                    x1="80" 
                    y1="205" 
                    x2="65" 
                    y2="275" 
                    stroke={selectedPart.id === 'radius_ulna' ? '#38bdf8' : '#e2e8f0'} 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                  />
                  {/* Right Lower Arm */}
                  <line 
                    x1="220" 
                    y1="205" 
                    x2="235" 
                    y2="275" 
                    stroke={selectedPart.id === 'radius_ulna' ? '#38bdf8' : '#e2e8f0'} 
                    strokeWidth="7" 
                    strokeLinecap="round" 
                  />
                </g>

                {/* 6. PELVIS (Tulang Panggul) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'pelvis')!)}
                >
                  <path 
                    d="M 115 240 Q 150 230 185 240 Q 190 275 165 285 Q 150 265 135 285 Q 110 275 115 240 Z" 
                    fill={selectedPart.id === 'pelvis' ? '#38bdf8' : '#f1f5f9'}
                    stroke="#94a3b8" 
                    strokeWidth="2" 
                  />
                </g>

                {/* 7. FEMUR (Tulang Paha) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'femur')!)}
                >
                  {/* Left Femur */}
                  <line 
                    x1="135" 
                    y1="285" 
                    x2="125" 
                    y2="395" 
                    stroke={selectedPart.id === 'femur' ? '#38bdf8' : '#f8fafc'} 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                  />
                  {/* Right Femur */}
                  <line 
                    x1="165" 
                    y1="285" 
                    x2="175" 
                    y2="395" 
                    stroke={selectedPart.id === 'femur' ? '#38bdf8' : '#f8fafc'} 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                  />
                </g>

                {/* 8. PATELLA (Tempurung Lutut) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'patella')!)}
                >
                  <circle 
                    cx="125" 
                    cy="405" 
                    r="6" 
                    fill={selectedPart.id === 'patella' ? '#38bdf8' : '#0ea5e9'} 
                  />
                  <circle 
                    cx="175" 
                    cy="405" 
                    r="6" 
                    fill={selectedPart.id === 'patella' ? '#38bdf8' : '#0ea5e9'} 
                  />
                </g>

                {/* 9. TIBIA & FIBULA (Tulang Kering & Betis) */}
                <g 
                  className="cursor-pointer"
                  onClick={() => handleBoneClick(SKELETON_PARTS.find(b => b.id === 'tibia_fibula')!)}
                >
                  {/* Left Lower Leg */}
                  <line 
                    x1="125" 
                    y1="415" 
                    x2="120" 
                    y2="515" 
                    stroke={selectedPart.id === 'tibia_fibula' ? '#38bdf8' : '#e2e8f0'} 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                  />
                  {/* Right Lower Leg */}
                  <line 
                    x1="175" 
                    y1="415" 
                    x2="180" 
                    y2="515" 
                    stroke={selectedPart.id === 'tibia_fibula' ? '#38bdf8' : '#e2e8f0'} 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                  />
                </g>

                {/* Feet */}
                <ellipse cx="115" cy="525" rx="14" ry="6" fill="#cbd5e1" />
                <ellipse cx="185" cy="525" rx="14" ry="6" fill="#cbd5e1" />
              </svg>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-slate-400 text-[11px] whitespace-nowrap bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                Klik bagian tulang tubuh mana pun untuk membedahnya
              </div>
            </div>
          ) : (
            // 3D Three.js Mannequin Viewer
            <div className="w-full h-full flex flex-col items-center">
              <div ref={canvasMountRef} className="w-full h-[460px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing" />
              <div className="mt-2 text-slate-400 text-xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Geser mouse / sentuh untuk memutar kerangka 360 derajat</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Anatomical Fact Sheet & Detail Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Bone Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md">
                  {selectedPart.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1.5">{selectedPart.name}</h3>
                {selectedPart.latinName && (
                  <p className="text-xs text-slate-500 italic font-serif">Nama Ilmiah: {selectedPart.latinName}</p>
                )}
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Bone className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Fungsi Utama bagi Tubuh
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedPart.function}
                </p>
              </div>

              {selectedPart.funFact && (
                <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-0.5 flex items-center gap-1 text-amber-950">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Fakta Menarik Sains:
                  </span>
                  {selectedPart.funFact}
                </div>
              )}
            </div>

            {/* Quick Directory Bone Buttons */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-600 block mb-2">
                Daftar Tulang Penting:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SKELETON_PARTS.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => handleBoneClick(part)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      selectedPart.id === part.id
                        ? 'bg-teal-600 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {part.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Quiz Feedback if in Quiz Mode */}
          {quizFeedback && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs font-medium text-teal-900 leading-relaxed animate-in fade-in">
              {quizFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
