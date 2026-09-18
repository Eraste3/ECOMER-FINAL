import React, { useCallback, useMemo, useRef } from 'react';
import { cn } from '../../utils/format';
import {
  LAGOON_PATH,
  LAND_PATH,
  MAP_HEIGHT,
  MAP_WIDTH,
  PORT_PATH,
  RIVER_PATH,
  ZONE_SHAPES } from
'../../data/mock-geo';
import { severityMeta } from '../../utils/labels';
import type { Perimeter, Report } from '../../types';

export interface MapViewProps {
  perimeters?: Perimeter[];
  reports?: Report[];
  userPosition?: {x: number;y: number;};
  selectedPerimeterId?: string | null;
  onSelectPerimeter?: (perimeter: Perimeter) => void;
  marker?: {x: number;y: number;};
  onMarkerMove?: (point: {x: number;y: number;}) => void;
  showHeatmap?: boolean;
  showZoneLabels?: boolean;
  showResolved?: boolean;
  clusterRadius?: number;
  className?: string;
  tone?: 'light' | 'dark';
  ariaLabel?: string;
}

function polygonPoints(polygon: Array<{x: number;y: number;}>): string {
  return polygon.map((p) => `${p.x},${p.y}`).join(' ');
}

export function MapView({
  perimeters = [],
  reports = [],
  userPosition,
  selectedPerimeterId,
  onSelectPerimeter,
  marker,
  onMarkerMove,
  showHeatmap = false,
  showZoneLabels = true,
  showResolved = true,
  clusterRadius,
  className,
  tone = 'dark',
  ariaLabel = 'Carte environnementale de Pointe-Noire'
}: MapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const visiblePerimeters = useMemo(
    () => showResolved ? perimeters : perimeters.filter((p) => p.status !== 'resolu'),
    [perimeters, showResolved]
  );

  const toLocal = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const local = pt.matrixTransform(ctm.inverse());
    return {
      x: Math.max(0, Math.min(MAP_WIDTH, Math.round(local.x))),
      y: Math.max(0, Math.min(MAP_HEIGHT, Math.round(local.y)))
    };
  }, []);

  const handlePointer = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!onMarkerMove || !dragging.current) return;
      const local = toLocal(e.clientX, e.clientY);
      if (local) onMarkerMove(local);
    },
    [onMarkerMove, toLocal]
  );

  const ocean = tone === 'dark' ? '#04101c' : '#dceefb';
  const land = tone === 'dark' ? '#0d2233' : '#f5f8fb';
  const landStroke = tone === 'dark' ? 'rgba(148,197,234,0.16)' : '#dbe4ee';
  const zoneStroke = tone === 'dark' ? 'rgba(148,197,234,0.14)' : '#e5ebf2';
  const labelColor = tone === 'dark' ? 'rgba(203,225,242,0.55)' : '#64748b';

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className={cn('h-full w-full', onMarkerMove && 'cursor-crosshair touch-none')}
        onPointerDown={(e) => {
          if (!onMarkerMove) return;
          dragging.current = true;
          const local = toLocal(e.clientX, e.clientY);
          if (local) onMarkerMove(local);
        }}
        onPointerMove={handlePointer}
        onPointerUp={() => dragging.current = false}
        onPointerLeave={() => dragging.current = false}>
        
        <defs>
          <pattern id="ecomerGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke={tone === 'dark' ? 'rgba(148,197,234,0.07)' : 'rgba(100,116,139,0.08)'}
              strokeWidth="1" />
            
          </pattern>
          <filter id="heatBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <linearGradient id="oceanWave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={tone === 'dark' ? '#062036' : '#c9e6fa'} />
            <stop offset="100%" stopColor={tone === 'dark' ? '#04101c' : '#e4f2fd'} />
          </linearGradient>
        </defs>

        {/* Océan */}
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#oceanWave)" />
        <g opacity={tone === 'dark' ? 0.5 : 0.7}>
          {[0, 1, 2, 3, 4, 5].map((i) =>
          <path
            key={i}
            d={`M 0 ${70 + i * 110} C 60 ${50 + i * 110}, 120 ${92 + i * 110}, 210 ${68 + i * 110}`}
            fill="none"
            stroke={tone === 'dark' ? 'rgba(34,211,238,0.16)' : 'rgba(18,115,184,0.18)'}
            strokeWidth="1.5" />

          )}
        </g>

        {/* Terre */}
        <path d={LAND_PATH} fill={land} stroke={landStroke} strokeWidth="1.5" />
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ecomerGrid)" clipPath="none" opacity="0.6" />

        {/* Quartiers */}
        <g>
          {ZONE_SHAPES.map((z) =>
          <polygon
            key={z.name}
            points={polygonPoints(z.polygon)}
            fill={tone === 'dark' ? 'rgba(148,197,234,0.03)' : 'rgba(15,23,42,0.02)'}
            stroke={zoneStroke}
            strokeWidth="1" />

          )}
        </g>

        {/* Hydrographie */}
        <path d={LAGOON_PATH} fill={tone === 'dark' ? '#062036' : '#d3e9fa'} stroke="rgba(34,211,238,0.25)" />
        <path d={RIVER_PATH} fill="none" stroke={tone === 'dark' ? '#0e4f7d' : '#9fd0f0'} strokeWidth="5" strokeLinecap="round" />
        <path d={PORT_PATH} fill="none" stroke={tone === 'dark' ? 'rgba(148,197,234,0.3)' : '#c3d3e2'} strokeWidth="2" />

        {/* Heatmap */}
        {showHeatmap &&
        <g filter="url(#heatBlur)" opacity="0.75">
            {visiblePerimeters.
          filter((p) => p.status !== 'resolu').
          map((p) =>
          <circle
            key={`heat-${p.id}`}
            cx={p.centroid.x}
            cy={p.centroid.y}
            r={30 + p.reportCount * 1.9}
            fill={severityMeta[p.severity].color}
            opacity="0.5" />

          )}
          </g>
        }

        {/* Rayon de clustering */}
        {clusterRadius !== undefined &&
        visiblePerimeters.map((p) =>
        <circle
          key={`radius-${p.id}`}
          cx={p.centroid.x}
          cy={p.centroid.y}
          r={clusterRadius / 3.2}
          fill="none"
          stroke="#f97316"
          strokeWidth="1.2"
          strokeDasharray="5 5"
          opacity="0.8" />

        )}

        {/* Périmètres de pollution */}
        <g>
          {visiblePerimeters.map((p) => {
            const meta = severityMeta[p.severity];
            const resolved = p.status === 'resolu';
            const selected = selectedPerimeterId === p.id;
            const color = resolved ? '#10b981' : meta.color;
            return (
              <g
                key={p.id}
                onClick={onSelectPerimeter ? () => onSelectPerimeter(p) : undefined}
                className={onSelectPerimeter ? 'cursor-pointer' : undefined}
                tabIndex={onSelectPerimeter ? 0 : -1}
                role={onSelectPerimeter ? 'button' : undefined}
                aria-label={`Périmètre ${p.id}, ${p.zone}, gravité ${meta.label}`}
                onKeyDown={(e) => {
                  if (onSelectPerimeter && (e.key === 'Enter' || e.key === ' ')) onSelectPerimeter(p);
                }}>
                
                <polygon
                  points={polygonPoints(p.polygon)}
                  fill={color}
                  fillOpacity={resolved ? 0.14 : selected ? 0.38 : 0.24}
                  stroke={color}
                  strokeWidth={selected ? 3 : 1.8}
                  strokeDasharray={resolved ? '6 4' : undefined}
                  className="transition-all duration-200" />
                
                {p.severity === 'critique' && !resolved &&
                <circle
                  cx={p.centroid.x}
                  cy={p.centroid.y}
                  r="14"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  className="animate-ping-slow"
                  style={{ transformOrigin: `${p.centroid.x}px ${p.centroid.y}px` }} />

                }
                <circle cx={p.centroid.x} cy={p.centroid.y} r="5" fill={color} stroke="#fff" strokeWidth="1.5" />
                <text
                  x={p.centroid.x}
                  y={p.centroid.y - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={tone === 'dark' ? '#e2e8f0' : '#0f172a'}>
                  
                  {p.id}
                </text>
              </g>);

          })}
        </g>

        {/* Signalements individuels */}
        <g>
          {reports.map((r) =>
          <g key={r.id}>
              <circle
              cx={r.point.x}
              cy={r.point.y}
              r="3.4"
              fill={r.status === 'resolu' ? '#10b981' : '#22d3ee'}
              stroke={tone === 'dark' ? '#04101c' : '#ffffff'}
              strokeWidth="1.2" />
            
              {r.priority &&
            <circle cx={r.point.x} cy={r.point.y} r="7" fill="none" stroke="#f97316" strokeWidth="1.4" />
            }
            </g>
          )}
        </g>

        {/* Libellés de quartiers */}
        {showZoneLabels &&
        <g>
            {ZONE_SHAPES.map((z) =>
          <text
            key={`label-${z.name}`}
            x={z.labelAt.x}
            y={z.labelAt.y}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill={labelColor}
            letterSpacing="0.5">
            
                {z.label.toUpperCase()}
              </text>
          )}
          </g>
        }

        {/* Position citoyenne */}
        {userPosition &&
        <g>
            <circle
            cx={userPosition.x}
            cy={userPosition.y}
            r="10"
            fill="#22d3ee"
            opacity="0.25"
            className="animate-ping-slow"
            style={{ transformOrigin: `${userPosition.x}px ${userPosition.y}px` }} />
          
            <circle cx={userPosition.x} cy={userPosition.y} r="6" fill="#22d3ee" stroke="#fff" strokeWidth="2" />
          </g>
        }

        {/* Marqueur déplaçable */}
        {marker &&
        <g transform={`translate(${marker.x} ${marker.y})`}>
            <path
            d="M0 0 c-9 -12 -13 -17 -13 -24 a13 13 0 1 1 26 0 c0 7 -4 12 -13 24 z"
            transform="translate(0 2)"
            fill="#f97316"
            stroke="#fff"
            strokeWidth="2" />
          
            <circle cx="0" cy="-22" r="4.5" fill="#fff" />
          </g>
        }
      </svg>
    </div>);

}