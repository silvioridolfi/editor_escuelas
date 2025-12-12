-- Vista para clasificación de conectividad
-- Fuente de verdad oficial para métricas de conectividad

CREATE OR REPLACE VIEW vw_conectividad_establecimientos AS
SELECT
  id,
  cue,
  nombre,
  distrito,
  ciudad,
  lat,
  lon,
  nivel,
  modalidad,
  matricula,
  turnos,
  listado_conexion_internet,
  plan_enlace,
  plan_piso_tecnologico,
  CASE
    -- SIN_CONECTIVIDAD: solo si listado_conexion_internet indica explícitamente sin conectividad
    WHEN LOWER(TRIM(COALESCE(listado_conexion_internet, ''))) IN (
      'sin enlace',
      'sin conectividad',
      'sin piso tecnologico',
      'sin piso tecnologico ni enlace'
    ) THEN 'SIN_CONECTIVIDAD'
    
    -- CON_PNCE: tiene programa PNCE en enlace o piso tecnológico
    WHEN (
      plan_enlace ILIKE '%PNCE%' OR
      plan_piso_tecnologico ILIKE '%PNCE%'
    ) THEN 'CON_PNCE'
    
    -- CON_PBA: tiene programa PBA en enlace o piso tecnológico
    WHEN (
      plan_enlace ILIKE '%PBA%' OR
      plan_piso_tecnologico ILIKE '%PBA%'
    ) THEN 'CON_PBA'
    
    -- SIN_DATO: información no determinada
    ELSE 'SIN_DATO'
  END AS categoria_conectividad
FROM establecimientos;

-- Índice para mejorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_establecimientos_conectividad 
ON establecimientos(listado_conexion_internet, plan_enlace, plan_piso_tecnologico);

-- Comentarios para documentación
COMMENT ON VIEW vw_conectividad_establecimientos IS 'Vista que clasifica establecimientos según conectividad real basada en campos oficiales';
