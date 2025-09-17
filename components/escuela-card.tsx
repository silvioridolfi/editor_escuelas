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
    <motion.div whileHover={{ y: -5, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white backdrop-blur-sm border-l-4 border-l-pba-cyan group overflow-hidden hover:bg-slate-50/30">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-pba-blue line-clamp-2 group-hover:text-pba-cyan transition-colors duration-200">
                  {nombreMostrar}
                </h3>
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
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 text-pba-blue" />
                <span className="font-medium">{escuela.distrito || "N/A"}</span>
                {escuela.ciudad && escuela.ciudad !== escuela.distrito && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span>{escuela.ciudad}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4 text-pba-blue" />
                <span>{escuela.tipo_establecimiento || escuela.tipo || "N/A"}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {escuela.fed_a_cargo && (
                <Badge className="bg-pba-blue/10 text-pba-blue hover:bg-pba-blue/20 border-pba-blue/20">
                  {escuela.fed_a_cargo}
                </Badge>
              )}
              {escuela.nivel && <Badge className="bg-green-100 text-green-700 border-green-200">{escuela.nivel}</Badge>}
              {escuela.matricula && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  Mat: {escuela.matricula.toString()}
                </Badge>
              )}
              {esAlias && <Badge className="bg-pba-cyan/10 text-pba-cyan border-pba-cyan/20">Alias</Badge>}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            onClick={onSelect}
            className="w-full rounded-xl bg-pba-cyan hover:bg-pba-cyan/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
