"use server"

import { supabase } from "@/lib/db"

export async function obtenerEstadisticasGenerales() {
  try {
    const { count: totalEscuelas } = await supabase.from("establecimientos").select("*", { count: "exact", head: true })

    const { data: equipamientoData } = await supabase
      .from("equipamiento_escolar")
      .select("establecimiento_id, netbooks, tablets, kits_robotica")

    const totalNetbooks = equipamientoData?.reduce((sum, item) => sum + (item.netbooks || 0), 0) || 0
    const totalTablets = equipamientoData?.reduce((sum, item) => sum + (item.tablets || 0), 0) || 0
    const totalKitsRobotica = equipamientoData?.reduce((sum, item) => sum + (item.kits_robotica || 0), 0) || 0

    // Extraer los IDs de establecimientos que tienen equipamiento
    const establecimientosConEquipamiento = new Set(
      equipamientoData?.map((item) => item.establecimiento_id).filter(Boolean) || [],
    )

    // Contar escuelas sin equipamiento/conectividad
    const escuelasSinConectividad = (totalEscuelas || 0) - establecimientosConEquipamiento.size
    const porcentajeSinConectividad = totalEscuelas ? (escuelasSinConectividad / totalEscuelas) * 100 : 0

    return {
      totalEscuelas: totalEscuelas || 0,
      totalNetbooks,
      totalTablets,
      totalKitsRobotica,
      escuelasSinConectividad: Math.max(0, escuelasSinConectividad),
      porcentajeSinConectividad,
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    throw new Error("Error al obtener estadísticas")
  }
}
