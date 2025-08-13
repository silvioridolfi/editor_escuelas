"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import DashboardKPIs from "@/components/dashboard-kpis"
import EscuelasDashboard from "@/components/escuelas-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, MapPin } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f6fa]">
      <div className="container mx-auto py-8 px-4">
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="p-3 bg-pba-blue rounded-2xl shadow-lg relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(65, 112, 153, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Efecto de brillo en hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <GraduationCap className="h-10 w-10 text-white relative z-10" />
            </motion.div>
            <div>
              <motion.h1
                className="text-4xl font-bold text-pba-blue mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Dashboard de Escuelas
              </motion.h1>
              <motion.div
                className="flex items-center gap-2 text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MapPin className="h-4 w-4" />
                <span className="text-lg">Provincia de Buenos Aires</span>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="h-1 bg-gradient-to-r from-pba-cyan to-pba-blue rounded-full relative overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {/* Efecto de brillo animado en la línea */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.header>

        {/* KPIs Dashboard */}
        <Suspense fallback={<KPISkeleton />}>
          <DashboardKPIs />
        </Suspense>

        {/* Buscador y Resultados */}
        <Suspense fallback={<DashboardSkeleton />}>
          <EscuelasDashboard />
        </Suspense>
      </div>
    </div>
  )
}

function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Skeleton className="h-32 rounded-2xl" />
          </motion.div>
        ))}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Skeleton className="h-56 rounded-2xl" />
            </motion.div>
          ))}
      </div>
    </div>
  )
}
