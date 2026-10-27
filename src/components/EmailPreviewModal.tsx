import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  Building, 
  User, 
  AlertTriangle,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { Aprendiz, PlantillaCorreo } from '../types';
import { plantillasCorreoPorDefecto } from '../data';

interface EmailPreviewModalProps {
  aprendiz: Aprendiz;
  tipoLlamadoInicial?: 'uniforme' | 'puntualidad' | 'actividades' | 'pmd';
  nivelLlamadoInicial?: 1 | 2 | 3;
  fechaLlamado?: string;
  observacionInicial?: string;
  medidaInicial?: string;
  onClose: () => void;
  onConfirmSend?: (emailSentTo: string, tipo: string) => void;
  onUpdateEmail?: (documento: string, newEmail: string) => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  aprendiz,
  tipoLlamadoInicial = 'puntualidad',
  nivelLlamadoInicial = 1,
  fechaLlamado = new Date().toISOString().split('T')[0],
  observacionInicial = '',
  medidaInicial = '',
  onClose,
  onConfirmSend,
  onUpdateEmail
}) => {
  const [tipoLlamado, setTipoLlamado] = useState<'uniforme' | 'puntualidad' | 'actividades' | 'pmd'>(tipoLlamadoInicial);
  const [nivelLlamado, setNivelLlamado] = useState<1 | 2 | 3>(nivelLlamadoInicial);
  const [correoDestino, setCorreoDestino] = useState<string>(aprendiz.correo || '');
  const [fecha, setFecha] = useState<string>(fechaLlamado);
  const [observacion, setObservacion] = useState<string>(observacionInicial);
  const [copied, setCopied] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Editable Subject & Body
  const [asunto, setAsunto] = useState<string>('');
  const [cuerpo, setCuerpo] = useState<string>('');

  // Academic specific fields
  const [motivoAcademico, setMotivoAcademico] = useState<string>('No entrega oportuna ni justificada de evidencias de aprendizaje concertadas en la planeación pedagógica');
  const [guiaAcademica, setGuiaAcademica] = useState<string>('Guía de Aprendizaje N° 1 - Fase Planeación');
  const [rapsAcademicos, setRapsAcademicos] = useState<string>('Competencia: Coordinar actividades del talento humano / RAP: Evaluar desempeño del talento humano');
  const [normasSeleccionadas, setNormasSeleccionadas] = useState<{ [key: string]: boolean }>({
    num3: true,
    num5: true,
    num7: true
  });

  // Disciplinary specific fields (Acuerdo 009 de 2024 - Art. 46 literal a numeral 2)
  const [fase, setFase] = useState<'Análisis' | 'Planeación' | 'Ejecución' | 'Evaluación'>('Planeación');
  const [motivoDisciplinario, setMotivoDisciplinario] = useState<string>('Porte inadecuado del conjunto de prendas del uniforme institucional');
  const [normaDisciplinaria, setNormaDisciplinaria] = useState<string>(
    'ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 20. Portar el conjunto de prendas y elementos de trabajo y protección asociados al proceso formativo.'
  );
  const [incluirNorma3Uniforme, setIncluirNorma3Uniforme] = useState<boolean>(true);

  // Sync default disciplinary motif when switching between types
  useEffect(() => {
    if (tipoLlamado === 'puntualidad') {
      setMotivoDisciplinario('Ingreso tarde a formación');
      setNormaDisciplinaria('ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 5. Asistir con puntualidad a todas las actividades propias del proceso de formación.');
    } else if (tipoLlamado === 'uniforme') {
      setMotivoDisciplinario('Porte inadecuado del conjunto de prendas del uniforme institucional');
      setNormaDisciplinaria('ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 20. Portar el conjunto de prendas y elementos de trabajo y protección asociados al proceso formativo.');
    }
  }, [tipoLlamado]);

  // Generate body based on templates
  const generateEmailContent = () => {
    const nombreCompleto = `${aprendiz.nombre} ${aprendiz.apellidos}`;
    const nivelTexto = nivelLlamado === 1 ? 'PRIMER' : nivelLlamado === 2 ? 'SEGUNDO' : 'TERCER';

    // 1. SPECIAL ACADEMIC TEMPLATE (Acuerdo 009 de 2024 - Art. 46 literal a numeral 1)
    if (tipoLlamado === 'actividades') {
      const parsedSubject = `[SENA CSF] ${nivelTexto} LLAMADO DE ATENCIÓN ACADÉMICO - Ficha ${aprendiz.ficha} - ${nombreCompleto}`;

      const normasList: string[] = [];
      if (normasSeleccionadas.num3) {
        normasList.push('• Artículo 8° deberes del aprendiz, Numeral 3. Actuar siempre teniendo como base los principios y valores institucionales.');
      }
      if (normasSeleccionadas.num5) {
        normasList.push('• Artículo 8° deberes del aprendiz, Numeral 5. Asistir con puntualidad a todas las actividades propias del proceso de formación.');
      }
      if (normasSeleccionadas.num7) {
        normasList.push('• Artículo 8° deberes del aprendiz, Numeral 7. Justificar debidamente las inasistencias o incumplimientos a las actividades de la formación, en los términos establecidos en el presente reglamento.');
      }

      const parsedBody = 
`${nivelTexto} LLAMADO DE ATENCIÓN ACADÉMICO

Fecha: ${fecha}
Aprendiz: ${nombreCompleto} (${aprendiz.tipoDocumento} ${aprendiz.documento})
Programa de formación: Tecnólogo en Gestión Empresarial
No ficha: ${aprendiz.ficha}

Motivo: (Bajo rendimiento académico) ${motivoAcademico}

En cumplimiento a lo establecido en el literal a) numeral 1 del artículo 46 tipo de medidas formativas de acuerdo 009 de 2024, se realiza este llamado de atención al aprendiz ${nombreCompleto} debido a ${motivoAcademico}. Con relación a la guía ${guiaAcademica} y los respectivas competencias y RAPS que se indican en la planeación pedagógica: ${rapsAcademicos}.

Con lo anterior el aprendiz ${nombreCompleto} ha incumplido algunas de las siguientes normas del reglamento 009 de 2024:
${normasList.join('\n')}

MEDIDA FORMATIVA / COMPROMISO PEDAGÓGICO:
1. Presentar las evidencias académicas pendientes de la guía ${guiaAcademica} en la plataforma institucional.
2. Concertar plan de nivelación con el instructor técnico a más tardar dentro de los próximos 5 días hábiles.
3. El incumplimiento o reiteración a 3 llamados de atención dará lugar a la apertura de un Plan de Mejoramiento Disciplinario/Académico con citación a Coordinación.

Atentamente,

EQUIPO DE INSTRUCTORES DE GESTIÓN EMPRESARIAL
Coordinación de Formación Profesional
Centro de Servicios Financieros - SENA Regional Distrito Capital`;

      setAsunto(parsedSubject);
      setCuerpo(parsedBody);
      return;
    }

    // 2. SPECIAL DISCIPLINARY UNIFORME TEMPLATE (Acuerdo 009 de 2024 - Art. 46 literal a numeral 2 & Art. 8 Numeral 20)
    if (tipoLlamado === 'uniforme') {
      const parsedSubject = `[SENA CSF] ${nivelTexto} LLAMADO DE ATENCIÓN DISCIPLINARIO POR USO DE UNIFORME INSTITUCIONAL - Ficha ${aprendiz.ficha} - ${nombreCompleto}`;

      const normasUniforme: string[] = [
        'ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 20. Portar el conjunto de prendas y elementos de trabajo y protección asociados al proceso formativo.'
      ];
      if (incluirNorma3Uniforme) {
        normasUniforme.push('ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 3. Actuar siempre teniendo como base los principios y valores institucionales.');
      }

      const parsedBody = 
`${nivelTexto} LLAMADO DE ATENCIÓN DISCIPLINARIO POR USO DE UNIFORME INSTITUCIONAL

Ficha: ${aprendiz.ficha}
Fecha: ${fecha}
Aprendiz: ${nombreCompleto} (${aprendiz.tipoDocumento} ${aprendiz.documento})
Programa de formación: Tecnólogo en Gestión Empresarial
Fase: ${fase}

Motivo: ${motivoDisciplinario}

En cumplimiento a lo establecido en el literal a) numeral 2 del artículo 46 tipo de medidas formativas de acuerdo 009 de 2024, se realiza este llamado de atención al aprendiz ${nombreCompleto} debido a ${motivoDisciplinario}. Con lo anterior el aprendiz ha incumplido algunas de las siguientes normas del reglamento 009 de 2024:

${normasUniforme.join('\n')}

MEDIDA FORMATIVA / COMPROMISO PEDAGÓGICO:
1. Portar adecuadamente y en su totalidad el conjunto de prendas del uniforme institucional reglamentario y el carné de aprendiz visible a partir de la próxima sesión de formación.
2. Presentar compromiso escrito y actividad reflexiva sobre la identidad corporativa, presentación profesional y cumplimiento del Acuerdo 009 de 2024.
3. La reiteración a tres (3) llamados de atención dará lugar a la apertura obligatoria del Plan de Mejoramiento Disciplinario (PMD).

Atentamente,

EQUIPO DE INSTRUCTORES DE GESTIÓN EMPRESARIAL
Coordinación de Formación Profesional
Centro de Servicios Financieros - SENA Regional Distrito Capital`;

      setAsunto(parsedSubject);
      setCuerpo(parsedBody);
      return;
    }

    // 3. SPECIAL DISCIPLINARY PUNTUALIDAD TEMPLATE (Acuerdo 009 de 2024 - Art. 46 literal a numeral 2 & Art. 8 Numeral 5)
    if (tipoLlamado === 'puntualidad') {
      const parsedSubject = `[SENA CSF] ${nivelTexto} LLAMADO DE ATENCIÓN DISCIPLINARIO - Ficha ${aprendiz.ficha} - ${nombreCompleto}`;

      const parsedBody = 
`${nivelTexto} LLAMADO DE ATENCIÓN DISCIPLINARIO

Fecha: ${fecha}
Aprendiz: ${nombreCompleto} (${aprendiz.tipoDocumento} ${aprendiz.documento})
Programa de formación: Tecnólogo en Gestión Empresarial
Fase: ${fase}
No ficha: ${aprendiz.ficha}

Motivo: ${motivoDisciplinario}

En cumplimiento a lo establecido en el literal a) numeral 2 del artículo 46 tipo de medidas formativas de acuerdo 009 de 2024, se realiza este llamado de atención al aprendiz ${nombreCompleto} debido a ${motivoDisciplinario}. Con lo anterior el aprendiz ha incumplido algunas de las siguientes normas del reglamento 009 de 2024:

${normaDisciplinaria}

MEDIDA FORMATIVA / COMPROMISO PEDAGÓGICO:
1. Asistir puntualmente a todas las actividades programadas en los ambientes de formación presencial y virtual.
2. Presentar compromiso escrito de puntualidad y ajuste de itinerario de desplazamiento.
3. La reiteración a tres (3) llamados de atención dará lugar a la activación obligatoria del Plan de Mejoramiento Disciplinario (PMD).

Atentamente,

EQUIPO DE INSTRUCTORES DE GESTIÓN EMPRESARIAL
Coordinación de Formación Profesional
Centro de Servicios Financieros - SENA Regional Distrito Capital`;

      setAsunto(parsedSubject);
      setCuerpo(parsedBody);
      return;
    }

    // 4. PMD TEMPLATE (Acuerdo 009 de 2024)
    const parsedSubject = `[SENA CSF - URGENTE] ACTIVACIÓN DE PLAN DE MEJORAMIENTO DISCIPLINARIO - Ficha ${aprendiz.ficha} - ${nombreCompleto}`;

    const parsedBody = 
`ACTIVACIÓN DE PLAN DE MEJORAMIENTO DISCIPLINARIO (PMD)

Fecha: ${fecha}
Aprendiz: ${nombreCompleto} (${aprendiz.tipoDocumento} ${aprendiz.documento})
Programa de formación: Tecnólogo en Gestión Empresarial
Fase: ${fase}
No ficha: ${aprendiz.ficha}

Motivo: Acumulación de tres (3) llamados de atención disciplinarios en el proceso formativo.

En cumplimiento a lo establecido en el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024), nos permitimos notificarle de manera formal y obligatoria la activación del Plan de Mejoramiento Disciplinario (PMD).

CITACIÓN Y COMPROMISOS ANTE COORDINACIÓN:
1. Presentarse de carácter obligatorio ante la Coordinación Académica del Centro de Servicios Financieros dentro de los próximos tres (3) días hábiles.
2. Suscribir el acta de compromisos y actividades pedagógicas correctivas concertadas.
3. El incumplimiento o no comparecencia al Plan de Mejoramiento Disciplinario dará lugar a remisión inmediata ante el Comité de Evaluación y Seguimiento de la Regional Distrito Capital.

Atentamente,

EQUIPO DE INSTRUCTORES DE GESTIÓN EMPRESARIAL
Coordinación de Formación Profesional
Centro de Servicios Financieros - SENA Regional Distrito Capital`;

    setAsunto(parsedSubject);
    setCuerpo(parsedBody);
  };

  useEffect(() => {
    generateEmailContent();
  }, [
    tipoLlamado, 
    nivelLlamado, 
    fecha, 
    observacion, 
    motivoAcademico, 
    guiaAcademica, 
    rapsAcademicos, 
    normasSeleccionadas,
    fase,
    motivoDisciplinario,
    normaDisciplinaria,
    incluirNorma3Uniforme
  ]);

  // Copy email to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`ASUNTO: ${asunto}\n\n${cuerpo}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('No se pudo copiar automáticamente. Por favor selecciona el texto y copia.');
    }
  };

  // Open in default mail client via mailto
  const handleSendMailto = () => {
    if (!correoDestino.trim()) {
      alert('Por favor especifica el correo del aprendiz.');
      return;
    }

    // Save updated email if modified
    if (onUpdateEmail && correoDestino !== aprendiz.correo) {
      onUpdateEmail(aprendiz.documento, correoDestino);
    }

    const mailtoUrl = `mailto:${encodeURIComponent(correoDestino)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailtoUrl;

    if (onConfirmSend) {
      onConfirmSend(correoDestino, `${tipoLlamado}_${nivelLlamado}`);
    }

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-5 px-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Módulo de Notificación Disciplinaria
              </span>
              <h3 className="text-lg font-black tracking-tight text-white">
                Revisar Correo Antes de Enviar
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Mensaje de Confirmación de Envío */}
          {sentSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-5 h-5 text-emerald-600" />
              ¡Notificación remitida y registrada en la lista de verificación institucional!
            </div>
          )}

          {/* Tarjeta de Resumen del Destinatario */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 font-medium block">Aprendiz Destinatario:</span>
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                {aprendiz.nombre} {aprendiz.apellidos}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {aprendiz.tipoDocumento}: {aprendiz.documento}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-500 font-medium block">Ficha & Programa:</span>
              <span className="font-bold text-sm text-emerald-800 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-700" />
                Ficha {aprendiz.ficha}
              </span>
              <span className="text-[11px] text-slate-500 block">Gestión Empresarial · CSF</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-700 font-bold flex items-center justify-between">
                <span>Correo del Aprendiz:</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                  <Edit3 className="w-3 h-3" />
                  Editable
                </span>
              </span>
              <input
                type="email"
                value={correoDestino}
                onChange={(e) => setCorreoDestino(e.target.value)}
                placeholder="correo@misena.edu.co"
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Configuración Rápida del Tipo de Notificación */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Tipo de Incumplimiento</label>
              <select
                value={tipoLlamado}
                onChange={(e) => setTipoLlamado(e.target.value as any)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="puntualidad">1. Asistencia y Puntualidad (Llegada tarde)</option>
                <option value="uniforme">2. Porte Adecuado de Uniforme SENA CSF</option>
                <option value="actividades">3. Evidencias Académicas (Entrega extemporánea)</option>
                <option value="pmd">⚠️ Plan de Mejoramiento Disciplinario (3 Llamados)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Nivel de Llamado</label>
              <select
                value={nivelLlamado}
                onChange={(e) => setNivelLlamado(Number(e.target.value) as 1 | 2 | 3)}
                disabled={tipoLlamado === 'pmd'}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
              >
                <option value={1}>1er Llamado Formativo</option>
                <option value={2}>2do Llamado de Atención</option>
                <option value={3}>3er Llamado (PMD)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block font-bold text-slate-700">Fecha de la Novedad</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS PARA LLAMADO DE ATENCIÓN ACADÉMICO */}
          {tipoLlamado === 'actividades' ? (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3.5">
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-2">
                <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Estructura Oficial del Llamado Académico (Acuerdo 009 de 2024, Art. 46 literal a numeral 1)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-200 text-blue-800">
                  {nivelLlamado === 1 ? 'PRIMER' : nivelLlamado === 2 ? 'SEGUNDO' : 'TERCER'} LLAMADO
                </span>
              </div>

              {/* Motivo de Bajo Rendimiento */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">
                  Motivo: (Bajo rendimiento académico) <span className="text-slate-400 font-normal">Editar según sea el caso</span>
                </label>
                <input
                  type="text"
                  value={motivoAcademico}
                  onChange={(e) => setMotivoAcademico(e.target.value)}
                  placeholder="Ej: No entrega de evidencias concertadas en plataforma en los plazos establecidos"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Guía y RAPs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Guía de Aprendizaje <span className="text-slate-400 font-normal">(Espacio para incluir)</span>
                  </label>
                  <input
                    type="text"
                    value={guiaAcademica}
                    onChange={(e) => setGuiaAcademica(e.target.value)}
                    placeholder="Ej: Guía de Aprendizaje N° 1 - Fase Planeación"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    Competencias y RAPs <span className="text-slate-400 font-normal">(Planeación pedagógica)</span>
                  </label>
                  <input
                    type="text"
                    value={rapsAcademicos}
                    onChange={(e) => setRapsAcademicos(e.target.value)}
                    placeholder="Ej: Competencia 210601014 - RAP 1 Evaluar desempeño..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Checkboxes de Normas Infringidas */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-bold text-slate-800">
                  Normas presuntamente infringidas del Reglamento (Acuerdo 009 de 2024):
                </label>
                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-blue-200">
                  <label className="flex items-start gap-2 cursor-pointer text-slate-800">
                    <input
                      type="checkbox"
                      checked={normasSeleccionadas.num3}
                      onChange={(e) => setNormasSeleccionadas(prev => ({ ...prev, num3: e.target.checked }))}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span><strong>Artículo 8° deberes del aprendiz, Numeral 3.</strong> Actuar siempre teniendo como base los principios y valores institucionales.</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer text-slate-800">
                    <input
                      type="checkbox"
                      checked={normasSeleccionadas.num5}
                      onChange={(e) => setNormasSeleccionadas(prev => ({ ...prev, num5: e.target.checked }))}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span><strong>Artículo 8° deberes del aprendiz, Numeral 5.</strong> Asistir con puntualidad a todas las actividades propias del proceso de formación.</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer text-slate-800">
                    <input
                      type="checkbox"
                      checked={normasSeleccionadas.num7}
                      onChange={(e) => setNormasSeleccionadas(prev => ({ ...prev, num7: e.target.checked }))}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span><strong>Artículo 8° deberes del aprendiz, Numeral 7.</strong> Justificar debidamente las inasistencias o incumplimientos a las actividades de la formación, en los términos establecidos en el presente reglamento.</span>
                  </label>
                </div>
              </div>
            </div>
          ) : tipoLlamado === 'uniforme' ? (
            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-3.5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-200/80 pb-2.5">
                <div>
                  <span className="font-black text-teal-950 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    LLAMADO DE ATENCIÓN DISCIPLINARIO POR USO DE UNIFORME INSTITUCIONAL
                  </span>
                  <p className="text-[10px] text-teal-800 font-medium">
                    Acuerdo 009 de 2024 · Art. 46 literal a numeral 2 & Art. 8 Deberes Numeral 20
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-200 text-teal-900">
                    Ficha: {aprendiz.ficha}
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-teal-800 text-white uppercase">
                    {nivelLlamado === 1 ? 'PRIMER' : nivelLlamado === 2 ? 'SEGUNDO' : 'TERCER'} LLAMADO
                  </span>
                </div>
              </div>

              {/* Selector de Fase del Proyecto y Motivo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800 text-[11px]">
                    Fase del Proyecto Formativo <span className="text-teal-800 font-semibold">(Lista Desplegable)</span>
                  </label>
                  <select
                    value={fase}
                    onChange={(e) => setFase(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Análisis">Análisis</option>
                    <option value="Planeación">Planeación</option>
                    <option value="Ejecución">Ejecución</option>
                    <option value="Evaluación">Evaluación</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800 text-[11px]">
                    Motivo Específico del Llamado <span className="text-slate-400 font-normal">(Editable)</span>
                  </label>
                  <input
                    type="text"
                    value={motivoDisciplinario}
                    onChange={(e) => setMotivoDisciplinario(e.target.value)}
                    placeholder="Ej: Porte inadecuado del conjunto de prendas del uniforme institucional"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Botones rápidos de motivo de uniforme */}
              <div className="space-y-1">
                <span className="text-[10px] text-teal-900 font-bold block">Opciones rápidas de motivo de uniforme:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Porte inadecuado del conjunto de prendas del uniforme institucional',
                    'No portar la totalidad de prendas del uniforme institucional',
                    'Uso de calzado informal no reglamentario para el ambiente de formación',
                    'No portar el carné institucional visible',
                    'Uso de prendas exteriores o accesorios que cubren el uniforme'
                  ].map((motivoSugerido, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMotivoDisciplinario(motivoSugerido)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                        motivoDisciplinario === motivoSugerido
                          ? 'bg-teal-700 text-white border-teal-800 font-bold shadow-xs'
                          : 'bg-white text-teal-950 border-teal-200 hover:bg-teal-100 font-medium'
                      }`}
                    >
                      {motivoSugerido}
                    </button>
                  ))}
                </div>
              </div>

              {/* Normas del reglamento infringidas */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-bold text-slate-800 text-[11px]">
                  Normas infringidas del Reglamento del Aprendiz SENA (Acuerdo 009 de 2024):
                </label>
                <div className="space-y-2 bg-white p-3 rounded-xl border border-teal-200">
                  <div className="flex items-start gap-2 text-slate-900">
                    <Check className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-teal-950">ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 20:</strong>
                      <span className="text-slate-700 block">
                        Portar el conjunto de prendas y elementos de trabajo y protección asociados al proceso formativo.
                      </span>
                    </div>
                  </div>

                  <label className="flex items-start gap-2 pt-1 border-t border-slate-100 cursor-pointer text-slate-800">
                    <input
                      type="checkbox"
                      checked={incluirNorma3Uniforme}
                      onChange={(e) => setIncluirNorma3Uniforme(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <strong className="text-slate-900">ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 3:</strong>
                      <span className="text-slate-600 block">
                        Actuar siempre teniendo como base los principios y valores institucionales.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3.5">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  {tipoLlamado === 'pmd' 
                    ? 'Estructura Oficial: Activación de Plan de Mejoramiento Disciplinario'
                    : 'Estructura Oficial del Llamado Disciplinario (Acuerdo 009 de 2024, Art. 46 literal a numeral 2)'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                  {tipoLlamado === 'pmd' ? 'PLAN DE MEJORAMIENTO' : `${nivelLlamado === 1 ? 'PRIMER' : nivelLlamado === 2 ? 'SEGUNDO' : 'TERCER'} LLAMADO`}
                </span>
              </div>

              {/* Selector de Fase del Proyecto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">
                    Fase del Proyecto Formativo <span className="text-amber-800 font-semibold">(Lista Desplegable)</span>
                  </label>
                  <select
                    value={fase}
                    onChange={(e) => setFase(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Análisis">Análisis</option>
                    <option value="Planeación">Planeación</option>
                    <option value="Ejecución">Ejecución</option>
                    <option value="Evaluación">Evaluación</option>
                  </select>
                </div>

                {/* Motivo Disciplinario */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">
                    Motivo del Llamado <span className="text-slate-400 font-normal">(Editable)</span>
                  </label>
                  <input
                    type="text"
                    value={motivoDisciplinario}
                    onChange={(e) => setMotivoDisciplinario(e.target.value)}
                    placeholder="Ej: Ingreso tarde a formación"
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Norma Infringida */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">
                  Norma presuntamente infringida (Reglamento 009 de 2024):
                </label>
                <textarea
                  rows={2}
                  value={normaDisciplinaria}
                  onChange={(e) => setNormaDisciplinaria(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Campo Asunto */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Asunto del Correo Electrónico
              </label>
              <span className="text-[11px] text-slate-500">Incluye Ficha y Nombre de forma obligatoria</span>
            </div>
            <input
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Campo Cuerpo del Mensaje */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                Cuerpo del Correo (Redacción Formal Institucional)
              </label>
              <button
                type="button"
                onClick={generateEmailContent}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-bold"
                title="Restablecer redacción predeterminada"
              >
                <RotateCcw className="w-3 h-3" />
                Restablecer Plantilla
              </button>
            </div>

            <textarea
              rows={12}
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-50/50 font-mono text-[11.5px] leading-relaxed text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
            />
          </div>

          {/* Nota de Ayuda */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Garantía de Entrega:</strong> Puedes usar el botón <em>"Enviar con Cliente de Correo"</em> para abrir Outlook/Gmail automáticamente, o <em>"Copiar Texto"</em> para pegarlo directamente en Zajuna / Territorium o correo institucional.
            </span>
          </div>

        </div>

        {/* Pie de Acciones */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 px-6 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold transition-colors"
          >
            Cancelar
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold shadow-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              {copied ? '¡Copiado!' : 'Copiar Texto'}
            </button>

            <button
              onClick={handleSendMailto}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-black shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              Enviar con Cliente de Correo (mailto)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
