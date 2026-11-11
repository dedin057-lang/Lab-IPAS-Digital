/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LabCategory = 
  | 'kelistrikan'
  | 'magnet'
  | 'kerangka'
  | 'otot'
  | 'pencernaan'
  | 'pernapasan'
  | 'peredaran_darah'
  | 'organ_indra'
  | 'ekosistem'
  | 'bumi_antariksa';

export interface StudentProfile {
  name: string;
  className: string;
  groupName?: string;
  avatarId: string;
}

export interface QuizQuestion {
  id: string;
  category: LabCategory;
  type: 'multiple-choice' | 'true-false' | 'matching' | 'organ-identify';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  matchingPairs?: { left: string; right: string }[];
  explanation: string;
  hint?: string;
  diagramSvg?: string;
}

export interface QuizResult {
  id: string;
  studentName: string;
  className: string;
  groupName?: string;
  category: LabCategory;
  categoryTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: {
    questionId: string;
    studentAnswer: any;
    isCorrect: boolean;
  }[];
}

export interface VideoResource {
  id: string;
  title: string;
  category: LabCategory;
  description: string;
  embedUrl: string;
  duration: string;
  tags: string[];
}

export interface LearningTopic {
  id: LabCategory;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  learningObjectives: string[];
  coreConcepts: {
    title: string;
    body: string;
    keyPoints: string[];
  }[];
  labInstructions: string[];
  reflectionQuestions: string[];
}

/* Circuit Simulator Types */
export type CircuitComponentType = 'battery' | 'bulb' | 'switch' | 'resistor';

export interface CircuitTerminal {
  id: string;
  name: string;
  componentId: string;
  x: number; // relative to component
  y: number;
  polarity?: 'positive' | 'negative' | 'neutral';
}

export interface CircuitComponent {
  id: string;
  type: CircuitComponentType;
  x: number;
  y: number;
  rotation?: number; // 0, 90, 180, 270
  name: string;
  state?: {
    isOpen?: boolean; // for switch
    voltage?: number; // for battery (1.5V, 3.0V, 9V)
    resistance?: number; // ohms
    lit?: boolean;
    brightness?: number; // 0 to 1
  };
}

export interface CircuitWire {
  id: string;
  fromTerminalId: string;
  toTerminalId: string;
  color: 'red' | 'black' | 'blue' | 'yellow';
}

export interface CircuitState {
  isClosedCircuit: boolean;
  isShortCircuit: boolean;
  activeCurrentAmpere: number;
  bulbsLitCount: number;
  statusMessage: string;
  statusType: 'success' | 'warning' | 'error' | 'info';
}

/* Magnet Simulator Types */
export interface MagnetObject {
  id: string;
  x: number;
  y: number;
  angle: number; // in degrees
  strength: number;
}

export interface TestMaterial {
  id: string;
  name: string;
  type: 'feromagnetik' | 'paramagnetik' | 'diamagnetik';
  behavior: 'ditarik_kuat' | 'ditarik_lemah' | 'tidak_ditarik';
  icon: string;
  description: string;
  x: number;
  y: number;
  isAttractedTo?: string; // magnet id if snapped
}

/* Anatomy Types */
export interface AnatomyPart {
  id: string;
  name: string;
  latinName?: string;
  system: 'kerangka' | 'otot' | 'pencernaan' | 'pernapasan' | 'peredaran_darah';
  category: string;
  function: string;
  mechanism?: string;
  funFact?: string;
  highlightCoordinates?: { x: number; y: number; width?: number; height?: number };
}
