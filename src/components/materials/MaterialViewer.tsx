/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  FileText, 
  Play, 
  Sparkles,
  Info
} from 'lucide-react';
import { LAB_TOPICS, VIDEO_RESOURCES } from '../../data/curriculumData';
import { LabCategory, VideoResource } from '../../types/ipas';
import { sounds } from '../../services/sound';

interface MaterialViewerProps {
  initialCategory?: LabCategory;
  onOpenLab: (cat: LabCategory) => void;
}

export const MaterialViewer: React.FC<MaterialViewerProps> = ({
  initialCategory = 'kelistrikan',
  onOpenLab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>(initialCategory);
  const [videoList, setVideoList] = useState<VideoResource[]>(VIDEO_RESOURCES);
  const [activeVideo, setActiveVideo] = useState<VideoResource>(VIDEO_RESOURCES[0]);
  const [isAddingVideo, setIsAddingVideo] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const currentTopic = LAB_TOPICS.find(t => t.id === selectedCategory) || LAB_TOPICS[0];
  const categoryVideos = videoList.filter(v => v.category === selectedCategory);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    // Convert standard youtube watch url to embed if needed
    let embed = newUrl.trim();
    if (embed.includes('watch?v=')) {
      embed = embed.replace('watch?v=', 'embed/');
    } else if (embed.includes('youtu.be/')) {
      embed = embed.replace('youtu.be/', 'www.youtube.com/embed/');
    }

    const created: VideoResource = {
      id: `vid_custom_${Date.now()}`,
      title: newTitle.trim(),
      category: selectedCategory,
      description: newDesc.trim() || 'Video pembelajaran materi IPAS tambahan guru.',
      embedUrl: embed,
      duration: 'Bervariasi',
      tags: ['Guru', currentTopic.title]
    };

    setVideoList(prev => [created, ...prev]);
    setActiveVideo(created);
    setIsAddingVideo(false);
    setNewTitle('');
    setNewUrl('');
    setNewDesc('');
    sounds.playSuccess();
  };

  return (
    <div className="space-y-6">
      {/* Category Horizontal Filter Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {LAB_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => {
              setSelectedCategory(topic.id);
              const found = videoList.find(v => v.category === topic.id);
              if (found) setActiveVideo(found);
              sounds.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === topic.id
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Main Material Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Structured Curriculum Lesson */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                {currentTopic.badge}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenLab(currentTopic.id);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Masuk ke Meja Praktik
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">{currentTopic.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{currentTopic.subtitle}</p>
            </div>

            {/* Learning Objectives */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-teal-950 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Tujuan Pembelajaran (Fase C)
              </h3>
              <ul className="space-y-1.5 text-xs text-teal-900">
                {currentTopic.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Core Scientific Concepts */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              Konsep Utama & Penjelasan Ilmiah
            </h2>

            <div className="space-y-6">
              {currentTopic.coreConcepts.map((concept, idx) => (
                <div key={idx} className="space-y-2.5 border-b border-slate-100 last:border-b-0 pb-5 last:pb-0">
                  <h3 className="text-base font-bold text-slate-800">{concept.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {concept.body}
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 block">Poin Kunci:</span>
                    {concept.keyPoints.map((point, k) => (
                      <div key={k} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Steps & Reflection Questions */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Pertanyaan Refleksi Siswa
            </h3>
            <div className="space-y-2.5">
              {currentTopic.reflectionQuestions.map((q, idx) => (
                <div key={idx} className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-950 font-medium leading-relaxed">
                  {idx + 1}. {q}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Educational Video Player & Teacher Video Link Ingestion */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Video Pembelajaran</h3>
              </div>
              <button
                onClick={() => setIsAddingVideo(!isAddingVideo)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {isAddingVideo ? 'Batal' : 'Tambah Video Guru'}
              </button>
            </div>

            {/* Video Input Form by Teacher */}
            {isAddingVideo && (
              <form onSubmit={handleAddVideo} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-800">Sematkan Tautan Video Baru</h4>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Judul Video</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Praktik Rangkaian Seri di Kelas"
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">URL Video YouTube</label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Keterangan Singkat</label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Penjelasan guru kelas 5"
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-colors"
                >
                  Simpan Video ke Aplikasi
                </button>
              </form>
            )}

            {/* In-app Responsive Video Player */}
            {activeVideo ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-800">
                  <iframe
                    src={activeVideo.embedUrl}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{activeVideo.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activeVideo.description}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-400">
                Pilih salah satu video materi di bawah
              </div>
            )}

            {/* Video Playlist for this topic */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-semibold text-slate-600 block">Daftar Video Pembelajaran:</span>
              <div className="space-y-1.5">
                {videoList.map((vid) => {
                  const isCur = activeVideo?.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => {
                        setActiveVideo(vid);
                        sounds.playClick();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between text-xs ${
                        isCur ? 'bg-teal-50 border border-teal-200 text-teal-900 font-semibold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Play className="w-3 h-3 text-rose-500 shrink-0 fill-current" />
                        <span className="truncate">{vid.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">{vid.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
