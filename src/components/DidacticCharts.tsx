import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Shirt, 
  FolderArchive, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  User, 
  ChevronRight,
  TrendingUp,
  Tag,
  Timer,
  FileCheck
} from 'lucide-react';
import { Aprendiz, ChecklistRegistro } from '../types';

interface DidacticChartsProps {
  aprendices: Aprendiz[];
  checklist: ChecklistRegistro[];
  onSelectAprendiz?: (documento: string, ficha: string) => void;
}

export const DidacticCharts: React.FC<DidacticChartsProps> = ({
  aprendices,
  checklist,
  onSelectAprendiz
}) => {
  const [activeFicha, setActiveFicha] = useState<string>('todos');
  const [filterMode, setFilterMode] = useState<'conFaltas' | 'todos'>('conFaltas');

  // Build lookup map for checklist
  const checklistMap = useMemo(() => {
    const map: Record<string, ChecklistRegistro> = {};
    checklist.forEach(c => {
      map[c.aprendizDocumento] = c;
    });
    return map;
  }, [checklist]);

  // Prepared data for the 3 charts
  const preparedData = useMemo(() => {
    const baseList = aprendices.filter(a => activeFicha === 'todos' || a.ficha === activeFicha);

    const listPuntualidad = baseList.map(a => {
      const c = checklistMap[a.documento];
      const count = (c?.puntualidad1Fecha ? 1 : 0) + (c?.puntualidad2Fecha ? 1 : 0) + (c?.puntualidad3Fecha ? 1 : 0);
      const fechas = [c?.puntualidad1Fecha, c?.puntualidad2Fecha, c?.puntualidad3Fecha].filter(Boolean) as string[];
      return { aprendiz: a, count, fechas, hasPMD: count >= 3 || Boolean(c?.puntualidadPlanMejoramiento) };
    }).sort((a, b) => b.count - a.count);

    const listUniforme = baseList.map(a => {
      const c = checklistMap[a.documento];
      const count = (c?.uniforme1Fecha ? 1 : 0) + (c?.uniforme2Fecha ? 1 : 0) + (c?.uniforme3Fecha ? 1 : 0);
      const fechas = [c?.uniforme1Fecha, c?.uniforme2Fecha, c?.uniforme3Fecha].filter(Boolean) as string[];
      return { aprendiz: a, count, fechas, hasPMD: count >= 3 || Boolean(c?.uniformePlanMejoramiento) };
    }).sort((a, b) => b.count - a.count);

    const listActividades = baseList.map(a => {
      const c = checklistMap[a.documento];
      const count = (c?.evidencias1Fecha ? 1 : 0) + (c?.evidencias2Fecha ? 1 : 0) + (c?.evidencias3Fecha ? 1 : 0);
      const fechas = [c?.evidencias1Fecha, c?.evidencias2Fecha, c?.evidencias3Fecha].filter(Boolean) as string[];
      return { aprendiz: a, count, fechas, hasPMD: count >= 3 || Boolean(c?.evidenciasPlanMejoramiento) };
    }).sort((a, b) => b.count - a.count);

    return { listPuntualidad, listUniforme, listActividades };
  }, [aprendices, checklistMap, activeFicha]);

  // Helpers to get displayed list according to filterMode
  const getDisplayList = (list: { aprendiz: Aprendiz; count: number; fechas: string[]; hasPMD: boolean }[]) => {
    if (filterMode === 'conFaltas') {
      const withFaults = list.filter(item => item.count > 0);
      // If none with faults, show top 5 al día as praise
      return withFaults.length > 0 ? withFaults : list.slice(0, 5);
    }
    return list;
  };

  const displayPuntualidad = getDisplayList(preparedData.listPuntualidad);
  const displayUniforme = getDisplayList(preparedData.listUniforme);
  const displayActividades = getDisplayList(preparedData.listActividades);

  return (
    <div className="space-y-6">
      
      {/* Encabezado Didáctico */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-md border border-white/15 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Visualizador Didáctico de Convivencia y Cumplimiento
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Monitor de Incumplimientos por Componente
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Infografías temáticas poco convencionales: <strong>El Cronómetro del Tiempo</strong> para puntualidad, <strong>El Perchero Institucional</strong> para uniforme, y <strong>El Archivador de Proyectos</strong> para evidencias académicas.
            </p>
          </div>

          {/* Filtros de Ficha y Modo */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white/10 p-1 rounded-2xl border border-white/15 flex text-xs font-bold">
              <button
                onClick={() => setActiveFicha('todos')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeFicha === 'todos' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Todas (56)
              </button>
              <button
                onClick={() => setActiveFicha('3384701')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeFicha === '3384701' ? 'bg-emerald-400 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Ficha 3384701
              </button>
              <button
                onClick={() => setActiveFicha('3384773')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeFicha === '3384773' ? 'bg-emerald-400 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Ficha 3384773
              </button>
            </div>

            <button
              onClick={() => setFilterMode(filterMode === 'conFaltas' ? 'todos' : 'conFaltas')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
                filterMode === 'conFaltas'
                  ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-sm'
                  : 'bg-white/10 text-white border-white/20'
              }`}
            >
              {filterMode === 'conFaltas' ? 'Ver: Solo con Incumplimientos' : 'Ver: Todos los Aprendices'}
            </button>
          </div>
        </div>
      </div>

      {/* GRID DE LAS 3 GRÁFICAS TEMÁTICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ========================================================= */}
        {/* GRÁFICA 1: PUNTUALIDAD · METÁFORA DEL CRONÓMETRO Y HORAS */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-amber-200/90 shadow-lg p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
          {/* Fondo sutil de cuadrante de reloj */}
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full border-8 border-amber-100/60 pointer-events-none opacity-60 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-amber-200/80" />
          </div>

          <div className="space-y-4 relative z-10">
            {/* Cabecera temática */}
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                    Componente 1 · De Mayor a Menor
                  </span>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    El Tacómetro de Puntualidad
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Llamados</span>
                <span className="text-lg font-black text-amber-600">
                  {preparedData.listPuntualidad.filter(p => p.count > 0).length}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Visualiza en escala de cronómetro los llamados por llegadas tardías (máximo 3).
            </p>

            {/* Lista didáctica tipo reloj / tacómetro */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {displayPuntualidad.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-50 text-center text-xs text-emerald-800 font-bold space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                  <p>¡100% de asistencia puntual en esta ficha!</p>
                </div>
              ) : (
                displayPuntualidad.map((item, idx) => {
                  const hasFault = item.count > 0;
                  // Colors according to severity
                  const badgeColor = 
                    item.count >= 3 
                      ? 'bg-red-500 text-white border-red-600 shadow-md animate-pulse' 
                      : item.count === 2 
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs' 
                      : item.count === 1 
                      ? 'bg-amber-400 text-amber-950 border-amber-500' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                  const cardBorder = 
                    item.count >= 3 
                      ? 'border-red-300 bg-red-50/40' 
                      : item.count > 0 
                      ? 'border-amber-200 bg-amber-50/30' 
                      : 'border-slate-100 bg-slate-50/50';

                  return (
                    <div
                      key={item.aprendiz.documento}
                      onClick={() => onSelectAprendiz && onSelectAprendiz(item.aprendiz.documento, item.aprendiz.ficha)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md ${cardBorder} flex items-center justify-between gap-3`}
                      title="Clic para ver reporte completo del aprendiz"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Dial numérico tipo cronómetro */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          hasFault ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          #{idx + 1}
                        </div>

                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">
                            {item.aprendiz.apellidos} {item.aprendiz.nombre}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Ficha {item.aprendiz.ficha} · {item.fechas[0] ? `Últ: ${item.fechas[0]}` : 'Sin faltas'}
                          </span>
                        </div>
                      </div>

                      {/* Medidor tipo aguja de tacómetro */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex flex-col items-end text-[10px] text-slate-400">
                          <span className="font-mono font-bold text-slate-700">{item.count}/3</span>
                          <span className="text-[9px]">{item.hasPMD ? 'PMD Activo' : 'Alerta'}</span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${badgeColor}`}>
                          {item.count > 0 ? `${item.count} Tardes` : 'Puntual'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-amber-100 text-[11px] text-amber-900/80 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Tolerancia máxima: 0 llamados
            </span>
            <span className="text-amber-800">Acuerdo 009 de 2024</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* GRÁFICA 2: UNIFORME · METÁFORA DEL PERCHERO Y ETIQUETA    */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-lg p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
          {/* Fondo sutil de percha / silueta */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-8 border-emerald-100/60 pointer-events-none opacity-60 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 rotate-12" />
          </div>

          <div className="space-y-4 relative z-10">
            {/* Cabecera temática */}
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    Componente 2 · De Mayor a Menor
                  </span>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    El Perchero de Uniformes
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Llamados</span>
                <span className="text-lg font-black text-emerald-700">
                  {preparedData.listUniforme.filter(p => p.count > 0).length}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Evaluación del porte adecuado de prendas institucionales SENA CSF y carné visible.
            </p>

            {/* Lista didáctica tipo etiqueta de vestuario / perchero */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {displayUniforme.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-50 text-center text-xs text-emerald-800 font-bold space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                  <p>¡100% de aprendices con porte impecable de uniforme!</p>
                </div>
              ) : (
                displayUniforme.map((item, idx) => {
                  const hasFault = item.count > 0;
                  const badgeColor = 
                    item.count >= 3 
                      ? 'bg-red-500 text-white border-red-600 shadow-md animate-pulse' 
                      : item.count === 2 
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs' 
                      : item.count === 1 
                      ? 'bg-amber-400 text-amber-950 border-amber-500' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                  const cardBorder = 
                    item.count >= 3 
                      ? 'border-red-300 bg-red-50/40' 
                      : item.count > 0 
                      ? 'border-emerald-200 bg-emerald-50/30' 
                      : 'border-slate-100 bg-slate-50/50';

                  return (
                    <div
                      key={item.aprendiz.documento}
                      onClick={() => onSelectAprendiz && onSelectAprendiz(item.aprendiz.documento, item.aprendiz.ficha)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md ${cardBorder} flex items-center justify-between gap-3`}
                      title="Clic para ver reporte completo del aprendiz"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Ícono de percha / marbete */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          hasFault ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          #{idx + 1}
                        </div>

                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">
                            {item.aprendiz.apellidos} {item.aprendiz.nombre}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Ficha {item.aprendiz.ficha} · {item.fechas[0] ? `Últ: ${item.fechas[0]}` : 'Porte impecable'}
                          </span>
                        </div>
                      </div>

                      {/* Medidor tipo etiqueta de ropa */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex flex-col items-end text-[10px] text-slate-400">
                          <span className="font-mono font-bold text-slate-700">{item.count}/3</span>
                          <span className="text-[9px]">{item.hasPMD ? 'PMD Activo' : 'Conformidad'}</span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${badgeColor}`}>
                          {item.count > 0 ? `${item.count} Faltas` : 'Impecable'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-100 text-[11px] text-emerald-900/80 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              Porte reglamentario + Carné visible
            </span>
            <span className="text-emerald-800">Centro CSF</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* GRÁFICA 3: EVIDENCIAS · METÁFORA DEL ARCHIVADOR DIGITAL   */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-blue-200/90 shadow-lg p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
          {/* Fondo sutil de carpeta / expediente */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-8 border-blue-100/60 pointer-events-none opacity-60 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 -rotate-12" />
          </div>

          <div className="space-y-4 relative z-10">
            {/* Cabecera temática */}
            <div className="flex items-center justify-between border-b border-blue-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                    Componente 3 · De Mayor a Menor
                  </span>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    El Archivador de Evidencias
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Llamados</span>
                <span className="text-lg font-black text-blue-700">
                  {preparedData.listActividades.filter(p => p.count > 0).length}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Control de entregas extemporáneas y talleres de Gestión Empresarial en plataforma.
            </p>

            {/* Lista didáctica tipo expediente / archivo de proyectos */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {displayActividades.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-50 text-center text-xs text-emerald-800 font-bold space-y-1">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
                  <p>¡100% de evidencias entregadas a tiempo!</p>
                </div>
              ) : (
                displayActividades.map((item, idx) => {
                  const hasFault = item.count > 0;
                  const badgeColor = 
                    item.count >= 3 
                      ? 'bg-red-500 text-white border-red-600 shadow-md animate-pulse' 
                      : item.count === 2 
                      ? 'bg-orange-500 text-white border-orange-600 shadow-xs' 
                      : item.count === 1 
                      ? 'bg-amber-400 text-amber-950 border-amber-500' 
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                  const cardBorder = 
                    item.count >= 3 
                      ? 'border-red-300 bg-red-50/40' 
                      : item.count > 0 
                      ? 'border-blue-200 bg-blue-50/30' 
                      : 'border-slate-100 bg-slate-50/50';

                  return (
                    <div
                      key={item.aprendiz.documento}
                      onClick={() => onSelectAprendiz && onSelectAprendiz(item.aprendiz.documento, item.aprendiz.ficha)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md ${cardBorder} flex items-center justify-between gap-3`}
                      title="Clic para ver reporte completo del aprendiz"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Ícono de carpeta indexada */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          hasFault ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          #{idx + 1}
                        </div>

                        <div className="min-w-0">
                          <h5 className="font-bold text-xs text-slate-900 truncate">
                            {item.aprendiz.apellidos} {item.aprendiz.nombre}
                          </h5>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Ficha {item.aprendiz.ficha} · {item.fechas[0] ? `Últ: ${item.fechas[0]}` : 'Evidencias al día'}
                          </span>
                        </div>
                      </div>

                      {/* Medidor tipo expediente */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex flex-col items-end text-[10px] text-slate-400">
                          <span className="font-mono font-bold text-slate-700">{item.count}/3</span>
                          <span className="text-[9px]">{item.hasPMD ? 'PMD Activo' : 'Académico'}</span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${badgeColor}`}>
                          {item.count > 0 ? `${item.count} Pend.` : 'Al Día'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-blue-100 text-[11px] text-blue-900/80 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-blue-600" />
              Zajuna · Territorium · Sofía Plus
            </span>
            <span className="text-blue-800">Gestión Empresarial</span>
          </div>
        </div>

      </div>

    </div>
  );
};
