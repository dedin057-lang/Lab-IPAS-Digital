/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';
import { storage } from '../../services/storage';
import { QuizResult } from '../../types/ipas';
import { sounds } from '../../services/sound';

export const TeacherRecap: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>(storage.getQuizResults());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  const filtered = results.filter((item) => {
    const matchName = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (item.groupName && item.groupName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = filterCategory === 'all' || item.category === filterCategory;
    return matchName && matchCat;
  });

  const handleDownloadCSV = () => {
    sounds.playClick();
    const csvContent = storage.exportToCSV();
    if (!csvContent) {
      alert('Belum ada data rekap nilai untuk diunduh.');
      return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Nilai_IPAS_SD_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = () => {
    sounds.playClick();
    storage.clearAllData();
    setResults([]);
    setConfirmClear(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Rekapitulasi Hasil Praktikum & Nilai Siswa</h2>
              <p className="text-xs text-slate-500">Lembar penilaian guru: Rekap skor, durasi, kelompok, dan status penyelesaian</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              disabled={results.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor CSV (Excel / Google Sheets)
            </button>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                disabled={results.length === 0}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors disabled:opacity-50"
                title="Hapus Seluruh Data Rekap"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1.5 rounded-xl">
                <span className="text-[11px] text-rose-700 font-semibold px-1">Yakin hapus?</span>
                <button
                  onClick={handleClearAll}
                  className="px-2 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg"
                >
                  Ya
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 bg-slate-200 text-slate-700 text-[11px] rounded-lg"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama siswa, kelas, atau kelompok..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Semua Modul Praktikum</option>
              <option value="kelistrikan">Energi & Kelistrikan</option>
              <option value="magnet">Magnet & Kemagnetan</option>
              <option value="kerangka">Kerangka Manusia</option>
              <option value="otot">Sistem Otot</option>
              <option value="pencernaan">Sistem Pencernaan</option>
              <option value="pernapasan">Sistem Pernapasan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Waktu Pengerjaan</th>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Kelas & Kelompok</th>
                  <th className="py-3 px-4">Materi Praktikum</th>
                  <th className="py-3 px-4">Skor & Persentase</th>
                  <th className="py-3 px-4">Durasi Waktu</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(item.completedAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.studentName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <span>{item.className}</span>
                      {item.groupName && (
                        <span className="text-[11px] text-slate-400 block">{item.groupName}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {item.categoryTitle}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <strong className="text-teal-700 text-sm">{item.score}</strong>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {item.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {item.timeSpentSeconds} detik
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Tuntas
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="font-semibold text-slate-700 text-sm">Belum Ada Rekap Nilai yang Tersimpan</h4>
            <p className="text-xs max-w-sm mx-auto">
              Ketika siswa menyelesaikan kuis atau tantangan simulasi di laboratorium, hasilnya akan otomatis terdata di tabel ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
