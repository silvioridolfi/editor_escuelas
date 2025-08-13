"use client"

import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"
import type { Establecimiento } from "@/types/escuelas"

interface EscuelaTableProps {
  escuelas: Establecimiento[]
  onSelectEscuela: (escuela: Establecimiento) => void
}

export default function EscuelaTable({ escuelas, onSelectEscuela }: EscuelaTableProps) {
  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-white backdrop-blur-sm border-t-4 border-t-pba-blue">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-slate-50/50">
                <TableHead className="font-bold text-pba-blue">Nombre</TableHead>
                <TableHead className="font-bold text-pba-blue">CUE</TableHead>
                <TableHead className="font-bold text-pba-blue">Tipo</TableHead>
                <TableHead className="font-bold text-pba-blue">Distrito</TableHead>
                <TableHead className="font-bold text-pba-blue">Ciudad</TableHead>
                <TableHead className="font-bold text-pba-blue">Nivel</TableHead>
                <TableHead className="font-bold text-pba-blue">Modalidad</TableHead>
                <TableHead className="font-bold text-pba-blue">Mat.</TableHead>
                <TableHead className="font-bold text-pba-blue">V.</TableHead>
                <TableHead className="font-bold text-pba-blue">M.</TableHead>
                <TableHead className="font-bold text-pba-blue">Sec.</TableHead>
                <TableHead className="font-bold text-pba-blue">Turnos</TableHead>
                <TableHead className="font-bold text-pba-blue">FED</TableHead>
                <TableHead className="text-right font-bold text-pba-blue">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escuelas.map((escuela, index) => {
                // Usar alias si está disponible, sino el nombre completo
                const nombreMostrar = escuela.alias || escuela.nombre || "Sin nombre"
                const esAlias = !!escuela.alias

                return (
                  <motion.tr
                    key={escuela.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-gray-100 hover:bg-slate-50/60 transition-colors duration-200"
                  >
                    <TableCell className="font-semibold text-pba-blue">
                      <div className="flex flex-col">
                        <span>{nombreMostrar}</span>
                        {esAlias && escuela.nombre && (
                          <span className="text-xs text-gray-500 font-normal">{escuela.nombre}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-pba-cyan font-bold">{escuela.cue || "N/A"}</TableCell>
                    <TableCell className="text-gray-700">
                      {escuela.tipo_establecimiento || escuela.tipo || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-700">{escuela.distrito || "N/A"}</TableCell>
                    <TableCell className="text-gray-700">{escuela.ciudad || "N/A"}</TableCell>
                    <TableCell className="text-gray-700">{escuela.nivel || "N/A"}</TableCell>
                    <TableCell className="text-gray-700">{escuela.modalidad || "N/A"}</TableCell>
                    <TableCell className="text-gray-700 font-semibold">
                      {escuela.matricula?.toString() || "N/A"}
                    </TableCell>
                    <TableCell className="text-blue-600 font-medium">{escuela.varones?.toString() || "N/A"}</TableCell>
                    <TableCell className="text-pink-600 font-medium">{escuela.mujeres?.toString() || "N/A"}</TableCell>
                    <TableCell className="text-gray-700">{escuela.secciones?.toString() || "N/A"}</TableCell>
                    <TableCell className="text-gray-700">{escuela.turnos || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {escuela.fed_a_cargo && (
                          <Badge className="bg-pba-blue/10 text-pba-blue border-pba-blue/20">
                            {escuela.fed_a_cargo}
                          </Badge>
                        )}
                        {esAlias && (
                          <Badge className="bg-pba-cyan/10 text-pba-cyan border-pba-cyan/20 text-xs">Alias</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectEscuela(escuela)}
                        className="text-pba-cyan hover:text-pba-cyan/80 hover:bg-pba-cyan/10 rounded-lg"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Ver detalles
                      </Button>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
