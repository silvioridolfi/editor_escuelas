"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Laptop,
  Tablet,
  Bot,
  Printer,
  HardDrive,
  Calendar,
  Heart,
  BookOpen,
  Monitor,
  Headphones,
  ShoppingCart,
  CreditCard,
  Smartphone,
} from "lucide-react"
import type { Equipamiento, Establecimiento } from "@/types/escuelas"
import { determinarNivelesEducativos } from "@/types/escuelas"

interface EquipamientoFormProps {
  equipamiento: Equipamiento
  establecimiento: Establecimiento
  onChange: (equipamiento: Equipamiento) => void
}

export default function EquipamientoForm({ equipamiento, establecimiento, onChange }: EquipamientoFormProps) {
  const nivelesEducativos = determinarNivelesEducativos(establecimiento.nivel)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    const numericFields = ["netbooks", "tablets", "kits_robotica", "impresoras_3d"]
    const newValue = numericFields.includes(name) ? Number.parseInt(value) || 0 : value

    onChange({
      ...equipamiento,
      [name]: newValue,
    })
  }

  const handleInicialChange = (field: string, value: number) => {
    const currentInicial = equipamiento.equipamiento_inicial || {}
    const updatedInicial = { ...currentInicial, [field]: value }

    onChange({
      ...equipamiento,
      equipamiento_inicial: updatedInicial,
    })
  }

  const handlePrimarioSecundarioChange = (field: string, value: number) => {
    const currentPrimario = equipamiento.equipamiento_primario || {}
    const currentSecundario = equipamiento.equipamiento_secundario || {}

    // Para primario y secundario, usamos los mismos campos
    const updatedPrimario = { ...currentPrimario, [field]: value }
    const updatedSecundario = { ...currentSecundario, [field]: value }

    onChange({
      ...equipamiento,
      equipamiento_primario: updatedPrimario,
      equipamiento_secundario: updatedSecundario,
    })
  }

  const renderInicialFields = () => {
    const equipamientoInicial = equipamiento.equipamiento_inicial || {}

    const fields = [
      { key: "tablets", label: "Tablets", icon: Tablet, color: "text-pink-600" },
      { key: "notebook_docente", label: "Notebook docente", icon: Laptop, color: "text-pink-600" },
      { key: "robotitas", label: "Robotitas", icon: Bot, color: "text-pink-600" },
      { key: "tarjetas_didacticas", label: "Tarjetas didácticas", icon: CreditCard, color: "text-pink-600" },
      { key: "parlante_bluetooth", label: "Parlante Bluetooth", icon: Headphones, color: "text-pink-600" },
      { key: "disco_externo", label: "Disco externo", icon: HardDrive, color: "text-pink-600" },
      { key: "proyector", label: "Proyector", icon: Monitor, color: "text-pink-600" },
      { key: "pdi", label: "PDI (pizarra digital)", icon: Monitor, color: "text-pink-600" },
      { key: "ecap_servidor", label: "ECAP / servidor portátil", icon: Smartphone, color: "text-pink-600" },
      { key: "carro_carga", label: "Carro de carga", icon: ShoppingCart, color: "text-pink-600" },
    ]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <Card className="rounded-xl border-pink-200 bg-pink-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Heart className="h-5 w-5" />
              Equipamiento Nivel Inicial
              <Badge className="bg-pink-200 text-pink-800 border-pink-300 ml-2">
                {establecimiento.secciones || 0} secciones
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field, index) => {
                const Icon = field.icon
                return (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="rounded-lg border-pink-200 hover:border-pink-300 transition-colors duration-200 bg-white">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${field.color}`} />
                            <Label className="text-pink-700 font-medium text-sm">{field.label}</Label>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            value={equipamientoInicial[field.key] || 0}
                            onChange={(e) => handleInicialChange(field.key, Number.parseInt(e.target.value) || 0)}
                            className="border-pink-200 focus:border-pink-400 focus:ring-pink-300 rounded-lg text-center font-semibold"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderPrimarioSecundarioFields = () => {
    const equipamientoPrimario = equipamiento.equipamiento_primario || {}

    const fields = [
      { key: "netbooks", label: "Netbooks", icon: Laptop, color: "text-blue-600" },
      { key: "adm_aulas_digitales", label: "ADM (Aulas Digitales Móviles)", icon: Monitor, color: "text-blue-600" },
      { key: "kits_robotica", label: "Kits de robótica", icon: Bot, color: "text-blue-600" },
      { key: "impresora_3d", label: "Impresora 3D", icon: Printer, color: "text-blue-600" },
      { key: "pdi", label: "PDI (opcional)", icon: Monitor, color: "text-blue-600" },
      { key: "tablets", label: "Tablets (si aplica)", icon: Tablet, color: "text-blue-600" },
    ]

    const nivelLabel =
      nivelesEducativos.includes("primario") && nivelesEducativos.includes("secundario")
        ? "Primario y Secundario"
        : nivelesEducativos.includes("primario")
          ? "Primario"
          : "Secundario"

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-4"
      >
        <Card className="rounded-xl border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BookOpen className="h-5 w-5" />
              Equipamiento Nivel {nivelLabel}
              <Badge className="bg-blue-200 text-blue-800 border-blue-300 ml-2">
                {establecimiento.matricula || 0} estudiantes
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field, index) => {
                const Icon = field.icon
                return (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="rounded-lg border-blue-200 hover:border-blue-300 transition-colors duration-200 bg-white">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${field.color}`} />
                            <Label className="text-blue-700 font-medium text-sm">{field.label}</Label>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            value={equipamientoPrimario[field.key] || 0}
                            onChange={(e) =>
                              handlePrimarioSecundarioChange(field.key, Number.parseInt(e.target.value) || 0)
                            }
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-300 rounded-lg text-center font-semibold"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Información del nivel educativo */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="rounded-xl border-pba-cyan/30 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pba-cyan/20 rounded-lg">
                <Laptop className="h-5 w-5 text-pba-cyan" />
              </div>
              <div>
                <Label className="text-pba-blue font-semibold">Equipamiento por Nivel Educativo</Label>
                <div className="flex items-center gap-2 mt-1">
                  {nivelesEducativos.length > 0 ? (
                    nivelesEducativos.map((nivel) => (
                      <Badge key={nivel} className="bg-pba-cyan text-white">
                        {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                      </Badge>
                    ))
                  ) : (
                    <Badge className="bg-gray-200 text-gray-700">Sin nivel definido</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Equipamiento específico por nivel */}
      <div className="space-y-6">
        {nivelesEducativos.includes("inicial") && renderInicialFields()}
        {(nivelesEducativos.includes("primario") || nivelesEducativos.includes("secundario")) &&
          renderPrimarioSecundarioFields()}
      </div>

      {/* Otros recursos */}
      <Separator className="my-8" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="rounded-xl border-gray-200 hover:border-pba-cyan/50 transition-colors duration-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-pba-blue text-lg">
              <HardDrive className="h-5 w-5" />
              Otros Recursos Tecnológicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label htmlFor="otros_recursos" className="text-pba-blue font-medium">
                Descripción de otros recursos
              </Label>
              <Textarea
                id="otros_recursos"
                name="otros_recursos"
                rows={4}
                value={equipamiento.otros_recursos || ""}
                onChange={handleChange}
                className="border-gray-200 focus:border-pba-cyan focus:ring-pba-cyan rounded-lg bg-gray-100 focus:bg-white transition-colors duration-200"
                placeholder="Describe otros recursos tecnológicos disponibles: proyectores, pantallas interactivas, laboratorios de informática, equipamiento CNC, etc."
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Información del sistema */}
      <Separator className="my-8" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="rounded-xl border-gray-200 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gray-600 text-lg">
              <Calendar className="h-5 w-5" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-600 font-medium text-sm">ID de equipamiento (solo lectura)</Label>
                <Input
                  value={equipamiento.id || ""}
                  disabled
                  className="bg-gray-100 text-gray-500 rounded-lg text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 font-medium text-sm">ID de establecimiento (solo lectura)</Label>
                <Input
                  value={equipamiento.establecimiento_id || ""}
                  disabled
                  className="bg-gray-100 text-gray-500 rounded-lg text-sm"
                />
              </div>
            </div>
            {equipamiento.created_at && (
              <div className="space-y-2">
                <Label className="text-gray-600 font-medium text-sm">Fecha de creación (solo lectura)</Label>
                <Input
                  value={new Date(equipamiento.created_at).toLocaleString("es-AR")}
                  disabled
                  className="bg-gray-100 text-gray-500 rounded-lg text-sm"
                />
              </div>
            )}
            {equipamiento.updated_at && (
              <div className="space-y-2">
                <Label className="text-gray-600 font-medium text-sm">Última actualización (solo lectura)</Label>
                <Input
                  value={new Date(equipamiento.updated_at).toLocaleString("es-AR")}
                  disabled
                  className="bg-gray-100 text-gray-500 rounded-lg text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
