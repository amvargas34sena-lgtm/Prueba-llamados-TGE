import React from 'react';
import { X, Printer, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Aprendiz, Novedad } from '../types';

interface LlamadoModalProps {
  aprendiz: Aprendiz;
  novedades: Novedad[];
  onClose: () => void;
}

export const LlamadoModal: React.FC<LlamadoModalProps> = ({
  aprendiz,
  novedades,
  onClose
}) => {
  const conteoPuntualidad = novedades.filter(n => n.tipo === 'puntualidad').length;
  const conteoUniforme = novedades.filter(n => n.tipo === 'uniforme').length;
  const conteoActividades = novedades.filter(n => n.tipo === 'actividades').length;
  const total = conteoPuntualidad + conteoUniforme + conteoActividades;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8">
        
        {/* Barra superior de acciones */}
        <div className="flex items-center justify-between p-4 px-6 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Formato Institucional SENA · Acuerdo 009 de 2024
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DOCUMENTO OFICIAL SENA IMPRIMIBLE */}
        <div className="p-8 sm:p-12 space-y-6 text-slate-900 bg-white">
          
          {/* Membrete Institucional */}
          <div className="flex items-start justify-between border-b-2 border-emerald-600 pb-5">
            <div className="flex items-center gap-4">
              <img
                src="https://normograma.sena.edu.co/compilacion/images/logoSena.png"
                alt="Logo SENA"
                className="w-16 h-16 object-contain"
              />
              <div>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Servicio Nacional de Aprendizaje - SENA
                </h2>
                <h3 className="text-xs font-bold text-emerald-800">
                  Regional Distrito Capital · Centro de Servicios Financieros (CSF)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Coordinación de Formación Profesional · Gestión Empresarial
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500 space-y-0.5">
              <span className="font-bold text-slate-800 block text-xs">REGISTRO DISCIPLINARIO</span>
              <p>Código: F-GDO-009</p>
              <p>Fecha: {new Date().toLocaleDateString('es-CO')}</p>
            </div>
          </div>

          {/* Título del Formato */}
          <div className="text-center space-y-1">
            <h1 className="text-lg sm:text-xl font-extrabold uppercase text-slate-900 tracking-wide">
              {total >= 3 
                ? 'Acta de Activación de Plan de Mejoramiento Disciplinario'
                : 'Ficha Individual de Seguimiento Disciplinario y Formativo'}
            </h1>
            <p className="text-xs text-slate-600">
              Conforme a las disposiciones del <strong>Reglamento del Aprendiz SENA (Acuerdo 009 de 2024)</strong>
            </p>
          </div>

          {/* Datos del Aprendiz */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block font-medium">Nombre Completo:</span>
              <span className="font-bold text-slate-900">{aprendiz.nombre} {aprendiz.apellidos}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Identificación:</span>
              <span className="font-bold text-slate-900">{aprendiz.tipoDocumento} {aprendiz.documento}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Ficha de Caracterización:</span>
              <span className="font-bold text-emerald-800">{aprendiz.ficha}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Programa de Formación:</span>
              <span className="font-bold text-slate-900">Tecnólogo en Gestión Empresarial</span>
            </div>
          </div>

          {/* Consolidado de los 3 Componentes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Resumen de Llamados por Componente
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">1. Puntualidad</span>
                <span className={`text-xl font-black ${conteoPuntualidad > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {conteoPuntualidad} / 3
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">2. Uniforme SENA</span>
                <span className={`text-xl font-black ${conteoUniforme > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {conteoUniforme} / 3
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">3. Evidencias Académicas</span>
                <span className={`text-xl font-black ${conteoActividades > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {conteoActividades} / 3
                </span>
              </div>
            </div>
          </div>

          {/* Estado Reglamentario */}
          {total >= 3 ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-red-900">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Disposición Reglamentaria: Plan de Mejoramiento Activo
              </div>
              <p>
                Al acumular 3 o más llamados de atención, el aprendiz incurre en la activación inmediata del Plan de Mejoramiento Disciplinario. Se suscriben las actividades formativas correctivas con seguimiento obligatorio.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                {total === 0
                  ? 'El aprendiz mantiene un récord disciplinario limpio y ejemplar en su ficha de formación.'
                  : `El aprendiz registra ${total} llamado(s) preventivo(s). Se le exhorta a mantener el cumplimiento estricto de sus deberes.`}
              </span>
            </div>
          )}

          {/* Relación detallada de novedades */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Detalle de Novedades Registradas
            </h4>
            {novedades.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                Sin novedades disciplinarias registradas a la fecha.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Fecha</th>
                      <th className="p-2.5">Tipo</th>
                      <th className="p-2.5">Nivel</th>
                      <th className="p-2.5">Observación</th>
                      <th className="p-2.5">Medida Formativa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {novedades.map((n, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-600 font-medium whitespace-nowrap">{n.fecha}</td>
                        <td className="p-2.5 capitalize font-bold text-slate-800">{n.tipo}</td>
                        <td className="p-2.5">{n.nivelLlamado}°</td>
                        <td className="p-2.5 text-slate-600">{n.observacion}</td>
                        <td className="p-2.5 text-emerald-900 font-medium">{n.medidaFormativa || 'Compromiso formativo'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Firmas de Concertación */}
          <div className="pt-10 grid grid-cols-2 gap-12 text-center text-xs">
            <div className="border-t border-slate-400 pt-2 space-y-1">
              <span className="font-bold text-slate-900 block">{aprendiz.nombre} {aprendiz.apellidos}</span>
              <p className="text-slate-500">Firma del Aprendiz</p>
              <p className="text-[10px] text-slate-400">{aprendiz.tipoDocumento}: {aprendiz.documento}</p>
            </div>

            <div className="border-t border-slate-400 pt-2 space-y-1">
              <span className="font-bold text-slate-900 block">Instructor Responsable</span>
              <p className="text-slate-500">Instructor Gestión Empresarial SENA CSF</p>
              <p className="text-[10px] text-slate-400">Coordinación Académica CSF</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Documento generado electrónicamente en el Sistema de Gestión Disciplinaria SENA CSF · Acuerdo 009 de 2024
          </div>

        </div>
      </div>
    </div>
  );
};
