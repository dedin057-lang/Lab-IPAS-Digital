/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ComponentType = 'battery' | 'switch' | 'bulb' | 'resistor';

export interface TerminalPosition {
  id: string;
  componentId: string;
  name: string;
  relX: number; // offset relative to component center
  relY: number;
  type: 'positive' | 'negative' | 'switch_in' | 'switch_out' | 'load_in' | 'load_out';
}

export interface PlacedComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  name: string;
  voltage?: number; // for battery
  isOpen?: boolean; // for switch
  isBroken?: boolean; // for bulb filament
  resistance?: number; // ohms
}

export interface Wire {
  id: string;
  fromTerminalId: string;
  toTerminalId: string;
  color: 'red' | 'black' | 'blue' | 'yellow';
}

export interface CircuitAnalysisResult {
  isClosedCircuit: boolean;
  isShortCircuit: boolean;
  activeCurrentAmpere: number;
  litBulbIds: string[];
  isSeries: boolean;
  isParallel: boolean;
  voltages: Record<string, number>; // componentId -> voltage drop
  statusType: 'success' | 'warning' | 'error' | 'info';
  statusMessage: string;
}

export interface VoltmeterProbe {
  x: number;
  y: number;
  connectedTerminalId: string | null;
}
