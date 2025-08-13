"use server"

import { supabase } from "@/lib/db"
import type { Establecimiento, Contacto, Equipamiento } from "@/types/escuelas"

// Buscar escuelas por término (nombre, CUE o distrito)
export async function buscarEscuelas(searchTerm: string): Promise<Establecimiento[]> {
  // Para CUE, intentamos convertir a número si es posible
  const cueNumber = Number.parseInt(searchTerm)
  const isValidCue = !isNaN(cueNumber)

  let query = supabase
    .from("establecimientos")
    .select(
      "id, cue, nombre, alias, direccion, distrito, ciudad, tipo, tipo_establecimiento, fed_a_cargo, ambito, predio, lat, lon, observaciones, nivel, modalidad, matricula, varones, mujeres, secciones, turnos",
    )
    .order("nombre")
    .limit(50)

  if (isValidCue) {
    // Si el término de búsqueda es un número válido, buscar por CUE exacto o por nombre/distrito
    query = query.or(
      `cue.eq.${cueNumber},nombre.ilike.%${searchTerm}%,alias.ilike.%${searchTerm}%,distrito.ilike.%${searchTerm}%,ciudad.ilike.%${searchTerm}%`,
    )
  } else {
    // Si no es un número, solo buscar por campos de texto
    query = query.or(
      `nombre.ilike.%${searchTerm}%,alias.ilike.%${searchTerm}%,distrito.ilike.%${searchTerm}%,ciudad.ilike.%${searchTerm}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error("Error al buscar escuelas:", error)
    throw new Error("Error al buscar escuelas")
  }

  return data as Establecimiento[]
}

// Obtener detalles completos de una escuela
export async function obtenerDetallesEscuela(id: string) {
  // Obtener establecimiento
  const { data: establecimiento, error: establecimientoError } = await supabase
    .from("establecimientos")
    .select("*")
    .eq("id", id)
    .single()

  if (establecimientoError) {
    console.error("Error al obtener establecimiento:", establecimientoError)
    throw new Error("Error al obtener establecimiento")
  }

  // Obtener contacto por CUE (ya que la tabla contactos se relaciona por CUE)
  const { data: contacto } = await supabase.from("contactos").select("*").eq("cue", establecimiento.cue).single()

  // Obtener equipamiento (crear tabla si no existe)
  const { data: equipamiento } = await supabase
    .from("equipamiento_escolar")
    .select("*")
    .eq("establecimiento_id", id)
    .single()

  // Parsear los campos JSON de equipamiento específico por nivel de forma segura
  let equipamientoProcessed = equipamiento
  if (equipamiento) {
    equipamientoProcessed = {
      ...equipamiento,
      equipamiento_inicial: equipamiento.equipamiento_inicial
        ? typeof equipamiento.equipamiento_inicial === "string"
          ? JSON.parse(equipamiento.equipamiento_inicial)
          : equipamiento.equipamiento_inicial
        : null,
      equipamiento_primario: equipamiento.equipamiento_primario
        ? typeof equipamiento.equipamiento_primario === "string"
          ? JSON.parse(equipamiento.equipamiento_primario)
          : equipamiento.equipamiento_primario
        : null,
      equipamiento_secundario: equipamiento.equipamiento_secundario
        ? typeof equipamiento.equipamiento_secundario === "string"
          ? JSON.parse(equipamiento.equipamiento_secundario)
          : equipamiento.equipamiento_secundario
        : null,
    }
  }

  return {
    establecimiento: establecimiento as Establecimiento,
    contacto: (contacto as Contacto) || null,
    equipamiento: (equipamientoProcessed as Equipamiento) || null,
  }
}

// Actualizar establecimiento
export async function actualizarEstablecimiento(establecimiento: Establecimiento): Promise<Establecimiento> {
  console.log("Actualizando establecimiento con nombre:", establecimiento.nombre)

  const { data, error } = await supabase
    .from("establecimientos")
    .update({
      cue: establecimiento.cue,
      nombre: establecimiento.nombre, // ✅ Asegurar que el nombre se actualice
      alias: establecimiento.alias,
      direccion: establecimiento.direccion,
      distrito: establecimiento.distrito,
      ciudad: establecimiento.ciudad,
      tipo: establecimiento.tipo,
      tipo_establecimiento: establecimiento.tipo_establecimiento,
      fed_a_cargo: establecimiento.fed_a_cargo,
      ambito: establecimiento.ambito,
      predio: establecimiento.predio,
      lat: establecimiento.lat,
      lon: establecimiento.lon,
      observaciones: establecimiento.observaciones,
      nivel: establecimiento.nivel,
      modalidad: establecimiento.modalidad,
      matricula: establecimiento.matricula,
      varones: establecimiento.varones,
      mujeres: establecimiento.mujeres,
      secciones: establecimiento.secciones,
      turnos: establecimiento.turnos,
    })
    .eq("id", establecimiento.id)
    .select()
    .single()

  if (error) {
    console.error("Error al actualizar establecimiento:", error)
    throw new Error("Error al actualizar establecimiento")
  }

  console.log("Establecimiento actualizado exitosamente:", data.nombre)
  return data as Establecimiento
}

// Actualizar contacto
export async function actualizarContacto(contacto: Contacto): Promise<Contacto> {
  // Verificar si ya existe un contacto para este CUE
  const { data: existing } = await supabase.from("contactos").select("id").eq("cue", contacto.cue).single()

  let result

  if (existing) {
    // Actualizar contacto existente
    result = await supabase
      .from("contactos")
      .update({
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
  } else {
    // Insertar nuevo contacto
    result = await supabase
      .from("contactos")
      .insert({
        cue: contacto.cue,
        nombre: contacto.nombre,
        apellido: contacto.apellido,
        cargo: contacto.cargo,
        telefono: contacto.telefono,
        correo: contacto.correo,
        distrito: contacto.distrito,
        fed_a_cargo: contacto.fed_a_cargo,
      })
      .select()
      .single()
  }

  if (result.error) {
    console.error("Error al actualizar contacto:", result.error)
    throw new Error("Error al actualizar contacto")
  }

  return result.data as Contacto
}

// Actualizar o insertar equipamiento (UPSERT)
export async function actualizarEquipamiento(equipamiento: Equipamiento): Promise<Equipamiento> {
  // Preparar los datos para la actualización
  const updateData: any = {
    establecimiento_id: equipamiento.establecimiento_id,
    netbooks: equipamiento.netbooks || 0,
    tablets: equipamiento.tablets || 0,
    kits_robotica: equipamiento.kits_robotica || 0,
    impresoras_3d: equipamiento.impresoras_3d || 0,
    otros_recursos: equipamiento.otros_recursos || null,
    programas_entregados: JSON.stringify(equipamiento.programas_entregados || []),
  }

  // Solo agregar campos de equipamiento por nivel si existen
  if (equipamiento.equipamiento_inicial) {
    updateData.equipamiento_inicial = JSON.stringify(equipamiento.equipamiento_inicial)
  }
  if (equipamiento.equipamiento_primario) {
    updateData.equipamiento_primario = JSON.stringify(equipamiento.equipamiento_primario)
  }
  if (equipamiento.equipamiento_secundario) {
    updateData.equipamiento_secundario = JSON.stringify(equipamiento.equipamiento_secundario)
  }

  const { data, error } = await supabase
    .from("equipamiento_escolar")
    .upsert(updateData, {
      onConflict: "establecimiento_id",
    })
    .select()
    .single()

  if (error) {
    console.error("Error al actualizar equipamiento:", error)
    throw new Error("Error al actualizar equipamiento")
  }

  // Parsear los campos JSON de vuelta de forma segura
  const equipamientoProcessed = {
    ...data,
    equipamiento_inicial: data.equipamiento_inicial
      ? typeof data.equipamiento_inicial === "string"
        ? JSON.parse(data.equipamiento_inicial)
        : data.equipamiento_inicial
      : null,
    equipamiento_primario: data.equipamiento_primario
      ? typeof data.equipamiento_primario === "string"
        ? JSON.parse(data.equipamiento_primario)
        : data.equipamiento_primario
      : null,
    equipamiento_secundario: data.equipamiento_secundario
      ? typeof data.equipamiento_secundario === "string"
        ? JSON.parse(data.equipamiento_secundario)
        : data.equipamiento_secundario
      : null,
  }

  return equipamientoProcessed as Equipamiento
}

// Eliminar escuela y todos sus datos relacionados
export async function eliminarEscuela(id: string): Promise<void> {
  // Obtener el CUE del establecimiento para eliminar contactos relacionados
  const { data: establecimiento } = await supabase.from("establecimientos").select("cue").eq("id", id).single()

  if (!establecimiento) {
    throw new Error("Establecimiento no encontrado")
  }

  // Eliminar en orden: primero los datos relacionados, luego el establecimiento

  // 1. Eliminar programas por CUE
  const { error: programasError } = await supabase.from("programas_x_cue").delete().eq("cue", establecimiento.cue)

  if (programasError) {
    console.error("Error al eliminar programas:", programasError)
    // No lanzamos error aquí porque los programas pueden no existir
  }

  // 2. Eliminar equipamiento
  const { error: equipamientoError } = await supabase.from("equipamiento_escolar").delete().eq("establecimiento_id", id)

  if (equipamientoError) {
    console.error("Error al eliminar equipamiento:", equipamientoError)
    // No lanzamos error aquí porque el equipamiento puede no existir
  }

  // 3. Eliminar contacto
  const { error: contactoError } = await supabase.from("contactos").delete().eq("cue", establecimiento.cue)

  if (contactoError) {
    console.error("Error al eliminar contacto:", contactoError)
    // No lanzamos error aquí porque el contacto puede no existir
  }

  // 4. Eliminar establecimiento
  const { error: establecimientoError } = await supabase.from("establecimientos").delete().eq("id", id)

  if (establecimientoError) {
    console.error("Error al eliminar establecimiento:", establecimientoError)
    throw new Error("Error al eliminar establecimiento")
  }
}
