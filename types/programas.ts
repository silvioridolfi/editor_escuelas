// Tipos para programas educativos
export interface ProgramaXCue {
  id: string
  cue: number
  programa: string
  created_at?: string
  updated_at?: string
}

// Lista de programas disponibles
export const PROGRAMAS_DISPONIBLES = [
  "Aprender Conectados – Nivel Inicial",
  "Primaria Digital",
  "Programa de Alfabetización Digital (PAD)",
  "Conectar Igualdad",
  "Juana Manso",
  "Conectar Igualdad 2023",
] as const

export type ProgramaDisponible = (typeof PROGRAMAS_DISPONIBLES)[number]

// Interfaz para el formulario de programas
export interface ProgramasFormData {
  cue: number
  programasSeleccionados: string[]
}
