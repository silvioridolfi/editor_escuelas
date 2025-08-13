-- Script para verificar la estructura de la tabla establecimientos
-- y identificar qué campos contienen información de matrícula

-- Ver la estructura completa de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'establecimientos' 
ORDER BY ordinal_position;

-- Ver algunos registros de ejemplo para identificar campos de matrícula
SELECT *
FROM establecimientos
LIMIT 5;

-- Buscar campos que puedan contener información de matrícula
SELECT column_name
FROM information_schema.columns 
WHERE table_name = 'establecimientos' 
AND (
  column_name ILIKE '%matricula%' OR
  column_name ILIKE '%alumnos%' OR
  column_name ILIKE '%estudiantes%' OR
  column_name ILIKE '%total%'
)
ORDER BY column_name;

-- Ver estadísticas de campos numéricos que podrían ser matrícula
SELECT 
  COUNT(*) as total_registros,
  COUNT(CASE WHEN matricula IS NOT NULL THEN 1 END) as con_matricula,
  SUM(CASE WHEN matricula IS NOT NULL THEN matricula ELSE 0 END) as suma_matricula,
  AVG(CASE WHEN matricula IS NOT NULL THEN matricula ELSE NULL END) as promedio_matricula
FROM establecimientos;
