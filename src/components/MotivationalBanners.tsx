import React, { useState } from 'react';
import { 
  Clock, 
  Shirt, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Lightbulb, 
  HeartHandshake,
  CalendarCheck
} from 'lucide-react';
import { DriveImage } from './DriveImage';

interface MotivationalBannersProps {
  onSelectComponent?: (comp: 'puntualidad' | 'uniforme' | 'actividades') => void;
}

export const MotivationalBanners: React.FC<MotivationalBannersProps> = ({ onSelectComponent }) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'puntualidad' | 'uniforme' | 'actividades'>('todos');

  // Drive File IDs provided by the user
  const photoPuntualidadId = "18vMXvFo34VUbGCoTD0IP5ZdiOaBglzD1";
  const photoUniformeId = "1KZAs56AItDUUgtggnnegW-l7qlmxOy2b";

  return (
    <div className="space-y-6">
      {/* Banner Principal Institucional */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-md border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              SENA CSF · Centro de Servicios Financieros · Gestión Empresarial
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              ¡Tu Compromiso y Disciplina Construyen tu Futuro Profesional!
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              El Reglamento del Aprendiz (Acuerdo 009 de 2024) promueve tu formación integral.
              Conoce los 3 componentes esenciales del ser y mantén tu récord disciplinario intachable.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center min-w-[110px] flex-1 md:flex-initial">
              <span className="block text-xl font-bold text-yellow-300">3</span>
              <span className="text-[11px] text-emerald-100 font-medium leading-tight">Pilares de Éxito</span>
            </div>
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center min-w-[110px] flex-1 md:flex-initial">
              <span className="block text-xl font-bold text-emerald-300">009</span>
              <span className="text-[11px] text-emerald-100 font-medium leading-tight">Acuerdo 2024</span>
            </div>
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-center min-w-[110px] flex-1 md:flex-initial">
              <span className="block text-xl font-bold text-white">56</span>
              <span className="text-[11px] text-emerald-100 font-medium leading-tight">Aprendices CSF</span>
            </div>
          </div>
        </div>

        {/* Pestañas de filtrado de anuncios */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'todos'
                ? 'bg-white text-emerald-900 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Todos los Anuncios
          </button>
          <button
            onClick={() => setActiveTab('puntualidad')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'puntualidad'
                ? 'bg-amber-400 text-amber-950 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            1. Puntualidad
          </button>
          <button
            onClick={() => setActiveTab('uniforme')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'uniforme'
                ? 'bg-emerald-300 text-emerald-950 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            2. Uniforme SENA
          </button>
          <button
            onClick={() => setActiveTab('actividades')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'actividades'
                ? 'bg-blue-300 text-blue-950 shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            3. Evidencias Académicas
          </button>
        </div>
      </div>

      {/* Grid de Anuncios Motivacionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ANUNCIO 1: PUNTUALIDAD (Foto 1: 18vMXvFo34VUbGCoTD0IP5ZdiOaBglzD1) */}
        {(activeTab === 'todos' || activeTab === 'puntualidad') && (
          <div className="flex flex-col bg-white rounded-3xl border border-amber-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Foto institucional */}
            <div className="p-4 pb-0">
              <DriveImage
                driveId={photoPuntualidadId}
                alt="Aprendices SENA en formación presencial con puntualidad"
                className="h-56 w-full"
                badgeText="Puntualidad & Asistencia"
                fallbackIcon={<Clock className="w-8 h-8 text-amber-300" />}
              />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Componente 1 · Asistencia Puntual
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  "El Reloj de tu Éxito Empresarial"
                </h3>
                
                {/* Frase motivacional destacada */}
                <blockquote className="mt-3 p-3.5 rounded-2xl bg-amber-50/80 border-l-4 border-amber-500 text-slate-700 italic text-sm leading-relaxed">
                  "El respeto al tiempo de los demás es el primer principio de la gestión empresarial. Llegar puntual a tus ambientes de formación proyecta tu liderazgo y compromiso profesional."
                </blockquote>

                {/* Deber institucional según Acuerdo 009 de 2024 */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">Deber Institucional (Acuerdo 009 de 2024):</span>
                  <p>«Asistir puntualmente a todas las actividades programadas en los ambientes de formación presencial y virtual».</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Tip: Sal 20 min antes
                  </span>
                  <span className="font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    Máx 0 llamados
                  </span>
                </div>
                {onSelectComponent && (
                  <button
                    onClick={() => onSelectComponent('puntualidad')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors"
                  >
                    Ver estadísticas de puntualidad
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ANUNCIO 2: UNIFORME (Foto 2: 1KZAs56AItDUUgtggnnegW-l7qlmxOy2b) */}
        {(activeTab === 'todos' || activeTab === 'uniforme') && (
          <div className="flex flex-col bg-white rounded-3xl border border-emerald-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Foto institucional */}
            <div className="p-4 pb-0">
              <DriveImage
                driveId={photoUniformeId}
                alt="Aprendiz con uniforme institucional SENA CSF"
                className="h-56 w-full"
                badgeText="Identidad SENA CSF"
                fallbackIcon={<Shirt className="w-8 h-8 text-emerald-300" />}
              />
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
                  <Shirt className="w-4 h-4 text-emerald-600" />
                  Componente 2 · Porte de Prendas
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  "Porte con Orgullo: Identidad y Disciplina"
                </h3>
                
                {/* Frase motivacional destacada */}
                <blockquote className="mt-3 p-3.5 rounded-2xl bg-emerald-50/80 border-l-4 border-emerald-600 text-slate-700 italic text-sm leading-relaxed">
                  "Portar adecuadamente las prendas del SENA Centro de Servicios Financieros refleja orden, pertenencia y respeto por la institución que impulsa tus sueños."
                </blockquote>

                {/* Deber institucional según Acuerdo 009 de 2024 */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">Deber Institucional (Acuerdo 009 de 2024):</span>
                  <p>«Portar con dignidad y decoro el uniforme institucional y el carné visible en ambientes y visitas empresariales».</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    Carné visible en el pecho
                  </span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Prendas oficiales
                  </span>
                </div>
                {onSelectComponent && (
                  <button
                    onClick={() => onSelectComponent('uniforme')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors"
                  >
                    Ver estado de uniforme
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ANUNCIO 3: EVIDENCIAS ACADÉMICAS */}
        {(activeTab === 'todos' || activeTab === 'actividades') && (
          <div className="flex flex-col bg-white rounded-3xl border border-blue-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            {/* Cabecera gráfica con estilo formativo */}
            <div className="p-4 pb-0">
              <div className="h-56 w-full rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-800 to-slate-900 p-6 flex flex-col justify-between text-white relative overflow-hidden shadow-inner">
                <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl" />
                <div className="flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold backdrop-blur-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                    Rigor Académico
                  </span>
                  <span className="text-[11px] font-semibold text-blue-200 bg-blue-500/30 px-2.5 py-0.5 rounded-full">
                    Gestión Empresarial
                  </span>
                </div>

                <div className="z-10 space-y-1">
                  <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold">Competencias Laborales</span>
                  <h4 className="text-xl font-black text-white leading-tight">
                    Tus Evidencias son tu Mejor Carta de Presentación
                  </h4>
                </div>

                <div className="z-10 flex items-center gap-2 text-xs text-blue-100 bg-black/30 p-2.5 rounded-xl backdrop-blur-sm border border-white/10">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" />
                  <span>Entrega a tiempo en plataforma Zajuna / Territorium</span>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Componente 3 · Entrega Oportuna
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                  "La Constancia Forja Empresas Exitosas"
                </h3>
                
                {/* Frase motivacional destacada */}
                <blockquote className="mt-3 p-3.5 rounded-2xl bg-blue-50/80 border-l-4 border-blue-600 text-slate-700 italic text-sm leading-relaxed">
                  "Cada evidencia entregada en los tiempos acordados demuestra tu capacidad para planificar, ejecutar y liderar proyectos reales en las organizaciones."
                </blockquote>

                {/* Deber institucional según Acuerdo 009 de 2024 */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800 block">Deber Institucional (Acuerdo 009 de 2024):</span>
                  <p>«Cumplir con todas las actividades, talleres y evidencias de su proceso formativo dentro de los cronogramas concertados».</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-blue-700">
                    <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                    Pide apoyo a tu instructor
                  </span>
                  <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                    Calidad 100%
                  </span>
                </div>
                {onSelectComponent && (
                  <button
                    onClick={() => onSelectComponent('actividades')}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-colors"
                  >
                    Ver estado de actividades
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alerta Preventiva / Formativa del Acuerdo 009 de 2024 */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/90 border border-amber-200 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-base text-amber-950 flex items-center gap-2">
              Regla de Oro del Acuerdo 009 de 2024
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                Formativo & Preventivo
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-amber-900/90 mt-1 leading-relaxed">
              Recuerda: Los llamados de atención tienen un propósito <strong>pedagógico y reflexivo</strong>. Sin embargo, al acumular <strong>3 llamados de atención</strong> se activa de forma automática el <strong>Plan de Mejoramiento Disciplinario (PMD)</strong> con seguimiento especial ante la Coordinación Académica.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-amber-200 rounded-2xl p-3 shrink-0 text-center w-full md:w-auto">
          <span className="text-[11px] uppercase tracking-wider text-amber-800 font-bold block">Meta del Aprendiz</span>
          <span className="text-lg font-black text-emerald-700">0 Llamados</span>
          <span className="text-[11px] text-slate-500 block">Excelencia SENA</span>
        </div>
      </div>
    </div>
  );
};
