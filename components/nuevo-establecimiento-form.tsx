"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { crearEstablecimiento } from "@/app/actions/escuelas"
import { NIVELES_EDUCATIVOS, MODALIDADES, type NuevoEstablecimiento } from "@/types/escuelas"

interface NuevoEstablecimientoFormProps {
  onClose: () => void
  onCreated: () => void
}

export default function NuevoEstablecimientoForm({ onClose, onCreated }: NuevoEstablecimientoFormProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<NuevoEstablecimiento>({
    cue: 0,
    nombre: "",
    distrito: "",
    ciudad: "",
    direccion: "",
    nivel: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof NuevoEstablecimiento, string>>>({})

  const handleChange = (field: keyof NuevoEstablecimiento, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NuevoEstablecimiento, string>> = {}

    if (!formData.cue || formData.cue <= 0) {
      newErrors.cue = "El CUE es obligatorio y debe ser un número positivo"
    }
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    }
    if (!formData.distrito.trim()) {
      newErrors.distrito = "El distrito es obligatorio"
    }
    if (!formData.ciudad.trim()) {
      newErrors.ciudad = "La ciudad es obligatoria"
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria"
    }
    if (!formData.nivel) {
      newErrors.nivel = "El nivel educativo es obligatorio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await crearEstablecimiento(formData)

      toast({
        title: "Establecimiento creado",
        description: `El establecimiento "${formData.nombre}" ha sido creado exitosamente`,
      })

      onCreated()
    } catch (error) {
      console.error("Error al crear establecimiento:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el establecimiento",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="rounded-2xl shadow-xl border-0 bg-white backdrop-blur-sm border-t-4 border-t-green-600">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 rounded-xl shadow-lg">
                <Save className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-green-700">Nuevo Establecimiento</CardTitle>
                <p className="text-gray-600 mt-1">Completa la información del nuevo establecimiento educativo</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-green-100">
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
            {/* CUE */}
            <div className="space-y-2">
              <Label htmlFor="cue" className="text-pba-blue font-semibold flex items-center gap-2">
                CUE <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cue"
                type="number"
                placeholder="Ej: 123456"
                value={formData.cue || ""}
                onChange={(e) => handleChange("cue", Number.parseInt(e.target.value) || 0)}
                className={`rounded-xl ${errors.cue ? "border-red-500" : ""}`}
              />
              {errors.cue && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.cue}
                </p>
              )}
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-pba-blue font-semibold flex items-center gap-2">
                Nombre del Establecimiento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Escuela Primaria N° 1"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className={`rounded-xl ${errors.nombre ? "border-red-500" : ""}`}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Alias */}
            <div className="space-y-2">
              <Label htmlFor="alias" className="text-pba-blue font-semibold">
                Alias (opcional)
              </Label>
              <Input
                id="alias"
                placeholder="Nombre corto o alias"
                value={formData.alias || ""}
                onChange={(e) => handleChange("alias", e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distrito */}
              <div className="space-y-2">
                <Label htmlFor="distrito" className="text-pba-blue font-semibold flex items-center gap-2">
                  Distrito <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="distrito"
                  placeholder="Ej: La Plata"
                  value={formData.distrito}
                  onChange={(e) => handleChange("distrito", e.target.value)}
                  className={`rounded-xl ${errors.distrito ? "border-red-500" : ""}`}
                />
                {errors.distrito && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.distrito}
                  </p>
                )}
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <Label htmlFor="ciudad" className="text-pba-blue font-semibold flex items-center gap-2">
                  Ciudad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ciudad"
                  placeholder="Ej: La Plata"
                  value={formData.ciudad}
                  onChange={(e) => handleChange("ciudad", e.target.value)}
                  className={`rounded-xl ${errors.ciudad ? "border-red-500" : ""}`}
                />
                {errors.ciudad && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.ciudad}
                  </p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-pba-blue font-semibold flex items-center gap-2">
                Dirección <span className="text-red-500">*</span>
              </Label>
              <Input
                id="direccion"
                placeholder="Ej: Calle 7 N° 123"
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                className={`rounded-xl ${errors.direccion ? "border-red-500" : ""}`}
              />
              {errors.direccion && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.direccion}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nivel Educativo */}
              <div className="space-y-2">
                <Label htmlFor="nivel" className="text-pba-blue font-semibold flex items-center gap-2">
                  Nivel Educativo <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.nivel} onValueChange={(value) => handleChange("nivel", value)}>
                  <SelectTrigger className={`rounded-xl ${errors.nivel ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVELES_EDUCATIVOS.map((nivel) => (
                      <SelectItem key={nivel} value={nivel}>
                        {nivel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.nivel && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.nivel}
                  </p>
                )}
              </div>

              {/* Modalidad */}
              <div className="space-y-2">
                <Label htmlFor="modalidad" className="text-pba-blue font-semibold">
                  Modalidad (opcional)
                </Label>
                <Select value={formData.modalidad || ""} onValueChange={(value) => handleChange("modalidad", value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar modalidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALIDADES.map((modalidad) => (
                      <SelectItem key={modalidad} value={modalidad}>
                        {modalidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Turnos */}
            <div className="space-y-2">
              <Label htmlFor="turnos" className="text-pba-blue font-semibold">
                Turnos (opcional)
              </Label>
              <Input
                id="turnos"
                placeholder="Ej: Mañana y Tarde"
                value={formData.turnos || ""}
                onChange={(e) => handleChange("turnos", e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Latitud */}
              <div className="space-y-2">
                <Label htmlFor="lat" className="text-pba-blue font-semibold">
                  Latitud (opcional)
                </Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="Ej: -34.9205"
                  value={formData.lat || ""}
                  onChange={(e) => handleChange("lat", Number.parseFloat(e.target.value) || undefined)}
                  className="rounded-xl"
                />
              </div>

              {/* Longitud */}
              <div className="space-y-2">
                <Label htmlFor="lon" className="text-pba-blue font-semibold">
                  Longitud (opcional)
                </Label>
                <Input
                  id="lon"
                  type="number"
                  step="any"
                  placeholder="Ej: -57.9536"
                  value={formData.lon || ""}
                  onChange={(e) => handleChange("lon", Number.parseFloat(e.target.value) || undefined)}
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-xl h-12 font-semibold bg-transparent"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 rounded-xl h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Creando..." : "Crear Establecimiento"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
