"use server"

import { supabase } from "@/lib/db"
import type { Establecimiento, Contacto, EstablecimientoConectividad, NuevoEstablecimiento } from "@/types/escuelas"

export async function buscarEscuelas(searchTerm: string): Promise<EstablecimientoConectividad[]> {
  try {
    if (!searchTerm || searchTerm.trim() === "") {
      const { data, error } = await supabase.from("vw_conectividad_establecimientos").select("*").limit(50)

      if (error) throw error
      return data || []
    }

    // Detectar si es búsqueda por CUE (números) o texto
    if (/^\d+$/.test(searchTerm.trim())) {
      const cueNumber = Number.parseInt(searchTerm.trim(), 10)

      const { data, error } = await supabase
        .from("vw_conectividad_establecimientos")
        .select("*")
        .eq("cue", cueNumber)
        .limit(50)

      if (error) throw error
      return data || []
    }

    // Búsqueda por texto en nombre, distrito, ciudad, localidad
    const { data, error } = await supabase
      .from("vw_conectividad_establecimientos")
      .select("*")
      .or(`nombre.ilike.%${searchTerm}%,distrito.ilike.%${searchTerm}%,ciudad.ilike.%${searchTerm}%`)
      .limit(50)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error en búsqueda:", error)
    throw new Error(`Error en búsqueda: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function obtenerDetallesEscuela(id: string) {
  try {
    // Obtener datos básicos del establecimiento
    const { data: establecimiento, error: escuelaError } = await supabase
      .from("establecimientos")
      .select("*")
      .eq("id", id)
      .single()

    if (escuelaError) throw escuelaError

    // Obtener contacto (si existe)
    const { data: contacto } = await supabase.from("contactos").select("*").eq("cue", establecimiento.cue).maybeSingle()

    return {
      establecimiento: establecimiento as Establecimiento,
      contacto: (contacto as Contacto) || null,
    }
  } catch (error) {
    console.error("Error al obtener detalles:", error)
    throw new Error("Error al obtener detalles de la escuela")
  }
}

export async function actualizarDatosGenerales(id: string, datos: Partial<Establecimiento>) {
  try {
    const { data, error } = await supabase.from("establecimientos").update(datos).eq("id", id).select().single()

    if (error) throw error
    return data as Establecimiento
  } catch (error) {
    console.error("Error al actualizar datos generales:", error)
    throw new Error("Error al actualizar datos generales")
  }
}

export async function actualizarConectividad(
  id: string,
  datos: {
    listado_conexion_internet?: string
    plan_enlace?: string
    plan_piso_tecnologico?: string
  },
) {
  try {
    const { data, error } = await supabase.from("establecimientos").update(datos).eq("id", id).select().single()

    if (error) throw error
    return data as Establecimiento
  } catch (error) {
    console.error("Error al actualizar conectividad:", error)
    throw new Error("Error al actualizar conectividad")
  }
}

export async function actualizarMatricula(
  id: string,
  datos: {
    matricula?: number
    varones?: number
    mujeres?: number
    secciones?: number
  },
) {
  try {
    const { data, error } = await supabase.from("establecimientos").update(datos).eq("id", id).select().single()

    if (error) throw error
    return data as Establecimiento
  } catch (error) {
    console.error("Error al actualizar matrícula:", error)
    throw new Error("Error al actualizar matrícula")
  }
}

export async function actualizarObservaciones(id: string, observaciones: string) {
  try {
    const { data, error } = await supabase
      .from("establecimientos")
      .update({ observaciones })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data as Establecimiento
  } catch (error) {
    console.error("Error al actualizar observaciones:", error)
    throw new Error("Error al actualizar observaciones")
  }
}

// Actualizar contacto
export async function actualizarContacto(contacto: Contacto): Promise<Contacto> {
  try {
    const { data, error } = await supabase
      .from("contactos")
      .upsert({
        cue: contacto.cue,
        nombre: contacto.nombre,
        apellido: contacto.apellido,
        cargo: contacto.cargo,
        telefono: contacto.telefono,
        correo: contacto.correo,
        distrito: contacto.distrito,
        fed_a_cargo: contacto.fed_a_cargo,
      })
      .eq("cue", contacto.cue)
      .select()
      .single()

    if (error) throw error
    return data as Contacto
  } catch (error) {
    console.error("Error al actualizar contacto:", error)
    throw new Error("Error al actualizar contacto")
  }
}

export async function crearEstablecimiento(datos: NuevoEstablecimiento): Promise<Establecimiento> {
  try {
    // Verificar que el CUE no exista
    const { data: existente } = await supabase.from("establecimientos").select("id").eq("cue", datos.cue).maybeSingle()

    if (existente) {
      throw new Error(`El CUE ${datos.cue} ya existe en el sistema`)
    }

    // Insertar nuevo establecimiento
    const { data, error } = await supabase
      .from("establecimientos")
      .insert({
        cue: datos.cue,
        nombre: datos.nombre,
        distrito: datos.distrito,
        ciudad: datos.ciudad,
        direccion: datos.direccion,
        nivel: datos.nivel,
        modalidad: datos.modalidad || null,
        turnos: datos.turnos || null,
        alias: datos.alias || null,
        lat: datos.lat || null,
        lon: datos.lon || null,
      })
      .select()
      .single()

    if (error) throw error
    return data as Establecimiento
  } catch (error) {
    console.error("Error al crear establecimiento:", error)
    throw new Error(error instanceof Error ? error.message : "Error al crear establecimiento")
  }
}

// Eliminar establecimiento
export async function eliminarEscuela(id: string): Promise<void> {
  try {
    // Obtener el CUE antes de eliminar
    const { data: escuela } = await supabase.from("establecimientos").select("cue").eq("id", id).single()

    if (!escuela) throw new Error("Escuela no encontrada")

    // 1. Eliminar contacto
    await supabase.from("contactos").delete().eq("cue", escuela.cue)

    // 2. Eliminar establecimiento
    const { error: establecimientoError } = await supabase.from("establecimientos").delete().eq("id", id)

    if (establecimientoError) throw establecimientoError
  } catch (error) {
    console.error("Error al eliminar escuela:", error)
    throw new Error("Error al eliminar escuela")
  }
}
