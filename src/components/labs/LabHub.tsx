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
  Globe 
} from 'lucide-react';
import { LabCategory } from '../../types/ipas';
import { LAB_TOPICS } from '../../data/curriculumData';
import { CircuitLab } from './circuits/CircuitLab';
import { MagnetLab } from './magnet/MagnetLab';
import { SkeletonLab } from './skeleton/SkeletonLab';
import { MuscleLab } from './muscles/MuscleLab';
import { DigestiveLab } from './digestive/DigestiveLab';
import { RespiratoryLab } from './respiratory/RespiratoryLab';
import { CirculatoryLab } from './circulatory/CirculatoryLab';
import { sounds } from '../../services/sound';

interface LabHubProps {
  currentCategory: LabCategory;
  onSelectCategory: (cat: LabCategory) => void;
}

export const LabHub: React.FC<LabHubProps> = ({
  currentCategory,
  onSelectCategory
}) => {
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

  return (
    <div className="space-y-6">
      {/* Category Tabs Ribbon */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {LAB_TOPICS.map((topic) => {
          const Icon = getCategoryIcon(topic.id);
          const isSelected = currentCategory === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => {
                sounds.playClick();
                onSelectCategory(topic.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{topic.title}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Interactive Lab Simulation */}
      <div>
        {currentCategory === 'kelistrikan' && <CircuitLab />}
        {currentCategory === 'magnet' && <MagnetLab />}
        {currentCategory === 'kerangka' && <SkeletonLab />}
        {currentCategory === 'otot' && <MuscleLab />}
        {currentCategory === 'pencernaan' && <DigestiveLab />}
        {currentCategory === 'pernapasan' && <RespiratoryLab />}
        {currentCategory === 'peredaran_darah' && <CirculatoryLab />}
        {/* Additional Fallback for other categories pointing to rich interactive materials */}
        {(currentCategory === 'organ_indra' || currentCategory === 'ekosistem' || currentCategory === 'bumi_antariksa') && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center font-bold">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {LAB_TOPICS.find(t => t.id === currentCategory)?.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Modul ini dilengkapi dengan visual interaktif, fakta sains, dan video pembelajaran kurikulum merdeka.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onSelectCategory('kelistrikan');
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
              >
                Coba Lab Rangkaian Listrik & Magnet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
