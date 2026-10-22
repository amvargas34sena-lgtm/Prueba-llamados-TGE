/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Sparkles, 
  ArrowLeft, 
  Building2, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { aprendices as rawAprendices, initialNovedades } from './data';
import { Aprendiz, Novedad } from './types';
import { ApprenticePortal } from './components/ApprenticePortal';
import { InstructorPortal } from './components/InstructorPortal';
import { LlamadoModal } from './components/LlamadoModal';

const STORAGE_KEY_NOVEDADES = 'sena_csf_novedades_v1';

export default function App() {
  const [role, setRole] = useState<'instructor' | 'aprendiz' | null>('aprendiz');
  const [novedades, setNovedades] = useState<Novedad[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOVEDADES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return initialNovedades;
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    aprendiz: Aprendiz | null;
    novedades: Novedad[];
  }>({
    isOpen: false,
    aprendiz: null,
    novedades: []
  });

  // Persist novedades in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOVEDADES, JSON.stringify(novedades));
    } catch (err) {
      console.error('Error saving novedades to localStorage', err);
    }
  }, [novedades]);

  // Handler to add a new incident
  const handleAddNovedad = (newNov: Omit<Novedad, 'id' | 'nivelLlamado'>) => {
    // Determine existing count for this learner
    const existingCount = novedades.filter(n => n.aprendizDocumento === newNov.aprendizDocumento).length;
    const nextLevel = Math.min(existingCount + 1, 3) as 1 | 2 | 3;

    const fullNovedad: Novedad = {
      ...newNov,
      id: `NOV-${Date.now().toString().slice(-5)}`,
      nivelLlamado: nextLevel
    };

    setNovedades(prev => [fullNovedad, ...prev]);
  };

  // Open official print modal
  const handleOpenReportModal = (aprendiz: Aprendiz, aprendizNovedades: Novedad[]) => {
    setModalState({
      isOpen: true,
      aprendiz,
      novedades: aprendizNovedades
    });
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('¿Deseas reiniciar los llamados disciplinarios a los datos de prueba institucionales?')) {
      setNovedades(initialNovedades);
      localStorage.setItem(STORAGE_KEY_NOVEDADES, JSON.stringify(initialNovedades));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* HEADER INSTITUCIONAL UNIFICADO */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          
          {/* Logo y Título Institucional */}
          <div className="flex items-center gap-3">
            <img 
              src="https://normograma.sena.edu.co/compilacion/images/logoSena.png" 
              alt="Logo SENA" 
              className="w-11 h-11 object-contain shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  SENA - CSF - Gestión Empresarial
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Acuerdo 009 de 2024
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Centro de Servicios Financieros · Fichas 3384701 y 3384773 (56 Aprendices)
              </p>
            </div>
          </div>

          {/* Selector de Perfil y Acciones Rápidas */}
          <div className="flex items-center gap-2 sm:gap-3">
            {role && (
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setRole('aprendiz')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    role === 'aprendiz'
                      ? 'bg-white shadow text-emerald-800'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden sm:inline">Módulo</span> Aprendiz
                </button>
                <button
                  onClick={() => setRole('instructor')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    role === 'instructor'
                      ? 'bg-white shadow text-emerald-800'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Módulo</span> Instructor
                </button>
              </div>
            )}

            {role && (
              <button
                onClick={handleResetData}
                title="Restablecer datos de prueba"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {role && (
              <button
                onClick={() => setRole(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Inicio
              </button>
            )}
          </div>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        
        {/* PANTALLA INICIAL DE SELECCIÓN DE ROL */}
        {!role && (
          <div className="max-w-2xl mx-auto py-12 sm:py-20 text-center space-y-8 animate-in fade-in duration-300">
            <div className="relative inline-block">
              <img 
                src="https://normograma.sena.edu.co/compilacion/images/logoSena.png" 
                alt="SENA Logo" 
                className="w-28 h-28 mx-auto drop-shadow-md" 
              />
              <span className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-600 text-white rounded-full shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Centro de Servicios Financieros · Regional Distrito Capital
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                SENA - CSF - Gestión Empresarial
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
                Plataforma digital para el seguimiento disciplinario, preventivo y formativo, conforme al <strong>Reglamento del Aprendiz SENA (Acuerdo 009 de 2024)</strong>.
              </p>
            </div>

            {/* Tarjetas de Selección de Rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
              <button
                onClick={() => setRole('aprendiz')}
                className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white border-2 border-emerald-500/80 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all group text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Soy Aprendiz
                </h3>
                <p className="text-xs text-slate-500 text-center mt-1">
                  Consulta tu reporte de llamados (llegada tarde, uniforme, evidencias) y anuncios motivacionales.
                </p>
                <span className="mt-4 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  Ingresar a Consulta &rarr;
                </span>
              </button>

              <button
                onClick={() => setRole('instructor')}
                className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-slate-800 shadow-md hover:shadow-xl transition-all group text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-slate-900 transition-colors">
                  Soy Instructor
                </h3>
                <p className="text-xs text-slate-500 text-center mt-1">
                  Dashboard de seguimiento, registro de novedades, planes de mejoramiento y actas oficiales.
                </p>
                <span className="mt-4 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  Ingresar a Gestión &rarr;
                </span>
              </button>
            </div>

            {/* Pie con Fichas */}
            <div className="pt-6 border-t border-slate-200 max-w-md mx-auto flex items-center justify-around text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Ficha 3384701 (28)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Ficha 3384773 (28)
              </span>
            </div>
          </div>
        )}

        {/* MÓDULO DE APRENDICES */}
        {role === 'aprendiz' && (
          <ApprenticePortal
            aprendices={rawAprendices}
            novedades={novedades}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {/* MÓDULO DE INSTRUCTORES */}
        {role === 'instructor' && (
          <InstructorPortal
            aprendices={rawAprendices}
            novedades={novedades}
            onAddNovedad={handleAddNovedad}
            onOpenReportModal={handleOpenReportModal}
          />
        )}
      </main>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-700">
          SENA · Centro de Servicios Financieros (CSF) · Regional Distrito Capital
        </p>
        <p>
          Programa: Tecnólogo en Gestión Empresarial · Fichas 3384701 y 3384773 · Aplicación alineada con el Acuerdo 009 de 2024
        </p>
      </footer>

      {/* MODAL DE ACTA OFICIAL IMPRIMIBLE */}
      {modalState.isOpen && modalState.aprendiz && (
        <LlamadoModal
          aprendiz={modalState.aprendiz}
          novedades={modalState.novedades}
          onClose={() => setModalState({ isOpen: false, aprendiz: null, novedades: [] })}
        />
      )}

    </div>
  );
}
