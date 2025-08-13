"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Search, Grid, List, School, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EscuelaCard from "./escuela-card"
import EscuelaTable from "./escuela-table"
import { buscarEscuelas } from "@/app/actions/escuelas-actions"
import type { Establecimiento } from "@/types/escuelas"

type ViewMode = "cards" | "table"

export default function EscuelasDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [escuelas, setEscuelas] = useState<Establecimiento[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const placeholders = [
    "Buscar por CUE...",
    "Buscar por nombre...",
    "Buscar por localidad...",
    "Ej: 28001234",
    "Ej: Escuela Primaria N°1",
    "Ej: La Plata",
  ]

  // Efecto para animar el placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setHasSearched(true)

    try {
      const resultados = await buscarEscuelas(searchTerm)
      setEscuelas(resultados)
    } catch (error) {
      console.error("Error en la búsqueda:", error)
      setEscuelas([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e as any)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Buscador */}
      <Card className="rounded-2xl shadow-lg border-0 bg-white/98 backdrop-blur-sm border-t-4 border-t-pba-cyan overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <motion.div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Search className="h-5 w-5 text-pba-cyan" />
              </motion.div>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-pba-cyan focus:ring-pba-blue bg-gray-50 focus:bg-white transition-all duration-300"
                placeholder={placeholders[placeholderIndex]}
              />
              {/* Cursor parpadeante en el placeholder */}
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-0.5 h-5 bg-pba-cyan"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={!searchTerm.trim() || isSearching}
                className="bg-pba-cyan hover:bg-pba-blue text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group"
              >
                <AnimatePresence mode="wait">
                  {isSearching ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Buscando...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="search"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      Buscar
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Efecto de brillo en el botón */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>

              {/* Selector de vista */}
              {hasSearched && escuelas.length > 0 && (
                <LayoutGroup>
                  <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
                    <motion.button
                      type="button"
                      onClick={() => setViewMode("cards")}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 relative ${
                        viewMode === "cards" ? "text-pba-cyan" : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {viewMode === "cards" && (
                        <motion.div
                          layoutId="activeView"
                          className="absolute inset-0 bg-white shadow-md rounded-lg"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Grid className="h-4 w-4 relative z-10" />
                      <span className="text-sm font-medium relative z-10">Tarjetas</span>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setViewMode("table")}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 relative ${
                        viewMode === "table" ? "text-pba-cyan" : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      {viewMode === "table" && (
                        <motion.div
                          layoutId="activeView"
                          className="absolute inset-0 bg-white shadow-md rounded-lg"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <List className="h-4 w-4 relative z-10" />
                      <span className="text-sm font-medium relative z-10">Tabla</span>
                    </motion.button>
                  </div>
                </LayoutGroup>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resultados */}
      <AnimatePresence mode="wait">
        {!hasSearched ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <School className="h-24 w-24 text-pba-cyan mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-pba-blue mb-2">Buscar Escuelas</h3>
            <p className="text-gray-600 text-lg">
              Ingresa un CUE, nombre de escuela o localidad para comenzar la búsqueda
            </p>
          </motion.div>
        ) : isSearching ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <Loader2 className="h-12 w-12 text-pba-cyan mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 text-lg">Buscando escuelas...</p>
          </motion.div>
        ) : escuelas.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Search className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 text-lg">
              Intenta con otro término de búsqueda o verifica la información ingresada
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <p className="text-gray-600">
                Se encontraron <span className="font-bold text-pba-blue">{escuelas.length}</span> escuela
                {escuelas.length !== 1 ? "s" : ""}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "cards" ? (
                <motion.div
                  key="cards-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {escuelas.map((escuela, index) => (
                    <motion.div
                      key={escuela.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <EscuelaCard escuela={escuela} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="table-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <EscuelaTable escuelas={escuelas} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
