import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Clock, 
  Shirt, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Aprendiz, Novedad, TipoIncumplimiento, PlanMejoramiento } from '../types';

interface InstructorPortalProps {
  aprendices: Aprendiz[];
  novedades: Novedad[];
  onAddNovedad: (novedad: Omit<Novedad, 'id' | 'nivelLlamado'>) => void;
  onOpenReportModal: (aprendiz: Aprendiz, novedades: Novedad[]) => void;
}

export const InstructorPortal: React.FC<InstructorPortalProps> = ({
  aprendices,
  novedades,
  onAddNovedad,
  onOpenReportModal
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registrar' | 'aprendices' | 'planes' | 'reportes'>('dashboard');
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

  // Statistics calculation
  const stats = useMemo(() => {
    const totalAprendices = aprendices.length;
    const totalNovedades = novedades.length;

    // Counts per learner
    const countMap: Record<string, { puntualidad: number; uniforme: number; actividades: number; total: number }> = {};
    aprendices.forEach(a => {
      countMap[a.documento] = { puntualidad: 0, uniforme: 0, actividades: 0, total: 0 };
    });

    novedades.forEach(n => {
      if (countMap[n.aprendizDocumento]) {
        countMap[n.aprendizDocumento][n.tipo]++;
        countMap[n.aprendizDocumento].total++;
      }
    });

    let verde = 0;
    let amarillo = 0;
    let rojo = 0;

    Object.values(countMap).forEach(c => {
      if (c.total === 0) verde++;
      else if (c.total < 3) amarillo++;
      else rojo++;
    });

    const totalPuntualidad = novedades.filter(n => n.tipo === 'puntualidad').length;
    const totalUniforme = novedades.filter(n => n.tipo === 'uniforme').length;
    const totalActividades = novedades.filter(n => n.tipo === 'actividades').length;

    return {
      totalAprendices,
      totalNovedades,
      verde,
      amarillo,
      rojo,
      totalPuntualidad,
      totalUniforme,
      totalActividades,
      countMap
    };
  }, [aprendices, novedades]);

  // Filtered apprentices for the table
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

  // Apprentices with 3 or more warnings (Active PMD)
  const aprendicesConPMD = useMemo(() => {
    return aprendices.filter(a => (stats.countMap[a.documento]?.total || 0) >= 3);
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

    const aprendiz = aprendices.find(a => a.documento === formData.aprendizDocumento);
    const nombre = aprendiz ? `${aprendiz.nombre} ${aprendiz.apellidos}` : 'el aprendiz';

    if (nextLevel >= 3) {
      setFormSuccessMessage(`¡Alerta Crítica! ${nombre} ha alcanzado ${nextLevel} llamados de atención. Se ha ACTIVADO AUTOMÁTICAMENTE el Plan de Mejoramiento Disciplinario conforme al Acuerdo 009 de 2024.`);
    } else {
      setFormSuccessMessage(`Llamado #${nextLevel} registrado con éxito para ${nombre}. Se notificó la medida correctiva.`);
    }

    // Reset fields except ficha
    setFormData(prev => ({
      ...prev,
      observacion: '',
      soporteUrl: ''
    }));

    setTimeout(() => {
      setFormSuccessMessage(null);
    }, 7000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Ficha", "TipoDoc", "Documento", "Nombre", "Apellidos", "Llamados_Puntualidad", "Llamados_Uniforme", "Llamados_Evidencias", "Total_Llamados", "Estado_Reglamentario"];
    const rows = aprendices.map(a => {
      const counts = stats.countMap[a.documento] || { puntualidad: 0, uniforme: 0, actividades: 0, total: 0 };
      const estado = counts.total === 0 ? "Al Dia" : counts.total < 3 ? "Atencion Preventiva" : "Plan de Mejoramiento Activo";
      return [
        `"${a.ficha}"`,
        `"${a.tipoDocumento}"`,
        `"${a.documento}"`,
        `"${a.nombre}"`,
        `"${a.apellidos}"`,
        counts.puntualidad,
        counts.uniforme,
        counts.actividades,
        counts.total,
        `"${estado}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Disciplinario_SENA_CSF_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Navegación interna del Instructor */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Panel de Control del Instructor
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestión Disciplinaria y Preventiva · Acuerdo 009 de 2024
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
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
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'registrar'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Registrar Novedad
          </button>
          <button
            onClick={() => setActiveTab('aprendices')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'aprendices'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Aprendices ({aprendices.length})
          </button>
          <button
            onClick={() => setActiveTab('planes')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'planes'
                ? 'bg-red-700 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Planes de Mejoramiento ({aprendicesConPMD.length})
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
            title="Exportar base de datos a Excel / CSV"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* 1. VISTA DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Tarjetas KPI Superiores */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Total Aprendices
              </span>
              <div className="text-3xl font-black text-slate-900">{stats.totalAprendices}</div>
              <p className="text-[11px] text-slate-500">Fichas 3384701 & 3384773</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Récord Ejemplar (0 Llamados)
              </span>
              <div className="text-3xl font-black text-emerald-600">{stats.verde}</div>
              <p className="text-[11px] text-emerald-700 font-medium">
                {((stats.verde / stats.totalAprendices) * 100).toFixed(0)}% de la población formativa
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Atención Preventiva (1-2)
              </span>
              <div className="text-3xl font-black text-amber-600">{stats.amarillo}</div>
              <p className="text-[11px] text-amber-700 font-medium">Con medidas formativas activas</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                Plan Mejoramiento (≥ 3)
              </span>
              <div className="text-3xl font-black text-red-600">{stats.rojo}</div>
              <p className="text-[11px] text-red-700 font-medium">Activa remisión a Comité si incumple</p>
            </div>
          </div>

          {/* Distribución por los 3 Componentes Clave */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Incidencias por Componente Disciplinario (Reglamento del Aprendiz)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500 text-white">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">1. Puntualidad</h4>
                    <span className="text-xs text-amber-900/80">Llegadas tardías</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-amber-700">{stats.totalPuntualidad}</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">2. Uniforme SENA</h4>
                    <span className="text-xs text-emerald-900/80">Porte no reglamentario</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-emerald-800">{stats.totalUniforme}</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">3. Evidencias</h4>
                    <span className="text-xs text-blue-900/80">Entregas extemporáneas</span>
                  </div>
                </div>
                <span className="text-2xl font-black text-blue-800">{stats.totalActividades}</span>
              </div>
            </div>
          </div>

          {/* Comparativa por Ficha y Acceso Rápido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Ficha 3384701 · Gestión Empresarial</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Aprendices inscritos:</span>
                  <span className="font-bold text-slate-900">28</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Novedades registradas:</span>
                  <span className="font-bold text-slate-900">{novedades.filter(n => n.ficha === '3384701').length}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Planes de mejoramiento activos:</span>
                  <span className="font-bold text-red-600">
                    {aprendices.filter(a => a.ficha === '3384701' && (stats.countMap[a.documento]?.total || 0) >= 3).length}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setFilterFicha('3384701');
                  setActiveTab('aprendices');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Ver aprendices de la Ficha 3384701
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Ficha 3384773 · Gestión Empresarial</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Aprendices inscritos:</span>
                  <span className="font-bold text-slate-900">28</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Novedades registradas:</span>
                  <span className="font-bold text-slate-900">{novedades.filter(n => n.ficha === '3384773').length}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Planes de mejoramiento activos:</span>
                  <span className="font-bold text-red-600">
                    {aprendices.filter(a => a.ficha === '3384773' && (stats.countMap[a.documento]?.total || 0) >= 3).length}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setFilterFicha('3384773');
                  setActiveTab('aprendices');
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                Ver aprendices de la Ficha 3384773
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VISTA REGISTRAR NOVEDAD */}
      {activeTab === 'registrar' && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              <PlusCircle className="w-3.5 h-3.5" />
              Módulo de Registro Disciplinario
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Registrar Incumplimiento o Falta Formativa
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              El sistema calculará automáticamente si corresponde al 1°, 2° o 3° llamado y activará el Plan de Mejoramiento al 3er llamado.
            </p>
          </div>

          {formSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-start gap-2.5 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitNovedad} className="space-y-5 text-xs">
            
            {/* Ficha & Aprendiz */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Ficha de Formación</label>
                <select
                  value={formData.ficha}
                  onChange={(e) => setFormData({ ...formData, ficha: e.target.value, aprendizDocumento: '' })}
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="3384701">Ficha 3384701 - Gestión Empresarial</option>
                  <option value="3384773">Ficha 3384773 - Gestión Empresarial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Aprendiz Responsable</label>
                <select
                  value={formData.aprendizDocumento}
                  onChange={(e) => setFormData({ ...formData, aprendizDocumento: e.target.value })}
                  required
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="">-- Seleccionar Aprendiz --</option>
                  {aprendices.filter(a => a.ficha === formData.ficha).map(a => (
                    <option key={a.documento} value={a.documento}>
                      {a.apellidos} {a.nombre} ({stats.countMap[a.documento]?.total || 0} llamados previos)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tipo de Novedad y Fecha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Tipo de Incumplimiento</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoIncumplimiento })}
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="puntualidad">1. Llegada tarde a la formación (Puntualidad)</option>
                  <option value="uniforme">2. Uso inadecuado del uniforme SENA CSF</option>
                  <option value="actividades">3. Entrega tardía o no entrega de actividades / evidencias</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Fecha del Suceso</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Observación Pedagógica */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Observación Pedagógica de los Hechos</label>
              <textarea
                rows={3}
                placeholder="Describe puntualmente la situación ocurrida en el ambiente de aprendizaje..."
                value={formData.observacion}
                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                required
                className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Medida Formativa & Fecha Límite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Medida Formativa Sugerida</label>
                <select
                  value={formData.medidaFormativa}
                  onChange={(e) => setFormData({ ...formData, medidaFormativa: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Compromiso escrito de puntualidad y ajuste de horario">Compromiso escrito de puntualidad</option>
                  <option value="Taller reflexivo sobre imagen profesional y porte del uniforme">Taller reflexivo de uniforme</option>
                  <option value="Infografía pedagógica sobre deberes del aprendiz (Acuerdo 009/2024)">Infografía pedagógica Acuerdo 009</option>
                  <option value="Actividad de recuperación académica y entrega concertada">Actividad de recuperación académica</option>
                  <option value="Reunión de concertación con el equipo ejecutor de la ficha">Reunión de concertación pedagógica</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Fecha Límite para Cumplimiento</label>
                <input
                  type="date"
                  value={formData.fechaLimiteMedida}
                  onChange={(e) => setFormData({ ...formData, fechaLimiteMedida: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Enlace o Soporte de Evidencia */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Enlace o Soporte de Evidencia (Google Drive / Foto)</label>
              <input
                type="text"
                placeholder="https://drive.google.com/... o referencia del acta"
                value={formData.soporteUrl}
                onChange={(e) => setFormData({ ...formData, soporteUrl: e.target.value })}
                className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            {/* Botón de Enviar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, observacion: '' })}
                className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                Guardar y Generar Llamado
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. VISTA LISTADO DE APRENDICES */}
      {activeTab === 'aprendices' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Directorio y Récord Disciplinario ({filteredAprendices.length} Aprendices)
              </h3>
              <p className="text-xs text-slate-500">
                Monitoreo individual de los 3 componentes: Puntualidad, Uniforme y Evidencias.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setFilterFicha('todos')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterFicha === 'todos' ? 'bg-white shadow text-emerald-800' : 'text-slate-600'
                  }`}
                >
                  Todas (56)
                </button>
                <button
                  onClick={() => setFilterFicha('3384701')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterFicha === '3384701' ? 'bg-white shadow text-emerald-800' : 'text-slate-600'
                  }`}
                >
                  3384701 (28)
                </button>
                <button
                  onClick={() => setFilterFicha('3384773')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterFicha === '3384773' ? 'bg-white shadow text-emerald-800' : 'text-slate-600'
                  }`}
                >
                  3384773 (28)
                </button>
              </div>

              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o doc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Tabla de Aprendices */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Ficha</th>
                  <th className="p-3">Aprendiz</th>
                  <th className="p-3">Identificación</th>
                  <th className="p-3 text-center">1. Puntualidad</th>
                  <th className="p-3 text-center">2. Uniforme</th>
                  <th className="p-3 text-center">3. Evidencias</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAprendices.map(a => {
                  const counts = stats.countMap[a.documento] || { puntualidad: 0, uniforme: 0, actividades: 0, total: 0 };
                  const aprendizNovedades = novedades.filter(n => n.aprendizDocumento === a.documento);

                  return (
                    <tr key={a.documento} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-emerald-800 whitespace-nowrap">{a.ficha}</td>
                      <td className="p-3 font-bold text-slate-900">
                        {a.apellidos} {a.nombre}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {a.tipoDocumento} {a.documento}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          counts.puntualidad === 0 ? 'text-slate-400' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {counts.puntualidad}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          counts.uniforme === 0 ? 'text-slate-400' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {counts.uniforme}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${
                          counts.actividades === 0 ? 'text-slate-400' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {counts.actividades}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-black ${
                          counts.total === 0 ? 'text-emerald-600' : counts.total < 3 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {counts.total} / 3
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {counts.total === 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Al Día
                          </span>
                        ) : counts.total < 3 ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            Preventivo ({counts.total})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 animate-pulse">
                            PMD Activo
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onOpenReportModal(a, aprendizNovedades)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] shadow-sm transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Acta Oficial
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
              Aprendices con 3 Llamados Acumulados ({aprendicesConPMD.length})
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
                const counts = stats.countMap[a.documento] || { puntualidad: 0, uniforme: 0, actividades: 0, total: 0 };
                const aprendizNovedades = novedades.filter(n => n.aprendizDocumento === a.documento);

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
                        <p className="text-xs text-slate-500">{a.tipoDocumento} {a.documento}</p>
                      </div>

                      <span className="text-xl font-black text-red-600 bg-white px-3 py-1 rounded-xl shadow-sm border border-red-200">
                        {counts.total} llamados
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-2.5 rounded-xl border border-red-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Puntualidad</span>
                        <span className="font-bold text-slate-800">{counts.puntualidad}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Uniforme</span>
                        <span className="font-bold text-slate-800">{counts.uniforme}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Evidencias</span>
                        <span className="font-bold text-slate-800">{counts.actividades}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] font-semibold text-red-800">
                        Estado: En suscripción de compromisos
                      </span>
                      <button
                        onClick={() => onOpenReportModal(a, aprendizNovedades)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-sm transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Generar Acta PMD
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
