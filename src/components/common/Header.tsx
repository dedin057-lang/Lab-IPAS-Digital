/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, User, FlaskConical } from 'lucide-react';
import { StudentProfile } from '../../types/ipas';
import { sounds } from '../../services/sound';

export type ActiveTab = 'dashboard' | 'laboratorium' | 'materi' | 'evaluasi' | 'rekap_guru';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  studentProfile: StudentProfile;
  onOpenStudentModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  studentProfile,
  onOpenStudentModal,
  isMuted,
  onToggleMute
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Beranda' },
    { id: 'laboratorium', label: 'Laboratorium' },
    { id: 'materi', label: 'Materi & Video' },
    { id: 'evaluasi', label: 'Evaluasi & Kuis' },
    { id: 'rekap_guru', label: 'Rekap Guru' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (one line text element) */}
        <button
          onClick={() => {
            sounds.playClick();
            onTabChange('dashboard');
          }}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-700 transition-colors">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              Laboratorium IPAS Digital
            </span>
            <span className="hidden sm:inline text-[11px] text-teal-700 font-medium -mt-1">
              SD Fase C · Kurikulum Merdeka
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onTabChange(item.id);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 font-medium ${
                  isActive
                    ? 'border-teal-600 text-teal-700 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + audio utility */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              onToggleMute();
              sounds.playClick();
            }}
            title={isMuted ? 'Nyalakan Suara Laboratorium' : 'Matikan Suara Laboratorium'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenStudentModal();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/80 whitespace-nowrap shrink-0"
          >
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span className="max-w-[120px] truncate">{studentProfile.name}</span>
            <span className="hidden lg:inline text-[11px] text-slate-400">· {studentProfile.className}</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-white px-2 py-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                onTabChange(item.id);
              }}
              className={`px-2.5 py-1.5 text-xs font-medium whitespace-nowrap ${
                isActive ? 'text-teal-700 font-semibold' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
