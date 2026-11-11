/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProfile, QuizResult, LabCategory } from '../types/ipas';

const KEY_STUDENT_PROFILE = 'ipas_student_profile';
const KEY_QUIZ_RESULTS = 'ipas_quiz_results';
const KEY_LAB_PROGRESS = 'ipas_lab_progress';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Siswa Peneliti',
  className: 'Kelas 5-A',
  groupName: 'Kelompok Sains 1',
  avatarId: 'scientist-1',
};

export const storage = {
  getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(KEY_STUDENT_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(KEY_STUDENT_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  },

  getQuizResults(): QuizResult[] {
    try {
      const data = localStorage.getItem(KEY_QUIZ_RESULTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveQuizResult(result: QuizResult): void {
    try {
      const current = this.getQuizResults();
      const updated = [result, ...current];
      localStorage.setItem(KEY_QUIZ_RESULTS, JSON.stringify(updated));
      this.markLabCompleted(result.category);
    } catch (e) {
      console.error('Failed to save quiz result', e);
    }
  },

  getLabProgress(): Record<LabCategory, boolean> {
    try {
      const data = localStorage.getItem(KEY_LAB_PROGRESS);
      return data ? JSON.parse(data) : {
        kelistrikan: true, // initial completed exploration
        magnet: false,
        kerangka: false,
        otot: false,
        pencernaan: false,
        pernapasan: false,
        peredaran_darah: false,
        organ_indra: false,
        ekosistem: false,
        bumi_antariksa: false,
      };
    } catch {
      return {
        kelistrikan: true,
        magnet: false,
        kerangka: false,
        otot: false,
        pencernaan: false,
        pernapasan: false,
        peredaran_darah: false,
        organ_indra: false,
        ekosistem: false,
        bumi_antariksa: false,
      };
    }
  },

  markLabCompleted(category: LabCategory): void {
    try {
      const current = this.getLabProgress();
      current[category] = true;
      localStorage.setItem(KEY_LAB_PROGRESS, JSON.stringify(current));
    } catch (e) {
      console.error('Failed to update lab progress', e);
    }
  },

  clearAllData(): void {
    try {
      localStorage.removeItem(KEY_QUIZ_RESULTS);
      localStorage.removeItem(KEY_LAB_PROGRESS);
    } catch (e) {
      console.error('Failed to clear data', e);
    }
  },

  exportToCSV(): string {
    const results = this.getQuizResults();
    if (results.length === 0) return '';
    const headers = ['Waktu', 'Nama Siswa', 'Kelas', 'Kelompok', 'Materi/Laboratorium', 'Skor', 'Total Soal', 'Persentase', 'Durasi (detik)'];
    const rows = results.map(r => [
      `"${new Date(r.completedAt).toLocaleString('id-ID')}"`,
      `"${r.studentName}"`,
      `"${r.className}"`,
      `"${r.groupName || '-'}"`,
      `"${r.categoryTitle}"`,
      r.score,
      r.totalQuestions,
      `${r.percentage}%`,
      r.timeSpentSeconds
    ]);
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
};
