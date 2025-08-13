"use client"

import type React from "react"

import { useState } from "react"
import { Search, Grid3X3, Table } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import EscuelaCard from "@/components/escuela-card"
import EscuelaTable from "@/components/escuela-table"
import EscuelaDetalles from "@/components/escuela-detalles-fixed"
import { buscarEscuelas } from "@/app/actions/escuelas-actions"
import type { Establecimiento } from "@/types/escuelas"

export default function EscuelasDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [resultados, setResultados] = useState<Establecimiento[]>([])
  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState<Establecimiento | null>(null)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsSearching(true)
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

  const handleSelectEscuela = (escuela: Establecimiento) => {
    setEscuelaSeleccionada(escuela)
  }

  const handleCloseDetalles = () => {
    setEscuelaSeleccionada(null)
  }

  const handleEscuelaUpdated = (updatedEscuela: Establecimiento) => {
    // Actualizar la escuela en la lista de resultados
    setResultados((prevResultados) => prevResultados.map((e) => (e.id === updatedEscuela.id ? updatedEscuela : e)))
    setEscuelaSeleccionada(updatedEscuela)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar por nombre, CUE o localidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {resultados.length > 0 && !escuelaSeleccionada && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Resultados ({resultados.length})</h2>

            {/* Selector de vista personalizado */}
            <div className="flex rounded-lg bg-muted p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "cards"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                Tarjetas
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Table className="h-4 w-4" />
                Tabla
              </button>
            </div>
          </div>

          {/* Contenido basado en el modo de vista */}
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resultados.map((escuela) => (
                <EscuelaCard key={escuela.id} escuela={escuela} onSelect={() => handleSelectEscuela(escuela)} />
              ))}
            </div>
          )}

          {viewMode === "table" && <EscuelaTable escuelas={resultados} onSelectEscuela={handleSelectEscuela} />}
        </div>
      )}

      {escuelaSeleccionada && (
        <EscuelaDetalles escuela={escuelaSeleccionada} onClose={handleCloseDetalles} onUpdate={handleEscuelaUpdated} />
      )}

      {resultados.length === 0 && searchTerm && !isSearching && (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No se encontraron escuelas con ese criterio de búsqueda.</p>
        </div>
      )}
    </div>
  )
}
