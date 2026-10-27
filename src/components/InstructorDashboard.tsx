import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Users,
  Clock,
  Shirt,
  BookOpen,
  Filter,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  Award
} from 'lucide-react';
import { Aprendiz, Novedad, ChecklistRegistro } from '../types';

interface InstructorDashboardProps {
  aprendices: Aprendiz[];
  checklist: ChecklistRegistro[];
  novedades: Novedad[];
  onSelectAprendiz?: (documento: string) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  aprendices,
  checklist,
  novedades,
  onSelectAprendiz
}) => {
  const [fichaFiltro, setFichaFiltro] = useState<string>('todos');
  const [tipoGrafico, setTipoGrafico] = useState<'apilado' | 'comparativo'>('apilado');

  // Filtrado de aprendices y checklist según ficha seleccionada
  const filteredAprendices = useMemo(() => {
    if (fichaFiltro === 'todos') return aprendices;
    return aprendices.filter(a => a.ficha === fichaFiltro);
  }, [aprendices, fichaFiltro]);

  const filteredChecklist = useMemo(() => {
    if (fichaFiltro === 'todos') return checklist;
    return checklist.filter(c => c.ficha === fichaFiltro);
  }, [checklist, fichaFiltro]);

  // Cómputo analítico por Tipo y Nivel de Gravedad
  const analyticsData = useMemo(() => {
    // Definición de Niveles de Gravedad según el Acuerdo 009 de 2024:
    // Nivel 1 = Leve / Preventivo (1° Llamado de atención formativo)
    // Nivel 2 = Moderado / Advertencia (2° Llamado de atención con medida formativa)
    // Nivel 3 = Grave / Conminatorio (3° Llamado con citación)
    // PMD = Crítico / Plan de Mejoramiento Disciplinario

    let uniformeL1 = 0;
    let uniformeL2 = 0;
    let uniformeL3 = 0;
    let uniformePMD = 0;
    let uniformeEntregadas = 0;
    let uniformePendientes = 0;

    let puntualidadL1 = 0;
    let puntualidadL2 = 0;
    let puntualidadL3 = 0;
    let puntualidadPMD = 0;
    let puntualidadEntregadas = 0;
    let puntualidadPendientes = 0;

    let evidenciasL1 = 0;
    let evidenciasL2 = 0;
    let evidenciasL3 = 0;
    let evidenciasPMD = 0;
    let evidenciasEntregadas = 0;
    let evidenciasPendientes = 0;

    // Resumen por aprendiz para ranking
    const aprendizTotals: Record<string, {
      documento: string;
      nombre: string;
      apellidos: string;
      ficha: string;
      correo?: string;
      l1: number;
      l2: number;
      l3: number;
      pmd: number;
      total: number;
      uniforme: number;
      puntualidad: number;
      evidencias: number;
    }> = {};

    filteredAprendices.forEach(a => {
      aprendizTotals[a.documento] = {
        documento: a.documento,
        nombre: a.nombre,
        apellidos: a.apellidos,
        ficha: a.ficha,
        correo: a.correo,
        l1: 0,
        l2: 0,
        l3: 0,
        pmd: 0,
        total: 0,
        uniforme: 0,
        puntualidad: 0,
        evidencias: 0
      };
    });

    // Recorrer el checklist de la matriz
    filteredChecklist.forEach(c => {
      const doc = c.aprendizDocumento;
      const rec = aprendizTotals[doc];

      // 1. UNIFORME
      if (c.uniforme1Fecha) {
        uniformeL1++;
        if (rec) { rec.l1++; rec.uniforme++; rec.total++; }
        if (c.uniforme1Entregada) uniformeEntregadas++; else uniformePendientes++;
      }
      if (c.uniforme2Fecha) {
        uniformeL2++;
        if (rec) { rec.l2++; rec.uniforme++; rec.total++; }
        if (c.uniforme2Entregada) uniformeEntregadas++; else uniformePendientes++;
      }
      if (c.uniforme3Fecha) {
        uniformeL3++;
        if (rec) { rec.l3++; rec.uniforme++; rec.total++; }
        if (c.uniforme3Entregada) uniformeEntregadas++; else uniformePendientes++;
      }
      if (c.uniformePlanMejoramiento) {
        uniformePMD++;
        if (rec) { rec.pmd++; rec.total++; }
      }

      // 2. PUNTUALIDAD
      if (c.puntualidad1Fecha) {
        puntualidadL1++;
        if (rec) { rec.l1++; rec.puntualidad++; rec.total++; }
        if (c.puntualidad1Entregada) puntualidadEntregadas++; else puntualidadPendientes++;
      }
      if (c.puntualidad2Fecha) {
        puntualidadL2++;
        if (rec) { rec.l2++; rec.puntualidad++; rec.total++; }
        if (c.puntualidad2Entregada) puntualidadEntregadas++; else puntualidadPendientes++;
      }
      if (c.puntualidad3Fecha) {
        puntualidadL3++;
        if (rec) { rec.l3++; rec.puntualidad++; rec.total++; }
        if (c.puntualidad3Entregada) puntualidadEntregadas++; else puntualidadPendientes++;
      }
      if (c.puntualidadPlanMejoramiento) {
        puntualidadPMD++;
        if (rec) { rec.pmd++; rec.total++; }
      }

      // 3. EVIDENCIAS / ACADÉMICO
      if (c.evidencias1Fecha) {
        evidenciasL1++;
        if (rec) { rec.l1++; rec.evidencias++; rec.total++; }
        if (c.evidencias1Entregada) evidenciasEntregadas++; else evidenciasPendientes++;
      }
      if (c.evidencias2Fecha) {
        evidenciasL2++;
        if (rec) { rec.l2++; rec.evidencias++; rec.total++; }
        if (c.evidencias2Entregada) evidenciasEntregadas++; else evidenciasPendientes++;
      }
      if (c.evidencias3Fecha) {
        evidenciasL3++;
        if (rec) { rec.l3++; rec.evidencias++; rec.total++; }
        if (c.evidencias3Entregada) evidenciasEntregadas++; else evidenciasPendientes++;
      }
      if (c.evidenciasPlanMejoramiento) {
        evidenciasPMD++;
        if (rec) { rec.pmd++; rec.total++; }
      }
    });

    const totalL1 = uniformeL1 + puntualidadL1 + evidenciasL1;
    const totalL2 = uniformeL2 + puntualidadL2 + evidenciasL2;
    const totalL3 = uniformeL3 + puntualidadL3 + evidenciasL3;
    const totalPMD = uniformePMD + puntualidadPMD + evidenciasPMD;
    const totalGeneral = totalL1 + totalL2 + totalL3;

    // 1. Datos para BarChart: Llamados por Tipo clasificados por Gravedad
    const dataPorTipoYGravedad = [
      {
        tipo: 'Uniforme Institucional',
        tipoCorto: 'Uniforme',
        leve: uniformeL1,
        moderado: uniformeL2,
        grave: uniformeL3,
        pmd: uniformePMD,
        total: uniformeL1 + uniformeL2 + uniformeL3,
        icono: Shirt,
        colorPrincipal: '#10b981'
      },
      {
        tipo: 'Puntualidad y Asistencia',
        tipoCorto: 'Puntualidad',
        leve: puntualidadL1,
        moderado: puntualidadL2,
        grave: puntualidadL3,
        pmd: puntualidadPMD,
        total: puntualidadL1 + puntualidadL2 + puntualidadL3,
        icono: Clock,
        colorPrincipal: '#f59e0b'
      },
      {
        tipo: 'Evidencias Académicas',
        tipoCorto: 'Evidencias',
        leve: evidenciasL1,
        moderado: evidenciasL2,
        grave: evidenciasL3,
        pmd: evidenciasPMD,
        total: evidenciasL1 + evidenciasL2 + evidenciasL3,
        icono: BookOpen,
        colorPrincipal: '#3b82f6'
      }
    ];

    // 2. Datos para PieChart: Distribución Global por Nivel de Gravedad
    const dataGravedadPie = [
      {
        name: 'Nivel 1 (Leve / Preventivo)',
        shortName: 'Llamado 1 (Leve)',
        value: totalL1,
        color: '#f59e0b', // Amber
        descripcion: '1° Llamado pedagógico con medida formativa'
      },
      {
        name: 'Nivel 2 (Moderado / Advertencia)',
        shortName: 'Llamado 2 (Moderado)',
        value: totalL2,
        color: '#ea580c', // Orange
        descripcion: '2° Llamado reiterativo de advertencia'
      },
      {
        name: 'Nivel 3 (Grave / Sancionatorio)',
        shortName: 'Llamado 3 (Grave)',
        value: totalL3,
        color: '#dc2626', // Red
        descripcion: '3° Llamado con citación a coordinación'
      },
      {
        name: 'Plan de Mejoramiento (Crítico)',
        shortName: 'Plan de Mejoramiento',
        value: totalPMD,
        color: '#7c3aed', // Purple/Violet
        descripcion: 'Apertura de Plan de Mejoramiento Disciplinario'
      }
    ].filter(item => item.value > 0);

    const pieDataToRender = dataGravedadPie.length > 0 ? dataGravedadPie : [
      { name: 'Sin llamados', shortName: 'Al día', value: 1, color: '#10b981', descripcion: '100% de aprendices al día' }
    ];

    // 3. Comparativa entre Fichas (3384701 vs 3384773)
    const dataPorFicha = [
      {
        ficha: 'Ficha 3384701',
        total: checklist.filter(c => c.ficha === '3384701').reduce((acc, c) => {
          const u = (c.uniforme1Fecha ? 1 : 0) + (c.uniforme2Fecha ? 1 : 0) + (c.uniforme3Fecha ? 1 : 0);
          const p = (c.puntualidad1Fecha ? 1 : 0) + (c.puntualidad2Fecha ? 1 : 0) + (c.puntualidad3Fecha ? 1 : 0);
          const e = (c.evidencias1Fecha ? 1 : 0) + (c.evidencias2Fecha ? 1 : 0) + (c.evidencias3Fecha ? 1 : 0);
          return acc + u + p + e;
        }, 0),
        leves: checklist.filter(c => c.ficha === '3384701').reduce((acc, c) => (
          acc + (c.uniforme1Fecha ? 1 : 0) + (c.puntualidad1Fecha ? 1 : 0) + (c.evidencias1Fecha ? 1 : 0)
        ), 0),
        moderados: checklist.filter(c => c.ficha === '3384701').reduce((acc, c) => (
          acc + (c.uniforme2Fecha ? 1 : 0) + (c.puntualidad2Fecha ? 1 : 0) + (c.evidencias2Fecha ? 1 : 0)
        ), 0),
        graves: checklist.filter(c => c.ficha === '3384701').reduce((acc, c) => (
          acc + (c.uniforme3Fecha ? 1 : 0) + (c.puntualidad3Fecha ? 1 : 0) + (c.evidencias3Fecha ? 1 : 0)
        ), 0),
        pmd: checklist.filter(c => c.ficha === '3384701' && (c.uniformePlanMejoramiento || c.puntualidadPlanMejoramiento || c.evidenciasPlanMejoramiento)).length
      },
      {
        ficha: 'Ficha 3384773',
        total: checklist.filter(c => c.ficha === '3384773').reduce((acc, c) => {
          const u = (c.uniforme1Fecha ? 1 : 0) + (c.uniforme2Fecha ? 1 : 0) + (c.uniforme3Fecha ? 1 : 0);
          const p = (c.puntualidad1Fecha ? 1 : 0) + (c.puntualidad2Fecha ? 1 : 0) + (c.puntualidad3Fecha ? 1 : 0);
          const e = (c.evidencias1Fecha ? 1 : 0) + (c.evidencias2Fecha ? 1 : 0) + (c.evidencias3Fecha ? 1 : 0);
          return acc + u + p + e;
        }, 0),
        leves: checklist.filter(c => c.ficha === '3384773').reduce((acc, c) => (
          acc + (c.uniforme1Fecha ? 1 : 0) + (c.puntualidad1Fecha ? 1 : 0) + (c.evidencias1Fecha ? 1 : 0)
        ), 0),
        moderados: checklist.filter(c => c.ficha === '3384773').reduce((acc, c) => (
          acc + (c.uniforme2Fecha ? 1 : 0) + (c.puntualidad2Fecha ? 1 : 0) + (c.evidencias2Fecha ? 1 : 0)
        ), 0),
        graves: checklist.filter(c => c.ficha === '3384773').reduce((acc, c) => (
          acc + (c.uniforme3Fecha ? 1 : 0) + (c.puntualidad3Fecha ? 1 : 0) + (c.evidencias3Fecha ? 1 : 0)
        ), 0),
        pmd: checklist.filter(c => c.ficha === '3384773' && (c.uniformePlanMejoramiento || c.puntualidadPlanMejoramiento || c.evidenciasPlanMejoramiento)).length
      }
    ];

    // 4. Datos para Radar Chart: Espectro Dimensional Disciplinario
    const radarData = [
      { tema: 'Uniforme (L1)', valor: uniformeL1, fullMark: Math.max(10, uniformeL1 + 2) },
      { tema: 'Uniforme (L2+L3)', valor: uniformeL2 + uniformeL3, fullMark: Math.max(10, uniformeL2 + uniformeL3 + 2) },
      { tema: 'Puntualidad (L1)', valor: puntualidadL1, fullMark: Math.max(10, puntualidadL1 + 2) },
      { tema: 'Puntualidad (L2+L3)', valor: puntualidadL2 + puntualidadL3, fullMark: Math.max(10, puntualidadL2 + puntualidadL3 + 2) },
      { tema: 'Evidencias (L1)', valor: evidenciasL1, fullMark: Math.max(10, evidenciasL1 + 2) },
      { tema: 'Evidencias (L2+L3)', valor: evidenciasL2 + evidenciasL3, fullMark: Math.max(10, evidenciasL2 + evidenciasL3 + 2) }
    ];

    // Ranking de aprendices con llamados
    const listaConLlamados = Object.values(aprendizTotals)
      .filter(item => item.total > 0 || item.pmd > 0)
      .sort((a, b) => b.total - a.total);

    const aprendicesLimpios = Object.values(aprendizTotals).filter(item => item.total === 0 && item.pmd === 0).length;

    return {
      totalL1,
      totalL2,
      totalL3,
      totalPMD,
      totalGeneral,
      dataPorTipoYGravedad,
      dataGravedadPie: pieDataToRender,
      dataPorFicha,
      radarData,
      listaConLlamados,
      aprendicesLimpios,
      totalAprendices: filteredAprendices.length,
      uniformeEntregadas,
      uniformePendientes,
      puntualidadEntregadas,
      puntualidadPendientes,
      evidenciasEntregadas,
      evidenciasPendientes
    };
  }, [filteredAprendices, filteredChecklist, checklist]);

  // Colores Institucionales SENA y Semafóricos
  const COLORS = {
    leve: '#f59e0b',       // Amber 500 (Nivel 1 - Leve)
    moderado: '#ea580c',   // Orange 600 (Nivel 2 - Moderado)
    grave: '#dc2626',      // Red 600 (Nivel 3 - Grave)
    pmd: '#7c3aed',        // Purple 600 (Plan de Mejoramiento)
    senaGreen: '#15803d',  // Emerald / Green SENA
    senaLight: '#ecfdf5',
    darkText: '#0f172a'
  };

  // Tooltip personalizado para el BarChart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const totalItem = payload.reduce((acc: number, cur: any) => acc + (cur.value || 0), 0);
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 text-xs min-w-[220px]">
          <p className="font-black text-slate-900 border-b border-slate-100 pb-2 mb-2 text-sm flex items-center justify-between">
            <span>{label}</span>
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
              Total: {totalItem}
            </span>
          </p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-extrabold text-slate-900">{entry.value} llamado(s)</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para el PieChart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = analyticsData.totalGeneral > 0
        ? ((data.value / analyticsData.totalGeneral) * 100).toFixed(1)
        : '0';
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 text-xs">
          <p className="font-extrabold text-slate-900 flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
            {data.name}
          </p>
          <p className="text-slate-500 mb-2">{data.payload.descripcion}</p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 font-bold text-slate-800">
            <span>Cantidad: {data.value}</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-black">
              {percent}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Barra Superior con Selector de Ficha y Controles */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Panel Analítico de Control Disciplinario · Recharts
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Estadísticas de Incumplimientos por Tipo y Gravedad
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoreo en tiempo real según los lineamientos del Acuerdo 009 de 2024 SENA
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-700">Filtro Ficha:</span>
            <select
              value={fichaFiltro}
              onChange={(e) => setFichaFiltro(e.target.value)}
              className="bg-transparent font-bold text-emerald-800 focus:outline-none cursor-pointer"
            >
              <option value="todos">Todas las Fichas ({aprendices.length})</option>
              <option value="3384701">Ficha 3384701</option>
              <option value="3384773">Ficha 3384773</option>
            </select>
          </div>

          <div className="inline-flex rounded-2xl p-1 bg-slate-100 border border-slate-200">
            <button
              onClick={() => setTipoGrafico('apilado')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                tipoGrafico === 'apilado'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Barras Apiladas
            </button>
            <button
              onClick={() => setTipoGrafico('comparativo')}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                tipoGrafico === 'comparativo'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Comparativo Fichas
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards de Resumen por Nivel de Gravedad */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Aprendices */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Población</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{analyticsData.totalAprendices}</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            {analyticsData.aprendicesLimpios} sin llamados ({((analyticsData.aprendicesLimpios / (analyticsData.totalAprendices || 1)) * 100).toFixed(0)}%)
          </div>
        </div>

        {/* Nivel 1 - Leve */}
        <div className="bg-amber-50/70 rounded-3xl p-4 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Nivel 1 · Leve</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-700">{analyticsData.totalL1}</div>
          <div className="text-[11px] text-amber-800/80 mt-1 font-semibold">
            1° Llamado Preventivo
          </div>
        </div>

        {/* Nivel 2 - Moderado */}
        <div className="bg-orange-50/70 rounded-3xl p-4 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-orange-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Nivel 2 · Moderado</span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
          </div>
          <div className="text-2xl font-black text-orange-700">{analyticsData.totalL2}</div>
          <div className="text-[11px] text-orange-800/80 mt-1 font-semibold">
            2° Llamado Advertencia
          </div>
        </div>

        {/* Nivel 3 - Grave */}
        <div className="bg-red-50/70 rounded-3xl p-4 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-red-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Nivel 3 · Grave</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700">{analyticsData.totalL3}</div>
          <div className="text-[11px] text-red-800/80 mt-1 font-semibold">
            3° Llamado Sancionatorio
          </div>
        </div>

        {/* Plan de Mejoramiento Disciplinario */}
        <div className="bg-purple-50/70 rounded-3xl p-4 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-purple-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">PMD · Crítico</span>
            <ShieldAlert className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-black text-purple-800">{analyticsData.totalPMD}</div>
          <div className="text-[11px] text-purple-900/80 mt-1 font-semibold">
            Planes de Mejoramiento
          </div>
        </div>

        {/* Total General de Llamados */}
        <div className="bg-emerald-50/70 rounded-3xl p-4 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Llamados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-800">{analyticsData.totalGeneral}</div>
          <div className="text-[11px] text-emerald-900/80 mt-1 font-semibold">
            Registros activos
          </div>
        </div>
      </div>

      {/* Gráficos Principales con Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* GRÁFICO 1: Barras Clasificadas por Tipo y Nivel de Gravedad (8 columnas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  Clasificación Recharts
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {tipoGrafico === 'apilado' 
                    ? 'Cantidad de Llamados por Tipo y Nivel de Gravedad'
                    : 'Comparativo de Gravedad entre Fichas 3384701 y 3384773'}
                </h3>
                <p className="text-xs text-slate-500">
                  {tipoGrafico === 'apilado'
                    ? 'Uniforme, Puntualidad y Evidencias desglosados en Leve (L1), Moderado (L2), Grave (L3) y PMD'
                    : 'Incidencia de niveles disciplinarios clasificada por programa y ficha formativa'}
                </p>
              </div>

              {/* Leyenda rápida */}
              <div className="flex items-center gap-3 text-[11px] font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl self-start">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> L1 (Leve)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" /> L2 (Mod.)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> L3 (Grave)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> PMD
                </span>
              </div>
            </div>

            {/* Renderizado de Recharts BarChart */}
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                {tipoGrafico === 'apilado' ? (
                  <BarChart
                    data={analyticsData.dataPorTipoYGravedad}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="tipoCorto"
                      tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                    />
                    <Bar
                      dataKey="leve"
                      name="Nivel 1 · Leve (Llamado 1)"
                      stackId="a"
                      fill={COLORS.leve}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="moderado"
                      name="Nivel 2 · Moderado (Llamado 2)"
                      stackId="a"
                      fill={COLORS.moderado}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="grave"
                      name="Nivel 3 · Grave (Llamado 3)"
                      stackId="a"
                      fill={COLORS.grave}
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="pmd"
                      name="Plan de Mejoramiento (PMD)"
                      stackId="a"
                      fill={COLORS.pmd}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <BarChart
                    data={analyticsData.dataPorFicha}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="ficha"
                      tick={{ fill: '#475569', fontSize: 12, fontWeight: 700 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#cbd5e1' }}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                    />
                    <Bar
                      dataKey="leves"
                      name="Nivel 1 (Leves)"
                      fill={COLORS.leve}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="moderados"
                      name="Nivel 2 (Moderados)"
                      fill={COLORS.moderado}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="graves"
                      name="Nivel 3 (Graves)"
                      fill={COLORS.grave}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="pmd"
                      name="Planes de Mejoramiento"
                      fill={COLORS.pmd}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tarjetas resumen por tipo al pie del gráfico de barras */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 mt-2">
            {analyticsData.dataPorTipoYGravedad.map((item, idx) => {
              const IconComp = item.icono;
              return (
                <div key={idx} className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="p-1.5 rounded-lg text-white"
                      style={{ backgroundColor: item.colorPrincipal }}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-xs text-slate-800">{item.tipoCorto}</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xl font-black text-slate-900">{item.total}</span>
                    <span className="text-[10px] font-bold text-slate-500">
                      PMD: <strong className="text-purple-700">{item.pmd}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRÁFICO 2: Pie / Donut Chart con Distribución por Nivel de Gravedad (4 columnas) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Severidad Global
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Distribución por Gravedad
            </h3>
            <p className="text-xs text-slate-500">
              Porcentaje según severidad en el proceso formativo
            </p>

            <div className="h-64 w-full relative pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={analyticsData.dataGravedadPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analyticsData.dataGravedadPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Indicador central de llamados */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">{analyticsData.totalGeneral}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Llamados</span>
              </div>
            </div>
          </div>

          {/* Desglose de Leyenda con porcentajes */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            {analyticsData.dataGravedadPie.map((item, idx) => {
              const perc = analyticsData.totalGeneral > 0
                ? ((item.value / analyticsData.totalGeneral) * 100).toFixed(0)
                : '0';
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-700">{item.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.value}</span>
                    <span className="text-[11px] font-semibold text-slate-400">({perc}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Radar de Dimensiones + Tabla de Aprendices con Incumplimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Gráfico 3: Radar Multidimensional (5 columnas) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Espectro Conductual
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Radar de Vulnerabilidad Disciplinaria
            </h3>
            <p className="text-xs text-slate-500">
              Comportamiento del grupo en niveles preventivos vs sanciones acumuladas
            </p>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={analyticsData.radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="tema"
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 9 }} />
                  <Radar
                    name="Llamados Registrados"
                    dataKey="valor"
                    stroke="#15803d"
                    fill="#10b981"
                    fillOpacity={0.45}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">Interpretación Pedagógica SENA:</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Una mayor concentración en los ejes <strong>(L1)</strong> denota efectividad preventiva. La dispersión hacia <strong>(L2+L3)</strong> exige activación inmediata de medidas formativas correctivas.
              </p>
            </div>
          </div>
        </div>

        {/* Tabla / Ranking de Aprendices con Incumplimientos (7 columnas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Seguimiento Prioritario
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Aprendices con Llamados Registrados ({analyticsData.listaConLlamados.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Ordenados de mayor a menor gravedad según el Acuerdo 009 de 2024
                </p>
              </div>

              <span className="text-xs font-extrabold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                {fichaFiltro === 'todos' ? 'Todas las fichas' : `Ficha ${fichaFiltro}`}
              </span>
            </div>

            {analyticsData.listaConLlamados.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-extrabold text-slate-900 text-sm">¡Excelente récord disciplinario!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  No hay aprendices con llamados registrados en la selección actual.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      <th className="px-3.5 py-2.5">Aprendiz</th>
                      <th className="px-2 py-2.5 text-center">Ficha</th>
                      <th className="px-2 py-2.5 text-center bg-amber-50/80 text-amber-900">L1</th>
                      <th className="px-2 py-2.5 text-center bg-orange-50/80 text-orange-900">L2</th>
                      <th className="px-2 py-2.5 text-center bg-red-50/80 text-red-900">L3</th>
                      <th className="px-2 py-2.5 text-center bg-purple-50/80 text-purple-900">PMD</th>
                      <th className="px-3 py-2.5 text-center">Total</th>
                      <th className="px-3 py-2.5 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {analyticsData.listaConLlamados.map((item, idx) => {
                      const isHighRisk = item.l3 > 0 || item.pmd > 0 || item.total >= 3;
                      const isMediumRisk = item.l2 > 0 || item.total === 2;

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                          onClick={() => onSelectAprendiz && onSelectAprendiz(item.documento)}
                        >
                          <td className="px-3.5 py-2.5">
                            <p className="font-bold text-slate-900">
                              {item.nombre} {item.apellidos}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              CC {item.documento}
                            </span>
                          </td>
                          <td className="px-2 py-2.5 text-center font-bold text-slate-600">
                            {item.ficha}
                          </td>
                          <td className="px-2 py-2.5 text-center font-bold text-amber-700 bg-amber-50/30">
                            {item.l1 || '-'}
                          </td>
                          <td className="px-2 py-2.5 text-center font-bold text-orange-700 bg-orange-50/30">
                            {item.l2 || '-'}
                          </td>
                          <td className="px-2 py-2.5 text-center font-bold text-red-700 bg-red-50/30">
                            {item.l3 || '-'}
                          </td>
                          <td className="px-2 py-2.5 text-center font-bold text-purple-700 bg-purple-50/30">
                            {item.pmd > 0 ? (
                              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-black">
                                SI
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center font-black text-slate-900">
                            {item.total}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {isHighRisk ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">
                                Crítico / PMD
                              </span>
                            ) : isMediumRisk ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                                En Seguimiento
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                                Preventivo
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
            <span>
              Total aprendices analizados: <strong>{analyticsData.totalAprendices}</strong>
            </span>
            <span className="text-[11px] italic">
              * Datos calculados en tiempo real con Recharts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
