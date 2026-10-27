import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Mail, 
  Search, 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Clock, 
  Shirt, 
  CheckCircle2, 
  FileSpreadsheet,
  Settings,
  Sparkles,
  Edit2,
  BellRing,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Aprendiz, ChecklistRegistro, ItemAlertaMedida, TipoIncumplimiento } from '../types';

interface ChecklistTableProps {
  aprendices: Aprendiz[];
  checklist: ChecklistRegistro[];
  onUpdateChecklistCell: (
    documento: string, 
    field: keyof ChecklistRegistro, 
    value: string | boolean | undefined
  ) => void;
  onOpenEmailModal: (
    aprendiz: Aprendiz, 
    tipo: 'uniforme' | 'puntualidad' | 'actividades' | 'pmd', 
    nivel: 1 | 2 | 3,
    fecha?: string
  ) => void;
  onOpenReportModal: (aprendiz: Aprendiz) => void;
  onBatchUpdateEmails?: (updates: { documento: string; correo: string }[]) => void;
}

export const ChecklistTable: React.FC<ChecklistTableProps> = ({
  aprendices,
  checklist,
  onUpdateChecklistCell,
  onOpenEmailModal,
  onOpenReportModal,
  onBatchUpdateEmails
}) => {
  const [filterFicha, setFilterFicha] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingEmailDoc, setEditingEmailDoc] = useState<string | null>(null);
  const [tempEmailValue, setTempEmailValue] = useState<string>('');
  const [showBatchModal, setShowBatchModal] = useState<boolean>(false);
  const [batchText, setBatchText] = useState<string>('');
  
  // Alert Panel State
  const [showAlertPanel, setShowAlertPanel] = useState<boolean>(true);
  const [alertFilter, setAlertFilter] = useState<'todas' | 'vencidas' | 'pendientes' | 'cumplidas'>('todas');

  // Map checklist by documento for O(1) lookups
  const checklistMap = useMemo(() => {
    const map: Record<string, ChecklistRegistro> = {};
    checklist.forEach(c => {
      map[c.aprendizDocumento] = c;
    });
    return map;
  }, [checklist]);

  // Today's date string YYYY-MM-DD
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Helper to add days to a date string
  const addDays = (dateStr: string, days: number): string => {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() + days);
      return d.toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  // Helper to calculate days difference
  const getDaysDiff = (targetDateStr: string): number => {
    try {
      const target = new Date(targetDateStr).getTime();
      const current = new Date(todayStr).getTime();
      return Math.round((target - current) / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  // Build Comprehensive List of Alerts for Formative Measures and PMD ordered by MOST RECENT
  const alertasMedidas = useMemo<ItemAlertaMedida[]>(() => {
    const items: ItemAlertaMedida[] = [];

    aprendices.forEach(a => {
      const c = checklistMap[a.documento];
      if (!c) return;

      const checkEntry = (
        tipo: TipoIncumplimiento | 'pmd',
        etiqueta: string,
        nivel: 1 | 2 | 3,
        fechaLlamado?: string,
        fieldEntregada?: keyof ChecklistRegistro,
        fieldFechaLimite?: keyof ChecklistRegistro
      ) => {
        if (!fechaLlamado || !fieldEntregada || !fieldFechaLimite) return;

        const entregada = Boolean(c[fieldEntregada]);
        const customLimite = (c[fieldFechaLimite] as string) || '';
        const fechaLimite = customLimite || addDays(fechaLlamado, 5); // Default: 5 days
        const diff = getDaysDiff(fechaLimite);

        let estadoAlerta: 'vencida' | 'porVencer' | 'enPlazo' | 'cumplida' = 'enPlazo';
        if (entregada) {
          estadoAlerta = 'cumplida';
        } else if (diff < 0) {
          estadoAlerta = 'vencida';
        } else if (diff <= 2) {
          estadoAlerta = 'porVencer';
        }

        items.push({
          id: `${a.documento}_${tipo}_${nivel}`,
          aprendizDocumento: a.documento,
          nombreAprendiz: a.nombre,
          apellidosAprendiz: a.apellidos,
          ficha: a.ficha,
          correo: c.correo || a.correo || '',
          tipoComponente: tipo,
          etiquetaComponente: etiqueta,
          nivelLlamado: nivel,
          fechaLlamado,
          fechaLimite,
          entregada,
          fieldEntregada,
          fieldFechaLimite,
          estadoAlerta,
          diasDiferencia: diff
        });
      };

      // UNIFORME
      checkEntry('uniforme', 'Uniforme 1°', 1, c.uniforme1Fecha, 'uniforme1Entregada', 'uniforme1FechaLimite');
      checkEntry('uniforme', 'Uniforme 2°', 2, c.uniforme2Fecha, 'uniforme2Entregada', 'uniforme2FechaLimite');
      checkEntry('uniforme', 'Uniforme 3°', 3, c.uniforme3Fecha, 'uniforme3Entregada', 'uniforme3FechaLimite');
      if (c.uniformePlanMejoramiento && c.uniformePlanFecha) {
        checkEntry('pmd', 'Plan Mejoramiento Uniforme', 3, c.uniformePlanFecha, 'uniformePlanEntregado', 'uniformePlanFechaLimite');
      }

      // PUNTUALIDAD
      checkEntry('puntualidad', 'Puntualidad 1°', 1, c.puntualidad1Fecha, 'puntualidad1Entregada', 'puntualidad1FechaLimite');
      checkEntry('puntualidad', 'Puntualidad 2°', 2, c.puntualidad2Fecha, 'puntualidad2Entregada', 'puntualidad2FechaLimite');
      checkEntry('puntualidad', 'Puntualidad 3°', 3, c.puntualidad3Fecha, 'puntualidad3Entregada', 'puntualidad3FechaLimite');
      if (c.puntualidadPlanMejoramiento && c.puntualidadPlanFecha) {
        checkEntry('pmd', 'Plan Mejoramiento Puntualidad', 3, c.puntualidadPlanFecha, 'puntualidadPlanEntregado', 'puntualidadPlanFechaLimite');
      }

      // EVIDENCIAS
      checkEntry('actividades', 'Evidencias 1°', 1, c.evidencias1Fecha, 'evidencias1Entregada', 'evidencias1FechaLimite');
      checkEntry('actividades', 'Evidencias 2°', 2, c.evidencias2Fecha, 'evidencias2Entregada', 'evidencias2FechaLimite');
      checkEntry('actividades', 'Evidencias 3°', 3, c.evidencias3Fecha, 'evidencias3Entregada', 'evidencias3FechaLimite');
      if (c.evidenciasPlanMejoramiento && c.evidenciasPlanFecha) {
        checkEntry('pmd', 'Plan Mejoramiento Evidencias', 3, c.evidenciasPlanFecha, 'evidenciasPlanEntregado', 'evidenciasPlanFechaLimite');
      }
    });

    // Ordenar de la más RECIENTE a la más antigua
    return items.sort((a, b) => new Date(b.fechaLlamado).getTime() - new Date(a.fechaLlamado).getTime());
  }, [aprendices, checklistMap, todayStr]);

  // Filtered alerts
  const displayAlertas = useMemo(() => {
    return alertasMedidas.filter(item => {
      const matchFicha = filterFicha === 'todos' || item.ficha === filterFicha;
      if (!matchFicha) return false;

      if (alertFilter === 'vencidas') return item.estadoAlerta === 'vencida';
      if (alertFilter === 'pendientes') return item.estadoAlerta === 'porVencer' || item.estadoAlerta === 'enPlazo';
      if (alertFilter === 'cumplidas') return item.estadoAlerta === 'cumplida';
      return true;
    });
  }, [alertasMedidas, filterFicha, alertFilter]);

  // Counts of alerts
  const countVencidas = alertasMedidas.filter(a => a.estadoAlerta === 'vencida').length;
  const countPendientes = alertasMedidas.filter(a => a.estadoAlerta === 'porVencer' || a.estadoAlerta === 'enPlazo').length;
  const countCumplidas = alertasMedidas.filter(a => a.estadoAlerta === 'cumplida').length;

  // Filtered apprentices for the matrix table
  const filteredAprendices = useMemo(() => {
    return aprendices.filter(a => {
      const matchFicha = filterFicha === 'todos' || a.ficha === filterFicha;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm.trim() ||
        a.nombre.toLowerCase().includes(term) ||
        a.apellidos.toLowerCase().includes(term) ||
        a.documento.includes(term) ||
        (checklistMap[a.documento]?.correo || '').toLowerCase().includes(term);
      return matchFicha && matchSearch;
    });
  }, [aprendices, filterFicha, searchTerm, checklistMap]);

  // Helper to calculate total calls for a learner
  const calculateTotals = (c?: ChecklistRegistro) => {
    if (!c) return { uniforme: 0, puntualidad: 0, actividades: 0, total: 0, hasPMD: false };
    const u = (c.uniforme1Fecha ? 1 : 0) + (c.uniforme2Fecha ? 1 : 0) + (c.uniforme3Fecha ? 1 : 0);
    const p = (c.puntualidad1Fecha ? 1 : 0) + (c.puntualidad2Fecha ? 1 : 0) + (c.puntualidad3Fecha ? 1 : 0);
    const a = (c.evidencias1Fecha ? 1 : 0) + (c.evidencias2Fecha ? 1 : 0) + (c.evidencias3Fecha ? 1 : 0);
    const hasPMD = Boolean(c.uniformePlanMejoramiento || c.puntualidadPlanMejoramiento || c.evidenciasPlanMejoramiento || (u + p + a) >= 3);
    return { uniforme: u, puntualidad: p, actividades: a, total: u + p + a, hasPMD };
  };

  // Interactive Cell with Formative Measure Delivery Checkbox & Date
  const renderDateCellWithMedida = (
    doc: string, 
    dateField: keyof ChecklistRegistro, 
    entregadaField: keyof ChecklistRegistro,
    limiteField: keyof ChecklistRegistro,
    tipo: 'uniforme' | 'puntualidad' | 'actividades', 
    nivel: 1 | 2 | 3,
    aprendiz: Aprendiz
  ) => {
    const currentVal = (checklistMap[doc]?.[dateField] as string) || '';
    const isEntregada = Boolean(checklistMap[doc]?.[entregadaField]);
    const limiteVal = (checklistMap[doc]?.[limiteField] as string) || (currentVal ? addDays(currentVal, 5) : '');
    const diff = currentVal ? getDaysDiff(limiteVal) : 0;
    const isOverdue = !isEntregada && diff < 0;

    if (currentVal) {
      return (
        <div className={`p-1 rounded-xl border transition-all ${
          isEntregada 
            ? 'bg-emerald-50/80 border-emerald-300' 
            : isOverdue 
            ? 'bg-red-50/80 border-red-300 animate-pulse' 
            : 'bg-white border-slate-200'
        } shadow-2xs space-y-1`}>
          {/* Fila 1: Fecha del llamado y botones */}
          <div className="flex items-center justify-between gap-1">
            <input
              type="date"
              value={currentVal}
              onChange={(e) => onUpdateChecklistCell(doc, dateField, e.target.value)}
              className="text-[10.5px] font-bold text-slate-800 bg-transparent outline-none w-22"
            />
            <div className="flex items-center">
              <button
                type="button"
                title="Remitir correo de este llamado"
                onClick={() => onOpenEmailModal(aprendiz, tipo, nivel, currentVal)}
                className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                <Mail className="w-3 h-3" />
              </button>
              <button
                type="button"
                title="Borrar llamado"
                onClick={() => {
                  onUpdateChecklistCell(doc, dateField, undefined);
                  onUpdateChecklistCell(doc, entregadaField, false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Fila 2: Control de Entrega de Medida Formativa */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEntregada}
                onChange={(e) => onUpdateChecklistCell(doc, entregadaField, e.target.checked)}
                className="w-3 h-3 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className={`font-semibold ${
                isEntregada ? 'text-emerald-800' : isOverdue ? 'text-red-700 font-bold' : 'text-slate-500'
              }`}>
                {isEntregada ? 'Entregada' : isOverdue ? 'Vencida' : 'Pendiente'}
              </span>
            </label>

            <span className="text-[9px] text-slate-400 font-mono" title={`Fecha límite: ${limiteVal}`}>
              Vence: {limiteVal.slice(5)}
            </span>
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => {
          onUpdateChecklistCell(doc, dateField, todayStr);
          onUpdateChecklistCell(doc, limiteField, addDays(todayStr, 5));
          onUpdateChecklistCell(doc, entregadaField, false);
        }}
        className="w-full py-2 px-1.5 rounded-xl text-[10.5px] font-medium text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/70 border border-dashed border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-center gap-1"
        title="Registrar llamado con fecha de hoy"
      >
        <Plus className="w-3 h-3" />
        <span>Registrar</span>
      </button>
    );
  };

  // Plan de Mejoramiento con Checkbox de Activación Y Checkbox de Entrega
  const renderPMDCellWithDelivery = (
    doc: string, 
    pmdActivoField: keyof ChecklistRegistro,
    pmdEntregadoField: keyof ChecklistRegistro,
    autoTriggered: boolean,
    aprendiz: Aprendiz
  ) => {
    const isActivo = Boolean(checklistMap[doc]?.[pmdActivoField]) || autoTriggered;
    const isEntregado = Boolean(checklistMap[doc]?.[pmdEntregadoField]);

    return (
      <div className={`p-1.5 rounded-xl border text-center transition-all ${
        isEntregado 
          ? 'bg-emerald-50 border-emerald-300' 
          : isActivo 
          ? 'bg-red-50 border-red-300' 
          : 'bg-white border-slate-200'
      } space-y-1`}>
        {/* Checkbox de Activación de PMD */}
        <div className="flex items-center justify-center gap-1.5">
          <label className="flex items-center gap-1 cursor-pointer" title="Activar Plan de Mejoramiento">
            <input
              type="checkbox"
              checked={isActivo}
              onChange={(e) => {
                onUpdateChecklistCell(doc, pmdActivoField, e.target.checked);
                if (e.target.checked) {
                  onUpdateChecklistCell(doc, 'pmdGlobalFechaLimite', addDays(todayStr, 10));
                }
              }}
              className="w-3.5 h-3.5 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
            />
            <span className={`text-[10px] font-black ${isActivo ? 'text-red-700' : 'text-slate-400'}`}>
              PMD
            </span>
          </label>

          {isActivo && (
            <button
              type="button"
              title="Remitir notificación de PMD por correo"
              onClick={() => onOpenEmailModal(aprendiz, 'pmd', 3, todayStr)}
              className="p-1 rounded-md text-red-700 hover:bg-red-100 transition-colors"
            >
              <Mail className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Checkbox de Cumplimiento / Entrega del Plan */}
        {isActivo && (
          <div className="pt-1 border-t border-slate-200/80 flex items-center justify-center">
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isEntregado}
                onChange={(e) => onUpdateChecklistCell(doc, pmdEntregadoField, e.target.checked)}
                className="w-3 h-3 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className={`text-[9.5px] font-bold ${isEntregado ? 'text-emerald-700' : 'text-slate-500'}`}>
                {isEntregado ? '✓ Cumplido' : 'Pendiente'}
              </span>
            </label>
          </div>
        )}
      </div>
    );
  };

  // Inline email editing handler
  const handleStartEditEmail = (doc: string, currentEmail: string) => {
    setEditingEmailDoc(doc);
    setTempEmailValue(currentEmail || '');
  };

  const handleSaveEmail = (doc: string) => {
    onUpdateChecklistCell(doc, 'correo', tempEmailValue.trim());
    setEditingEmailDoc(null);
  };

  // Batch update handler
  const handleProcessBatchText = () => {
    if (!onBatchUpdateEmails || !batchText.trim()) return;
    const lines = batchText.split('\n');
    const updates: { documento: string; correo: string }[] = [];

    lines.forEach(line => {
      const parts = line.split(/[,\t;]/).map(p => p.trim());
      if (parts.length >= 2) {
        const doc = parts[0];
        const email = parts[1];
        if (doc && email) {
          updates.push({ documento: doc, correo: email });
        }
      }
    });

    if (updates.length > 0) {
      onBatchUpdateEmails(updates);
      alert(`Se actualizaron ${updates.length} correos institucionales.`);
      setShowBatchModal(false);
      setBatchText('');
    } else {
      alert('No se detectaron registros válidos. Usa el formato: Documento,Correo');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. CENTRO DE ALERTAS DE MEDIDAS FORMATIVAS Y PMD (ORDENADO POR MÁS RECIENTE) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Control Cronológico en Tiempo Real
                </span>
                <span className="text-xs text-slate-400">· Más reciente primero</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                Alertas de Entrega de Medidas Formativas y Planes de Mejoramiento
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAlertPanel(!showAlertPanel)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              {showAlertPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAlertPanel ? 'Ocultar Alertas' : `Ver Alertas (${alertasMedidas.length})`}
            </button>
          </div>
        </div>

        {/* Resumen de Métricas de Alerta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            onClick={() => setAlertFilter('todas')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              alertFilter === 'todas' ? 'bg-white/15 border-white/30' : 'bg-black/20 border-white/5 hover:bg-white/10'
            }`}
          >
            <span className="text-[11px] text-slate-300 block font-medium">Total Asignadas</span>
            <span className="text-2xl font-black text-white">{alertasMedidas.length}</span>
          </div>

          <div 
            onClick={() => setAlertFilter('vencidas')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              alertFilter === 'vencidas' ? 'bg-red-500/30 border-red-400/50' : 'bg-black/20 border-white/5 hover:bg-red-500/15'
            }`}
          >
            <span className="text-[11px] text-red-300 block font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              Vencidas sin Entrega
            </span>
            <span className="text-2xl font-black text-red-400">{countVencidas}</span>
          </div>

          <div 
            onClick={() => setAlertFilter('pendientes')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              alertFilter === 'pendientes' ? 'bg-amber-500/30 border-amber-400/50' : 'bg-black/20 border-white/5 hover:bg-amber-500/15'
            }`}
          >
            <span className="text-[11px] text-amber-300 block font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              En Plazo / Próximas
            </span>
            <span className="text-2xl font-black text-amber-400">{countPendientes}</span>
          </div>

          <div 
            onClick={() => setAlertFilter('cumplidas')}
            className={`p-3 rounded-2xl border cursor-pointer transition-all ${
              alertFilter === 'cumplidas' ? 'bg-emerald-500/30 border-emerald-400/50' : 'bg-black/20 border-white/5 hover:bg-emerald-500/15'
            }`}
          >
            <span className="text-[11px] text-emerald-300 block font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Entregadas / Cumplidas
            </span>
            <span className="text-2xl font-black text-emerald-400">{countCumplidas}</span>
          </div>
        </div>

        {/* Lista de Alertas Desplegable */}
        {showAlertPanel && (
          <div className="space-y-2 pt-2 animate-in fade-in duration-200">
            {displayAlertas.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-slate-300 space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                <p>No hay alertas en esta categoría de filtro.</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {displayAlertas.map(item => {
                  const apr = aprendices.find(a => a.documento === item.aprendizDocumento);

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.estadoAlerta === 'vencida'
                          ? 'bg-red-950/50 border-red-500/50 text-red-100'
                          : item.estadoAlerta === 'porVencer'
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
                          : item.estadoAlerta === 'cumplida'
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                          : 'bg-white/5 border-white/10 text-slate-200'
                      }`}
                    >
                      {/* Información del Aprendiz y Medida */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white">
                            Ficha {item.ficha}
                          </span>
                          <span className="font-extrabold text-xs text-white">
                            {item.apellidosAprendiz} {item.nombreAprendiz}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Doc: {item.aprendizDocumento}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-amber-300">
                            {item.etiquetaComponente}
                          </span>
                          <span>·</span>
                          <span className="text-slate-300">Llamado: {item.fechaLlamado}</span>
                          <span>·</span>
                          <span className="font-semibold text-white">
                            Fecha Límite: {item.fechaLimite}
                          </span>
                        </div>
                      </div>

                      {/* Estado y Acciones Rápidas de 1 Clic */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.estadoAlerta === 'vencida' && (
                          <span className="px-2.5 py-1 rounded-xl text-[10.5px] font-black bg-red-600 text-white shadow-xs">
                            ⚠️ Vencida ({Math.abs(item.diasDiferencia)}d)
                          </span>
                        )}
                        {item.estadoAlerta === 'porVencer' && (
                          <span className="px-2.5 py-1 rounded-xl text-[10.5px] font-black bg-amber-500 text-slate-950 shadow-xs">
                            ⏳ Vence en {item.diasDiferencia}d
                          </span>
                        )}
                        {item.estadoAlerta === 'cumplida' && (
                          <span className="px-2.5 py-1 rounded-xl text-[10.5px] font-bold bg-emerald-600 text-white shadow-xs">
                            ✓ Entregada
                          </span>
                        )}

                        {/* Botón para marcar / desmarcar entrega con 1 clic */}
                        <button
                          type="button"
                          onClick={() => onUpdateChecklistCell(item.aprendizDocumento, item.fieldEntregada, !item.entregada)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                            item.entregada
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {item.entregada ? 'Desmarcar' : '✓ Marcar Entregada'}
                        </button>

                        {/* Botón para remitir alerta por correo */}
                        {apr && (
                          <button
                            type="button"
                            title="Remitir correo de recordatorio o alerta"
                            onClick={() => onOpenEmailModal(apr, item.tipoComponente === 'pmd' ? 'pmd' : item.tipoComponente, item.nivelLlamado, item.fechaLlamado)}
                            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                          >
                            <Mail className="w-4 h-4 text-amber-300" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. BARRA DE CONTROL Y FILTROS DE LA LISTA DE VERIFICACIÓN               */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              Matriz con Control de Entrega de Medidas Formativas
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Lista de Verificación Disciplinaria y Control de Inasistencias
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Cada celda permite registrar la <strong>Fecha del Llamado</strong> y marcar la <strong>Entrega de la Medida Formativa</strong> o del <strong>Plan de Mejoramiento</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBatchModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              Pegar Correos
            </button>

            <button
              onClick={() => {
                const headers = ["Ficha", "Documento", "Nombre", "Apellidos", "Correo", "Uniforme1", "U1_Entregada", "Uniforme2", "U2_Entregada", "Uniforme3", "U3_Entregada", "PMD_Uniforme", "Puntualidad1", "P1_Entregada", "Puntualidad2", "P2_Entregada", "Puntualidad3", "P3_Entregada", "PMD_Puntualidad", "Evidencias1", "E1_Entregada", "Evidencias2", "E2_Entregada", "Evidencias3", "E3_Entregada", "PMD_Evidencias", "Total_Llamados"];
                const rows = aprendices.map(a => {
                  const c = checklistMap[a.documento];
                  const totals = calculateTotals(c);
                  return [
                    `"${a.ficha}"`, `"${a.documento}"`, `"${a.nombre}"`, `"${a.apellidos}"`, `"${c?.correo || a.correo || ''}"`,
                    `"${c?.uniforme1Fecha || ''}"`, c?.uniforme1Entregada ? "SI" : "NO",
                    `"${c?.uniforme2Fecha || ''}"`, c?.uniforme2Entregada ? "SI" : "NO",
                    `"${c?.uniforme3Fecha || ''}"`, c?.uniforme3Entregada ? "SI" : "NO",
                    c?.uniformePlanMejoramiento ? "SI" : "NO",
                    `"${c?.puntualidad1Fecha || ''}"`, c?.puntualidad1Entregada ? "SI" : "NO",
                    `"${c?.puntualidad2Fecha || ''}"`, c?.puntualidad2Entregada ? "SI" : "NO",
                    `"${c?.puntualidad3Fecha || ''}"`, c?.puntualidad3Entregada ? "SI" : "NO",
                    c?.puntualidadPlanMejoramiento ? "SI" : "NO",
                    `"${c?.evidencias1Fecha || ''}"`, c?.evidencias1Entregada ? "SI" : "NO",
                    `"${c?.evidencias2Fecha || ''}"`, c?.evidencias2Entregada ? "SI" : "NO",
                    `"${c?.evidencias3Fecha || ''}"`, c?.evidencias3Entregada ? "SI" : "NO",
                    c?.evidenciasPlanMejoramiento ? "SI" : "NO",
                    totals.total
                  ].join(",");
                });
                const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `Matriz_Medidas_Formativas_SENA_${todayStr}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Matriz CSV
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setFilterFicha('todos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterFicha === 'todos' ? 'bg-white shadow text-emerald-800' : 'text-slate-600'
              }`}
            >
              Todas las Fichas (56)
            </button>
            <button
              onClick={() => setFilterFicha('3384701')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterFicha === '3384701' ? 'bg-white shadow text-emerald-800' : 'text-slate-600'
              }`}
            >
              Ficha 3384701 (28)
            </button>
            <button
              onClick={() => setFilterFicha('3384773')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterFicha === '3384773' ? 'bg-white shadow text-emerald-800' : 'text-slate-600'
              }`}
            >
              Ficha 3384773 (28)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, doc o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MATRIZ DE VERIFICACIÓN CON CONTROL DE ENTREGA DE MEDIDA POR CELDA    */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
        <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            
            <thead className="sticky top-0 z-20 bg-slate-900 text-white shadow-sm text-center">
              <tr className="border-b border-slate-800">
                <th colSpan={3} className="p-3 bg-slate-950 text-left font-bold border-r border-slate-800">
                  DATOS DEL APRENDIZ
                </th>
                <th colSpan={4} className="p-3 bg-emerald-950 text-emerald-200 font-extrabold border-r border-slate-800">
                  <span className="inline-flex items-center gap-1.5">
                    <Shirt className="w-4 h-4 text-emerald-400" />
                    UNIFORME (FECHA & ENTREGA MEDIDA)
                  </span>
                </th>
                <th colSpan={4} className="p-3 bg-amber-950 text-amber-200 font-extrabold border-r border-slate-800">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    PUNTUALIDAD (FECHA & ENTREGA MEDIDA)
                  </span>
                </th>
                <th colSpan={4} className="p-3 bg-blue-950 text-blue-200 font-extrabold border-r border-slate-800">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    EVIDENCIAS (FECHA & ENTREGA MEDIDA)
                  </span>
                </th>
                <th colSpan={2} className="p-3 bg-slate-950 text-slate-200 font-bold">
                  TOTAL & ACCIONES
                </th>
              </tr>

              <tr className="bg-slate-800 text-[10.5px] font-semibold text-slate-300">
                <th className="p-2.5 text-left bg-slate-900/90 whitespace-nowrap border-r border-slate-700">Ficha</th>
                <th className="p-2.5 text-left bg-slate-900/90 whitespace-nowrap border-r border-slate-700">Aprendiz</th>
                <th className="p-2.5 text-left bg-slate-900/90 whitespace-nowrap border-r border-slate-700">Correo Electrónico</th>
                
                {/* Uniforme */}
                <th className="p-2 bg-emerald-900/60 text-emerald-100 whitespace-nowrap border-r border-emerald-800/60 min-w-[130px]">Uniforme 1</th>
                <th className="p-2 bg-emerald-900/60 text-emerald-100 whitespace-nowrap border-r border-emerald-800/60 min-w-[130px]">Uniforme 2</th>
                <th className="p-2 bg-emerald-900/60 text-emerald-100 whitespace-nowrap border-r border-emerald-800/60 min-w-[130px]">Uniforme 3</th>
                <th className="p-2 bg-emerald-900/80 text-yellow-300 whitespace-nowrap border-r border-slate-700 min-w-[100px]">Plan Mejoram.</th>

                {/* Puntualidad */}
                <th className="p-2 bg-amber-900/60 text-amber-100 whitespace-nowrap border-r border-amber-800/60 min-w-[130px]">Puntualidad 1</th>
                <th className="p-2 bg-amber-900/60 text-amber-100 whitespace-nowrap border-r border-amber-800/60 min-w-[130px]">Puntualidad 2</th>
                <th className="p-2 bg-amber-900/60 text-amber-100 whitespace-nowrap border-r border-amber-800/60 min-w-[130px]">Puntualidad 3</th>
                <th className="p-2 bg-amber-900/80 text-yellow-300 whitespace-nowrap border-r border-slate-700 min-w-[100px]">Plan Mejoram.</th>

                {/* Evidencias */}
                <th className="p-2 bg-blue-900/60 text-blue-100 whitespace-nowrap border-r border-blue-800/60 min-w-[130px]">Evidencias 1</th>
                <th className="p-2 bg-blue-900/60 text-blue-100 whitespace-nowrap border-r border-blue-800/60 min-w-[130px]">Evidencias 2</th>
                <th className="p-2 bg-blue-900/60 text-blue-100 whitespace-nowrap border-r border-blue-800/60 min-w-[130px]">Evidencias 3</th>
                <th className="p-2 bg-blue-900/80 text-yellow-300 whitespace-nowrap border-r border-slate-700 min-w-[100px]">Plan Mejoram.</th>

                {/* Resumen */}
                <th className="p-2.5 bg-slate-900/90 whitespace-nowrap border-r border-slate-700">Total</th>
                <th className="p-2.5 bg-slate-900/90 whitespace-nowrap">Notificación</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAprendices.map((a, index) => {
                const c = checklistMap[a.documento];
                const totals = calculateTotals(c);
                const currentCorreo = c?.correo || a.correo || '';

                return (
                  <tr 
                    key={a.documento} 
                    className={`hover:bg-slate-50/90 transition-colors ${
                      totals.hasPMD ? 'bg-red-50/20' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Ficha */}
                    <td className="p-2.5 font-bold text-emerald-800 whitespace-nowrap border-r border-slate-100">
                      {a.ficha}
                    </td>

                    {/* Aprendiz */}
                    <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap border-r border-slate-100">
                      <div>{a.apellidos} {a.nombre}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {a.tipoDocumento}: {a.documento}
                      </span>
                    </td>

                    {/* Correo */}
                    <td className="p-2.5 border-r border-slate-100 whitespace-nowrap">
                      {editingEmailDoc === a.documento ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="email"
                            value={tempEmailValue}
                            onChange={(e) => setTempEmailValue(e.target.value)}
                            className="px-2 py-1 text-[11px] rounded border border-emerald-500 outline-none w-44"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEmail(a.documento)}
                            className="p-1 rounded bg-emerald-600 text-white"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => handleStartEditEmail(a.documento, currentCorreo)}
                          className="flex items-center gap-1.5 cursor-pointer group text-slate-600 hover:text-emerald-700"
                          title="Clic para editar correo"
                        >
                          <span className="text-[11px] font-mono">{currentCorreo || 'Sin correo'}</span>
                          <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-emerald-600" />
                        </div>
                      )}
                    </td>

                    {/* GRUPO UNIFORME */}
                    <td className="p-2 bg-emerald-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'uniforme1Fecha', 'uniforme1Entregada', 'uniforme1FechaLimite', 'uniforme', 1, a)}
                    </td>
                    <td className="p-2 bg-emerald-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'uniforme2Fecha', 'uniforme2Entregada', 'uniforme2FechaLimite', 'uniforme', 2, a)}
                    </td>
                    <td className="p-2 bg-emerald-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'uniforme3Fecha', 'uniforme3Entregada', 'uniforme3FechaLimite', 'uniforme', 3, a)}
                    </td>
                    <td className="p-2 bg-emerald-100/30 border-r border-slate-200">
                      {renderPMDCellWithDelivery(a.documento, 'uniformePlanMejoramiento', 'uniformePlanEntregado', totals.uniforme >= 3, a)}
                    </td>

                    {/* GRUPO PUNTUALIDAD */}
                    <td className="p-2 bg-amber-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'puntualidad1Fecha', 'puntualidad1Entregada', 'puntualidad1FechaLimite', 'puntualidad', 1, a)}
                    </td>
                    <td className="p-2 bg-amber-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'puntualidad2Fecha', 'puntualidad2Entregada', 'puntualidad2FechaLimite', 'puntualidad', 2, a)}
                    </td>
                    <td className="p-2 bg-amber-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'puntualidad3Fecha', 'puntualidad3Entregada', 'puntualidad3FechaLimite', 'puntualidad', 3, a)}
                    </td>
                    <td className="p-2 bg-amber-100/30 border-r border-slate-200">
                      {renderPMDCellWithDelivery(a.documento, 'puntualidadPlanMejoramiento', 'puntualidadPlanEntregado', totals.puntualidad >= 3, a)}
                    </td>

                    {/* GRUPO EVIDENCIAS */}
                    <td className="p-2 bg-blue-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'evidencias1Fecha', 'evidencias1Entregada', 'evidencias1FechaLimite', 'actividades', 1, a)}
                    </td>
                    <td className="p-2 bg-blue-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'evidencias2Fecha', 'evidencias2Entregada', 'evidencias2FechaLimite', 'actividades', 2, a)}
                    </td>
                    <td className="p-2 bg-blue-50/15 border-r border-slate-100">
                      {renderDateCellWithMedida(a.documento, 'evidencias3Fecha', 'evidencias3Entregada', 'evidencias3FechaLimite', 'actividades', 3, a)}
                    </td>
                    <td className="p-2 bg-blue-100/30 border-r border-slate-200">
                      {renderPMDCellWithDelivery(a.documento, 'evidenciasPlanMejoramiento', 'evidenciasPlanEntregado', totals.actividades >= 3, a)}
                    </td>

                    {/* TOTAL */}
                    <td className="p-2 text-center font-black border-r border-slate-100 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs ${
                        totals.total === 0 
                          ? 'text-emerald-700 bg-emerald-50' 
                          : totals.total < 3 
                          ? 'text-amber-800 bg-amber-100' 
                          : 'text-red-700 bg-red-100 animate-pulse'
                      }`}>
                        {totals.total} / 3
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td className="p-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const tipo = totals.uniforme > 0 ? 'uniforme' : totals.puntualidad > 0 ? 'puntualidad' : 'actividades';
                            const nivel = Math.max(1, Math.min(3, totals.total || 1)) as 1 | 2 | 3;
                            onOpenEmailModal(a, totals.hasPMD ? 'pmd' : tipo, nivel);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-2xs transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          Remitir Correo
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenReportModal(a)}
                          className="p-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="Ficha Oficial SENA"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA PEGAR CORREOS */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-600" />
                Cargar o Actualizar Correos de Aprendices
              </h4>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-700">
                <XClose className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Pega la lista de correos en formato: <strong>Documento,Correo</strong>
            </p>

            <textarea
              rows={8}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="1023383791,nicollalarcon602@gmail.com&#10;1030573025,feralonso1918@gmail.com&#10;..."
              className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 font-mono text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessBatchText}
                className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl shadow-md"
              >
                Procesar y Guardar Correos
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

function XClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
