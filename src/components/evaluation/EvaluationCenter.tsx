/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ChevronRight, 
  Sparkles, 
  HelpCircle,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_DATABASE, LAB_TOPICS } from '../../data/curriculumData';
import { QuizQuestion, QuizResult, StudentProfile, LabCategory } from '../../types/ipas';
import { storage } from '../../services/storage';
import { sounds } from '../../services/sound';

interface EvaluationCenterProps {
  studentProfile: StudentProfile;
  onOpenTeacherRecap: () => void;
}

export const EvaluationCenter: React.FC<EvaluationCenterProps> = ({
  studentProfile,
  onOpenTeacherRecap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<LabCategory | 'semua'>('semua');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [recordedAnswers, setRecordedAnswers] = useState<{ questionId: string; studentAnswer: any; isCorrect: boolean }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Filter questions based on selected category
  const filteredQuestions = selectedCategory === 'semua'
    ? QUIZ_DATABASE
    : QUIZ_DATABASE.filter(q => q.category === selectedCategory);

  const currentQ = filteredQuestions[activeQuestionIndex] || filteredQuestions[0];

  // Timer counter
  useEffect(() => {
    if (quizCompleted) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, quizCompleted]);

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    sounds.playClick();
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || hasSubmittedAnswer) return;
    setHasSubmittedAnswer(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      sounds.playSuccess();
      setScore(prev => prev + 10);
    } else {
      sounds.playShortCircuit();
    }

    setRecordedAnswers(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        studentAnswer: selectedOption,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (activeQuestionIndex < filteredQuestions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
    } else {
      // Quiz Finished!
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    const finalScore = score + (selectedOption === currentQ.correctAnswer ? 10 : 0);
    const totalQ = filteredQuestions.length;
    const percentage = Math.round((finalScore / (totalQ * 10)) * 100);

    const categoryLabel = selectedCategory === 'semua'
      ? 'Ujian Gabungan IPAS Fase C'
      : (LAB_TOPICS.find(t => t.id === selectedCategory)?.title || 'Evaluasi IPAS');

    const result: QuizResult = {
      id: `result_${Date.now()}`,
      studentName: studentProfile.name,
      className: studentProfile.className,
      groupName: studentProfile.groupName,
      category: (selectedCategory === 'semua' ? 'kelistrikan' : selectedCategory) as LabCategory,
      categoryTitle: categoryLabel,
      score: finalScore,
      totalQuestions: totalQ,
      percentage,
      timeSpentSeconds: elapsedTime,
      completedAt: new Date().toISOString(),
      answers: recordedAnswers
    };

    storage.saveQuizResult(result);

    // Launch celebratory confetti if score >= 70%
    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const restartQuiz = () => {
    sounds.playClick();
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setScore(0);
    setRecordedAnswers([]);
    setQuizCompleted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Category Selector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pusat Evaluasi & Uji Pemahaman</h2>
              <p className="text-xs text-slate-500">Soal berbasis inkuiri sains: Pilihan ganda, penalaran fenomena, dan analisis hasil lab</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono">{Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s</span>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenTeacherRecap();
              }}
              className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors"
            >
              Lihat Rekap Guru
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory('semua');
              restartQuiz();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === 'semua'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua Soal IPAS
          </button>
          {LAB_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedCategory(topic.id);
                restartQuiz();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === topic.id
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      {!quizCompleted ? (
        /* Active Quiz Card */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          {/* Question Index Progress */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
              Soal {activeQuestionIndex + 1} dari {filteredQuestions.length}
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Skor Sementara: <strong className="text-teal-700 text-sm">{score}</strong> poin
            </span>
          </div>

          {/* Question Stem */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options?.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = currentQ.correctAnswer === idx;

              let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
              if (isSelected && !hasSubmittedAnswer) {
                optionStyle = 'bg-teal-50 border-teal-500 text-teal-900 font-medium ring-1 ring-teal-500';
              } else if (hasSubmittedAnswer) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasSubmittedAnswer}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between text-xs sm:text-sm ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0 text-slate-600">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{optionText}</span>
                  </div>

                  {hasSubmittedAnswer && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasSubmittedAnswer && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scientific Explanation Reveal */}
          {hasSubmittedAnswer && (
            <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl text-xs sm:text-sm text-teal-950 space-y-1.5 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Ulasan & Penjelasan Ilmiah:
              </span>
              <p className="text-teal-900 leading-relaxed text-xs sm:text-[13px]">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-400">
              Siswa: {studentProfile.name} ({studentProfile.className})
            </span>

            {!hasSubmittedAnswer ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
                  selectedOption !== null
                    ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Kunci Jawaban
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
              >
                <span>{activeQuestionIndex < filteredQuestions.length - 1 ? 'Soal Berikutnya' : 'Selesaikan Kuis'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed Summary Card */
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center font-bold">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Evaluasi Selesai!
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              Kerja Bagus, {studentProfile.name}!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Kamu telah menyelesaikan praktikum dan uji evaluasi dengan sangat baik. Hasil belajarmu telah otomatis dicatat pada rekap guru.
            </p>
          </div>

          {/* Score breakdown metrics */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Total Skor</span>
              <strong className="text-xl font-bold text-teal-700">{score}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Persentase</span>
              <strong className="text-xl font-bold text-emerald-600">
                {Math.round((score / (filteredQuestions.length * 10)) * 100)}%
              </strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-500 block">Waktu</span>
              <strong className="text-xl font-bold text-slate-800 font-mono">
                {Math.floor(elapsedTime / 60)}m {elapsedTime % 60}s
              </strong>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi Kuis
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onOpenTeacherRecap();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors"
            >
              <Award className="w-4 h-4" />
              Buka Lembar Rekap Guru
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
