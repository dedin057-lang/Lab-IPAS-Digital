/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlacedComponent, Wire, CircuitAnalysisResult } from './types';

// Helper to get terminals for any placed component based on its position and type
export function getComponentTerminals(comp: PlacedComponent) {
  switch (comp.type) {
    case 'battery':
      return [
        {
          id: `${comp.id}_pos`,
          componentId: comp.id,
          name: 'Kutub Positif (+)',
          x: comp.x - 55,
          y: comp.y,
          type: 'positive' as const
        },
        {
          id: `${comp.id}_neg`,
          componentId: comp.id,
          name: 'Kutub Negatif (-)',
          x: comp.x + 55,
          y: comp.y,
          type: 'negative' as const
        }
      ];
    case 'switch':
      return [
        {
          id: `${comp.id}_in`,
          componentId: comp.id,
          name: 'Terminal Masuk',
          x: comp.x - 40,
          y: comp.y,
          type: 'switch_in' as const
        },
        {
          id: `${comp.id}_out`,
          componentId: comp.id,
          name: 'Terminal Keluar',
          x: comp.x + 40,
          y: comp.y,
          type: 'switch_out' as const
        }
      ];
    case 'bulb':
      return [
        {
          id: `${comp.id}_t1`,
          componentId: comp.id,
          name: 'Terminal Kiri Lampu',
          x: comp.x - 30,
          y: comp.y + 35,
          type: 'load_in' as const
        },
        {
          id: `${comp.id}_t2`,
          componentId: comp.id,
          name: 'Terminal Kanan Lampu',
          x: comp.x + 30,
          y: comp.y + 35,
          type: 'load_out' as const
        }
      ];
    case 'resistor':
      return [
        {
          id: `${comp.id}_t1`,
          componentId: comp.id,
          name: 'Terminal Kiri Resistor',
          x: comp.x - 45,
          y: comp.y,
          type: 'load_in' as const
        },
        {
          id: `${comp.id}_t2`,
          componentId: comp.id,
          name: 'Terminal Kanan Resistor',
          x: comp.x + 45,
          y: comp.y,
          type: 'load_out' as const
        }
      ];
    default:
      return [];
  }
}

export function analyzeCircuit(components: PlacedComponent[], wires: Wire[]): CircuitAnalysisResult {
  const batteries = components.filter(c => c.type === 'battery');
  const bulbs = components.filter(c => c.type === 'bulb');
  const switches = components.filter(c => c.type === 'switch');

  if (batteries.length === 0) {
    return {
      isClosedCircuit: false,
      isShortCircuit: false,
      activeCurrentAmpere: 0,
      litBulbIds: [],
      isSeries: false,
      isParallel: false,
      voltages: {},
      statusType: 'info',
      statusMessage: 'Tarik baterai dari kotak komponen ke atas meja praktik.'
    };
  }

  const primaryBattery = batteries[0];
  const batVoltage = primaryBattery.voltage || 3.0;
  const batPosId = `${primaryBattery.id}_pos`;
  const batNegId = `${primaryBattery.id}_neg`;

  // Build adjacency list for terminal-to-terminal graph
  const adj = new Map<string, string[]>();

  // Helper to connect two terminals bidirectionally
  const connect = (t1: string, t2: string) => {
    if (!adj.has(t1)) adj.set(t1, []);
    if (!adj.has(t2)) adj.set(t2, []);
    adj.get(t1)!.push(t2);
    adj.get(t2)!.push(t1);
  };

  // 1. Add internal connections inside components
  for (const comp of components) {
    if (comp.type === 'switch') {
      if (!comp.isOpen) {
        connect(`${comp.id}_in`, `${comp.id}_out`);
      }
    } else if (comp.type === 'bulb') {
      if (!comp.isBroken) {
        connect(`${comp.id}_t1`, `${comp.id}_t2`);
      }
    } else if (comp.type === 'resistor') {
      connect(`${comp.id}_t1`, `${comp.id}_t2`);
    }
  }

  // 2. Add wire connections
  for (const wire of wires) {
    connect(wire.fromTerminalId, wire.toTerminalId);
  }

  // Helper BFS for reachability
  const canReach = (start: string, target: string, excludeComponentTypes: string[] = []): boolean => {
    const visited = new Set<string>();
    const queue = [start];
    visited.add(start);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr === target) return true;

      const neighbors = adj.get(curr) || [];
      for (const n of neighbors) {
        if (!visited.has(n)) {
          // Check if terminal belongs to excluded component type
          const isExcluded = excludeComponentTypes.some(type => {
            const comp = components.find(c => c.type === type && n.startsWith(c.id));
            return !!comp;
          });

          if (!isExcluded) {
            visited.add(n);
            queue.push(n);
          }
        }
      }
    }
    return false;
  };

  // Check for short circuit: Path from battery pos to battery neg that bypasses all bulbs and resistors
  const isShortCircuit = canReach(batPosId, batNegId, ['bulb', 'resistor']);

  // Find lit bulbs
  const litBulbIds: string[] = [];
  const voltages: Record<string, number> = {};

  if (!isShortCircuit) {
    for (const bulb of bulbs) {
      if (bulb.isBroken) continue;
      const t1 = `${bulb.id}_t1`;
      const t2 = `${bulb.id}_t2`;

      // Bulb lights if one terminal reaches positive and the other reaches negative
      const reachesPos = canReach(batPosId, t1) || canReach(batPosId, t2);
      const reachesNeg = canReach(batNegId, t1) || canReach(batNegId, t2);

      // Verify that positive and negative don't just connect to the same terminal
      const t1ToPos = canReach(batPosId, t1);
      const t2ToNeg = canReach(batNegId, t2);
      const t2ToPos = canReach(batPosId, t2);
      const t1ToNeg = canReach(batNegId, t1);

      if ((t1ToPos && t2ToNeg) || (t2ToPos && t1ToNeg)) {
        litBulbIds.push(bulb.id);
      }
    }
  }

  // Determine series vs parallel topology among lit bulbs
  let isSeries = false;
  let isParallel = false;

  if (litBulbIds.length >= 2) {
    // If breaking bulb 0 stops bulb 1, they are in series!
    const testBulb0 = components.find(c => c.id === litBulbIds[0]);
    if (testBulb0) {
      // Temporarily simulate broken bulb 0
      const testComponents = components.map(c => c.id === testBulb0.id ? { ...c, isBroken: true } : c);
      const testResult = analyzeCircuit(testComponents, wires);
      // If the second bulb is no longer lit, they must be in series!
      if (!testResult.litBulbIds.includes(litBulbIds[1])) {
        isSeries = true;
      } else {
        isParallel = true;
      }
    }
  }

  // Calculate voltage per bulb
  for (const bulbId of litBulbIds) {
    if (isSeries) {
      voltages[bulbId] = +(batVoltage / litBulbIds.length).toFixed(1);
    } else {
      voltages[bulbId] = batVoltage; // parallel or single bulb gets full battery voltage
    }
  }

  // Compute status messages
  let statusType: 'success' | 'warning' | 'error' | 'info' = 'info';
  let statusMessage = 'Hubungkan kabel antarkomponen lalu tutup saklar.';
  const hasOpenSwitch = switches.some(s => s.isOpen);

  if (isShortCircuit) {
    statusType = 'error';
    statusMessage = '⚠️ Peringatan Korsleting! Kutub (+) dan (-) baterai terhubung langsung tanpa beban/lampu.';
  } else if (litBulbIds.length > 0) {
    statusType = 'success';
    if (isSeries) {
      statusMessage = `✓ Rangkaian Seri Berhasil! ${litBulbIds.length} Lampu menyala redup (${voltages[litBulbIds[0]]}V tiap lampu) karena tegangan baterai terbagi.`;
    } else if (isParallel) {
      statusMessage = `✓ Rangkaian Paralel Berhasil! ${litBulbIds.length} Lampu menyala terang benderang (${batVoltage}V tiap lampu) dengan tegangan penuh.`;
    } else {
      statusMessage = '✓ Rangkaian Berhasil! Jalur tertutup sempurna, arus listrik mengalir dan lampu menyala.';
    }
  } else if (hasOpenSwitch && wires.length >= 2) {
    statusType = 'info';
    statusMessage = 'Rangkaian telah terpasang, namun saklar masih terbuka (OFF). Klik saklar untuk menutup rangkaian!';
  } else if (wires.length > 0) {
    statusType = 'warning';
    statusMessage = 'Rangkaian belum tertutup utuh. Pastikan kabel mengalir dari kutub (+) baterai menuju saklar, lampu, dan kembali ke kutub (-).';
  }

  return {
    isClosedCircuit: litBulbIds.length > 0,
    isShortCircuit,
    activeCurrentAmpere: isShortCircuit ? 99 : (litBulbIds.length > 0 ? (isSeries ? 0.25 : 0.5 * litBulbIds.length) : 0),
    litBulbIds,
    isSeries,
    isParallel,
    voltages,
    statusType,
    statusMessage
  };
}
