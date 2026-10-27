import React, { useState, useMemo } from 'react';
import { 
  GitCommit, 
  Grid3X3, 
  TrendingUp, 
  Layers, 
  Clock, 
  Shirt, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Filter,
  Eye,
  Sparkles
} from 'lucide-react';
import { Aprendiz, ChecklistRegistro } from '../types';

interface StatisticalTrioChartsProps {
  aprendices: Aprendiz[];
  checklist: ChecklistRegistro[];
  onSelectAprendiz?: (documento: string, ficha: string) => void;
}

export const StatisticalTrioCharts: React.FC<StatisticalTrioChartsProps> = ({
  aprendices,
  checklist,
  onSelectAprendiz
}) => {
  const [activeFichaFilter, setActiveFichaFilter] = useState<'todas' | '3384701' | '3384773'>('todas');
  const [hoveredSankey, setHoveredSankey] = useState<string | null>(null);
  const [hoveredBump, setHoveredBump] = useState<string | null>(null);
  const [hoveredHeatCell, setHoveredHeatCell] = useState<{
    aprendizNombre: string;
    documento: string;
    columna: string;
    fecha?: string;
    estado: string;
  } | null>(null);

  // Filtered apprentices based on selected cohort
  const filteredAprendices = useMemo(() => {
    if (activeFichaFilter === 'todas') return aprendices;
    return aprendices.filter(a => a.ficha === activeFichaFilter);
  }, [aprendices, activeFichaFilter]);

  // Checklist map for fast access
  const checklistMap = useMemo(() => {
    const map = new Map<string, ChecklistRegistro>();
    checklist.forEach(c => map.set(c.aprendizDocumento, c));
    return map;
  }, [checklist]);

  // Aggregate metrics
  const stats = useMemo(() => {
    let totPuntualidad1 = 0, totPuntualidad2 = 0, totPuntualidad3 = 0, totPuntualidadPMD = 0;
    let totUniforme1 = 0, totUniforme2 = 0, totUniforme3 = 0, totUniformePMD = 0;
    let totEvidencias1 = 0, totEvidencias2 = 0, totEvidencias3 = 0, totEvidenciasPMD = 0;

    let aprendicesConPuntualidad = 0;
    let aprendicesConUniforme = 0;
    let aprendicesConEvidencias = 0;
    let aprendicesAlDia = 0;

    let medidasEntregadas = 0;
    let medidasPendientes = 0;
    let totalPMDActivos = 0;

    filteredAprendices.forEach(a => {
      const c = checklistMap.get(a.documento);
      if (!c) {
        aprendicesAlDia++;
        return;
      }

      let tienePunt = false;
      let tieneUni = false;
      let tieneEvid = false;

      // Puntualidad
      if (c.puntualidad1Fecha) { totPuntualidad1++; tienePunt = true; if (c.puntualidad1Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.puntualidad2Fecha) { totPuntualidad2++; tienePunt = true; if (c.puntualidad2Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.puntualidad3Fecha) { totPuntualidad3++; tienePunt = true; if (c.puntualidad3Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.puntualidadPlanMejoramiento) { totPuntualidadPMD++; totalPMDActivos++; }

      // Uniforme
      if (c.uniforme1Fecha) { totUniforme1++; tieneUni = true; if (c.uniforme1Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.uniforme2Fecha) { totUniforme2++; tieneUni = true; if (c.uniforme2Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.uniforme3Fecha) { totUniforme3++; tieneUni = true; if (c.uniforme3Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.uniformePlanMejoramiento) { totUniformePMD++; totalPMDActivos++; }

      // Evidencias
      if (c.evidencias1Fecha) { totEvidencias1++; tieneEvid = true; if (c.evidencias1Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.evidencias2Fecha) { totEvidencias2++; tieneEvid = true; if (c.evidencias2Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.evidencias3Fecha) { totEvidencias3++; tieneEvid = true; if (c.evidencias3Entregada) medidasEntregadas++; else medidasPendientes++; }
      if (c.evidenciasPlanMejoramiento) { totEvidenciasPMD++; totalPMDActivos++; }

      if (tienePunt) aprendicesConPuntualidad++;
      if (tieneUni) aprendicesConUniforme++;
      if (tieneEvid) aprendicesConEvidencias++;
      if (!tienePunt && !tieneUni && !tieneEvid) aprendicesAlDia++;
    });

    const totPunt = totPuntualidad1 + totPuntualidad2 + totPuntualidad3;
    const totUni = totUniforme1 + totUniforme2 + totUniforme3;
    const totEvid = totEvidencias1 + totEvidencias2 + totEvidencias3;

    return {
      totPunt, totUni, totEvid,
      totPuntualidad1, totPuntualidad2, totPuntualidad3, totPuntualidadPMD,
      totUniforme1, totUniforme2, totUniforme3, totUniformePMD,
      totEvidencias1, totEvidencias2, totEvidencias3, totEvidenciasPMD,
      aprendicesConPuntualidad,
      aprendicesConUniforme,
      aprendicesConEvidencias,
      aprendicesAlDia,
      medidasEntregadas,
      medidasPendientes,
      totalPMDActivos,
      totalLlamados: totPunt + totUni + totEvid
    };
  }, [filteredAprendices, checklistMap]);

  // ==========================================
  // 1. SANKEY DIAGRAM CONFIGURATION & FLOWS
  // ==========================================
  // Left: Fichas -> Middle: 3 Componentes + Al Día -> Right: Medidas Entregadas / Pendientes / PMD
  const sankeyNodes = useMemo(() => {
    const f1Count = activeFichaFilter === '3384773' ? 0 : 28;
    const f2Count = activeFichaFilter === '3384701' ? 0 : 28;
    const totalPob = filteredAprendices.length || 1;

    return {
      f1: { label: 'Ficha 3384701', count: f1Count, color: '#059669', x: 20, y: 35, h: 65 },
      f2: { label: 'Ficha 3384773', count: f2Count, color: '#10b981', x: 20, y: 125, h: 65 },

      // Middle components
      punt: { label: 'Puntualidad', count: Math.max(stats.totPunt, 1), color: '#d97706', x: 175, y: 25, h: 42 },
      uni: { label: 'Uniforme', count: Math.max(stats.totUni, 1), color: '#0d9488', x: 175, y: 75, h: 36 },
      evid: { label: 'Evidencias', count: Math.max(stats.totEvid, 1), color: '#4f46e5', x: 175, y: 120, h: 36 },
      aldia: { label: 'Al Día', count: Math.max(stats.aprendicesAlDia, 1), color: '#10b981', x: 175, y: 165, h: 45 },

      // Right: Results / Measures
      entregadas: { label: 'Entregadas', count: Math.max(stats.medidasEntregadas, 1), color: '#10b981', x: 330, y: 30, h: 45 },
      pendientes: { label: 'Pendientes', count: Math.max(stats.medidasPendientes, 1), color: '#f59e0b', x: 330, y: 90, h: 50 },
      pmd: { label: 'PMD Activo', count: Math.max(stats.totalPMDActivos, 1), color: '#e11d48', x: 330, y: 155, h: 45 },
    };
  }, [activeFichaFilter, filteredAprendices.length, stats]);

  // Helper to generate cubic bezier curve ribbon for Sankey
  const createSankeyRibbon = (
    x0: number, y0: number, h0: number,
    x1: number, y1: number, h1: number
  ) => {
    const mx = (x0 + x1) / 2;
    return `M ${x0} ${y0} 
            C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1} 
            L ${x1} ${y1 + h1} 
            C ${mx} ${y1 + h1}, ${mx} ${y0 + h0}, ${x0} ${y0 + h0} 
            Z`;
  };

  // ==========================================
  // 2. HEATMAP (MAPA DE CALOR) MATRIX
  // ==========================================
  // Top 10 Aprendices with most activity + columns
  const heatmapData = useMemo(() => {
    const cols = [
      { id: 'uni1', label: 'U1', full: 'Uniforme 1°' },
      { id: 'uni2', label: 'U2', full: 'Uniforme 2°' },
      { id: 'uni3', label: 'U3', full: 'Uniforme 3°' },
      { id: 'punt1', label: 'P1', full: 'Puntualidad 1°' },
      { id: 'punt2', label: 'P2', full: 'Puntualidad 2°' },
      { id: 'punt3', label: 'P3', full: 'Puntualidad 3°' },
      { id: 'evid1', label: 'E1', full: 'Evidencias 1°' },
      { id: 'evid2', label: 'E2', full: 'Evidencias 2°' },
      { id: 'evid3', label: 'E3', full: 'Evidencias 3°' },
      { id: 'pmd', label: 'PMD', full: 'Plan Mejoramiento' }
    ];

    // Score apprentices by activity
    const rows = filteredAprendices.map(a => {
      const c = checklistMap.get(a.documento);
      let score = 0;
      const cells: Record<string, { value: number; fecha?: string; entregada?: boolean; label: string }> = {};

      if (c) {
        // Uniforme
        if (c.uniforme1Fecha) { score += 1; cells['uni1'] = { value: 1, fecha: c.uniforme1Fecha, entregada: c.uniforme1Entregada, label: 'Uniforme 1°' }; }
        if (c.uniforme2Fecha) { score += 2; cells['uni2'] = { value: 2, fecha: c.uniforme2Fecha, entregada: c.uniforme2Entregada, label: 'Uniforme 2°' }; }
        if (c.uniforme3Fecha) { score += 3; cells['uni3'] = { value: 3, fecha: c.uniforme3Fecha, entregada: c.uniforme3Entregada, label: 'Uniforme 3°' }; }

        // Puntualidad
        if (c.puntualidad1Fecha) { score += 1; cells['punt1'] = { value: 1, fecha: c.puntualidad1Fecha, entregada: c.puntualidad1Entregada, label: 'Puntualidad 1°' }; }
        if (c.puntualidad2Fecha) { score += 2; cells['punt2'] = { value: 2, fecha: c.puntualidad2Fecha, entregada: c.puntualidad2Entregada, label: 'Puntualidad 2°' }; }
        if (c.puntualidad3Fecha) { score += 3; cells['punt3'] = { value: 3, fecha: c.puntualidad3Fecha, entregada: c.puntualidad3Entregada, label: 'Puntualidad 3°' }; }

        // Evidencias
        if (c.evidencias1Fecha) { score += 1; cells['evid1'] = { value: 1, fecha: c.evidencias1Fecha, entregada: c.evidencias1Entregada, label: 'Evidencias 1°' }; }
        if (c.evidencias2Fecha) { score += 2; cells['evid2'] = { value: 2, fecha: c.evidencias2Fecha, entregada: c.evidencias2Entregada, label: 'Evidencias 2°' }; }
        if (c.evidencias3Fecha) { score += 3; cells['evid3'] = { value: 3, fecha: c.evidencias3Fecha, entregada: c.evidencias3Entregada, label: 'Evidencias 3°' }; }

        // PMD
        if (c.uniformePlanMejoramiento || c.puntualidadPlanMejoramiento || c.evidenciasPlanMejoramiento) {
          score += 5;
          cells['pmd'] = { value: 4, fecha: c.uniformePlanFecha || c.puntualidadPlanFecha || c.evidenciasPlanFecha, entregada: c.uniformePlanEntregado || c.puntualidadPlanEntregado, label: 'PMD Activo' };
        }
      }

      return {
        aprendiz: a,
        score,
        cells
      };
    });

    // Sort to place apprentices with infractions first, then pad up to 8 rows
    rows.sort((a, b) => b.score - a.score);
    const displayRows = rows.slice(0, 7);

    return { cols, rows: displayRows };
  }, [filteredAprendices, checklistMap]);

  // ==========================================
  // 3. BUMP CHART (RANKING EVOLUTION)
  // ==========================================
  // Stages: 1° Llamado -> 2° Llamado -> 3° Llamado -> PMD
  // Tracking 3 Components: Puntualidad, Uniforme, Evidencias
  const bumpData = useMemo(() => {
    const stages = [
      { id: 'etapa1', name: '1° Llamado' },
      { id: 'etapa2', name: '2° Llamado' },
      { id: 'etapa3', name: '3° Llamado' },
      { id: 'etapa4', name: 'PMD Activado' },
    ];

    // Compute counts at each stage
    const pCounts = [stats.totPuntualidad1, stats.totPuntualidad2, stats.totPuntualidad3, stats.totPuntualidadPMD];
    const uCounts = [stats.totUniforme1, stats.totUniforme2, stats.totUniforme3, stats.totUniformePMD];
    const eCounts = [stats.totEvidencias1, stats.totEvidencias2, stats.totEvidencias3, stats.totEvidenciasPMD];

    // Calculate rank 1, 2, 3 at each stage
    const series = [
      { id: 'punt', name: 'Puntualidad', color: '#d97706', bg: '#fef3c7', counts: pCounts, ranks: [1, 1, 1, 1] },
      { id: 'uni', name: 'Uniforme', color: '#059669', bg: '#d1fae5', counts: uCounts, ranks: [2, 2, 2, 2] },
      { id: 'evid', name: 'Evidencias', color: '#4f46e5', bg: '#e0e7ff', counts: eCounts, ranks: [3, 3, 3, 3] },
    ];

    // Dynamically assign rank per stage based on counts (ties handled gracefully)
    for (let stageIdx = 0; stageIdx < 4; stageIdx++) {
      const stageScores = series.map((s, idx) => ({ sIdx: idx, count: s.counts[stageIdx] }));
      // Sort descending by count
      stageScores.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.sIdx - b.sIdx;
      });
      stageScores.forEach((item, rankIdx) => {
        series[item.sIdx].ranks[stageIdx] = rankIdx + 1;
      });
    }

    return { stages, series };
  }, [stats]);

  // Helper for Bump Chart SVG path
  const createBumpSpline = (ranks: number[], width = 360, height = 180) => {
    // Stage X coordinates (4 stages evenly spaced)
    const xs = [45, 140, 235, 330];
    // Y coordinates mapped to Rank 1 (top), Rank 2 (mid), Rank 3 (bottom)
    const rankY: Record<number, number> = {
      1: 35,
      2: 95,
      3: 155
    };

    let path = `M ${xs[0]} ${rankY[ranks[0]]}`;
    for (let i = 0; i < 3; i++) {
      const x0 = xs[i];
      const y0 = rankY[ranks[i]];
      const x1 = xs[i + 1];
      const y1 = rankY[ranks[i + 1]];
      const mx = (x0 + x1) / 2;
      path += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
    }
    return { path, xs, rankY };
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30 space-y-6">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
              <Sparkles className="w-3.5 h-3.5" />
              Tablero Estadístico Avanzado · Rol de Aprendiz
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Acuerdo 009 de 2024 SENA CSF
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Visualización Comparativa de Incumplimientos
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Monitoreo analítico en tiempo real a través de 3 modelos gráficos estadísticos: 
            <strong> Flujo de Sankey</strong>, <strong>Mapa de Calor Matricial</strong> y <strong>Bump Chart de Evolución</strong>.
          </p>
        </div>

        {/* FILTRO DE COHORTE / FICHA */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/10 self-start lg:self-auto">
          <Filter className="w-3.5 h-3.5 text-emerald-400 ml-2" />
          <span className="text-xs font-semibold text-slate-300 mr-1">Ficha:</span>
          {(['todas', '3384701', '3384773'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFichaFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFichaFilter === f
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {f === 'todas' ? 'Ambas Fichas (56)' : `Ficha ${f} (28)`}
            </button>
          ))}
        </div>
      </div>

      {/* 3 IMÁGENES / GRÁFICOS ALINEADOS HORIZONTALMENTE (GRID DE 3 COLUMNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ------------------------------------------------------------------ */}
        {/* GRÁFICO 1: DIAGRAMA DE SANKEY (FLUJO DE CUMPLIMIENTO) */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-emerald-400/40 transition-all group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <GitCommit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">1. Diagrama de Sankey</h3>
                  <span className="text-[11px] text-slate-400">Flujo: Población &rarr; Componentes &rarr; Estado</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-emerald-300">
                {stats.totalLlamados} registros
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Mapea el recorrido de los aprendices desde su cohorte hasta el componente infringido y el estado formativo actual.
            </p>

            {/* SVG SANKEY CANVAS */}
            <div className="relative w-full h-[220px] bg-slate-950/70 rounded-xl border border-white/5 p-2 flex items-center justify-center overflow-hidden">
              <svg 
                viewBox="0 0 400 210" 
                className="w-full h-full select-none"
              >
                <defs>
                  <linearGradient id="gradF1Punt" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="gradF1Uni" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="gradF2Evid" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="gradMidEntregadas" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="gradMidPendientes" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.45" />
                  </linearGradient>
                  <linearGradient id="gradMidPMD" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity="0.55" />
                  </linearGradient>
                </defs>

                {/* RIBBONS (Stage 1 to 2) */}
                <path 
                  d={createSankeyRibbon(70, sankeyNodes.f1.y + 5, 20, sankeyNodes.punt.x, sankeyNodes.punt.y + 5, 18)} 
                  fill="url(#gradF1Punt)"
                  className="transition-opacity hover:opacity-100"
                />
                <path 
                  d={createSankeyRibbon(70, sankeyNodes.f1.y + 30, 22, sankeyNodes.uni.x, sankeyNodes.uni.y + 5, 18)} 
                  fill="url(#gradF1Uni)"
                  className="transition-opacity hover:opacity-100"
                />
                <path 
                  d={createSankeyRibbon(70, sankeyNodes.f2.y + 10, 24, sankeyNodes.evid.x, sankeyNodes.evid.y + 5, 18)} 
                  fill="url(#gradF2Evid)"
                  className="transition-opacity hover:opacity-100"
                />
                <path 
                  d={createSankeyRibbon(70, sankeyNodes.f2.y + 38, 22, sankeyNodes.aldia.x, sankeyNodes.aldia.y + 5, 24)} 
                  fill="#10b981"
                  fillOpacity="0.25"
                  className="transition-opacity hover:opacity-100"
                />

                {/* RIBBONS (Stage 2 to 3) */}
                <path 
                  d={createSankeyRibbon(sankeyNodes.punt.x + 40, sankeyNodes.punt.y + 10, 16, sankeyNodes.entregadas.x, sankeyNodes.entregadas.y + 5, 18)} 
                  fill="url(#gradMidEntregadas)"
                  className="transition-opacity hover:opacity-100"
                />
                <path 
                  d={createSankeyRibbon(sankeyNodes.uni.x + 40, sankeyNodes.uni.y + 10, 16, sankeyNodes.pendientes.x, sankeyNodes.pendientes.y + 10, 20)} 
                  fill="url(#gradMidPendientes)"
                  className="transition-opacity hover:opacity-100"
                />
                <path 
                  d={createSankeyRibbon(sankeyNodes.evid.x + 40, sankeyNodes.evid.y + 10, 16, sankeyNodes.pmd.x, sankeyNodes.pmd.y + 8, 18)} 
                  fill="url(#gradMidPMD)"
                  className="transition-opacity hover:opacity-100"
                />

                {/* NODES (LEFT: Fichas) */}
                <g>
                  <rect x={sankeyNodes.f1.x} y={sankeyNodes.f1.y} width={50} height={sankeyNodes.f1.h} rx={6} fill={sankeyNodes.f1.color} opacity="0.9" />
                  <text x={sankeyNodes.f1.x + 25} y={sankeyNodes.f1.y + 28} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">3384701</text>
                  <text x={sankeyNodes.f1.x + 25} y={sankeyNodes.f1.y + 44} fill="#d1fae5" fontSize="8" textAnchor="middle">{sankeyNodes.f1.count} apr</text>

                  <rect x={sankeyNodes.f2.x} y={sankeyNodes.f2.y} width={50} height={sankeyNodes.f2.h} rx={6} fill={sankeyNodes.f2.color} opacity="0.9" />
                  <text x={sankeyNodes.f2.x + 25} y={sankeyNodes.f2.y + 28} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">3384773</text>
                  <text x={sankeyNodes.f2.x + 25} y={sankeyNodes.f2.y + 44} fill="#d1fae5" fontSize="8" textAnchor="middle">{sankeyNodes.f2.count} apr</text>
                </g>

                {/* NODES (MIDDLE: Componentes) */}
                <g>
                  <rect x={sankeyNodes.punt.x} y={sankeyNodes.punt.y} width={45} height={sankeyNodes.punt.h} rx={6} fill={sankeyNodes.punt.color} />
                  <text x={sankeyNodes.punt.x + 22} y={sankeyNodes.punt.y + 20} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Puntual.</text>
                  <text x={sankeyNodes.punt.x + 22} y={sankeyNodes.punt.y + 32} fill="#fef3c7" fontSize="8" textAnchor="middle">({stats.totPunt})</text>

                  <rect x={sankeyNodes.uni.x} y={sankeyNodes.uni.y} width={45} height={sankeyNodes.uni.h} rx={6} fill={sankeyNodes.uni.color} />
                  <text x={sankeyNodes.uni.x + 22} y={sankeyNodes.uni.y + 17} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Uniforme</text>
                  <text x={sankeyNodes.uni.x + 22} y={sankeyNodes.uni.y + 29} fill="#ccfbf1" fontSize="8" textAnchor="middle">({stats.totUni})</text>

                  <rect x={sankeyNodes.evid.x} y={sankeyNodes.evid.y} width={45} height={sankeyNodes.evid.h} rx={6} fill={sankeyNodes.evid.color} />
                  <text x={sankeyNodes.evid.x + 22} y={sankeyNodes.evid.y + 17} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Evidenc.</text>
                  <text x={sankeyNodes.evid.x + 22} y={sankeyNodes.evid.y + 29} fill="#e0e7ff" fontSize="8" textAnchor="middle">({stats.totEvid})</text>

                  <rect x={sankeyNodes.aldia.x} y={sankeyNodes.aldia.y} width={45} height={sankeyNodes.aldia.h} rx={6} fill={sankeyNodes.aldia.color} />
                  <text x={sankeyNodes.aldia.x + 22} y={sankeyNodes.aldia.y + 20} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Al Día</text>
                  <text x={sankeyNodes.aldia.x + 22} y={sankeyNodes.aldia.y + 32} fill="#d1fae5" fontSize="8" textAnchor="middle">({stats.aprendicesAlDia})</text>
                </g>

                {/* NODES (RIGHT: Estados) */}
                <g>
                  <rect x={sankeyNodes.entregadas.x} y={sankeyNodes.entregadas.y} width={50} height={sankeyNodes.entregadas.h} rx={6} fill={sankeyNodes.entregadas.color} />
                  <text x={sankeyNodes.entregadas.x + 25} y={sankeyNodes.entregadas.y + 20} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Entregadas</text>
                  <text x={sankeyNodes.entregadas.x + 25} y={sankeyNodes.entregadas.y + 32} fill="#d1fae5" fontSize="8" textAnchor="middle">✓ {stats.medidasEntregadas}</text>

                  <rect x={sankeyNodes.pendientes.x} y={sankeyNodes.pendientes.y} width={50} height={sankeyNodes.pendientes.h} rx={6} fill={sankeyNodes.pendientes.color} />
                  <text x={sankeyNodes.pendientes.x + 25} y={sankeyNodes.pendientes.y + 22} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Pendientes</text>
                  <text x={sankeyNodes.pendientes.x + 25} y={sankeyNodes.pendientes.y + 34} fill="#fef3c7" fontSize="8" textAnchor="middle">⏳ {stats.medidasPendientes}</text>

                  <rect x={sankeyNodes.pmd.x} y={sankeyNodes.pmd.y} width={50} height={sankeyNodes.pmd.h} rx={6} fill={sankeyNodes.pmd.color} />
                  <text x={sankeyNodes.pmd.x + 25} y={sankeyNodes.pmd.y + 20} fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">PMD Activo</text>
                  <text x={sankeyNodes.pmd.x + 25} y={sankeyNodes.pmd.y + 32} fill="#ffe4e6" fontSize="8" textAnchor="middle">⚠ {stats.totalPMDActivos}</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Fuente: Matriz de Registro</span>
            <span className="text-emerald-400 font-bold">Distribución proporcional</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* GRÁFICO 2: MAPA DE CALOR (HEATMAP MATRICIAL DE INCUMPLIMIENTOS) */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-emerald-400/40 transition-all group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  <Grid3X3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">2. Mapa de Calor (Heatmap)</h3>
                  <span className="text-[11px] text-slate-400">Matriz 2D: Aprendices vs Nivel de Incumplimiento</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-amber-300">
                10 Indicadores
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Intensidad de color según gravedad y reiteración: <span className="text-emerald-400">Verde</span> (al día), <span className="text-amber-400">Ámbar</span> (1°), <span className="text-orange-400">Naranja</span> (2°), <span className="text-red-400">Rojo</span> (3°/PMD).
            </p>

            {/* MATRIZ DE CALOR */}
            <div className="w-full bg-slate-950/70 rounded-xl border border-white/5 p-2.5 overflow-x-auto">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr>
                    <th className="text-left text-slate-400 font-semibold p-1 pb-1.5 w-24">Aprendiz</th>
                    {heatmapData.cols.map(c => (
                      <th key={c.id} className="text-center font-bold text-slate-300 p-1 pb-1.5" title={c.full}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {heatmapData.rows.map(({ aprendiz, cells }) => (
                    <tr 
                      key={aprendiz.documento} 
                      className="hover:bg-white/5 transition-colors cursor-pointer group/row"
                      onClick={() => onSelectAprendiz && onSelectAprendiz(aprendiz.documento, aprendiz.ficha)}
                      title="Clic para ver detalle de este aprendiz"
                    >
                      <td className="p-1 font-medium text-slate-300 truncate max-w-[95px]">
                        {aprendiz.nombre.split(' ')[0]} {aprendiz.apellidos.split(' ')[0][0]}.
                      </td>
                      {heatmapData.cols.map(c => {
                        const cell = cells[c.id];
                        let bgClass = 'bg-white/5 text-slate-600';
                        let symbol = '·';

                        if (cell) {
                          if (cell.entregada) {
                            bgClass = 'bg-emerald-500/80 text-white font-bold shadow-xs';
                            symbol = '✓';
                          } else if (cell.value === 1) {
                            bgClass = 'bg-amber-400 text-slate-950 font-black shadow-xs';
                            symbol = '1';
                          } else if (cell.value === 2) {
                            bgClass = 'bg-orange-500 text-white font-black shadow-xs';
                            symbol = '2';
                          } else if (cell.value === 3) {
                            bgClass = 'bg-rose-600 text-white font-black shadow-xs';
                            symbol = '3';
                          } else if (cell.value === 4) {
                            bgClass = 'bg-purple-600 text-white font-black animate-pulse';
                            symbol = 'PMD';
                          }
                        }

                        return (
                          <td key={c.id} className="p-0.5 text-center">
                            <div 
                              onMouseEnter={() => {
                                if (cell) {
                                  setHoveredHeatCell({
                                    aprendizNombre: `${aprendiz.nombre} ${aprendiz.apellidos}`,
                                    documento: aprendiz.documento,
                                    columna: c.full,
                                    fecha: cell.fecha,
                                    estado: cell.entregada ? 'Entregada' : `Llamado Activo (${symbol})`
                                  });
                                }
                              }}
                              onMouseLeave={() => setHoveredHeatCell(null)}
                              className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center transition-transform hover:scale-115 ${bgClass}`}
                            >
                              {symbol}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOOLTIP DINÁMICO DEL MAPA DE CALOR */}
              <div className="mt-2 min-h-[22px] px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-slate-300 flex items-center justify-between">
                {hoveredHeatCell ? (
                  <>
                    <span className="font-semibold text-white">
                      {hoveredHeatCell.aprendizNombre} &bull; <strong className="text-amber-300">{hoveredHeatCell.columna}</strong>
                    </span>
                    <span className="text-emerald-400">
                      {hoveredHeatCell.estado} {hoveredHeatCell.fecha ? `(${hoveredHeatCell.fecha})` : ''}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Info className="w-3 h-3 text-slate-500" />
                    Pasa el cursor sobre una celda para ver el incidente registrado
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>U: Uniforme &bull; P: Puntualidad &bull; E: Evidencias</span>
            <span className="text-amber-400 font-bold">Matriz de densidad</span>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* GRÁFICO 3: BUMP CHART (RANKING DE EVOLUCIÓN POR LLAMADO) */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between hover:border-emerald-400/40 transition-all group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">3. Bump Chart</h3>
                  <span className="text-[11px] text-slate-400">Evolución de Ranking según Etapas Formativas</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-indigo-300">
                4 Etapas
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Traza la posición relativa de cada componente (#1 al #3) a medida que los aprendices avanzan en el régimen disciplinario.
            </p>

            {/* SVG BUMP CHART */}
            <div className="relative w-full h-[220px] bg-slate-950/70 rounded-xl border border-white/5 p-2 flex items-center justify-center overflow-hidden">
              <svg 
                viewBox="0 0 380 200" 
                className="w-full h-full select-none"
              >
                {/* Horizontal guide lines for Rank 1, 2, 3 */}
                <line x1="45" y1="35" x2="330" y2="35" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="45" y1="95" x2="330" y2="95" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="45" y1="155" x2="330" y2="155" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />

                {/* Y-Axis labels */}
                <text x="18" y="38" fill="#e2e8f0" fontSize="9" fontWeight="bold">Top 1</text>
                <text x="18" y="98" fill="#94a3b8" fontSize="9" fontWeight="bold">Top 2</text>
                <text x="18" y="158" fill="#64748b" fontSize="9" fontWeight="bold">Top 3</text>

                {/* CURVING TRAJECTORY PATHS (SPLINES) */}
                {bumpData.series.map(s => {
                  const { path, xs, rankY } = createBumpSpline(s.ranks);
                  const isHovered = hoveredBump === s.id;
                  const isAnyHovered = hoveredBump !== null;

                  return (
                    <g 
                      key={s.id} 
                      onMouseEnter={() => setHoveredBump(s.id)}
                      onMouseLeave={() => setHoveredBump(null)}
                      className="cursor-pointer transition-all"
                    >
                      {/* Glow path behind */}
                      <path 
                        d={path} 
                        fill="none" 
                        stroke={s.color} 
                        strokeWidth={isHovered ? 8 : 4} 
                        strokeLinecap="round"
                        strokeOpacity={isHovered ? 0.9 : isAnyHovered ? 0.2 : 0.75}
                      />

                      {/* Circles for each stage */}
                      {s.ranks.map((rank, i) => (
                        <g key={i}>
                          <circle 
                            cx={xs[i]} 
                            cy={rankY[rank]} 
                            r={isHovered ? 11 : 8.5} 
                            fill={s.color} 
                            stroke="#0f172a" 
                            strokeWidth="2.5"
                          />
                          <text 
                            x={xs[i]} 
                            y={rankY[rank] + 3} 
                            fill="#ffffff" 
                            fontSize={isHovered ? "9" : "7.5"} 
                            fontWeight="black" 
                            textAnchor="middle"
                          >
                            {rank}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })}

                {/* X-Axis Stage Labels at bottom */}
                {bumpData.stages.map((st, i) => {
                  const xs = [45, 140, 235, 330];
                  return (
                    <text 
                      key={st.id} 
                      x={xs[i]} 
                      y="190" 
                      fill="#94a3b8" 
                      fontSize="8.5" 
                      fontWeight="bold" 
                      textAnchor="middle"
                    >
                      {st.name}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* LEYENDA DEL BUMP CHART */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Puntualidad
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Uniforme
              </span>
              <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                Evidencias
              </span>
            </div>
            <span className="text-indigo-400 font-bold">Curvas de rango</span>
          </div>
        </div>

      </div>

    </div>
  );
};
