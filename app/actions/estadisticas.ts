"use server"

import { supabase } from "@/lib/db"
import type { EstadisticasConectividad } from "@/types/escuelas"

export async function obtenerEstadisticasConectividad(): Promise<EstadisticasConectividad> {
  try {
    // Obtener todos los datos de conectividad desde la vista
    const { data, error } = await supabase.from("vw_conectividad_establecimientos").select("categoria_conectividad")

    if (error) {
      console.error("Error al obtener estadísticas:", error)
      throw new Error("Error al obtener estadísticas de conectividad")
    }

    // Contar por categoría
    const estadisticas = {
      total_establecimientos: data?.length || 0,
      con_pba: 0,
      con_pnce: 0,
      sin_conectividad: 0,
      sin_dato: 0,
    }

    data?.forEach((item) => {
      switch (item.categoria_conectividad) {
        case "CON_PBA":
          estadisticas.con_pba++
          break
        case "CON_PNCE":
          estadisticas.con_pnce++
          break
        case "SIN_CONECTIVIDAD":
          estadisticas.sin_conectividad++
          break
        case "SIN_DATO":
          estadisticas.sin_dato++
          break
      }
    })

    return estadisticas
  } catch (error) {
    console.error("Error en obtenerEstadisticasConectividad:", error)
    return {
      total_establecimientos: 0,
      con_pba: 0,
      con_pnce: 0,
      sin_conectividad: 0,
      sin_dato: 0,
    }
  }
}

export async function obtenerTotalDistritos(): Promise<number> {
  try {
    const { data, error } = await supabase.from("establecimientos").select("distrito")

    if (error) throw error

    // Contar distritos únicos (excluir null/undefined)
    const distritosUnicos = new Set(data?.map((item) => item.distrito?.trim()).filter(Boolean))

    return distritosUnicos.size
  } catch (error) {
    console.error("Error al obtener total de distritos:", error)
    return 0
  }
}

export async function obtenerMatriculaTotal(): Promise<number> {
  try {
    const { data, error } = await supabase.from("datos_nivel_temp").select("matricula")

    if (error) throw error

    const total = data?.reduce((sum, item) => sum + (item.matricula || 0), 0) || 0
    return total
  } catch (error) {
    console.error("Error al obtener matrícula total:", error)
    return 0
  }
}
