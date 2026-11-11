/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlacedComponent, TerminalPosition } from './types';
import { getComponentTerminals } from './circuitSolver';
import { sounds } from '../../../services/sound';

interface CircuitComponentProps {
  component: PlacedComponent;
  isLit?: boolean;
  brightness?: number; // 0 to 1
  voltage?: number;
  isSelected?: boolean;
  selectedTerminalId?: string | null;
  onPointerDown: (e: React.PointerEvent, compId: string) => void;
  onTerminalClick: (terminalId: string) => void;
  onToggleSwitch?: (compId: string) => void;
  onToggleBulbFilament?: (compId: string) => void;
  onDeleteComponent?: (compId: string) => void;
}

export const CircuitComponent: React.FC<CircuitComponentProps> = ({
  component,
  isLit = false,
  brightness = 1.0,
  voltage,
  isSelected = false,
  selectedTerminalId = null,
  onPointerDown,
  onTerminalClick,
  onToggleSwitch,
  onToggleBulbFilament,
  onDeleteComponent
}) => {
  const terminals = getComponentTerminals(component);

  return (
    <g
      transform={`translate(${component.x}, ${component.y}) rotate(${component.rotation})`}
      className="cursor-move select-none"
      onPointerDown={(e) => onPointerDown(e, component.id)}
    >
      {/* Selection halo */}
      {isSelected && (
        <rect
          x="-75"
          y="-55"
          width="150"
          height="110"
          rx="12"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      )}

      {/* --- BATTERY COMPONENT --- */}
      {component.type === 'battery' && (
        <g>
          {/* Outer casing */}
          <rect x="-65" y="-35" width="130" height="70" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="-55" y="-25" width="110" height="50" rx="6" fill="#0f172a" />
          
          {/* Blue AA Cell */}
          <rect x="-45" y="-18" width="90" height="16" rx="3" fill="#3b82f6" />
          <rect x="-45" y="-18" width="22" height="16" fill="#1d4ed8" />
          <rect x="45" y="-15" width="4" height="10" rx="2" fill="#cbd5e1" />

          {/* Cell 2 */}
          <rect x="-45" y="4" width="90" height="16" rx="3" fill="#3b82f6" />
          <rect x="-45" y="4" width="22" height="16" fill="#1d4ed8" />
          <rect x="45" y="7" width="4" height="10" rx="2" fill="#cbd5e1" />

          <text x="0" y="2" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
            BATERAI {component.voltage || 3.0}V
          </text>
          <text x="-55" y="4" fill="#f87171" fontSize="13" fontWeight="bold" textAnchor="middle">+</text>
          <text x="55" y="4" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle">-</text>
        </g>
      )}

      {/* --- SWITCH COMPONENT --- */}
      {component.type === 'switch' && (
        <g>
          <rect x="-60" y="-35" width="120" height="70" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <text x="0" y="-18" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
            SAKLAR {component.isOpen ? '(OFF)' : '(ON)'}
          </text>

          {/* Contact posts */}
          <circle cx="-40" cy="5" r="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
          <circle cx="40" cy="5" r="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />

          {/* Knife lever */}
          {component.isOpen ? (
            <line x1="-40" y1="5" x2="20" y2="-25" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          ) : (
            <line x1="-40" y1="5" x2="40" y2="5" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          )}

          {/* Interactive Toggle Handle */}
          <circle
            cx={component.isOpen ? 20 : 40}
            cy={component.isOpen ? -25 : 5}
            r="8"
            fill="#ea580c"
            className="cursor-pointer hover:scale-110 transition-transform"
            onPointerDown={(e) => {
              e.stopPropagation();
              if (onToggleSwitch) onToggleSwitch(component.id);
            }}
          />
        </g>
      )}

      {/* --- LIGHT BULB COMPONENT --- */}
      {component.type === 'bulb' && (
        <g>
          {/* Bulb base mount */}
          <rect x="-55" y="10" width="110" height="45" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <text x="0" y="32" fill="#94a3b8" fontSize="9" fontWeight="bold" textAnchor="middle">
            {component.name || 'LAMPU 6V'} {voltage ? `(${voltage}V)` : ''}
          </text>

          {/* Threaded Socket */}
          <rect x="-18" y="0" width="36" height="14" rx="2" fill="#64748b" />

          {/* Realistic Dynamic Glow when Lit */}
          {isLit && (
            <circle
              cx="0"
              cy="-24"
              r={brightness < 0.6 ? 50 : 70}
              fill="url(#bulbRadialGlow)"
              filter="url(#bulbGlow)"
              opacity={brightness < 0.6 ? 0.6 : 1.0}
            />
          )}

          {/* Glass Dome */}
          <circle
            cx="0"
            cy="-24"
            r="26"
            fill={isLit ? (brightness < 0.6 ? '#fef08a' : '#ffffff') : '#334155'}
            fillOpacity={isLit ? 0.95 : 0.5}
            stroke={isLit ? '#facc15' : '#64748b'}
            strokeWidth="2"
            className="cursor-pointer"
            onPointerDown={(e) => {
              e.stopPropagation();
              if (onToggleBulbFilament) onToggleBulbFilament(component.id);
            }}
          />

          {/* Filament wire */}
          <path
            d="M -8 -12 L -3 -28 L 3 -28 L 8 -12"
            fill="none"
            stroke={component.isBroken ? '#475569' : (isLit ? '#ea580c' : '#94a3b8')}
            strokeWidth="2"
            strokeDasharray={component.isBroken ? '3 3' : 'none'}
          />

          {/* Broken indicator */}
          {component.isBroken && (
            <text x="0" y="-20" fill="#f87171" fontSize="14" fontWeight="bold" textAnchor="middle">✕</text>
          )}
        </g>
      )}

      {/* --- RESISTOR COMPONENT --- */}
      {component.type === 'resistor' && (
        <g>
          <rect x="-55" y="-25" width="110" height="50" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Ceramic Resistor Body */}
          <rect x="-35" y="-12" width="70" height="24" rx="4" fill="#fed7aa" stroke="#ca8a04" strokeWidth="1.5" />
          {/* Color bands */}
          <rect x="-22" y="-12" width="5" height="24" fill="#b91c1c" />
          <rect x="-10" y="-12" width="5" height="24" fill="#1e3a8a" />
          <rect x="2" y="-12" width="5" height="24" fill="#ca8a04" />
          <rect x="16" y="-12" width="4" height="24" fill="#eab308" />
          <text x="0" y="20" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle">
            RESISTOR 100Ω
          </text>
        </g>
      )}

      {/* --- TERMINAL PINS --- */}
      {terminals.map((t) => {
        const isSelected = selectedTerminalId === t.id;
        const relX = t.x - component.x;
        const relY = t.y - component.y;

        const isPositive = t.type === 'positive';
        const isNegative = t.type === 'negative';

        return (
          <g
            key={t.id}
            transform={`translate(${relX}, ${relY})`}
            className="cursor-pointer"
            onPointerDown={(e) => {
              e.stopPropagation();
              onTerminalClick(t.id);
            }}
          >
            {/* Pulsing ring if terminal is selected for wiring */}
            {isSelected && (
              <circle cx="0" cy="0" r="14" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            )}

            {/* Base plate */}
            <circle
              cx="0"
              cy="0"
              r="8"
              fill={isPositive ? '#dc2626' : (isNegative ? '#0f172a' : '#64748b')}
              stroke={isSelected ? '#38bdf8' : '#e2e8f0'}
              strokeWidth="2"
            />

            {/* Contact copper pin */}
            <circle cx="0" cy="0" r="3" fill={isPositive ? '#fca5a5' : '#cbd5e1'} />

            {/* Terminal Polarity Text */}
            {isPositive && (
              <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">+</text>
            )}
            {isNegative && (
              <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">-</text>
            )}
          </g>
        );
      })}

      {/* Delete mini button when selected */}
      {isSelected && onDeleteComponent && (
        <g
          transform="translate(60, -45)"
          className="cursor-pointer hover:scale-110 transition-transform"
          onPointerDown={(e) => {
            e.stopPropagation();
            sounds.playClick();
            onDeleteComponent(component.id);
          }}
        >
          <circle cx="0" cy="0" r="10" fill="#ef4444" />
          <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">✕</text>
        </g>
      )}
    </g>
  );
};
