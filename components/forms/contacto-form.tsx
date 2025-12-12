"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Building } from "lucide-react"
import type { Contacto } from "@/types/escuelas"

interface ContactoFormProps {
  contacto: Contacto
  onChange: (contacto: Contacto) => void
}

export default function ContactoForm({ contacto, onChange }: ContactoFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newValue = name === "cue" ? Number.parseInt(value) || 0 : value

    onChange({
      ...contacto,
      [name]: newValue,
    })
  }

  // Campos de información personal
  const personalFields = [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Nombre del directivo" },
    { name: "apellido", label: "Apellido", type: "text", placeholder: "Apellido del directivo" },
    { name: "cargo", label: "Cargo", type: "text", placeholder: "Ej: Director/a, Vicedirector/a" },
  ]

  // Campos de contacto
  const contactFields = [
    { name: "telefono", label: "Teléfono", type: "tel", placeholder: "Ej: 221-4567890" },
    { name: "correo", label: "Correo electrónico", type: "email", placeholder: "ejemplo@escuela.edu.ar" },
  ]

  // Campos administrativos
  const adminFields = [
    { name: "distrito", label: "Distrito", type: "text", placeholder: "Distrito educativo" },
    { name: "fed_a_cargo", label: "FED a cargo", type: "text", placeholder: "Facilitador Educativo Digital" },
    { name: "cue", label: "CUE", type: "number", placeholder: "Código Único de Establecimiento" },
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
                  className={field.name === "correo" ? "md:col-span-2" : ""}
                >
                  <Card className="rounded-lg border-gray-200 hover:border-pba-cyan/50 transition-colors duration-200 bg-gray-50/50">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <Label htmlFor={field.name} className="text-pba-blue font-medium text-sm">
                          {field.label}
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={contacto[field.name as keyof Contacto] || ""}
                          onChange={handleChange}
                          className="border-gray-200 focus:border-pba-cyan focus:ring-2 focus:ring-pba-cyan rounded-lg text-sm"
                        />
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
      {/* Información personal */}
      {renderFieldSection(personalFields, "Información Personal", User, 0.1)}

      {/* Información de contacto */}
      {renderFieldSection(contactFields, "Información de Contacto", Phone, 0.2)}

      {/* Información administrativa */}
      {renderFieldSection(adminFields, "Información Administrativa", Building, 0.3)}

      {/* ID del contacto (solo lectura) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="rounded-xl border-gray-200 bg-gray-50">
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-gray-600 font-medium">
                ID de contacto (solo lectura)
              </Label>
              <Input
                id="id"
                name="id"
                value={contacto.id || ""}
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
