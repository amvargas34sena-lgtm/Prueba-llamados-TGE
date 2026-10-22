import React, { useState, useMemo } from 'react';
import { 
  Search, 
  User, 
  Award, 
  Clock, 
  Shirt, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Printer, 
  FileText, 
  Calendar, 
  HelpCircle,
  Building,
  GraduationCap
} from 'lucide-react';
import { Aprendiz, Novedad, TipoIncumplimiento } from '../types';
import { MotivationalBanners } from './MotivationalBanners';

interface ApprenticePortalProps {
  aprendices: Aprendiz[];
  novedades: Novedad[];
  onOpenReportModal?: (aprendiz: Aprendiz, novedades: Novedad[]) => void;
}

export const ApprenticePortal: React.FC<ApprenticePortalProps> = ({
  aprendices,
  novedades,
  onOpenReportModal
}) => {
  const [selectedFicha, setSelectedFicha] = useState<string>('3384701');
  const [selectedDocumento, setSelectedDocumento] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedComponent, setHighlightedComponent] = useState<TipoIncumplimiento | null>(null);

  // Available fichas
  const fichas = useMemo(() => Array.from(new Set(aprendices.map(a => a.ficha))), [aprendices]);

  // Filtered apprentices for the dropdown
  const aprendicesDeFicha = useMemo(() => {
    return aprendices.filter(a => a.ficha === selectedFicha);
  }, [aprendices, selectedFicha]);

  // Quick search
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return aprendicesDeFicha;
    const term = searchTerm.toLowerCase();
    return aprendicesDeFicha.filter(
      a =>
        a.nombre.toLowerCase().includes(term) ||
        a.apellidos.toLowerCase().includes(term) ||
        a.documento.includes(term)
    );
  }, [aprendicesDeFicha, searchTerm]);

  // Current selected apprentice
  const selectedAprendiz = useMemo(() => {
    return aprendices.find(a => a.documento === selectedDocumento);
  }, [aprendices, selectedDocumento]);

  // Novedades of the selected apprentice
  const aprendizNovedades = useMemo(() => {
    if (!selectedDocumento) return [];
    return novedades.filter(n => n.aprendizDocumento === selectedDocumento);
  }, [novedades, selectedDocumento]);

  // Individual counts per component
  const conteoPuntualidad = useMemo(() => {
    return aprendizNovedades.filter(n => n.tipo === 'puntualidad').length;
  }, [aprendizNovedades]);

  const conteoUniforme = useMemo(() => {
    return aprendizNovedades.filter(n => n.tipo === 'uniforme').length;
  }, [aprendizNovedades]);

  const conteoActividades = useMemo(() => {
    return aprendizNovedades.filter(n => n.tipo === 'actividades').length;
  }, [aprendizNovedades]);

  const totalLlamados = conteoPuntualidad + conteoUniforme + conteoActividades;

  // Plan de Mejoramiento active if >= 3 warnings
  const tienePlanMejoramiento = totalLlamados >= 3;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* 1. SECCIÓN DE ANUNCIOS MOTIVACIONALES (CON FOTOS REALES DE APRENDICES CSF) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Cultura Disciplinaria y Valores Institucionales
            </h2>
            <p className="text-xs text-slate-500">
              Inspiración para los 3 componentes del Reglamento del Aprendiz (Acuerdo 009 de 2024)
            </p>
          </div>
        </div>

        <MotivationalBanners 
          onSelectComponent={(comp) => {
            setHighlightedComponent(comp);
            const el = document.getElementById('reporte-aprendiz-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </section>

      {/* 2. MÓDULO DE CONSULTA INDIVIDUAL DEL APRENDIZ */}
      <section id="reporte-aprendiz-section" className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              <User className="w-3.5 h-3.5" />
              Portal de Auto-Consulta de Aprendices
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Consulta tu Estado Disciplinario en Tiempo Real
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Selecciona tu número de ficha y tu nombre o número de documento para verificar tu récord de llamados de atención.
            </p>
          </div>

          {/* Selectores */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Selector de Ficha */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Selecciona tu Ficha
              </label>
              <select
                value={selectedFicha}
                onChange={(e) => {
                  setSelectedFicha(e.target.value);
                  setSelectedDocumento('');
                }}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              >
                {fichas.map(f => (
                  <option key={f} value={f}>
                    Ficha {f} - Gestión Empresarial ({aprendices.filter(a => a.ficha === f).length} aprendices)
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Aprendiz */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Selecciona tu Nombre
              </label>
              <select
                value={selectedDocumento}
                onChange={(e) => setSelectedDocumento(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              >
                <option value="">-- Elige tu nombre de la lista ({aprendicesDeFicha.length}) --</option>
                {filteredList.map(a => (
                  <option key={a.documento} value={a.documento}>
                    {a.apellidos} {a.nombre} · {a.tipoDocumento} {a.documento}
                  </option>
                ))}
              </select>
            </div>

            {/* Buscador Rápido por Documento o Nombre */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Filtrar por texto
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar nombre o doc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Estado vacío cuando no ha seleccionado ningún aprendiz */}
          {!selectedAprendiz && (
            <div className="py-12 px-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Selecciona tu ficha y nombre para ver tu informe
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tu información es privada y formativa. Consulta el estado de tus deberes de puntualidad, uniforme y evidencias académicas.
              </p>
            </div>
          )}

          {/* 3. REPORTE COMPLETO DEL APRENDIZ SELECCIONADO */}
          {selectedAprendiz && (
            <div className="space-y-6 pt-4 animate-in fade-in duration-300">
              
              {/* Tarjeta de Encabezado del Aprendiz */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Ficha {selectedAprendiz.ficha}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200">
                      {selectedAprendiz.tipoDocumento}: {selectedAprendiz.documento}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200">
                      Jornada {selectedAprendiz.jornada || 'Diurna'}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {selectedAprendiz.nombre} {selectedAprendiz.apellidos}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-200/80 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Programa: Tecnólogo en Gestión Empresarial · SENA CSF
                  </p>
                </div>

                {/* Badge de Estado General */}
                <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                  {totalLlamados === 0 ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-sm font-bold shadow-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      Estado: Ejemplar / Al Día
                    </div>
                  ) : totalLlamados < 3 ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-bold shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Estado: Atención Preventiva ({totalLlamados} {totalLlamados === 1 ? 'llamado' : 'llamados'})
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-500/20 border border-red-400/40 text-red-200 text-sm font-bold shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      Plan de Mejoramiento Activo
                    </div>
                  )}

                  <span className="text-[11px] text-slate-300">
                    Reglamento del Aprendiz · Acuerdo 009 de 2024
                  </span>
                </div>
              </div>

              {/* LOS 3 COMPONENTES DISCIPLINARIOS CON SUS RESPECTIVOS LLAMADOS */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                  <span>Balance por Componente Reglamentario</span>
                  <span className="text-xs text-slate-500 font-normal">Máximo permitido antes de PMD: 2 llamadas</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* COMPONENTE 1: PUNTUALIDAD */}
                  <div className={`p-5 rounded-3xl border transition-all ${
                    highlightedComponent === 'puntualidad' ? 'ring-2 ring-amber-500 bg-amber-50/50' : 'bg-white'
                  } ${
                    conteoPuntualidad === 0 
                      ? 'border-slate-200' 
                      : conteoPuntualidad < 3 
                      ? 'border-amber-300 bg-amber-50/20' 
                      : 'border-red-300 bg-red-50/30'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">1. Puntualidad</h5>
                          <span className="text-[11px] text-slate-500">Llegadas tarde</span>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${
                        conteoPuntualidad === 0 ? 'text-emerald-600' : conteoPuntualidad < 3 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {conteoPuntualidad} <span className="text-xs font-semibold text-slate-400">/ 3</span>
                      </span>
                    </div>

                    {/* Semáforo visual de 3 pasos */}
                    <div className="grid grid-cols-3 gap-1.5 my-3">
                      <div className={`h-2 rounded-full ${conteoPuntualidad >= 1 ? 'bg-amber-500' : 'bg-slate-200'}`} title="1er Llamado" />
                      <div className={`h-2 rounded-full ${conteoPuntualidad >= 2 ? 'bg-amber-600' : 'bg-slate-200'}`} title="2do Llamado" />
                      <div className={`h-2 rounded-full ${conteoPuntualidad >= 3 ? 'bg-red-600' : 'bg-slate-200'}`} title="3er Llamado (PMD)" />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Deber: <em>"Asistir puntualmente a las actividades programadas en los ambientes de formación."</em>
                    </p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                      <span>Llamados registrados:</span>
                      <span className={conteoPuntualidad === 0 ? 'text-emerald-700' : 'text-amber-800'}>
                        {conteoPuntualidad === 0 ? 'Sin incidencias' : `${conteoPuntualidad} llamado(s)`}
                      </span>
                    </div>
                  </div>

                  {/* COMPONENTE 2: UNIFORME */}
                  <div className={`p-5 rounded-3xl border transition-all ${
                    highlightedComponent === 'uniforme' ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : 'bg-white'
                  } ${
                    conteoUniforme === 0 
                      ? 'border-slate-200' 
                      : conteoUniforme < 3 
                      ? 'border-amber-300 bg-amber-50/20' 
                      : 'border-red-300 bg-red-50/30'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                          <Shirt className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">2. Uniforme SENA</h5>
                          <span className="text-[11px] text-slate-500">Porte reglamentario</span>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${
                        conteoUniforme === 0 ? 'text-emerald-600' : conteoUniforme < 3 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {conteoUniforme} <span className="text-xs font-semibold text-slate-400">/ 3</span>
                      </span>
                    </div>

                    {/* Semáforo visual de 3 pasos */}
                    <div className="grid grid-cols-3 gap-1.5 my-3">
                      <div className={`h-2 rounded-full ${conteoUniforme >= 1 ? 'bg-amber-500' : 'bg-slate-200'}`} title="1er Llamado" />
                      <div className={`h-2 rounded-full ${conteoUniforme >= 2 ? 'bg-amber-600' : 'bg-slate-200'}`} title="2do Llamado" />
                      <div className={`h-2 rounded-full ${conteoUniforme >= 3 ? 'bg-red-600' : 'bg-slate-200'}`} title="3er Llamado (PMD)" />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Deber: <em>"Portar adecuadamente el conjunto de prendas institucionales y el carné visible."</em>
                    </p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                      <span>Llamados registrados:</span>
                      <span className={conteoUniforme === 0 ? 'text-emerald-700' : 'text-amber-800'}>
                        {conteoUniforme === 0 ? 'Sin incidencias' : `${conteoUniforme} llamado(s)`}
                      </span>
                    </div>
                  </div>

                  {/* COMPONENTE 3: ACTIVIDADES / EVIDENCIAS */}
                  <div className={`p-5 rounded-3xl border transition-all ${
                    highlightedComponent === 'actividades' ? 'ring-2 ring-blue-500 bg-blue-50/50' : 'bg-white'
                  } ${
                    conteoActividades === 0 
                      ? 'border-slate-200' 
                      : conteoActividades < 3 
                      ? 'border-amber-300 bg-amber-50/20' 
                      : 'border-red-300 bg-red-50/30'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">3. Evidencias</h5>
                          <span className="text-[11px] text-slate-500">Entrega de talleres</span>
                        </div>
                      </div>
                      <span className={`text-xl font-black ${
                        conteoActividades === 0 ? 'text-emerald-600' : conteoActividades < 3 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {conteoActividades} <span className="text-xs font-semibold text-slate-400">/ 3</span>
                      </span>
                    </div>

                    {/* Semáforo visual de 3 pasos */}
                    <div className="grid grid-cols-3 gap-1.5 my-3">
                      <div className={`h-2 rounded-full ${conteoActividades >= 1 ? 'bg-amber-500' : 'bg-slate-200'}`} title="1er Llamado" />
                      <div className={`h-2 rounded-full ${conteoActividades >= 2 ? 'bg-amber-600' : 'bg-slate-200'}`} title="2do Llamado" />
                      <div className={`h-2 rounded-full ${conteoActividades >= 3 ? 'bg-red-600' : 'bg-slate-200'}`} title="3er Llamado (PMD)" />
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      Deber: <em>"Cumplir con todas las actividades y evidencias concertadas en el proceso formativo."</em>
                    </p>

                    <div className="pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                      <span>Llamados registrados:</span>
                      <span className={conteoActividades === 0 ? 'text-emerald-700' : 'text-amber-800'}>
                        {conteoActividades === 0 ? 'Sin incidencias' : `${conteoActividades} llamado(s)`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ALERTA DE PLAN DE MEJORAMIENTO DISCIPLINARIO (SI APLICA) */}
              {tienePlanMejoramiento && (
                <div className="p-6 rounded-3xl bg-red-50 border-2 border-red-300 text-red-950 space-y-3 shadow-md animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-red-600 text-white shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-red-900">
                        Atención: Has acumulado 3 llamados de atención
                      </h4>
                      <p className="text-xs text-red-800">
                        Conforme al <strong>Acuerdo 009 de 2024</strong> del Reglamento del Aprendiz SENA, se ha activado automáticamente el <strong>Plan de Mejoramiento Disciplinario (PMD)</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 p-4 rounded-2xl border border-red-200 text-xs text-slate-700 space-y-1.5">
                    <span className="font-bold text-slate-900 block">Pautas a seguir con tu Instructor Líder:</span>
                    <p>1. Presentarse en coordinación para suscribir el acta de compromisos y actividades pedagógicas correctivas.</p>
                    <p>2. Entregar las evidencias o medidas formativas asignadas antes de la fecha límite estipulada.</p>
                    <p>3. El incumplimiento del Plan de Mejoramiento Disciplinario da lugar a remisión inmediata ante el Comité de Evaluación y Seguimiento.</p>
                  </div>
                </div>
              )}

              {/* DETALLE DEL HISTORIAL DE NOVEDADES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Historial de Novedades y Medidas Formativas
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    Total Registros: {aprendizNovedades.length}
                  </span>
                </div>

                {aprendizNovedades.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h5 className="font-bold text-sm text-emerald-950">¡Historial Impecable!</h5>
                    <p className="text-xs text-emerald-800 max-w-md mx-auto">
                      No registras llamados de atención por puntualidad, uniforme ni entregas académicas. Continúa con este nivel de compromiso institucional.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {aprendizNovedades.map((nov, idx) => (
                      <div 
                        key={nov.id || idx}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                              nov.tipo === 'puntualidad' 
                                ? 'bg-amber-100 text-amber-800' 
                                : nov.tipo === 'uniforme' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {nov.tipo === 'puntualidad' ? 'Puntualidad' : nov.tipo === 'uniforme' ? 'Uniforme' : 'Evidencias'}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              Llamado Nivel {nov.nivelLlamado}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {nov.fecha}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span>{nov.instructor}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-700 space-y-1">
                          <p><strong>Observación:</strong> {nov.observacion}</p>
                          {nov.medidaFormativa && (
                            <p className="text-emerald-900 bg-emerald-50/70 p-2 rounded-xl border border-emerald-100">
                              <strong>Medida Formativa Asignada:</strong> {nov.medidaFormativa}
                              {nov.fechaLimiteMedida && ` (Fecha límite: ${nov.fechaLimiteMedida})`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón para imprimir o descargar reporte oficial */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  ¿Dudas sobre tu reporte? Consulta con tu instructor técnico o vocero de ficha.
                </div>

                <button
                  onClick={() => onOpenReportModal && onOpenReportModal(selectedAprendiz, aprendizNovedades)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / Descargar Reporte Formativo
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};
