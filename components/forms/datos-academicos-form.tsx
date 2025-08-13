"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users } from "lucide-react"
import type { Establecimiento } from "@/types/escuelas"

interface DatosAcademicosFormProps {
  datos: Establecimiento
  onChange: (datos: Establecimiento) => void
}

export default function DatosAcademicosForm({ datos, onChange }: DatosAcademicosFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    const numericFields = ["matricula", "varones", "mujeres", "secciones"]
    let newValue: any = value

    if (numericFields.includes(name)) {
      newValue = value === "" ? null : Number.parseInt(value) || null
    }

    onChange({
      ...datos,
      [name]: newValue,
    })
  }

  // Campos de nivel y modalidad
  const levelFields = [
    { name: "nivel", label: "Nivel Educativo", type: "text", placeholder: "Ej: Inicial, Primario, Secundario" },
    { name: "modalidad", label: "Modalidad", type: "text", placeholder: "Ej: Común, Técnica, Artística" },
    { name: "turnos", label: "Turnos", type: "text", placeholder: "Ej: Mañana, Tarde, Vespertino" },
  ]

  // Campos de matrícula
  const enrollmentFields = [
    { name: "matricula", label: "Matrícula Total", type: "number", placeholder: "Total de estudiantes" },
    { name: "varones", label: "Varones", type: "number", placeholder: "Cantidad de varones" },
    { name: "mujeres", label: "Mujeres", type: "number", placeholder: "Cantidad de mujeres" },
    { name: "secciones", label: "Secciones", type: "number", placeholder: "Cantidad de secciones" },
  ]

  const renderFieldSection = (fields: any[], title: string, icon: any, delay = 0) => {
    const Icon = icon
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className="space-y-4"
      >
        <Card className="rounded-xl border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-pba-blue text-lg">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: delay + index * 0.05 }}
                  className={field.name === "turnos" ? "md:col-span-2" : ""}
                >
                  <Card className="rounded-lg border-gray-200 hover:border-pba-cyan/50 transition-colors duration-200 bg-gray-50/50">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        {field.name === "nivel" && (
                          <Label htmlFor="nivel" className="text-gray-600 font-medium text-sm">
                            Nivel Educativo (solo lectura)
                            <span className="text-xs text-gray-500 ml-1">Campo de identidad</span>
                          </Label>
                        )}
                        {field.name === "modalidad" && (
                          <Label htmlFor="modalidad" className="text-gray-600 font-medium text-sm">
                            Modalidad (solo lectura)
                            <span className="text-xs text-gray-500 ml-1">Campo de identidad</span>
                          </Label>
                        )}
                        <Label htmlFor={field.name} className="text-pba-blue font-medium text-sm">
                          {field.label}
                        </Label>
                        {field.name === "nivel" && (
                          <Input
                            id="nivel"
                            name="nivel"
                            type="text"
                            value={datos.nivel || ""}
                            disabled
                            className="bg-gray-100 text-gray-500 rounded-lg text-sm"
                          />
                        )}
                        {field.name === "modalidad" && (
                          <Input
                            id="modalidad"
                            name="modalidad"
                            type="text"
                            value={datos.modalidad || ""}
                            disabled
                            className="bg-gray-100 text-gray-500 rounded-lg text-sm"
                          />
                        )}
                        {field.name !== "nivel" && field.name !== "modalidad" && (
                          <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={datos[field.name as keyof Establecimiento] || ""}
                            onChange={handleChange}
                            className="border-gray-200 focus:border-pba-cyan focus:ring-pba-blue rounded-lg text-sm"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Calcular estadísticas si hay datos
  const totalMatricula = datos.matricula || 0
  const totalVarones = datos.varones || 0
  const totalMujeres = datos.mujeres || 0
  const porcentajeVarones = totalMatricula > 0 ? ((totalVarones / totalMatricula) * 100).toFixed(1) : "0"
  const porcentajeMujeres = totalMatricula > 0 ? ((totalMujeres / totalMatricula) * 100).toFixed(1) : "0"

  return (
    <div className="space-y-8">
      {/* Resumen de matrícula si hay datos */}
      {totalMatricula > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="rounded-xl border-pba-cyan/30 bg-blue-50/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pba-cyan/20 rounded-lg">
                  <Users className="h-6 w-6 text-pba-cyan" />
                </div>
                <div className="flex-1">
                  <Label className="text-pba-cyan font-semibold text-lg">Resumen de Matrícula</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="bg-pba-cyan text-white font-semibold text-base px-3 py-1">
                      Total: {totalMatricula.toString()}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Varones: {totalVarones.toString()} ({porcentajeVarones}%)
                    </Badge>
                    <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                      Mujeres: {totalMujeres.toString()} ({porcentajeMujeres}%)
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Campos de nivel y modalidad */}
      {renderFieldSection(levelFields, "Nivel y Modalidad Educativa", GraduationCap, 0.1)}

      {/* Campos de matrícula */}
      {renderFieldSection(enrollmentFields, "Matrícula y Distribución", Users, 0.2)}
    </div>
  )
}
