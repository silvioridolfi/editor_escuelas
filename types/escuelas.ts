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
  // Campos académicos
  nivel?: string | null
  modalidad?: string | null
  matricula?: number | null
  varones?: number | null
  mujeres?: number | null
  secciones?: number | null
  turnos?: string | null
  // Campos de conectividad
  listado_conexion_internet?: string | null
  plan_enlace?: string | null
  plan_piso_tecnologico?: string | null
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

export interface EstablecimientoConectividad {
  id: string
  cue: number
  nombre: string | null
  distrito: string | null
  ciudad: string | null
  lat: number | null
  lon: number | null
  nivel: string | null
  modalidad: string | null
  matricula: number | null
  turnos: string | null
  listado_conexion_internet: string | null
  plan_enlace: string | null
  plan_piso_tecnologico: string | null
  categoria_conectividad: "SIN_CONECTIVIDAD" | "CON_PNCE" | "CON_PBA" | "SIN_DATO"
}

export interface EstadisticasConectividad {
  total_establecimientos: number
  con_pba: number
  con_pnce: number
  sin_conectividad: number
  sin_dato: number
}

export const OPCIONES_LISTADO_CONEXION = [
  "Sin enlace",
  "Sin conectividad",
  "Sin piso tecnologico",
  "Sin piso tecnologico ni enlace",
  "Con conectividad",
  "No informado",
] as const

export const OPCIONES_PLAN_ENLACE = [
  "PBA - Plan Enlace",
  "PNCE - Conectar Igualdad",
  "PNCE - Primaria Digital",
  "Sin plan",
  "No informado",
] as const

export const OPCIONES_PLAN_PISO = [
  "PBA - Piso Tecnológico",
  "PNCE - Piso Tecnológico",
  "Sin piso tecnológico",
  "No informado",
] as const

export const NIVELES_EDUCATIVOS = [
  "Inicial",
  "Primario",
  "Secundario",
  "Inicial y Primario",
  "Primario y Secundario",
  "Inicial, Primario y Secundario",
  "Técnico",
  "Especial",
] as const

export const MODALIDADES = ["Común", "Técnica", "Artística", "Especial", "Adultos", "Rural"] as const

export interface NuevoEstablecimiento {
  cue: number
  nombre: string
  distrito: string
  ciudad: string
  direccion: string
  nivel: string
  modalidad?: string
  turnos?: string
  alias?: string
  lat?: number
  lon?: number
}

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
