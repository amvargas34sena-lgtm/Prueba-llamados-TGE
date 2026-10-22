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
  estado: 'Activo' | 'En Seguimiento' | 'Cumplido' | 'Incumplido - Escalar a Comité';
}
