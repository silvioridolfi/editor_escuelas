"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { Establecimiento, Contacto, Equipamiento } from "@/types/escuelas"
import {
  obtenerDetallesEscuela,
  actualizarEstablecimiento,
  actualizarContacto,
  actualizarEquipamiento,
} from "@/app/actions/escuelas-actions"
import DatosGeneralesForm from "@/components/forms/datos-generales-form"
import ContactoForm from "@/components/forms/contacto-form"
import EquipamientoForm from "@/components/forms/equipamiento-form"

interface EscuelaDetallesProps {
  escuela: Establecimiento
  onClose: () => void
  onUpdate: (escuela: Establecimiento) => void
}

export default function EscuelaDetalles({ escuela, onClose, onUpdate }: EscuelaDetallesProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("datos-generales")
  const [datosGenerales, setDatosGenerales] = useState<Establecimiento>(escuela)
  const [contacto, setContacto] = useState<Contacto | null>(null)
  const [equipamiento, setEquipamiento] = useState<Equipamiento | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        const detalles = await obtenerDetallesEscuela(escuela.id)
        setDatosGenerales(detalles.establecimiento)
        setContacto(detalles.contacto)
        setEquipamiento(detalles.equipamiento)
      } catch (error) {
        console.error("Error al cargar detalles:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los detalles de la escuela",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      cargarDetalles()
    }
  }, [escuela.id, toast, mounted])

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Actualizar datos generales
      const updatedEstablecimiento = await actualizarEstablecimiento(datosGenerales)

      // Actualizar contacto si existe
      if (contacto) {
        await actualizarContacto({
          ...contacto,
          cue: datosGenerales.cue,
        })
      }

      // Actualizar o insertar equipamiento
      if (equipamiento) {
        await actualizarEquipamiento({
          ...equipamiento,
          establecimiento_id: datosGenerales.id,
        })
      }

      toast({
        title: "Cambios guardados",
        description: "Los datos de la escuela se han actualizado correctamente",
      })

      onUpdate(updatedEstablecimiento)
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <Card className="rounded-2xl shadow-md p-4">
        <CardHeader>
          <CardTitle>Cargando detalles...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "datos-generales":
        return <DatosGeneralesForm datos={datosGenerales} onChange={setDatosGenerales} />
      case "contacto":
        return (
          <ContactoForm
            contacto={
              contacto || {
                id: "",
                cue: datosGenerales.cue || 0,
                nombre: "",
                apellido: "",
                cargo: "",
                telefono: "",
                correo: "",
                distrito: datosGenerales.distrito || "",
                fed_a_cargo: datosGenerales.fed_a_cargo || "",
              }
            }
            onChange={setContacto}
          />
        )
      case "equipamiento":
        return (
          <EquipamientoForm
            equipamiento={
              equipamiento || {
                id: "",
                establecimiento_id: datosGenerales.id,
                netbooks: 0,
                tablets: 0,
                kits_robotica: 0,
                impresoras_3d: 0,
                otros_recursos: "",
              }
            }
            onChange={setEquipamiento}
          />
        )
      default:
        return null
    }
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <CardTitle>Detalles de la escuela: {datosGenerales.nombre || "Sin nombre"}</CardTitle>
        <Button className="ml-auto" onClick={handleSaveChanges} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </CardHeader>
      <CardContent>
        {/* Navegación de pestañas personalizada */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1 mb-4">
          <button
            onClick={() => setActiveTab("datos-generales")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "datos-generales"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Datos generales
          </button>
          <button
            onClick={() => setActiveTab("contacto")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "contacto"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Contacto institucional
          </button>
          <button
            onClick={() => setActiveTab("equipamiento")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === "equipamiento"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Equipamiento
          </button>
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="space-y-4">{renderTabContent()}</div>

        <Separator className="my-6" />

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
