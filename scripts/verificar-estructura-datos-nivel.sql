-- Verificar la estructura de la tabla datos_nivel_temp
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'datos_nivel_temp'
ORDER BY ordinal_position;

-- Ver algunos registros de ejemplo
SELECT * FROM datos_nivel_temp LIMIT 10;

-- Verificar si hay datos de matrícula
SELECT 
  COUNT(*) as total_registros,
  COUNT(matricula) as registros_con_matricula,
  SUM(matricula) as matricula_total,
  AVG(matricula) as matricula_promedio,
  MIN(matricula) as matricula_minima,
  MAX(matricula) as matricula_maxima
FROM datos_nivel_temp
WHERE matricula IS NOT NULL;
