export interface Establecimiento {
  id: string // uuid en el esquema real
  cue: number // integer en el esquema real
  nombre: string | null
  alias?: string | null // Nuevo campo para nombre corto
  direccion: string | null
  distrito: string | null
  ciudad: string | null
  tipo: string | null
  tipo_establecimiento: string | null
  fed_a_cargo: string | null
  ambito: string | null
  predio: number | null
  lat?: number | null
  lon?: number | null
  observaciones?: string | null
  // Nuevos campos académicos
  nivel?: string | null
  modalidad?: string | null
  matricula?: number | null
  varones?: number | null
  mujeres?: number | null
  secciones?: number | null
  turnos?: string | null
}

export interface Contacto {
  id: string // uuid en el esquema real
  cue: number // se relaciona por CUE, no por establecimiento_id
  nombre: string | null
  apellido: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null // campo correo en lugar de email
  distrito: string | null
  fed_a_cargo: string | null
}

export interface Equipamiento {
  id: string
  establecimiento_id: string
  // Equipamiento general
  netbooks: number
  tablets: number
  kits_robotica: number
  impresoras_3d: number
  otros_recursos: string | null
  programas_entregados?: string[] | null
  // Equipamiento específico por nivel
  equipamiento_inicial?: EquipamientoInicial | null
  equipamiento_primario?: EquipamientoPrimario | null
  equipamiento_secundario?: EquipamientoSecundario | null
  created_at?: string
  updated_at?: string
}

// Equipamiento específico para Nivel Inicial
export interface EquipamientoInicial {
  tablets: number
  notebook_docente: number
  robotitas: number
  tarjetas_didacticas: number
  parlante_bluetooth: number
  disco_externo: number
  proyector: number
  pdi: number
  ecap_servidor: number
  carro_carga: number
}

// Equipamiento específico para Nivel Primario
export interface EquipamientoPrimario {
  adm_aulas_digitales: number
  netbooks: number
  kits_robotica: number
  pdi: number
  tablets: number
}

// Equipamiento específico para Nivel Secundario
export interface EquipamientoSecundario {
  netbooks: number
  kits_robotica: number
  impresora_3d: number
  adm_aulas_digitales: number
}

// Tipos para los programas según nivel educativo
export interface ProgramasEducativos {
  inicial: string[]
  primario: string[]
  secundario: string[]
  tecnico: string[]
  especial: string[]
}

export const PROGRAMAS_POR_NIVEL: ProgramasEducativos = {
  inicial: ["Aprender Conectados – Nivel Inicial"],
  primario: ["Primaria Digital", "Programa de Alfabetización Digital (PAD)"],
  secundario: ["Conectar Igualdad", "Aprender Conectados", "Juana Manso", "Conectar Igualdad 2023"],
  tecnico: ["Conectar Igualdad", "Red de Escuelas Técnicas"],
  especial: ["Aprender Conectados"],
}

// Tipos para los kits de Nivel Inicial
export interface KitInicial {
  nombre: string
  condicion: string
  componentes: {
    tablets: number
    notebook: number
    robotitas: number
    disco_externo?: number
    servidor_portatil?: number
    pdi_proyector?: number
    carro_carga?: number
  }
}

export const KITS_NIVEL_INICIAL: KitInicial[] = [
  {
    nombre: "Kit A",
    condicion: "≤ 3 secciones",
    componentes: {
      tablets: 1,
      notebook: 1,
      robotitas: 1,
      disco_externo: 1,
    },
  },
  {
    nombre: "Kit B",
    condicion: "4–5 secciones",
    componentes: {
      tablets: 3,
      notebook: 1,
      robotitas: 1,
      disco_externo: 1,
    },
  },
  {
    nombre: "Kit C",
    condicion: "6–10 secciones",
    componentes: {
      tablets: 5,
      notebook: 1,
      robotitas: 1,
      disco_externo: 1,
    },
  },
  {
    nombre: "Kit D",
    condicion: "11–15 secciones",
    componentes: {
      tablets: 10,
      notebook: 1,
      robotitas: 2,
      servidor_portatil: 1,
      pdi_proyector: 1,
      carro_carga: 1,
    },
  },
  {
    nombre: "Kit E",
    condicion: "≥ 16 secciones",
    componentes: {
      tablets: 15,
      notebook: 1,
      robotitas: 2,
      servidor_portatil: 1,
      pdi_proyector: 1,
      carro_carga: 1,
    },
  },
]

// Función para determinar el kit según el número de secciones
export function determinarKitInicial(secciones: number | null): KitInicial | null {
  if (!secciones || secciones <= 0) return null

  if (secciones <= 3) return KITS_NIVEL_INICIAL[0] // Kit A
  if (secciones <= 5) return KITS_NIVEL_INICIAL[1] // Kit B
  if (secciones <= 10) return KITS_NIVEL_INICIAL[2] // Kit C
  if (secciones <= 15) return KITS_NIVEL_INICIAL[3] // Kit D
  return KITS_NIVEL_INICIAL[4] // Kit E
}

// Función para determinar niveles educativos desde el campo nivel
export function determinarNivelesEducativos(nivel: string | null): string[] {
  if (!nivel) return []

  const nivelLower = nivel.toLowerCase()
  const niveles: string[] = []

  if (nivelLower.includes("inicial") || nivelLower.includes("jardín") || nivelLower.includes("jardin")) {
    niveles.push("inicial")
  }
  if (nivelLower.includes("primari")) {
    niveles.push("primario")
  }
  if (nivelLower.includes("secundari") || nivelLower.includes("media")) {
    niveles.push("secundario")
  }
  if (nivelLower.includes("técnic") || nivelLower.includes("tecnic")) {
    niveles.push("tecnico")
  }
  if (nivelLower.includes("especial")) {
    niveles.push("especial")
  }

  return niveles
}

// Valores por defecto para equipamiento por nivel
export const DEFAULT_EQUIPAMIENTO_INICIAL: EquipamientoInicial = {
  tablets: 0,
  notebook_docente: 0,
  robotitas: 0,
  tarjetas_didacticas: 0,
  parlante_bluetooth: 0,
  disco_externo: 0,
  proyector: 0,
  pdi: 0,
  ecap_servidor: 0,
  carro_carga: 0,
}

export const DEFAULT_EQUIPAMIENTO_PRIMARIO: EquipamientoPrimario = {
  adm_aulas_digitales: 0,
  netbooks: 0,
  kits_robotica: 0,
  pdi: 0,
  tablets: 0,
}

export const DEFAULT_EQUIPAMIENTO_SECUNDARIO: EquipamientoSecundario = {
  netbooks: 0,
  kits_robotica: 0,
  impresora_3d: 0,
  adm_aulas_digitales: 0,
}
