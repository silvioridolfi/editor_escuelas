"use server"

import { supabase } from "@/lib/db"

export async function obtenerEstadisticasGenerales() {
  try {
    // Obtener total de escuelas
    const { count: totalEscuelas } = await supabase.from("establecimientos").select("*", { count: "exact", head: true })

    // Obtener total de distritos únicos
    const { data: distritosData } = await supabase
      .from("establecimientos")
      .select("distrito")
      .not("distrito", "is", null)

    const distritosUnicos = new Set(distritosData?.map((item) => item.distrito) || [])
    const totalDistritos = distritosUnicos.size

    // Obtener matrícula total de la tabla datos_nivel_temp
    const { data: matriculaData } = await supabase
      .from("datos_nivel_temp")
      .select("matricula")
      .not("matricula", "is", null)

    const matriculaTotal = matriculaData?.reduce((sum, item) => sum + (item.matricula || 0), 0) || 0

    return {
      totalEscuelas: totalEscuelas || 0,
      totalDistritos,
      matriculaTotal,
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    throw new Error("Error al obtener estadísticas")
  }
}
