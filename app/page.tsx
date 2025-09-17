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
              className="p-3 bg-pba-blue rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GraduationCap className="h-10 w-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-pba-blue mb-1">Dashboard de Escuelas</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-lg">Provincia de Buenos Aires</span>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-pba-cyan to-pba-blue rounded-full"></div>
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
          <Skeleton key={i} className="h-32 rounded-2xl" />
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
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
      </div>
    </div>
  )
}
