"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { School, MapPin, Users } from "lucide-react"
import { obtenerEstadisticasGenerales } from "@/app/actions/estadisticas-actions"

interface EstadisticasGenerales {
  totalEscuelas: number
  totalDistritos: number
  matriculaTotal: number
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            </motion.div>
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
      value: estadisticas.totalEscuelas.toLocaleString(),
      icon: School,
      color: "pba-blue",
      bgColor: "bg-pba-blue",
      textColor: "text-pba-blue",
      gradient: "from-pba-blue to-pba-cyan",
    },
    {
      title: "Distritos",
      value: estadisticas.totalDistritos.toLocaleString(),
      icon: MapPin,
      color: "pba-cyan",
      bgColor: "bg-pba-cyan",
      textColor: "text-pba-cyan",
      gradient: "from-pba-cyan to-green-500",
    },
    {
      title: "Matrícula Total",
      value: estadisticas.matriculaTotal > 0 ? estadisticas.matriculaTotal.toLocaleString() : "Sin datos",
      icon: Users,
      color: "green-600",
      bgColor: "bg-green-600",
      textColor: "text-green-600",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/98 backdrop-blur-sm overflow-hidden group relative">
                {/* Borde izquierdo animado con degradado */}
                <motion.div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${kpi.gradient}`}
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />

                {/* Efecto de brillo en hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${kpi.gradient} opacity-0 group-hover:opacity-5`}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {kpi.title}
                    </CardTitle>
                    <motion.div
                      className={`p-2 rounded-xl ${kpi.bgColor} relative overflow-hidden`}
                      whileHover={{
                        scale: 1.1,
                        boxShadow: `0 0 20px ${kpi.color === "pba-blue" ? "#417099" : kpi.color === "pba-cyan" ? "#00AEC3" : "#16a34a"}40`,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Efecto de pulso en el icono */}
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 1,
                        }}
                      />
                      <Icon className="h-5 w-5 text-white relative z-10" />
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <motion.div
                    className={`text-3xl font-bold ${kpi.textColor} mb-1`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  >
                    {kpi.value}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
