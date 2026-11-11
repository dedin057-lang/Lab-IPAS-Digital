/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Zap, 
  Compass, 
  Bone, 
  Activity, 
  Utensils, 
  Wind, 
  Heart, 
  Eye, 
  Trees, 
  Globe, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Award, 
  BookOpen, 
  FlaskConical, 
  Play,
  Sparkles
} from 'lucide-react';
import { LAB_TOPICS } from '../../data/curriculumData';
import { LabCategory, StudentProfile } from '../../types/ipas';
import { storage } from '../../services/storage';
import { sounds } from '../../services/sound';

interface DashboardProps {
  studentProfile: StudentProfile;
  onSelectCategory: (cat: LabCategory) => void;
  onNavigateTab: (tab: 'laboratorium' | 'materi' | 'evaluasi' | 'rekap_guru') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  studentProfile,
  onSelectCategory,
  onNavigateTab
}) => {
  const labProgress = storage.getLabProgress();
  const quizResults = storage.getQuizResults();

  const completedCount = Object.values(labProgress).filter(Boolean).length;
  const totalLabs = LAB_TOPICS.length;
  const progressPercent = Math.round((completedCount / totalLabs) * 100);

  const getCategoryIcon = (id: LabCategory) => {
    switch (id) {
      case 'kelistrikan': return Zap;
      case 'magnet': return Compass;
      case 'kerangka': return Bone;
      case 'otot': return Activity;
      case 'pencernaan': return Utensils;
      case 'pernapasan': return Wind;
      case 'peredaran_darah': return Heart;
      case 'organ_indra': return Eye;
      case 'ekosistem': return Trees;
      case 'bumi_antariksa': return Globe;
    }
  };

  const getCategoryColor = (id: LabCategory) => {
    switch (id) {
      case 'kelistrikan': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'magnet': return 'bg-sky-500/10 text-sky-600 border-sky-200';
      case 'kerangka': return 'bg-indigo-500/10 text-indigo-600 border-indigo-200';
      case 'otot': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      case 'pencernaan': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'pernapasan': return 'bg-teal-500/10 text-teal-600 border-teal-200';
      case 'peredaran_darah': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'organ_indra': return 'bg-cyan-500/10 text-cyan-600 border-cyan-200';
      case 'ekosistem': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'bumi_antariksa': return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-r from-teal-800 via-teal-700 to-sky-800 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-300"></span>
            <span>Kurikulum Merdeka IPAS Fase C (Kelas 5 & 6 SD)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Selamat Datang di Laboratorium Sains Virtual, {studentProfile.name}!
          </h1>

          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Eksplorasi konsep ilmiah melalui simulasi meja praktik interaktif. Rangkai sirkuit listrik nyata, amati garis medan magnetik, bedah anatomi kerangka, dan uji hipotesismu secara langsung.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onSelectCategory('kelistrikan');
                onNavigateTab('laboratorium');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              Mulai Eksperimen Listrik
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigateTab('evaluasi');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-900/60 hover:bg-teal-900/80 text-white border border-teal-500/40 rounded-xl font-medium text-xs sm:text-sm transition-colors"
            >
              <Award className="w-4 h-4 text-teal-300" />
              Uji Pemahaman (Kuis)
            </button>
          </div>
        </div>

        {/* Decorative laboratory glassware backdrop illustration */}
        <div className="absolute right-4 bottom-2 sm:right-10 sm:bottom-6 opacity-15 pointer-events-none">
          <FlaskConical className="w-64 h-64 text-white" />
        </div>
      </section>

      {/* Student Progress & Overview Metrics Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Lab Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Progres Praktikum Sains</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{completedCount} <span className="text-sm font-normal text-slate-400">/ {totalLabs} Lab</span></span>
              <span className="text-xs font-bold text-teal-700">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Quiz Evaluations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Evaluasi Terselesaikan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{quizResults.length} <span className="text-sm font-normal text-slate-400">Aktivitas</span></span>
              <span className="text-xs text-slate-500">Tersimpan di Rekap</span>
            </div>
            <p className="text-[11px] text-slate-400">Hasil tersimpan otomatis di perangkat</p>
          </div>
        </div>

        {/* Metric 3: Active Student Info */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Identitas Peneliti Aktif</span>
            <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
              {studentProfile.className}
            </span>
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 block truncate">{studentProfile.name}</span>
            <span className="text-xs text-slate-500 block">{studentProfile.groupName || 'Praktikum Mandiri'}</span>
          </div>
        </div>
      </section>

      {/* 10 Laboratorium Categories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ruang Laboratorium Virtual</h2>
            <p className="text-xs text-slate-500">Pilih modul laboratorium untuk membuka simulasi interaktif</p>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateTab('laboratorium');
            }}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            Buka Semua Lab <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {LAB_TOPICS.map((topic) => {
            const Icon = getCategoryIcon(topic.id);
            const colorClass = getCategoryColor(topic.id);
            const isCompleted = labProgress[topic.id];

            return (
              <div
                key={topic.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectCategory(topic.id);
                  onNavigateTab('laboratorium');
                }}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {topic.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span>Buka Praktik</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity & Reflection Guidance */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Activity List */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base">Aktivitas Terakhir</h3>
            <span className="text-xs text-slate-500">Catatan Pengerjaan</span>
          </div>

          {quizResults.length > 0 ? (
            <div className="space-y-3">
              {quizResults.slice(0, 4).map((res) => (
                <div key={res.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      {res.percentage}%
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{res.categoryTitle}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(res.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">
                    Skor: {res.score} / {res.totalQuestions * 10}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
              <p>Belum ada aktivitas kuis yang dikerjakan. Mulai salah satu laboratorium untuk mencatat hasil belajarmu!</p>
            </div>
          )}
        </div>

        {/* Right: Kurikulum Merdeka Principles for Teacher & Student */}
        <div className="lg:col-span-5 bg-teal-50/70 border border-teal-200/80 p-6 rounded-3xl text-teal-950 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-sm sm:text-base">Prinsip Belajar IPAS Fase C</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-teal-900">
            <p>
              Aplikasi ini dirancang sesuai capaian pembelajaran <strong>Fase C Kurikulum Merdeka</strong> untuk membina keterampilan inkuiri sains:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[11px] text-teal-800">
              <li><strong>Mengamati:</strong> Mengamati fenomena listrik, gaya magnet, dan anatomi tubuh secara visual.</li>
              <li><strong>Memprediksi:</strong> Memperkirakan apa yang terjadi saat saklar ditutup atau kutub didekatkan.</li>
              <li><strong>Melakukan Uji Coba:</strong> Merakit komponen kabel mandiri di meja praktik tanpa risiko tersengat.</li>
              <li><strong>Menyimpulkan:</strong> Menemukan aturan ilmiah dari hasil percobaan langsung.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
