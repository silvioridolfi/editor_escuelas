"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { GraduationCap, Save, CheckCircle, AlertCircle, Loader2, BookOpen, Users, Laptop, FileX } from "lucide-react"
import { PROGRAMAS_DISPONIBLES } from "@/types/programas"
import { obtenerProgramasPorCue, actualizarProgramasPorCue } from "@/app/actions/programas-actions"

interface ProgramasEducativosFormProps {
  cue: number
  nombreEscuela?: string
}

export default function ProgramasEducativosForm({ cue, nombreEscuela }: ProgramasEducativosFormProps) {
  const { toast } = useToast()
  const [programasSeleccionados, setProgramasSeleccionados] = useState<string[]>([])
  const [programasOriginales, setProgramasOriginales] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Cargar programas existentes al montar el componente
  useEffect(() => {
    const cargarProgramas = async () => {
      try {
        setIsLoading(true)
        const programas = await obtenerProgramasPorCue(cue)
        const programasActuales = programas.map((p) => p.programa)

        setProgramasSeleccionados(programasActuales)
        setProgramasOriginales(programasActuales)
        setHasChanges(false)
      } catch (error) {
        console.error("Error al cargar programas:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los programas existentes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (cue) {
      cargarProgramas()
    }
  }, [cue, toast])

  // Detectar cambios
  useEffect(() => {
    const cambiosDetectados =
      JSON.stringify(programasSeleccionados.sort()) !== JSON.stringify(programasOriginales.sort())
    setHasChanges(cambiosDetectados)
  }, [programasSeleccionados, programasOriginales])

  const handleProgramaChange = (programa: string, checked: boolean) => {
    setProgramasSeleccionados((prev) => {
      if (checked) {
        return [...prev, programa]
      } else {
        return prev.filter((p) => p !== programa)
      }
    })
  }

  const handleGuardarProgramas = async () => {
    try {
      setIsSaving(true)
      await actualizarProgramasPorCue(cue, programasSeleccionados)

      setProgramasOriginales([...programasSeleccionados])
      setHasChanges(false)

      toast({
        title: "Programas actualizados",
        description: `Se han guardado ${programasSeleccionados.length} programas para la escuela`,
      })
    } catch (error) {
      console.error("Error al guardar programas:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los programas",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetear = () => {
    setProgramasSeleccionados([...programasOriginales])
    setHasChanges(false)
  }

  const getProgramaIcon = (programa: string) => {
    if (programa.includes("Inicial")) return GraduationCap
    if (programa.includes("Primaria") || programa.includes("PAD")) return BookOpen
    if (programa.includes("Conectar") || programa.includes("Juana")) return Laptop
    return Users
  }

  const getProgramaColor = (programa: string) => {
    if (programa.includes("Inicial")) return "text-pink-600"
    if (programa.includes("Primaria") || programa.includes("PAD")) return "text-blue-600"
    if (programa.includes("Conectar") || programa.includes("Juana")) return "text-green-600"
    return "text-purple-600"
  }

  const getProgramaBadgeColor = (programa: string) => {
    if (programa.includes("Inicial")) return "bg-pink-100 text-pink-700 border-pink-200"
    if (programa.includes("Primaria") || programa.includes("PAD")) return "bg-blue-100 text-blue-700 border-blue-200"
    if (programa.includes("Conectar") || programa.includes("Juana"))
      return "bg-green-100 text-green-700 border-green-200"
    return "bg-purple-100 text-purple-700 border-purple-200"
  }

  if (isLoading) {
    return (
      <Card className="rounded-xl border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pba-blue">
            <GraduationCap className="h-5 w-5" />
            Programas Educativos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-pba-cyan" />
            <span className="ml-2 text-gray-600">Cargando programas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Información de la escuela */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="rounded-xl border-pba-cyan/30 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pba-cyan/20 rounded-lg">
                <GraduationCap className="h-5 w-5 text-pba-cyan" />
              </div>
              <div>
                <Label className="text-pba-blue font-semibold">Programas Educativos Registrados</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    CUE: <span className="font-semibold text-pba-cyan">{cue}</span>
                  </span>
                  {nombreEscuela && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm font-medium text-gray-700">{nombreEscuela}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Programas registrados actualmente */}
      {programasOriginales.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="rounded-xl border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Programas Registrados en Base de Datos
                <Badge className="bg-green-200 text-green-800 border-green-300 ml-2">
                  {programasOriginales.length} programa{programasOriginales.length !== 1 ? "s" : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {programasOriginales.map((programa) => (
                  <Badge key={programa} className={getProgramaBadgeColor(programa)}>
                    {programa}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="rounded-xl border-gray-200 bg-gray-50/50">
            <CardContent className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FileX className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin programas registrados</h3>
              <p className="text-gray-500">
                Esta escuela no tiene programas educativos registrados en la base de datos.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Editor de programas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="rounded-xl border-gray-200 bg-white hover:border-pba-cyan/50 transition-colors duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-pba-blue text-lg">
                <GraduationCap className="h-5 w-5" />
                Editar Programas
                {programasSeleccionados.length > 0 && (
                  <Badge className="bg-pba-cyan text-white ml-2">
                    {programasSeleccionados.length} seleccionado{programasSeleccionados.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>

              {hasChanges && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700 font-medium">Cambios sin guardar</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm">Selecciona los programas educativos que ha recibido esta escuela</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Lista de programas con checkboxes */}
            <div className="space-y-3">
              {PROGRAMAS_DISPONIBLES.map((programa, index) => {
                const isSelected = programasSeleccionados.includes(programa)
                const Icon = getProgramaIcon(programa)

                return (
                  <motion.div
                    key={programa}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card
                      className={`rounded-lg border-gray-200 hover:border-pba-cyan/50 transition-all duration-200 cursor-pointer ${
                        isSelected ? "bg-pba-cyan/5 border-pba-cyan/30" : "bg-gray-50/50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`programa-${index}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => handleProgramaChange(programa, checked as boolean)}
                            className="data-[state=checked]:bg-pba-cyan data-[state=checked]:border-pba-cyan"
                          />

                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-pba-cyan/20" : "bg-gray-200"}`}>
                              <Icon className={`h-4 w-4 ${isSelected ? "text-pba-cyan" : "text-gray-500"}`} />
                            </div>

                            <div className="flex-1">
                              <Label
                                htmlFor={`programa-${index}`}
                                className={`cursor-pointer font-medium ${isSelected ? "text-pba-blue" : "text-gray-700"}`}
                              >
                                {programa}
                              </Label>
                            </div>

                            {isSelected && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                                <CheckCircle className="h-5 w-5 text-pba-cyan" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Resumen de programas seleccionados */}
            {programasSeleccionados.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-pba-blue font-semibold">Programas seleccionados:</Label>
                  <div className="flex flex-wrap gap-2">
                    {programasSeleccionados.map((programa) => (
                      <Badge key={programa} className={getProgramaBadgeColor(programa)}>
                        {programa}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Botones de acción */}
            <Separator />
            <div className="flex items-center justify-end gap-3">
              {hasChanges && (
                <Button
                  variant="outline"
                  onClick={handleResetear}
                  disabled={isSaving}
                  className="rounded-lg bg-transparent"
                >
                  Cancelar
                </Button>
              )}

              <Button
                onClick={handleGuardarProgramas}
                disabled={!hasChanges || isSaving}
                className={`rounded-lg font-semibold shadow-lg transition-all duration-200 ${
                  hasChanges
                    ? "bg-pba-cyan hover:bg-pba-cyan/90 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Programas
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
