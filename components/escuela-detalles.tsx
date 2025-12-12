"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Save, Trash2, AlertTriangle, User, Building, GraduationCap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Establecimiento, Contacto, EstablecimientoConectividad } from "@/types/escuelas"
import {
  obtenerDetallesEscuela,
  actualizarDatosGenerales,
  actualizarContacto,
  eliminarEscuela,
} from "@/app/actions/escuelas"
import DatosGeneralesForm from "@/components/forms/datos-generales-form"
import ContactoForm from "@/components/forms/contacto-form"
import DatosAcademicosForm from "@/components/forms/datos-academicos-form"
import ProgramasEducativosForm from "@/components/forms/programas-educativos-form"

interface EscuelaDetallesProps {
  escuela: EstablecimientoConectividad
  onClose: () => void
  onUpdate: (escuela: any) => void
  onDelete: (id: string) => void
}

export default function EscuelaDetalles({ escuela, onClose, onUpdate, onDelete }: EscuelaDetallesProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("datos-generales")
  const [datosGenerales, setDatosGenerales] = useState<Establecimiento | null>(null)
  const [contacto, setContacto] = useState<Contacto | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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

  // Guard clause to prevent crashes when escuela or escuela.id is undefined
  if (!escuela || !escuela.id) {
    console.error("[v0] EscuelaDetalles: escuela or escuela.id is undefined")
    return null
  }

  const handleSaveChanges = async () => {
    if (!datosGenerales) {
      console.error("[v0] handleSaveChanges: datosGenerales is null")
      return
    }

    setIsSaving(true)
    try {
      const updatedEstablecimiento = await actualizarDatosGenerales(datosGenerales.id, datosGenerales)

      if (contacto) {
        await actualizarContacto({
          ...contacto,
          cue: datosGenerales.cue,
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

  const handleDeleteEscuela = async () => {
    setIsDeleting(true)
    try {
      await eliminarEscuela(escuela.id)

      toast({
        title: "Escuela eliminada",
        description: "La escuela y todos sus datos han sido eliminados correctamente",
      })

      onDelete(escuela.id)
    } catch (error) {
      console.error("Error al eliminar escuela:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la escuela",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (!mounted || isLoading || !datosGenerales) {
    return (
      <Card className="rounded-2xl shadow-lg border-0 bg-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-pba-blue">Cargando detalles...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const tabs = [
    { id: "datos-generales", label: "Datos generales", icon: Building },
    { id: "datos-academicos", label: "Datos académicos", icon: GraduationCap },
    { id: "contacto", label: "Contacto institucional", icon: User },
    { id: "programas-educativos", label: "Programas Educativos", icon: BookOpen },
  ]

  const renderTabContent = () => {
    if (!datosGenerales) return null

    switch (activeTab) {
      case "datos-generales":
        return <DatosGeneralesForm datos={datosGenerales} onChange={setDatosGenerales} />
      case "datos-academicos":
        return <DatosAcademicosForm datos={datosGenerales} onChange={setDatosGenerales} />
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
      case "programas-educativos":
        return <ProgramasEducativosForm cue={datosGenerales.cue || 0} nombreEscuela={nombreMostrar} />
      default:
        return null
    }
  }

  const nombreMostrar = datosGenerales.alias || datosGenerales.nombre || "Sin nombre"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="rounded-2xl shadow-xl border-0 bg-white backdrop-blur-sm border-t-4 border-t-pba-blue">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#f5f9fc] to-[#edf6fc]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-pba-blue/10">
                  <ArrowLeft className="h-5 w-5 text-pba-blue" />
                </Button>
              </motion.div>
              <div>
                <CardTitle className="text-2xl text-pba-blue">{nombreMostrar}</CardTitle>
                <p className="text-gray-600 mt-1">
                  CUE: <span className="font-semibold text-pba-cyan">{datosGenerales.cue}</span> •{" "}
                  {datosGenerales.distrito}
                  {datosGenerales.alias && (
                    <span className="ml-2 text-xs bg-pba-cyan/10 text-pba-cyan px-2 py-1 rounded">Alias</span>
                  )}
                </p>
              </div>
            </div>

            {["datos-generales", "datos-academicos", "contacto"].includes(activeTab) && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="rounded-xl bg-pba-cyan hover:bg-pba-cyan/90 text-white font-semibold shadow-lg"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Navegación de pestañas */}
          <div className="flex space-x-1 rounded-2xl bg-gray-100 p-1 mb-8 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id ? "bg-white text-pba-cyan shadow-md" : "text-gray-600 hover:text-pba-blue"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </motion.button>
              )
            })}
          </div>

          {/* Contenido de la pestaña activa */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>

          <Separator className="my-10" />

          {/* Zona de peligro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border-2 border-pba-pink/20 bg-pba-pink/5 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-pba-pink/10 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-pba-pink" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-pba-pink text-lg mb-2">Zona de peligro</h3>
                <p className="text-gray-700 mb-6">
                  Esta acción eliminará permanentemente la escuela y todos sus datos asociados.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="destructive"
                        className="rounded-xl bg-pba-pink hover:bg-pba-pink/90 shadow-lg"
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting ? "Eliminando..." : "Eliminar escuela"}
                      </Button>
                    </motion.div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-pba-pink">
                        <AlertTriangle className="h-5 w-5" />
                        ¿Eliminar escuela?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-left text-gray-700">
                        <div>¿Estás seguro de que querés eliminar esta escuela y todos sus datos?</div>
                        <br />
                        <div>
                          <strong className="text-pba-pink">Esta acción no se puede deshacer.</strong>
                        </div>
                        <br />
                        <div>Se eliminarán:</div>
                        <ul className="list-disc list-inside mt-3 space-y-1 text-gray-600">
                          <li>Datos del establecimiento</li>
                          <li>Información de contacto</li>
                          <li>Programas educativos registrados</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteEscuela}
                        className="rounded-xl bg-pba-pink hover:bg-pba-pink/90"
                      >
                        Sí, eliminar escuela
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
