"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { School, Laptop, Tablet, Bot, Wifi, WifiOff } from "lucide-react"
import { obtenerEstadisticasGenerales } from "@/app/actions/estadisticas-actions"

interface EstadisticasGenerales {
  totalEscuelas: number
  totalNetbooks: number
  totalTablets: number
  totalKitsRobotica: number
  escuelasSinConectividad: number
  porcentajeSinConectividad: number
}

export default function DashboardKPIs() {
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const stats = await obtenerEstadisticasGenerales()
        setEstadisticas(stats)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array(4)
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
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm border-l-4 border-l-pba-pink">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const kpiCards = [
    {
      title: "Total de Escuelas",
      value: estadisticas.totalEscuelas.toString(),
      icon: School,
      color: "pba-blue",
      bgColor: "bg-pba-blue",
      textColor: "text-pba-blue",
    },
    {
      title: "Netbooks",
      value: estadisticas.totalNetbooks.toString(),
      icon: Laptop,
      color: "pba-cyan",
      bgColor: "bg-pba-cyan",
      textColor: "text-pba-cyan",
    },
    {
      title: "Tablets",
      value: estadisticas.totalTablets.toString(),
      icon: Tablet,
      color: "green-600",
      bgColor: "bg-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Kits de Robótica",
      value: estadisticas.totalKitsRobotica.toString(),
      icon: Bot,
      color: "purple-600",
      bgColor: "bg-purple-600",
      textColor: "text-purple-600",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/98 backdrop-blur-sm border-l-4 border-l-current overflow-hidden group">
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
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Tarjeta de conectividad si hay datos */}
      {estadisticas.totalEscuelas > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -5, scale: 1.01 }}
        >
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/98 backdrop-blur-sm border-l-4 border-l-pba-pink">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-pba-blue">Estado de Conectividad</CardTitle>
                <div className="flex gap-2">
                  <div className="p-2 rounded-xl bg-green-500">
                    <Wifi className="h-5 w-5 text-white" />
                  </div>
                  <div className="p-2 rounded-xl bg-pba-pink">
                    <WifiOff className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {(estadisticas.totalEscuelas - estadisticas.escuelasSinConectividad).toString()}
                  </div>
                  <p className="text-sm text-gray-600">Escuelas con conectividad</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pba-pink mb-1">
                    {estadisticas.escuelasSinConectividad.toString()}
                  </div>
                  <p className="text-sm text-gray-600">
                    Sin conectividad ({estadisticas.porcentajeSinConectividad.toFixed(1)}%)
                  </p>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-pba-cyan h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${100 - estadisticas.porcentajeSinConectividad}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
