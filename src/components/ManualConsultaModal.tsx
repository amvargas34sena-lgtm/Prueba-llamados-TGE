import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  Printer, 
  CheckCircle, 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Clock, 
  Shirt, 
  BarChart3, 
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Search
} from 'lucide-react';

interface ManualConsultaModalProps {
  onClose: () => void;
}

export const ManualConsultaModal: React.FC<ManualConsultaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'aprendiz' | 'instructor' | 'comparativa' | 'plantillas' | 'faq'>('aprendiz');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement("a");
    element.href = "/MANUAL_DE_CONSULTA.md";
    element.download = "MANUAL_DE_CONSULTA_SENA_CSF.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-5 px-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                  Documento Oficial
                </span>
                <span className="text-[11px] text-slate-300">
                  Reglamento SENA · Acuerdo 009 de 2024
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
                Manual de Consulta e Instructivo de Usuario
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
              title="Descargar archivo Markdown del manual"
            >
              <Download className="w-4 h-4" />
              Descargar MD
            </button>
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
              title="Imprimir documento"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Barra de Navegación por Pestañas */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-100 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('aprendiz')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'aprendiz' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Instructivo Aprendiz (Paso a Paso)
            </button>
            <button
              onClick={() => setActiveTab('comparativa')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'comparativa' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              ¿Qué hace Instructor vs Aprendiz?
            </button>
            <button
              onClick={() => setActiveTab('plantillas')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'plantillas' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Plantillas de Notificación
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'faq' 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Preguntas Frecuentes
            </button>
          </div>

          <div className="text-[11px] font-bold text-slate-500 hidden md:block">
            SENA CSF · Fichas 3384701 & 3384773
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm leading-relaxed">

          {/* TAB 1: INSTRUCTIVO APRENDIZ */}
          {activeTab === 'aprendiz' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-950 text-base">
                    Guía de Orientación al Aprendiz en el Prototipo
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Este prototipo te permite hacer seguimiento en tiempo real a tu expediente formativo, conocer si tienes medidas pedagógicas pendientes, y explorar analíticas grupales sin afectar tus datos privados.
                  </p>
                </div>
              </div>

              {/* Pasos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h5 className="font-bold text-slate-900">Ingreso al Prototipo</h5>
                  <p className="text-xs text-slate-600">
                    En la pantalla principal titulada <strong>"SENA - CSF - Gestión Empresarial"</strong>, haz clic sobre la tarjeta <strong>"Soy Aprendiz"</strong>. No requieres contraseña en este prototipo interactivo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h5 className="font-bold text-slate-900">Selección de Ficha y Búsqueda</h5>
                  <p className="text-xs text-slate-600">
                    Elige tu ficha de caracterización (<strong>3384701</strong> o <strong>3384773</strong>). Luego escribe tu nombre o número de documento en la caja de búsqueda para desplegar tu expediente individual.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h5 className="font-bold text-slate-900">Lectura del Semáforo de Estado</h5>
                  <p className="text-xs text-slate-600">
                    • 🟢 <strong>Verde (Al día):</strong> Cero llamados.<br/>
                    • 🟡 <strong>Amarillo (Preventivo):</strong> 1 o 2 llamados de atención.<br/>
                    • 🔴 <strong>Rojo (En Riesgo):</strong> 3 llamados o Plan de Mejoramiento activo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                    4
                  </span>
                  <h5 className="font-bold text-slate-900">Trío Estadístico Avanzado</h5>
                  <p className="text-xs text-slate-600">
                    Visualiza 3 diagramas didácticos alineados:
                    <br/>• <strong>Sankey:</strong> Flujo hacia las 4 fases del proyecto.
                    <br/>• <strong>Mapa de Calor:</strong> Matriz individual de cumplimiento.
                    <br/>• <strong>Bump Chart:</strong> Trayectoria temporal de llamados.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                    5
                  </span>
                  <h5 className="font-bold text-slate-900">Gráficas con Objetos Temáticos</h5>
                  <p className="text-xs text-slate-600">
                    Explora el top de cumplimiento representado didácticamente con prendas de uniforme, cronómetros de puntualidad y carpetas de evidencias de aprendizaje.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                    6
                  </span>
                  <h5 className="font-bold text-slate-900">Control de Medidas Formativas</h5>
                  <p className="text-xs text-slate-600">
                    Revisa las observaciones hechas por los instructores y comprueba si tu entrega de taller pedagógico ya fue validada y registrada en el sistema.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPARATIVA DE ROLES */}
          {activeTab === 'comparativa' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-black text-base text-white">
                    Matriz de Permisos y Capacidades por Rol
                  </h4>
                  <p className="text-xs text-slate-300">
                    Clarificación de responsabilidades según el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024).
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 bg-emerald-600 rounded-lg">Instructor: Gestión</span>
                  <span className="px-2.5 py-1 bg-blue-600 rounded-lg">Aprendiz: Consulta</span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Funcionalidad en el Sistema</th>
                      <th className="p-3.5 bg-emerald-50/70 text-emerald-950">¿Qué puede hacer el Instructor?</th>
                      <th className="p-3.5 bg-blue-50/70 text-blue-950">¿Qué puede ver el Aprendiz?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        Lista de Verificación Matriz
                      </td>
                      <td className="p-3.5 bg-emerald-50/30 text-emerald-900 font-medium">
                        <strong>Edición total:</strong> Ingresar y modificar fechas de llamados 1, 2 y 3 para Uniforme, Puntualidad y Académico.
                      </td>
                      <td className="p-3.5 bg-blue-50/30 text-blue-900 font-medium">
                        <strong>Sólo lectura:</strong> Visualiza el consolidado de sus propios llamados sin permisos de edición.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        Control de Entrega de Medida Formativa
                      </td>
                      <td className="p-3.5 bg-emerald-50/30 text-emerald-900 font-medium">
                        <strong>Marcación activa:</strong> Marcar con checkbox cuando el aprendiz cumple la medida o el plan de mejoramiento.
                      </td>
                      <td className="p-3.5 bg-blue-50/30 text-blue-900 font-medium">
                        <strong>Verificación:</strong> Consulta si el instructor ya aprobó y recibió la medida pedagógica.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        Control por Fecha de la Más Reciente
                      </td>
                      <td className="p-3.5 bg-emerald-50/30 text-emerald-900 font-medium">
                        <strong>Panel de Alertas:</strong> Monitorear semáforo de días restantes, medidas vencidas y próximas a vencer.
                      </td>
                      <td className="p-3.5 bg-blue-50/30 text-blue-900 font-medium">
                        <strong>Fecha Límite:</strong> Conoce cuántos días hábiles tiene para presentar su actividad de recuperación.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        Remisión de Correos Institucionales
                      </td>
                      <td className="p-3.5 bg-emerald-50/30 text-emerald-900 font-medium">
                        <strong>Envío y edición previa:</strong> Abre el modal para revisar y ajustar el correo formal antes de remitirlo.
                      </td>
                      <td className="p-3.5 bg-blue-50/30 text-blue-900 font-medium">
                        <strong>Destinatario:</strong> Recibe el correo en su bandeja con el soporte normativo del Acuerdo 009 de 2024.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        Directorio y Correos de Aprendices
                      </td>
                      <td className="p-3.5 bg-emerald-50/30 text-emerald-900 font-medium">
                        <strong>Gestión:</strong> Actualizar correos individualmente o en bloque para los 56 aprendices.
                      </td>
                      <td className="p-3.5 bg-blue-50/30 text-blue-900 font-medium">
                        <strong>Verificación:</strong> Confirmar que su correo registrado esté actualizado.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        Analítica Visual y Gráficos Estadísticos
                      </td>
                      <td className="p-3.5 bg-emerald-50/30 text-emerald-900 font-medium">
                        Diagnosticar el rendimiento grupal para reuniones de equipo y comités pedagógicos.
                      </td>
                      <td className="p-3.5 bg-blue-50/30 text-blue-900 font-medium">
                        Conocer su posición formativa e identificar áreas de mejora en el Ser, Saber y Saber Hacer.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PLANTILLAS INSTITUCIONALES */}
          {activeTab === 'plantillas' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="font-extrabold text-slate-900 text-base">
                Estructura de las Notificaciones Institucionales (Acuerdo 009 de 2024)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Uniforme */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-teal-950 text-xs flex items-center gap-1.5">
                      <Shirt className="w-4 h-4 text-teal-700" />
                      Llamado por Uniforme Institucional
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-200 text-teal-900">
                      Art. 8 Num. 20
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Norma:</strong> Numeral 20. Portar el conjunto de prendas y elementos de trabajo y protección asociados al proceso formativo.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Estructura:</strong> Ficha, Fecha, Aprendiz, Programa, Fase (Análisis, Planeación, Ejecución, Evaluación), Motivo editable y Medida formativa.
                  </p>
                </div>

                {/* Puntualidad */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-950 text-xs flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      Llamado por Puntualidad y Asistencia
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                      Art. 8 Num. 5
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Norma:</strong> Numeral 5. Asistir con puntualidad a todas las actividades propias del proceso de formación.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Estructura:</strong> Ficha, Fecha, Aprendiz, Fase, Motivo de llegada tardía o inasistencia y compromiso escrito de horario.
                  </p>
                </div>

                {/* Académico */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-950 text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-700" />
                      Llamado Académico por Evidencias
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-200 text-blue-900">
                      Art. 46 Lit. a Num. 1
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Norma:</strong> Numerales 3, 5 y 7 de deberes. Art. 46 para medidas formativas por bajo rendimiento.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Estructura:</strong> Ficha, Fecha, Guía de Aprendizaje, Competencias y RAPs de la planeación y plazo de 5 días hábiles para nivelación.
                  </p>
                </div>

                {/* PMD */}
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-950 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-700" />
                      Plan de Mejoramiento Disciplinario (PMD)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-200 text-rose-900">
                      3 Llamados
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Activación:</strong> Automática por acumulación de 3 llamados de atención disciplinarios en el proceso formativo.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Compromiso:</strong> Citación con carácter obligatorio ante la Coordinación Académica del CSF dentro de los 3 días hábiles siguientes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREGUNTAS FRECUENTES (FAQ) */}
          {activeTab === 'faq' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  ¿Qué ocurre si acumulo 3 llamados de atención?
                </h5>
                <p className="text-xs text-slate-600">
                  El Reglamento del Aprendiz SENA (Acuerdo 009 de 2024) establece que ante la reiteración a tres llamados formativos se debe activar obligatoriamente un Plan de Mejoramiento (PMD o PMA). El incumplimiento o no suscripción del plan dará lugar a remisión inmediata ante el Comité de Evaluación y Seguimiento de la Regional Distrito Capital.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  ¿Puedo como aprendiz editar o borrar fechas en la tabla de verificación?
                </h5>
                <p className="text-xs text-slate-600">
                  No. El portal de aprendices es estrictamente de consulta y seguimiento individual. Solamente el equipo de instructores asignados a las fichas 3384701 y 3384773 cuentan con permisos para consignar novedades disciplinarias y académicas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  ¿Por qué el sistema exige revisar el correo antes de enviarlo?
                </h5>
                <p className="text-xs text-slate-600">
                  Para garantizar el principio institucional del debido proceso. El instructor puede verificar que los datos del aprendiz, la ficha, la fecha y los numerales aplicados sean exactos y justos antes de realizar la notificación oficial.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  ¿Dónde puedo consultar el archivo del manual completo?
                </h5>
                <p className="text-xs text-slate-600">
                  El archivo completo se encuentra disponible en la raíz del proyecto bajo el nombre <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">MANUAL_DE_CONSULTA.md</code> y <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">manual_de_consulta.md</code>, y puede ser descargado directamente con el botón en la esquina superior de este modal.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Pie del Modal */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 px-6 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Centro de Servicios Financieros</span>
            <span>·</span>
            <span>SENA Regional Distrito Capital</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex sm:hidden items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Entendido y Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
