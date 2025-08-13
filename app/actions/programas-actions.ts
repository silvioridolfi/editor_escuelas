"use server"

import { supabase } from "@/lib/db"
import type { ProgramaXCue } from "@/types/programas"

// Obtener programas por CUE
export async function obtenerProgramasPorCue(cue: number): Promise<ProgramaXCue[]> {
  try {
    const { data, error } = await supabase.from("programas_x_cue").select("*").eq("cue", cue).order("programa")

    if (error) {
      console.error("Error al obtener programas:", error)
      throw new Error("Error al obtener programas")
    }

    return data as ProgramaXCue[]
  } catch (error) {
    console.error("Error al obtener programas por CUE:", error)
    throw new Error("Error al obtener programas")
  }
}

// Actualizar programas para un CUE específico
export async function actualizarProgramasPorCue(cue: number, programasSeleccionados: string[]): Promise<void> {
  try {
    // Iniciar transacción: primero eliminar todos los programas existentes para este CUE
    const { error: deleteError } = await supabase.from("programas_x_cue").delete().eq("cue", cue)

    if (deleteError) {
      console.error("Error al eliminar programas existentes:", deleteError)
      throw new Error("Error al eliminar programas existentes")
    }

    // Si hay programas seleccionados, insertarlos
    if (programasSeleccionados.length > 0) {
      const programasParaInsertar = programasSeleccionados.map((programa) => ({
        cue,
        programa,
      }))

      const { error: insertError } = await supabase.from("programas_x_cue").insert(programasParaInsertar)

      if (insertError) {
        console.error("Error al insertar nuevos programas:", insertError)
        throw new Error("Error al insertar nuevos programas")
      }
    }
  } catch (error) {
    console.error("Error al actualizar programas:", error)
    throw new Error("Error al actualizar programas")
  }
}

// Obtener estadísticas de programas (opcional para dashboard)
export async function obtenerEstadisticasProgramas() {
  try {
    const { data, error } = await supabase.from("programas_x_cue").select("programa, cue")

    if (error) {
      console.error("Error al obtener estadísticas de programas:", error)
      throw new Error("Error al obtener estadísticas")
    }

    // Contar programas por tipo
    const estadisticas = data.reduce((acc: Record<string, number>, item) => {
      acc[item.programa] = (acc[item.programa] || 0) + 1
      return acc
    }, {})

    // Contar escuelas únicas con programas
    const escuelasConProgramas = new Set(data.map((item) => item.cue)).size

    return {
      estadisticasPorPrograma: estadisticas,
      totalEscuelasConProgramas: escuelasConProgramas,
      totalRegistros: data.length,
    }
  } catch (error) {
    console.error("Error al obtener estadísticas de programas:", error)
    throw new Error("Error al obtener estadísticas")
  }
}
