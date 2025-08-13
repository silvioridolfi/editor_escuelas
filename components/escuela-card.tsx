"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, Eye, Hash } from "lucide-react"
import type { Establecimiento } from "@/types/escuelas"

interface EscuelaCardProps {
  escuela: Establecimiento
  onSelect: () => void
}

export default function EscuelaCard({ escuela, onSelect }: EscuelaCardProps) {
  // Usar alias si está disponible, sino el nombre completo
  const nombreMostrar = escuela.alias || escuela.nombre || "Sin nombre"
  const esAlias = !!escuela.alias

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white backdrop-blur-sm border-l-4 border-l-pba-cyan group overflow-hidden hover:bg-slate-50/30 relative">
        {/* Efecto de brillo en el borde izquierdo */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pba-cyan via-pba-blue to-pba-cyan opacity-0 group-hover:opacity-100"
          initial={{ height: 0 }}
          whileHover={{ height: "100%" }}
          transition={{ duration: 0.3 }}
        />

        {/* Efecto de brillo general en hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pba-cyan/5 to-pba-blue/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />

        {/* Patrón geométrico sutil */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23417099' fillOpacity='0.1'%3E%3Cpolygon points='10,0 20,10 10,20 0,10'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.h3
                  className="font-bold text-xl text-pba-blue line-clamp-2 group-hover:text-pba-cyan transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  {nombreMostrar}
                </motion.h3>
                {esAlias && escuela.nombre && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{escuela.nombre}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Hash className="h-4 w-4 text-pba-cyan" />
                  <span className="text-sm font-semibold text-pba-cyan">CUE:</span>
                  <span className="text-sm font-medium text-gray-700">{escuela.cue || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <motion.div
                className="flex items-center gap-2 text-gray-600"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="h-4 w-4 text-pba-blue" />
                <span className="font-medium">{escuela.distrito || "N/A"}</span>
                {escuela.ciudad && escuela.ciudad !== escuela.distrito && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span>{escuela.ciudad}</span>
                  </>
                )}
              </motion.div>

              <motion.div
                className="flex items-center gap-2 text-gray-600"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <Building className="h-4 w-4 text-pba-blue" />
                <span>{escuela.tipo_establecimiento || escuela.tipo || "N/A"}</span>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2">
              {escuela.fed_a_cargo && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge className="bg-pba-blue/10 text-pba-blue hover:bg-pba-blue/20 border-pba-blue/20 border-opacity-30">
                    {escuela.fed_a_cargo}
                  </Badge>
                </motion.div>
              )}
              {escuela.nivel && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge className="bg-green-100 text-green-700 border-green-200 border-opacity-30">
                    {escuela.nivel}
                  </Badge>
                </motion.div>
              )}
              {escuela.matricula && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 border-opacity-30">
                    Mat: {escuela.matricula.toString()}
                  </Badge>
                </motion.div>
              )}
              {esAlias && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge className="bg-pba-cyan/10 text-pba-cyan border-pba-cyan/20 border-opacity-30">Alias</Badge>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 relative z-10">
          <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onSelect}
              className="w-full rounded-xl bg-pba-cyan hover:bg-pba-cyan/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden group"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
              {/* Efecto de brillo en hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
