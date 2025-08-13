"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Hash, MapPin, Building2, FileText, GraduationCap, Edit } from "lucide-react"
import type { Establecimiento } from "@/types/escuelas"

interface DatosGeneralesFormProps {
  datos: Establecimiento
  onChange: (datos: Establecimiento) => void
}

export default function DatosGeneralesForm({ datos, onChange }: DatosGeneralesFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    const numericFields = ["cue", "predio", "lat", "lon", "matricula", "varones", "mujeres", "secciones"]
    let newValue: any = value

    if (numericFields.includes(name)) {
      if (name === "lat" || name === "lon") {
        newValue = value === "" ? null : Number.parseFloat(value) || null
      } else {
        newValue = value === "" ? null : Number.parseInt(value) || null
      }
    }

    onChange({
      ...datos,
      [name]: newValue,
    })
  }

  // Campos básicos de identificación
  const basicFields = [
    { name: "cue", label: "CUE", type: "number", required: true, readonly: true },
    { name: "nombre", label: "Nombre completo", type: "text", required: true, readonly: false, editable: true },
    {
      name: "alias",
      label: "Alias o nombre corto",
      type: "text",
      placeholder: "Ej: EP 12, JI 922, EES 3",
      readonly: false,
    },
  ]

  // Campos de ubicación
  const locationFields = [
    { name: "direccion", label: "Dirección", type: "text", readonly: false },
    { name: "distrito", label: "Distrito", type: "text", readonly: true },
    { name: "ciudad", label: "Ciudad", type: "text", readonly: true },
    { name: "lat", label: "Latitud", type: "number", step: "any", placeholder: "Ej: -34.9214", readonly: false },
    { name: "lon", label: "Longitud", type: "number", step: "any", placeholder: "Ej: -57.9544", readonly: false },
  ]

  // Campos de clasificación
  const classificationFields = [
    { name: "tipo", label: "Tipo", type: "text", readonly: false },
    { name: "tipo_establecimiento", label: "Tipo de establecimiento", type: "text", readonly: false },
    { name: "fed_a_cargo", label: "FED a cargo", type: "text", readonly: false },
    { name: "ambito", label: "Ámbito", type: "text", readonly: false },
    { name: "predio", label: "Predio", type: "number", readonly: false },
  ]

  // Add new academic fields section
  const academicFields = [
    {
      name: "nivel",
      label: "Nivel Educativo",
      type: "text",
      placeholder: "Ej: Inicial, Primario, Secundario",
      readonly: true,
    },
    {
      name: "modalidad",
      label: "Modalidad",
      type: "text",
      placeholder: "Ej: Común, Técnica, Artística",
      readonly: true,
    },
    { name: "turnos", label: "Turnos", type: "text", placeholder: "Ej: Mañana, Tarde, Vespertino", readonly: false },
    {
      name: "matricula",
      label: "Matrícula Total",
      type: "number",
      placeholder: "Total de estudiantes",
      readonly: false,
    },
    { name: "varones", label: "Varones", type: "number", placeholder: "Cantidad de varones", readonly: false },
    { name: "mujeres", label: "Mujeres", type: "number", placeholder: "Cantidad de mujeres", readonly: false },
    { name: "secciones", label: "Secciones", type: "number", placeholder: "Cantidad de secciones", readonly: false },
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
        <Card className="rounded-xl border-gray-200 bg-white hover:border-pba-cyan/50 transition-colors duration-200 group relative overflow-hidden">
          {/* Efecto de brillo sutil en hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pba-cyan/5 to-pba-blue/5 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />

          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="flex items-center gap-2 text-pba-blue text-lg">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: delay + index * 0.05 }}
                >
                  <Card
                    className={`rounded-lg border-gray-200 hover:border-pba-cyan/50 transition-colors duration-200 bg-gray-50/50 group relative overflow-hidden ${
                      field.name === "alias" ? "border-pba-cyan/30 bg-blue-50/20" : ""
                    } ${field.name === "nombre" && field.editable ? "border-green-200/50 bg-green-50/20" : ""}`}
                  >
                    {/* Efecto de brillo para campos especiales */}
                    {(field.name === "alias" || (field.name === "nombre" && field.editable)) && (
                      <motion.div
                        className={`absolute inset-0 ${
                          field.name === "alias"
                            ? "bg-gradient-to-r from-pba-cyan/10 to-pba-blue/10"
                            : "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                        } opacity-0 group-hover:opacity-100 rounded-lg`}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <CardContent className="p-3 relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={field.name} className="text-pba-blue font-medium text-sm">
                            {field.label}
                            {field.required && <span className="text-pba-pink ml-1">*</span>}
                          </Label>
                          {field.name === "nombre" && field.editable && (
                            <motion.div
                              className="flex items-center gap-1"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Edit className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Editable</span>
                            </motion.div>
                          )}
                          {field.readonly && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Solo lectura</span>
                          )}
                        </div>

                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          step={field.step}
                          placeholder={field.placeholder}
                          value={datos[field.name as keyof Establecimiento] || ""}
                          onChange={handleChange}
                          className={`border-gray-200 focus:border-pba-cyan focus:ring-pba-blue rounded-lg text-sm transition-colors duration-200 ${
                            field.readonly
                              ? "bg-gray-100 text-gray-500"
                              : field.name === "nombre" && field.editable
                                ? "bg-green-50 border-green-200 focus:border-green-400 focus:ring-green-300"
                                : "bg-gray-100 focus:bg-white"
                          }`}
                          disabled={field.readonly}
                        />

                        {field.name === "cue" && (
                          <p className="text-xs text-gray-500">Código único de establecimiento (no modificable)</p>
                        )}
                        {field.name === "nombre" && field.editable && (
                          <p className="text-xs text-green-600">✓ Puedes modificar el nombre para corregir errores</p>
                        )}
                        {field.name === "alias" && (
                          <p className="text-xs text-gray-500">Nombre corto para mostrar en el dashboard</p>
                        )}
                        {field.name === "distrito" && (
                          <p className="text-xs text-gray-500">Campo de identidad (no modificable)</p>
                        )}
                        {field.name === "ciudad" && (
                          <p className="text-xs text-gray-500">Campo de identidad (no modificable)</p>
                        )}
                        {field.name === "lat" && (
                          <p className="text-xs text-gray-500">Coordenada de latitud (decimal)</p>
                        )}
                        {field.name === "lon" && (
                          <p className="text-xs text-gray-500">Coordenada de longitud (decimal)</p>
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

  return (
    <div className="space-y-8">
      {/* Información destacada del alias */}
      {datos.alias && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="rounded-xl border-pba-cyan/30 bg-blue-50/30 group relative overflow-hidden">
            {/* Efecto de brillo en hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pba-cyan/10 to-pba-blue/10 opacity-0 group-hover:opacity-100 rounded-xl"
              transition={{ duration: 0.3 }}
            />

            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pba-cyan/20 rounded-lg">
                  <Hash className="h-4 w-4 text-pba-cyan" />
                </div>
                <div>
                  <Label className="text-pba-cyan font-semibold text-sm">Alias del establecimiento</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-pba-cyan text-white font-semibold">{datos.alias}</Badge>
                    <span className="text-xs text-gray-600">Se mostrará en lugar del nombre completo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Aviso sobre campos editables */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="rounded-xl border-green-200/50 bg-green-50/30 group relative overflow-hidden">
          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 rounded-xl"
            transition={{ duration: 0.3 }}
          />

          <CardContent className="p-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200/50 rounded-lg">
                <Edit className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <Label className="text-green-700 font-semibold text-sm">Campos Editables</Label>
                <p className="text-xs text-green-600 mt-1">
                  Puedes modificar el nombre completo y otros campos. Los cambios se guardarán en la base de datos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Campos básicos de identificación */}
      {renderFieldSection(basicFields, "Información Básica", Building2, 0.1)}

      {/* Campos de ubicación */}
      {renderFieldSection(locationFields, "Ubicación y Coordenadas", MapPin, 0.2)}

      {/* Campos de clasificación */}
      {renderFieldSection(classificationFields, "Clasificación y Administración", FileText, 0.3)}

      {/* Campos académicos */}
      {renderFieldSection(academicFields, "Datos Académicos", GraduationCap, 0.4)}

      {/* Observaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="rounded-xl border-gray-200 bg-white hover:border-pba-cyan/50 transition-colors duration-200 group relative overflow-hidden">
          {/* Efecto de brillo en hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pba-cyan/5 to-pba-blue/5 opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />

          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="flex items-center gap-2 text-pba-blue text-lg">
              <FileText className="h-5 w-5" />
              Observaciones Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-pba-blue font-medium">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                name="observaciones"
                rows={4}
                value={datos.observaciones || ""}
                onChange={handleChange}
                className="border-gray-200 focus:border-pba-cyan focus:ring-pba-blue rounded-lg bg-gray-100 focus:bg-white transition-colors duration-200"
                placeholder="Observaciones adicionales sobre el establecimiento..."
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ID del establecimiento (solo lectura) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="rounded-xl border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-gray-600 font-medium">
                ID de establecimiento (solo lectura)
              </Label>
              <Input
                id="id"
                name="id"
                value={datos.id || ""}
                disabled
                className="bg-gray-100 text-gray-500 rounded-lg text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
