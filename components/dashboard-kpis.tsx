"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { School, MapPin, Users, Wifi, WifiOff, HelpCircle } from "lucide-react"
import {
  obtenerEstadisticasConectividad,
  obtenerTotalDistritos,
  obtenerMatriculaTotal,
} from "@/app/actions/estadisticas"
import type { EstadisticasConectividad } from "@/types/escuelas"

export default function DashboardKPIs() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasConectividad | null>(null)
  const [totalDistritos, setTotalDistritos] = useState<number>(0)
  const [matriculaTotal, setMatriculaTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [stats, distritos, matricula] = await Promise.all([
          obtenerEstadisticasConectividad(),
          obtenerTotalDistritos(),
          obtenerMatriculaTotal(),
        ])
        setEstadisticas(stats)
        setTotalDistritos(distritos)
        setMatriculaTotal(matricula)
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    cargarEstadisticas()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (!estadisticas) {
    return null
  }

  const kpiCards = [
    {
      title: "Total de Establecimientos",
      value: estadisticas.total_establecimientos.toLocaleString(),
      icon: School,
      bgColor: "bg-pba-blue",
      textColor: "text-pba-blue",
    },
    {
      title: "Total de Distritos",
      value: totalDistritos.toLocaleString(),
      icon: MapPin,
      bgColor: "bg-pba-cyan",
      textColor: "text-pba-cyan",
    },
    {
      title: "Matrícula Total",
      value: matriculaTotal.toLocaleString(),
      icon: Users,
      bgColor: "bg-green-600",
      textColor: "text-green-600",
    },
  ]

  const conectividadCards = [
    {
      title: "Conectividad PBA",
      value: estadisticas.con_pba.toLocaleString(),
      icon: Wifi,
      bgColor: "bg-blue-600",
      textColor: "text-blue-600",
      description: "Con programa PBA",
    },
    {
      title: "Conectividad PNCE",
      value: estadisticas.con_pnce.toLocaleString(),
      icon: Wifi,
      bgColor: "bg-purple-600",
      textColor: "text-purple-600",
      description: "Con programa PNCE",
    },
    {
      title: "Sin Conectividad",
      value: estadisticas.sin_conectividad.toLocaleString(),
      icon: WifiOff,
      bgColor: "bg-pba-pink",
      textColor: "text-pba-pink",
      description: "Sin conectividad confirmada",
    },
    {
      title: "Sin Dato",
      value: estadisticas.sin_dato.toLocaleString(),
      icon: HelpCircle,
      bgColor: "bg-gray-500",
      textColor: "text-gray-500",
      description: "Información no determinada",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 mb-8"
    >
      {/* KPIs Principales */}
      <div>
        <h3 className="text-xl font-bold text-pba-blue mb-4">Métricas Principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/98 backdrop-blur-sm overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {kpi.title}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-xl ${kpi.bgColor} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className={`text-3xl font-bold ${kpi.textColor}`}>{kpi.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* KPIs de Conectividad */}
      <div>
        <h3 className="text-xl font-bold text-pba-blue mb-4">Estado de Conectividad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conectividadCards.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/98 backdrop-blur-sm overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {kpi.title}
                      </CardTitle>
                      <div
                        className={`p-2 rounded-xl ${kpi.bgColor} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className={`text-3xl font-bold ${kpi.textColor} mb-1`}>{kpi.value}</div>
                    <p className="text-xs text-gray-500">{kpi.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
