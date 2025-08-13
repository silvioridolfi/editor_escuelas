"use server"

import { supabase } from "@/lib/db"

export async function obtenerEstadisticasGenerales() {
  try {
    // Obtener total de escuelas
    const { count: totalEscuelas } = await supabase.from("establecimientos").select("*", { count: "exact", head: true })

    // Obtener estadísticas de equipamiento
    const { data: equipamientoData } = await supabase
      .from("equipamiento_escolar")
      .select("netbooks, tablets, kits_robotica")

    // Calcular totales de equipamiento
    const totalNetbooks = equipamientoData?.reduce((sum, item) => sum + (item.netbooks || 0), 0) || 0
    const totalTablets = equipamientoData?.reduce((sum, item) => sum + (item.tablets || 0), 0) || 0
    const totalKitsRobotica = equipamientoData?.reduce((sum, item) => sum + (item.kits_robotica || 0), 0) || 0

    // Para el ejemplo de conectividad, asumimos que las escuelas sin equipamiento no tienen conectividad
    // En un caso real, esto vendría de un campo específico de conectividad
    const escuelasSinEquipamiento = await supabase
      .from("establecimientos")
      .select("id")
      .not(
        "id",
        "in",
        `(${equipamientoData?.map(() => "equipamiento_escolar.establecimiento_id").join(",") || "null"})`,
      )

    const escuelasSinConectividad = escuelasSinEquipamiento.data?.length || 0
    const porcentajeSinConectividad = totalEscuelas ? (escuelasSinConectividad / totalEscuelas) * 100 : 0

    return {
      totalEscuelas: totalEscuelas || 0,
      totalNetbooks,
      totalTablets,
      totalKitsRobotica,
      escuelasSinConectividad,
      porcentajeSinConectividad,
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    throw new Error("Error al obtener estadísticas")
  }
}
