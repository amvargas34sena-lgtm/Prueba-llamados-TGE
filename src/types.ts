export type TipoIncumplimiento = 'puntualidad' | 'uniforme' | 'actividades';

export interface Aprendiz {
  ficha: string;
  tipoDocumento: string;
  documento: string;
  nombre: string;
  apellidos: string;
  correo?: string;
  celular?: string;
  programa?: string;
  jornada?: string;
}

export interface Novedad {
  id: string;
  aprendizDocumento: string;
  ficha: string;
  fecha: string;
  instructor: string;
  tipo: TipoIncumplimiento;
  observacion: string;
  medidaFormativa?: string;
  fechaLimiteMedida?: string;
  medidaEntregada?: boolean;
  soporteUrl?: string;
  nivelLlamado: 1 | 2 | 3;
}

export interface PlanMejoramiento {
  id: string;
  aprendizDocumento: string;
  ficha: string;
  fechaActivacion: string;
  motivoActivacion: string;
  diagnostico: string;
  compromisos: string[];
  fechaEvaluacion: string;
  entregado?: boolean;
  estado: 'Activo' | 'En Seguimiento' | 'Cumplido' | 'Incumplido - Escalar a Comité';
}

// Registro en Matriz / Lista de Verificación de Inasistencias y Faltas Disciplinarias
export interface ChecklistRegistro {
  aprendizDocumento: string;
  ficha: string;
  correo: string;

  // LLAMADO DISCIPLINARIO UNIFORME
  uniforme1Fecha?: string;
  uniforme1Entregada?: boolean;
  uniforme1FechaLimite?: string;

  uniforme2Fecha?: string;
  uniforme2Entregada?: boolean;
  uniforme2FechaLimite?: string;

  uniforme3Fecha?: string;
  uniforme3Entregada?: boolean;
  uniforme3FechaLimite?: string;

  uniformePlanMejoramiento?: boolean;
  uniformePlanFecha?: string;
  uniformePlanEntregado?: boolean;
  uniformePlanFechaLimite?: string;

  // LLAMADO DISCIPLINARIO PUNTUALIDAD
  puntualidad1Fecha?: string;
  puntualidad1Entregada?: boolean;
  puntualidad1FechaLimite?: string;

  puntualidad2Fecha?: string;
  puntualidad2Entregada?: boolean;
  puntualidad2FechaLimite?: string;

  puntualidad3Fecha?: string;
  puntualidad3Entregada?: boolean;
  puntualidad3FechaLimite?: string;

  puntualidadPlanMejoramiento?: boolean;
  puntualidadPlanFecha?: string;
  puntualidadPlanEntregado?: boolean;
  puntualidadPlanFechaLimite?: string;

  // LLAMADO ACADÉMICO POR EVIDENCIAS
  evidencias1Fecha?: string;
  evidencias1Entregada?: boolean;
  evidencias1FechaLimite?: string;

  evidencias2Fecha?: string;
  evidencias2Entregada?: boolean;
  evidencias2FechaLimite?: string;

  evidencias3Fecha?: string;
  evidencias3Entregada?: boolean;
  evidencias3FechaLimite?: string;

  evidenciasPlanMejoramiento?: boolean;
  evidenciasPlanFecha?: string;
  evidenciasPlanEntregado?: boolean;
  evidenciasPlanFechaLimite?: string;

  // Control Global de Plan de Mejoramiento Disciplinario (PMD)
  pmdGlobalEntregado?: boolean;
  pmdGlobalFechaLimite?: string;

  // Seguimiento de notificaciones enviadas
  ultimoCorreoFecha?: string;
  ultimoCorreoTipo?: string;
}

export interface ItemAlertaMedida {
  id: string;
  aprendizDocumento: string;
  nombreAprendiz: string;
  apellidosAprendiz: string;
  ficha: string;
  correo: string;
  tipoComponente: TipoIncumplimiento | 'pmd';
  etiquetaComponente: string;
  nivelLlamado: 1 | 2 | 3;
  fechaLlamado: string;
  fechaLimite: string;
  entregada: boolean;
  fieldEntregada: keyof ChecklistRegistro;
  fieldFechaLimite: keyof ChecklistRegistro;
  estadoAlerta: 'vencida' | 'porVencer' | 'enPlazo' | 'cumplida';
  diasDiferencia: number;
}

export interface PlantillaCorreo {
  asunto: string;
  deberReglamento: string;
  medidaSugerida: string;
  textoAdicional?: string;
}
