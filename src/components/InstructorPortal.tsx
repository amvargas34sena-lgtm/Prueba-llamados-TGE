import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  PlusCircle, 
  CheckSquare, 
  Printer, 
  Download, 
  Clock, 
  Shirt, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Mail,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Aprendiz, Novedad, TipoIncumplimiento, ChecklistRegistro } from '../types';
import { ChecklistTable } from './ChecklistTable';
import { InstructorDashboard } from './InstructorDashboard';

interface InstructorPortalProps {
  aprendices: Aprendiz[];
  novedades: Novedad[];
  checklist: ChecklistRegistro[];
  onAddNovedad: (novedad: Omit<Novedad, 'id' | 'nivelLlamado'>) => void;
  onUpdateChecklistCell: (
    documento: string, 
    field: keyof ChecklistRegistro, 
    value: string | boolean | undefined
  ) => void;
  onOpenReportModal: (aprendiz: Aprendiz, novedades: Novedad[]) => void;
  onOpenEmailModal: (
    aprendiz: Aprendiz, 
    tipo: 'uniforme' | 'puntualidad' | 'actividades' | 'pmd', 
    nivel: 1 | 2 | 3,
    fecha?: string
  ) => void;
  onBatchUpdateEmails: (updates: { documento: string; correo: string }[]) => void;
}

export const InstructorPortal: React.FC<InstructorPortalProps> = ({
  aprendices,
  novedades,
  checklist,
  onAddNovedad,
  onUpdateChecklistCell,
  onOpenReportModal,
  onOpenEmailModal,
  onBatchUpdateEmails
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'dashboard' | 'registrar' | 'aprendices' | 'planes'>('checklist');
  const [filterFicha, setFilterFicha] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form State for new incident
  const [formData, setFormData] = useState({
    ficha: '3384701',
    aprendizDocumento: '',
    tipo: 'puntualidad' as TipoIncumplimiento,
    fecha: new Date().toISOString().split('T')[0],
    instructor: 'Instructor Gestión Empresarial',
    observacion: '',
    medidaFormativa: 'Compromiso reflexivo y ajuste de conducta formativa',
    fechaLimiteMedida: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    soporteUrl: ''
  });

  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Statistics calculation combining checklist and novedades
  const stats = useMemo(() => {
    const totalAprendices = aprendices.length;

    // Build map from checklist
    const countMap: Record<string, { puntualidad: number; uniforme: number; actividades: number; total: number; hasPMD: boolean }> = {};
    
    aprendices.forEach(a => {
      countMap[a.documento] = { puntualidad: 0, uniforme: 0, actividades: 0, total: 0, hasPMD: false };
    });

    checklist.forEach(c => {
      const u = (c.uniforme1Fecha ? 1 : 0) + (c.uniforme2Fecha ? 1 : 0) + (c.uniforme3Fecha ? 1 : 0);
      const p = (c.puntualidad1Fecha ? 1 : 0) + (c.puntualidad2Fecha ? 1 : 0) + (c.puntualidad3Fecha ? 1 : 0);
      const a = (c.evidencias1Fecha ? 1 : 0) + (c.evidencias2Fecha ? 1 : 0) + (c.evidencias3Fecha ? 1 : 0);
      const total = u + p + a;
      const hasPMD = Boolean(c.uniformePlanMejoramiento || c.puntualidadPlanMejoramiento || c.evidenciasPlanMejoramiento || total >= 3);

      countMap[c.aprendizDocumento] = {
        uniforme: u,
        puntualidad: p,
        actividades: a,
        total,
        hasPMD
      };
    });

    let verde = 0;
    let amarillo = 0;
    let rojo = 0;
    let totalPuntualidad = 0;
    let totalUniforme = 0;
    let totalActividades = 0;

    Object.values(countMap).forEach(c => {
      totalPuntualidad += c.puntualidad;
      totalUniforme += c.uniforme;
      totalActividades += c.actividades;

      if (c.total === 0) verde++;
      else if (c.total < 3) amarillo++;
      else rojo++;
    });

    return {
      totalAprendices,
      verde,
      amarillo,
      rojo,
      totalPuntualidad,
      totalUniforme,
      totalActividades,
      countMap
    };
  }, [aprendices, checklist]);

  // Filtered apprentices for the general table
  const filteredAprendices = useMemo(() => {
    return aprendices.filter(a => {
      const matchFicha = filterFicha === 'todos' || a.ficha === filterFicha;
      const term = searchTerm.toLowerCase();
      const matchSearch = 
        !searchTerm.trim() ||
        a.nombre.toLowerCase().includes(term) ||
        a.apellidos.toLowerCase().includes(term) ||
        a.documento.includes(term);
      return matchFicha && matchSearch;
    });
  }, [aprendices, filterFicha, searchTerm]);

  // Learners with active PMD
  const aprendicesConPMD = useMemo(() => {
    return aprendices.filter(a => (stats.countMap[a.documento]?.hasPMD || false));
  }, [aprendices, stats.countMap]);

  // Submit new incident
  const handleSubmitNovedad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aprendizDocumento) {
      alert('Por favor selecciona un aprendiz.');
      return;
    }

    const currentCount = (stats.countMap[formData.aprendizDocumento]?.total || 0);
    const nextLevel = (currentCount + 1);

    onAddNovedad({
      aprendizDocumento: formData.aprendizDocumento,
      ficha: formData.ficha,
      fecha: formData.fecha,
      instructor: formData.instructor,
      tipo: formData.tipo,
      observacion: formData.observacion,
      medidaFormativa: formData.medidaFormativa,
      fechaLimiteMedida: formData.fechaLimiteMedida,
      soporteUrl: formData.soporteUrl
    });

    // Also update checklist corresponding field
    const c = checklist.find(item => item.aprendizDocumento === formData.aprendizDocumento);
    if (formData.tipo === 'uniforme') {
      if (!c?.uniforme1Fecha) onUpdateChecklistCell(formData.aprendizDocumento, 'uniforme1Fecha', formData.fecha);
      else if (!c?.uniforme2Fecha) onUpdateChecklistCell(formData.aprendizDocumento, 'uniforme2Fecha', formData.fecha);
      else onUpdateChecklistCell(formData.aprendizDocumento, 'uniforme3Fecha', formData.fecha);
    } else if (formData.tipo === 'puntualidad') {
      if (!c?.puntualidad1Fecha) onUpdateChecklistCell(formData.aprendizDocumento, 'puntualidad1Fecha', formData.fecha);
      else if (!c?.puntualidad2Fecha) onUpdateChecklistCell(formData.aprendizDocumento, 'puntualidad2Fecha', formData.fecha);
      else onUpdateChecklistCell(formData.aprendizDocumento, 'puntualidad3Fecha', formData.fecha);
    } else if (formData.tipo === 'actividades') {
      if (!c?.evidencias1Fecha) onUpdateChecklistCell(formData.aprendizDocumento, 'evidencias1Fecha', formData.fecha);
      else if (!c?.evidencias2Fecha) onUpdateChecklistCell(formData.aprendizDocumento, 'evidencias2Fecha', formData.fecha);
      else onUpdateChecklistCell(formData.aprendizDocumento, 'evidencias3Fecha', formData.fecha);
    }

    const aprendiz = aprendices.find(a => a.documento === formData.aprendizDocumento);
    const nombre = aprendiz ? `${aprendiz.nombre} ${aprendiz.apellidos}` : 'el aprendiz';

    if (nextLevel >= 3) {
      setFormSuccessMessage(`¡Alerta Crítica! ${nombre} ha acumulado ${nextLevel} llamados de atención. Se ha ACTIVADO AUTOMÁTICAMENTE el Plan de Mejoramiento Disciplinario.`);
    } else {
      setFormSuccessMessage(`Llamado #${nextLevel} registrado para ${nombre}.`);
    }

    setFormData(prev => ({ ...prev, observacion: '', soporteUrl: '' }));
    setTimeout(() => setFormSuccessMessage(null), 7000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Navegación y Barra de Pestañas del Instructor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Panel de Gestión del Instructor · SENA CSF
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Control Disciplinario y Formativo · Acuerdo 009 de 2024
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'checklist'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Lista de Verificación
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('registrar')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'registrar'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Novedad
          </button>

          <button
            onClick={() => setActiveTab('planes')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all ${
              activeTab === 'planes'
                ? 'bg-red-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Planes de Mejoramiento ({aprendicesConPMD.length})
          </button>
        </div>
      </div>

      {/* 1. VISTA LISTA DE VERIFICACIÓN (MATRIZ DISCIPLINARIA) */}
      {activeTab === 'checklist' && (
        <ChecklistTable
          aprendices={aprendices}
          checklist={checklist}
          onUpdateChecklistCell={onUpdateChecklistCell}
          onOpenEmailModal={onOpenEmailModal}
          onOpenReportModal={(apr) => {
            const aprNovedades = novedades.filter(n => n.aprendizDocumento === apr.documento);
            onOpenReportModal(apr, aprNovedades);
          }}
          onBatchUpdateEmails={onBatchUpdateEmails}
        />
      )}

      {/* 2. VISTA DASHBOARD (RECHARTS) */}
      {activeTab === 'dashboard' && (
        <InstructorDashboard
          aprendices={aprendices}
          checklist={checklist}
          novedades={novedades}
          onSelectAprendiz={(documento) => {
            const apr = aprendices.find(a => a.documento === documento);
            if (apr) {
              const aprNovedades = novedades.filter(n => n.aprendizDocumento === apr.documento);
              onOpenReportModal(apr, aprNovedades);
            }
          }}
        />
      )}

      {/* 3. VISTA REGISTRAR NOVEDAD INDIVIDUAL */}
      {activeTab === 'registrar' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              <PlusCircle className="w-3.5 h-3.5" />
              Registro Rápido de Incumplimiento
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Ingresar Novedad Formativa
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Actualiza automáticamente la lista de verificación y el reporte individual del aprendiz.
            </p>
          </div>

          {formSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitNovedad} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Ficha</label>
                <select
                  value={formData.ficha}
                  onChange={(e) => setFormData({ ...formData, ficha: e.target.value, aprendizDocumento: '' })}
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="3384701">Ficha 3384701 - Gestión Empresarial</option>
                  <option value="3384773">Ficha 3384773 - Gestión Empresarial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Aprendiz</label>
                <select
                  value={formData.aprendizDocumento}
                  onChange={(e) => setFormData({ ...formData, aprendizDocumento: e.target.value })}
                  required
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Seleccionar Aprendiz --</option>
                  {aprendices.filter(a => a.ficha === formData.ficha).map(a => (
                    <option key={a.documento} value={a.documento}>
                      {a.apellidos} {a.nombre} ({stats.countMap[a.documento]?.total || 0} llamados)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Tipo de Incumplimiento</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoIncumplimiento })}
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="puntualidad">1. Llegada tarde a la formación (Puntualidad)</option>
                  <option value="uniforme">2. Uso inadecuado del uniforme SENA CSF</option>
                  <option value="actividades">3. Entrega tardía de evidencias / actividades</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Fecha del Suceso</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Observación Pedagógica</label>
              <textarea
                rows={3}
                placeholder="Detalle de los hechos observados en el ambiente de formación..."
                value={formData.observacion}
                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                required
                className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Medida Formativa Sugerida</label>
              <input
                type="text"
                value={formData.medidaFormativa}
                onChange={(e) => setFormData({ ...formData, medidaFormativa: e.target.value })}
                className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                Guardar Novedad y Actualizar Matriz
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. VISTA PLANES DE MEJORAMIENTO */}
      {activeTab === 'planes' && (
        <div className="bg-white rounded-3xl border border-red-200 shadow-md p-6 space-y-6">
          <div className="border-b border-red-100 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              Acuerdo 009 de 2024 · Planes de Mejoramiento Disciplinario (PMD)
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Aprendices con 3 Llamados o Plan de Mejoramiento Activo ({aprendicesConPMD.length})
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Conforme al Reglamento del Aprendiz SENA, al acumular 3 llamados en cualquiera de los componentes se suscribe el Plan de Mejoramiento con seguimiento estricto.
            </p>
          </div>

          {aprendicesConPMD.length === 0 ? (
            <div className="p-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base text-emerald-950">¡Ningún aprendiz en Plan de Mejoramiento!</h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Las estrategias preventivas y formativas han funcionado eficazmente. Los aprendices mantienen el control de sus deberes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aprendicesConPMD.map(a => {
                const c = checklist.find(item => item.aprendizDocumento === a.documento);
                const counts = stats.countMap[a.documento] || { puntualidad: 0, uniforme: 0, actividades: 0, total: 0 };
                const aprNovedades = novedades.filter(n => n.aprendizDocumento === a.documento);

                return (
                  <div key={a.documento} className="p-5 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                          Ficha {a.ficha} · Gestión Empresarial
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-1">
                          {a.apellidos} {a.nombre}
                        </h4>
                        <p className="text-xs text-slate-500">{a.tipoDocumento} {a.documento} · {c?.correo || a.correo}</p>
                      </div>

                      <span className="text-xl font-black text-red-600 bg-white px-3 py-1 rounded-xl shadow-sm border border-red-200">
                        {counts.total} llamados
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2.5 rounded-xl border border-red-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Uniforme</span>
                        <span className="font-bold text-slate-800">{counts.uniforme}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Puntualidad</span>
                        <span className="font-bold text-slate-800">{counts.puntualidad}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Evidencias</span>
                        <span className="font-bold text-slate-800">{counts.actividades}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => onOpenEmailModal(a, 'pmd', 3)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Remitir Notificación PMD
                      </button>

                      <button
                        onClick={() => onOpenReportModal(a, aprNovedades)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Acta Oficial PMD
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
