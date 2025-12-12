"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Grid3X3, Table, School, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EscuelaCard from "@/components/escuela-card"
import EscuelaTable from "@/components/escuela-table"
import EscuelaDetalles from "@/components/escuela-detalles"
import NuevoEstablecimientoForm from "@/components/nuevo-establecimiento-form"
import { buscarEscuelas } from "@/app/actions/escuelas"
import type { EstablecimientoConectividad } from "@/types/escuelas"

export default function EscuelasDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [resultados, setResultados] = useState<EstablecimientoConectividad[]>([])
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<EstablecimientoConectividad | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [hasSearched, setHasSearched] = useState(false)
  const [mostrarNuevoForm, setMostrarNuevoForm] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setHasSearched(true)
    try {
      const results = await buscarEscuelas(searchTerm)
      setResultados(results)
      setEscuelaSeleccionada(null)
    } catch (error) {
      console.error("Error al buscar escuelas:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleSelectEscuela = (escuela: EstablecimientoConectividad) => {
    setEscuelaSeleccionada(escuela)
  }

  const handleCloseDetalles = () => {
    setEscuelaSeleccionada(null)
  }

  const handleEscuelaDeleted = (deletedId: string) => {
    setResultados((prevResultados) => prevResultados.filter((e) => e.id !== deletedId))
    setEscuelaSeleccionada(null)
  }

  const handleEscuelaUpdated = (updatedEstablecimiento: any) => {
    setResultados((prevResultados) =>
      prevResultados.map((e) =>
        e.id === updatedEstablecimiento.id
          ? {
              ...e,
              ...updatedEstablecimiento,
              categoria_conectividad: e.categoria_conectividad,
            }
          : e,
      ),
    )

    if (escuelaSeleccionada && escuelaSeleccionada.id === updatedEstablecimiento.id) {
      setEscuelaSeleccionada({
        ...escuelaSeleccionada,
        ...updatedEstablecimiento,
        categoria_conectividad: escuelaSeleccionada.categoria_conectividad,
      })
    }
  }

  const handleNuevoEstablecimientoCreado = async () => {
    setMostrarNuevoForm(false)
    // Refrescar búsqueda si hay un término activo
    if (searchTerm.trim()) {
      await handleSearch()
    }
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-pba-blue mb-2">Buscar Establecimientos</h2>
            <p className="text-gray-600">Encuentra escuelas por CUE, nombre o localidad</p>
          </div>
          <Button
            onClick={() => setMostrarNuevoForm(true)}
            className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Establecimiento
          </Button>
        </div>
      </motion.div>

      {mostrarNuevoForm && (
        <NuevoEstablecimientoForm
          onClose={() => setMostrarNuevoForm(false)}
          onCreated={handleNuevoEstablecimientoCreado}
        />
      )}

      {/* Buscador */}
      {!mostrarNuevoForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="rounded-2xl shadow-lg border-0 bg-white backdrop-blur-sm border-t-4 border-t-pba-cyan">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Buscar por CUE, nombre o localidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-12 h-14 rounded-xl bg-gray-100 focus:bg-white transition-colors duration-200 border-gray-200 focus:border-pba-cyan focus:ring-2 focus:ring-pba-cyan text-lg"
                  />
                  <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="h-14 px-8 rounded-xl bg-pba-cyan hover:bg-pba-cyan/90 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Resultados */}
      {!mostrarNuevoForm && (
        <AnimatePresence mode="wait">
          {resultados.length > 0 && !escuelaSeleccionada && (
            <motion.div
              key="resultados"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-pba-blue mb-2">Resultados</h3>
                  <p className="text-gray-600 text-lg">{resultados.length} escuelas encontradas</p>
                </div>

                {/* Selector de vista */}
                <div className="flex rounded-xl bg-gray-100 p-1 shadow-inner">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      viewMode === "cards" ? "bg-white text-pba-cyan shadow-md" : "text-gray-600 hover:text-pba-blue"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    Tarjetas
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      viewMode === "table" ? "bg-white text-pba-cyan shadow-md" : "text-gray-600 hover:text-pba-blue"
                    }`}
                  >
                    <Table className="h-4 w-4" />
                    Tabla
                  </button>
                </div>
              </div>

              {/* Contenido basado en el modo de vista */}
              <AnimatePresence mode="wait">
                {viewMode === "cards" && (
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {resultados.map((escuela, index) => (
                      <motion.div
                        key={escuela.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <EscuelaCard escuela={escuela} onSelect={() => handleSelectEscuela(escuela)} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {viewMode === "table" && (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EscuelaTable escuelas={resultados} onSelectEscuela={handleSelectEscuela} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Panel de detalles */}
          {escuelaSeleccionada && (
            <motion.div
              key="detalles"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <EscuelaDetalles
                escuela={escuelaSeleccionada}
                onClose={handleCloseDetalles}
                onUpdate={handleEscuelaUpdated}
                onDelete={handleEscuelaDeleted}
              />
            </motion.div>
          )}

          {/* Estado vacío */}
          {resultados.length === 0 && hasSearched && !isSearching && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="rounded-2xl shadow-lg border-0 bg-white backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <motion.div
                    className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                  >
                    <School className="h-12 w-12 text-gray-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-pba-blue mb-3">No se encontraron escuelas</h3>
                  <p className="text-gray-600 text-lg">Intenta con otro término de búsqueda</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Estado inicial - sin búsqueda */}
          {!hasSearched && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="rounded-2xl shadow-lg border-0 bg-white backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <motion.div
                    className="mx-auto w-24 h-24 bg-pba-blue/10 rounded-full flex items-center justify-center mb-6"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Search className="h-12 w-12 text-pba-blue" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-pba-blue mb-3">Busca establecimientos educativos</h3>
                  <p className="text-gray-600 text-lg">Ingresa un CUE, nombre de escuela o localidad para comenzar</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
