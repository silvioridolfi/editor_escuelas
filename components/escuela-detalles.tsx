"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Save, Trash2, AlertTriangle, User, Laptop, Building, GraduationCap, BookOpen } from "lucide-react"
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
import type { Establecimiento, Contacto, Equipamiento } from "@/types/escuelas"
import {
  obtenerDetallesEscuela,
  actualizarEstablecimiento,
  actualizarContacto,
  actualizarEquipamiento,
  eliminarEscuela,
} from "@/app/actions/escuelas-actions"
import DatosGeneralesForm from "@/components/forms/datos-generales-form"
import ContactoForm from "@/components/forms/contacto-form"
import EquipamientoForm from "@/components/forms/equipamiento-form"
import DatosAcademicosForm from "@/components/forms/datos-academicos-form"
import ProgramasEducativosForm from "@/components/forms/programas-educativos-form"

interface EscuelaDetallesProps {
  escuela: Establecimiento
  onClose: () => void
  onUpdate: (escuela: Establecimiento) => void
  onDelete: (id: string) => void
}

export default function EscuelaDetalles({ escuela, onClose, onUpdate, onDelete }: EscuelaDetallesProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("datos-generales")
  const [datosGenerales, setDatosGenerales] = useState<Establecimiento>(escuela)
  const [contacto, setContacto] = useState<Contacto | null>(null)
  const [equipamiento, setEquipamiento] = useState<Equipamiento | null>(null)
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
      const updatedEstablecimiento = await actualizarEstablecimiento(datosGenerales)

      if (contacto) {
        await actualizarContacto({
          ...contacto,
          cue: datosGenerales.cue,
        })
      }

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

  if (!mounted || isLoading) {
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
    { id: "equipamiento", label: "Equipamiento", icon: Laptop },
    { id: "programas-educativos", label: "Programas Educativos", icon: BookOpen },
  ]

  const renderTabContent = () => {
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
                programas_entregados: [],
              }
            }
            establecimiento={datosGenerales}
            onChange={setEquipamiento}
          />
        )
      case "programas-educativos":
        return <ProgramasEducativosForm cue={datosGenerales.cue || 0} nombreEscuela={nombreMostrar} />
      default:
        return null
    }
  }

  // Usar alias si está disponible, sino el nombre completo
  const nombreMostrar = datosGenerales.alias || datosGenerales.nombre || "Sin nombre"

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="rounded-2xl shadow-xl border-0 bg-white backdrop-blur-sm border-t-4 border-t-pba-blue relative overflow-hidden">
        {/* Efecto de brillo sutil */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pba-blue/5 to-pba-cyan/5 opacity-0 hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-[#f5f9fc] to-[#edf6fc] relative z-10">
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

            {/* Solo mostrar botón de guardar para tabs que modifican datos */}
            {["datos-generales", "datos-academicos", "contacto", "equipamiento"].includes(activeTab) && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="rounded-xl bg-pba-cyan hover:bg-pba-cyan/90 text-white font-semibold shadow-lg relative overflow-hidden group"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                  {/* Efecto de brillo en hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8 relative z-10">
          {/* Navegación de pestañas mejorada */}
          <div className="flex space-x-1 rounded-2xl bg-gray-100 p-1 mb-8 shadow-inner relative">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-semibold transition-all duration-200 relative ${
                    isActive ? "text-pba-cyan" : "text-gray-600 hover:text-pba-blue"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-xl shadow-md"
                      layoutId="activeTabBackground"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pba-cyan/10 to-pba-blue/10 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <Icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                  {/* Efecto de brillo sutil en tab activo */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-pba-cyan/20 to-transparent rounded-xl"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                  )}
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

          {/* Zona de peligro mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border-2 border-pba-pink/20 bg-pba-pink/5 p-6 relative overflow-hidden group"
            whileHover={{ scale: 1.01 }}
          >
            {/* Patrón geométrico hexagonal en hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e81f76' fillOpacity='0.1'%3E%3Cpath d='M20 0l12 7v14l-12 7-12-7V7z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }}
            />

            <div className="flex items-start gap-4 relative z-10">
              <motion.div
                className="p-3 bg-pba-pink/10 rounded-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(232, 31, 118, 0)",
                    "0 0 0 10px rgba(232, 31, 118, 0.1)",
                    "0 0 0 0 rgba(232, 31, 118, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <AlertTriangle className="h-6 w-6 text-pba-pink" />
              </motion.div>
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
                        className="rounded-xl bg-pba-pink hover:bg-pba-pink/90 shadow-lg relative overflow-hidden group"
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting ? "Eliminando..." : "Eliminar escuela"}
                        {/* Efecto de brillo en hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
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
                          <li>Datos de equipamiento</li>
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
