/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/common/Header';
import { NotificationToast, LabNotice } from './components/common/NotificationToast';
import { StudentModal } from './components/common/StudentModal';
import { Dashboard } from './components/dashboard/Dashboard';
import { LabHub } from './components/labs/LabHub';
import { MaterialViewer } from './components/materials/MaterialViewer';
import { EvaluationCenter } from './components/evaluation/EvaluationCenter';
import { TeacherRecap } from './components/teacher/TeacherRecap';
import { storage } from './services/storage';
import { sounds } from './services/sound';
import { LabCategory, StudentProfile } from './types/ipas';
import { FlaskConical } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('kelistrikan');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(storage.getProfile());
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [notice, setNotice] = useState<LabNotice | null>({
    id: 'welcome',
    type: 'success',
    message: 'Selamat datang di Laboratorium IPAS Digital SD Fase C.'
  });

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sounds.setMuted(nextMute);
  };

  const handleSelectCategoryFromDashboard = (cat: LabCategory) => {
    setSelectedCategory(cat);
  };

  const handleOpenLab = (cat: LabCategory) => {
    setSelectedCategory(cat);
    setActiveTab('laboratorium');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Minimalist Top Notification */}
      <NotificationToast 
        notice={notice} 
        onDismiss={() => setNotice(null)} 
      />

      {/* Main Top Bar Contract Compliant Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        studentProfile={studentProfile}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Student Profile Dialog */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        currentProfile={studentProfile}
        onSave={(updated) => {
          setStudentProfile(updated);
          setNotice({
            id: `prof_${Date.now()}`,
            type: 'success',
            message: `Identitas peneliti tersimpan: ${updated.name} (${updated.className})`
          });
          setTimeout(() => setNotice(null), 3000);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            studentProfile={studentProfile}
            onSelectCategory={handleSelectCategoryFromDashboard}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'laboratorium' && (
          <LabHub
            currentCategory={selectedCategory}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        )}

        {activeTab === 'materi' && (
          <MaterialViewer
            initialCategory={selectedCategory}
            onOpenLab={handleOpenLab}
          />
        )}

        {activeTab === 'evaluasi' && (
          <EvaluationCenter
            studentProfile={studentProfile}
            onOpenTeacherRecap={() => setActiveTab('rekap_guru')}
          />
        )}

        {activeTab === 'rekap_guru' && (
          <TeacherRecap />
        )}
      </main>

      {/* Modern, Clean Educational Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
              <FlaskConical className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-800">Laboratorium IPAS Digital SD</span>
            <span>· Fase C Kurikulum Merdeka</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Responsif untuk Komputer, Laptop, Tablet & Ponsel Pintar</span>
            <span>· Penyimpanan Data Lokal Siswa & Rekap Guru</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
