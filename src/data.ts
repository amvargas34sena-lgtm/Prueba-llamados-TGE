import { Aprendiz, Novedad, PlanMejoramiento, ChecklistRegistro, PlantillaCorreo } from './types';

export const aprendices: Aprendiz[] = [
  // ==========================================
  // FICHA 3384701 - GESTIÓN EMPRESARIAL (28 Aprendices)
  // ==========================================
  { ficha: "3384701", tipoDocumento: "TI", documento: "1023383791", nombre: "NILSY DAYANA", apellidos: "ALARCON DIAZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "nicollalarcon602@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1030573025", nombre: "MARIA FERNANDA", apellidos: "ALONSO MARTINEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "feralonso1918@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1028840902", nombre: "MADELEIN DAYANA", apellidos: "BALTAZAR SERNA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "madeleinserna0@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1025536373", nombre: "MAICOL YAIR", apellidos: "BARRETO MUÑOZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "maicolmunoz0313@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1141117169", nombre: "MARIA FERNANDA", apellidos: "BENITEZ GOMEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "benitezgfernands@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1073689469", nombre: "ANGIE NICOLL", apellidos: "CASTILLO RAIRAN", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "nicollcaatillo3109@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1057892372", nombre: "DIANA CAROLINA", apellidos: "CUBILLOS QUIROGA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "carolina24cubillos@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1082900256", nombre: "JUNIOR JOSE", apellidos: "DE HORTA DE LA HOZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "juniordehorta33@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1141518760", nombre: "MARTIN", apellidos: "FAJARDO CARDALES", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "martinfajardocardales@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1028401410", nombre: "DILAN DANIEL", apellidos: "FORERO QUINTERO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "danielforeroquintero@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1033721536", nombre: "KAROL JIMENA", apellidos: "GARCIA HURTADO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "garciajimena2103@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1011323688", nombre: "MIGUEL ANGEL", apellidos: "GAVILAN ROMERO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "xiomyromero1385@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1025533404", nombre: "VALERIE", apellidos: "GONZALEZ LOPEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "valerilopez1502@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1023373921", nombre: "DAYANA", apellidos: "HERNANDEZ AMEZQUITA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "hernandezamezquitadayana@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1019059731", nombre: "ANDRES FELIPE", apellidos: "HIGUERA CASAS", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "felipehiguera1505@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1023377406", nombre: "DANIELA", apellidos: "MANJARRES RUSINQUE", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "manjarresrusinquedaniela@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1023380655", nombre: "SHARON NICOL", apellidos: "MARQUEZ ARANDA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "sharonnicolmarquezaranda2008@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1034781040", nombre: "WENDY JULIETH", apellidos: "MARTINEZ MARTINEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "wuendy073@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1024519069", nombre: "BRITNY DANIELA", apellidos: "MARTINEZ ROJAS", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "tatan1024519069@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1020758024", nombre: "VALERY JOHANA", apellidos: "MONTOYA LOPEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "valery.johana.montoya23@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1028489028", nombre: "KAREN GABRIELA", apellidos: "MORA SANDOVAL", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "gabrielam1699@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1028784008", nombre: "SHIRLEY TATIANA", apellidos: "PEDRAZA SEQUEA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "pedrazatatiana389@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1093595251", nombre: "MICHEL ALEXANDRA", apellidos: "RAMOS CRUSES", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "michellramos516@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1019995748", nombre: "YOJAN SEBASTIAN", apellidos: "RODRIGUEZ BARRERA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "sebastianrmd34@gmail.com" },
  { ficha: "3384701", tipoDocumento: "CC", documento: "1016716673", nombre: "NATALIA", apellidos: "RODRIGUEZ POLANIA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "natapolania330@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1011103502", nombre: "JHOFFER ALEXANDER", apellidos: "SALGADO AVELLANEDA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "wolfiefaithwolf@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1038112164", nombre: "JAVIER STEVEN", apellidos: "SIERRA ROMERO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "sierraromerojavieresteven@gmail.com" },
  { ficha: "3384701", tipoDocumento: "TI", documento: "1034519022", nombre: "MARIA PAULA", apellidos: "SUAREZ NIÑO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "mariasuarezn.8@gmail.com" },

  // ==========================================
  // FICHA 3384773 - GESTIÓN EMPRESARIAL (28 Aprendices)
  // ==========================================
  { ficha: "3384773", tipoDocumento: "TI", documento: "1031817219", nombre: "SANTIAGO", apellidos: "ACEVEDO OTERO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "santiago.wa.acevedo@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1020756874", nombre: "ZHARICK STEPHANY", apellidos: "AFANADOR JAIME", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "zharickafanador@gmail.com" },
  { ficha: "3384773", tipoDocumento: "PPT", documento: "3574662", nombre: "MARTIN ALEJANDRO", apellidos: "ALFONZO OSORIO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "martinalejandroalfonzoosorio@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1025144531", nombre: "TIFFANY GERALDINE", apellidos: "AMADO MOLINA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "molinatiffany556@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1029147444", nombre: "HELLEN MANUELA", apellidos: "ARDILA DUARTE", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "ardila.hellen09@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1033732725", nombre: "SHIRLEY ALEJANDRA", apellidos: "ARDILA QUEZADA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "ardilaalejandra060@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1016954106", nombre: "SAMUEL ANDRES", apellidos: "COCUNUBO DIAZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "samuelandres.cocunubodiaz2008@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1012375164", nombre: "MICHEL ESTEFANIA", apellidos: "COTRINO RINCON", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "michelcotrino0@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1067898727", nombre: "ARIANA ISABEL", apellidos: "FLOREZ RIVAS", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "arianaflorezrivas@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1025538558", nombre: "CAMILA ANDREA", apellidos: "GONZALEZ LLANOS", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "alimac2205@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1010196104", nombre: "ALEJANDRA", apellidos: "LEON IBAÑEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "iba91175@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1014217027", nombre: "DANIEL", apellidos: "LOMBANA RODRIGUEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "daniellombanarodriguez@gmail.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1013114957", nombre: "NICOLE DANIELA", apellidos: "MALDONADO ALVAREZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "maldonadodaniela100704@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1028841132", nombre: "LAURA SOFIA", apellidos: "NUMPAQUE RIOS", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "laura.numpaque@outlook.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1027283040", nombre: "CHRISTIAN FERNANDO", apellidos: "PACHON GOMEZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "cristianpachon54@gmail.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1033712146", nombre: "JOSUAN ANDRES", apellidos: "PIERNAGORDA MEJIA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "a75002871@gmail.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1031654394", nombre: "ANGEL SANTIAGO", apellidos: "PRADA VARGAS", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "angelpradav@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1032680988", nombre: "STEFANY", apellidos: "REAL PRADA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "srealprada@gmail.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1028664393", nombre: "ANDREA CAROLINA", apellidos: "RODRIGUEZ MIELES", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "andrea_crodriguez1@soy.sena.edu.co" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1012349619", nombre: "DEYCI PAOLA", apellidos: "RODRIGUEZ RAMIREZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "paolarodriguez01105@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1111337126", nombre: "SANTIAGO", apellidos: "ROJAS GARCIA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "rojas.santiago26@altamirense.com.co" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1025534780", nombre: "ANA VICTORIA", apellidos: "ROJAS LOZADA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "vlozada580@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1030584161", nombre: "SEBASTIAN", apellidos: "ROMERO GARRIDO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "romerogarridosebastian@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1014997802", nombre: "DAVID SANTIAGO", apellidos: "RUGELES TRUJILLO", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "rugelessantiago48@gmail.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1014202495", nombre: "LEIDY TATIANA", apellidos: "RUIZ MACIAS", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "tatianamaciasruiz@gmail.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1031541957", nombre: "AXEL SANTIAGO", apellidos: "SANABRIA FLOREZ", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "axxltq@gmail.com" },
  { ficha: "3384773", tipoDocumento: "TI", documento: "1012370472", nombre: "EVELIN DAYANA", apellidos: "SIERRA HINOJOSA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "evelindayana019@gmail.com" },
  { ficha: "3384773", tipoDocumento: "CC", documento: "1025534721", nombre: "KAREN YULIANA", apellidos: "TIERRADENTRO VIEDA", programa: "GESTIÓN EMPRESARIAL", jornada: "Diurna", correo: "karentierradentro06@gmail.com" }
];

// Generación inicial de la Matriz / Lista de Verificación con correos reales
export const initialChecklist: ChecklistRegistro[] = aprendices.map(a => {
  const registro: ChecklistRegistro = {
    aprendizDocumento: a.documento,
    ficha: a.ficha,
    correo: a.correo || ""
  };

  // Semilla de demostración para algunos aprendices
  if (a.documento === "1023383791") {
    // NILSY DAYANA ALARCON DIAZ -> Puntualidad 1
    registro.puntualidad1Fecha = "2026-10-14";
    registro.puntualidad1FechaLimite = "2026-10-20";
    registro.puntualidad1Entregada = false; // Vencida para activar alerta
  } else if (a.documento === "1025536373") {
    // MAICOL YAIR BARRETO MUÑOZ -> Uniforme 1
    registro.uniforme1Fecha = "2026-10-15";
    registro.uniforme1FechaLimite = "2026-10-25";
    registro.uniforme1Entregada = true; // Entregada y cumplida
  } else if (a.documento === "1028401410") {
    // DILAN DANIEL FORERO QUINTERO -> Evidencias 1, Puntualidad 2
    registro.evidencias1Fecha = "2026-10-10";
    registro.evidencias1FechaLimite = "2026-10-18";
    registro.evidencias1Entregada = true;

    registro.puntualidad1Fecha = "2026-10-18";
    registro.puntualidad1FechaLimite = "2026-10-24";
    registro.puntualidad1Entregada = false; // Por vencer
  } else if (a.documento === "1031817219") {
    // SANTIAGO ACEVEDO OTERO (Ficha 3384773) -> Uniforme 1
    registro.uniforme1Fecha = "2026-10-12";
    registro.uniforme1FechaLimite = "2026-10-19";
    registro.uniforme1Entregada = false; // Vencida
  }

  return registro;
});

export const initialNovedades: Novedad[] = [
  {
    id: "NOV-001",
    aprendizDocumento: "1023383791",
    ficha: "3384701",
    fecha: "2026-10-14",
    instructor: "Instructor Gestión Empresarial",
    tipo: "puntualidad",
    observacion: "Ingreso al ambiente de formación con 25 minutos de retraso sin justificación previa.",
    medidaFormativa: "Compromiso escrito de puntualidad y ajuste de ruta de transporte.",
    fechaLimiteMedida: "2026-10-18",
    nivelLlamado: 1
  },
  {
    id: "NOV-002",
    aprendizDocumento: "1025536373",
    ficha: "3384701",
    fecha: "2026-10-15",
    instructor: "Instructor Gestión Empresarial",
    tipo: "uniforme",
    observacion: "Porte de calzado deportivo no reglamentario y ausencia del carné institucional visible.",
    medidaFormativa: "Actividad reflexiva sobre imagen institucional y porte de prendas según manual.",
    fechaLimiteMedida: "2026-10-20",
    nivelLlamado: 1
  },
  {
    id: "NOV-003",
    aprendizDocumento: "1028401410",
    ficha: "3384701",
    fecha: "2026-10-10",
    instructor: "Instructor Gestión Empresarial",
    tipo: "actividades",
    observacion: "No presentó la evidencia GA1-210601014-AA2 en la fecha límite de la plataforma.",
    medidaFormativa: "Taller de recuperación y entrega concertada de evidencia extraordinaria.",
    fechaLimiteMedida: "2026-10-16",
    nivelLlamado: 1
  },
  {
    id: "NOV-004",
    aprendizDocumento: "1028401410",
    ficha: "3384701",
    fecha: "2026-10-18",
    instructor: "Instructor Gestión Empresarial",
    tipo: "puntualidad",
    observacion: "Reincidencia en llegada tardía al inicio de la jornada formativa (30 minutos).",
    medidaFormativa: "Plan de acción de gestión del tiempo y compromiso formativo.",
    fechaLimiteMedida: "2026-10-23",
    nivelLlamado: 2
  },
  {
    id: "NOV-005",
    aprendizDocumento: "1031817219",
    ficha: "3384773",
    fecha: "2026-10-12",
    instructor: "Instructor Gestión Empresarial",
    tipo: "uniforme",
    observacion: "Uso de prenda exterior informal cubriendo el chaleco institucional.",
    medidaFormativa: "Lectura del manual de porte de prendas institucionales SENA.",
    fechaLimiteMedida: "2026-10-15",
    nivelLlamado: 1
  }
];

export const initialPlanes: PlanMejoramiento[] = [];

// Plantillas institucionales para envío de correos
export const plantillasCorreoPorDefecto: Record<string, PlantillaCorreo> = {
  uniforme: {
    asunto: "[SENA CSF] LLAMADO DE ATENCIÓN DISCIPLINARIO POR USO DE UNIFORME INSTITUCIONAL - Ficha {FICHA} - {NOMBRE_APRENDIZ}",
    deberReglamento: "ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 20. Portar el conjunto de prendas y elementos de trabajo y protección asociados al proceso formativo.",
    medidaSugerida: "En cumplimiento a lo establecido en el literal a) numeral 2 del artículo 46 tipo de medidas formativas de acuerdo 009 de 2024.",
    textoAdicional: "Portar el conjunto de prendas y elementos de trabajo y protección asociados al proceso formativo y carné institucional visible en todos los ambientes de formación."
  },
  puntualidad: {
    asunto: "[SENA CSF] LLAMADO DE ATENCIÓN DISCIPLINARIO - Ficha {FICHA} - {NOMBRE_APRENDIZ}",
    deberReglamento: "ARTÍCULO 8o. DEBERES DEL APRENDIZ SENA. Numeral 5. Asistir con puntualidad a todas las actividades propias del proceso de formación.",
    medidaSugerida: "En cumplimiento a lo establecido en el literal a) numeral 2 del artículo 46 tipo de medidas formativas de acuerdo 009 de 2024.",
    textoAdicional: "Compromiso de puntualidad y registro de ingreso a la formación."
  },
  actividades: {
    asunto: "[SENA CSF] LLAMADO DE ATENCIÓN ACADÉMICO - Ficha {FICHA} - {NOMBRE_APRENDIZ}",
    deberReglamento: "Artículo 8° deberes del aprendiz, Numeral 3 (principios y valores), Numeral 5 (asistir con puntualidad) y Numeral 7 (justificar inasistencias o incumplimientos a la formación).",
    medidaSugerida: "En cumplimiento a lo establecido en el literal a) numeral 1 del artículo 46 tipo de medidas formativas de acuerdo 009 de 2024.",
    textoAdicional: "Con relación a la guía y las respectivas competencias y RAPS que se indican en la planeación pedagógica."
  },
  pmd: {
    asunto: "[SENA CSF - URGENTE] ACTIVACIÓN DE PLAN DE MEJORAMIENTO DISCIPLINARIO - Ficha {FICHA} - {NOMBRE_APRENDIZ}",
    deberReglamento: "Acatar las medidas formativas y disciplinarias contempladas en el Reglamento del Aprendiz SENA (Acuerdo 009 de 2024).",
    medidaSugerida: "Presentación obligatoria ante la Coordinación Académica para suscripción y firma del Plan de Mejoramiento Disciplinario (PMD).",
    textoAdicional: "Al haber acumulado 3 llamados de atención, se activa de forma obligatoria el Plan de Mejoramiento Disciplinario. El incumplimiento del mismo dará lugar a remisión ante el Comité de Evaluación y Seguimiento."
  }
};
