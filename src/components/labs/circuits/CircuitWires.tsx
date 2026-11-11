/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wire } from './types';

interface TerminalPoint {
  id: string;
  x: number;
  y: number;
}

interface CircuitWiresProps {
  wires: Wire[];
  terminalsMap: Map<string, TerminalPoint>;
  isCurrentFlowing: boolean;
  isSeries?: boolean;
  onRemoveWire: (wireId: string) => void;
  inProgressWire?: {
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    color: string;
  } | null;
}

export const CircuitWires: React.FC<CircuitWiresProps> = ({
  wires,
  terminalsMap,
  isCurrentFlowing,
  isSeries = false,
  onRemoveWire,
  inProgressWire
}) => {
  const wireColorCodes = {
    red: '#ef4444',
    black: '#1e293b',
    blue: '#38bdf8',
    yellow: '#facc15'
  };

  return (
    <g>
      {/* Existing Wires */}
      {wires.map((wire) => {
        const from = terminalsMap.get(wire.fromTerminalId);
        const to = terminalsMap.get(wire.toTerminalId);
        if (!from || !to) return null;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        // Natural sag/droop
        const sag = Math.min(Math.hypot(dx, dy) * 0.15, 45);
        const curveY = midY + sag;

        const pathData = `M ${from.x} ${from.y} Q ${midX} ${curveY} ${to.x} ${to.y}`;
        const mainColor = wireColorCodes[wire.color] || '#38bdf8';

        return (
          <g key={wire.id} className="group cursor-pointer">
            {/* Wide transparent hit area */}
            <path
              d={pathData}
              fill="none"
              stroke="transparent"
              strokeWidth="24"
              onPointerDown={(e) => {
                e.stopPropagation();
                onRemoveWire(wire.id);
              }}
            />

            {/* Outer wire insulation shadow/border */}
            <path
              d={pathData}
              fill="none"
              stroke="#0f172a"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Main wire colored cable */}
            <path
              d={pathData}
              fill="none"
              stroke={mainColor}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Inner highlight core */}
            <path
              d={pathData}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1"
              strokeOpacity="0.4"
              strokeLinecap="round"
            />

            {/* Flowing electric electron particles */}
            {isCurrentFlowing && (
              <path
                d={pathData}
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="6 14"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="40"
                  to="0"
                  dur={isSeries ? '1.8s' : '1.0s'}
                  repeatCount="indefinite"
                />
              </path>
            )}

            {/* Hover Delete Button badge */}
            <circle
              cx={midX}
              cy={curveY}
              r="10"
              fill="#ef4444"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onPointerDown={(e) => {
                e.stopPropagation();
                onRemoveWire(wire.id);
              }}
            />
            <text
              x={midX}
              y={curveY + 4}
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              className="opacity-0 group-hover:opacity-100 pointer-events-none"
            >
              ✕
            </text>
          </g>
        );
      })}

      {/* Rubber-band wire in progress */}
      {inProgressWire && (
        <line
          x1={inProgressWire.fromX}
          y1={inProgressWire.fromY}
          x2={inProgressWire.toX}
          y2={inProgressWire.toY}
          stroke={inProgressWire.color || '#38bdf8'}
          strokeWidth="3"
          strokeDasharray="4 4"
        />
      )}
    </g>
  );
};
