-- Crear tabla de programas por CUE
CREATE TABLE IF NOT EXISTS programas_x_cue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cue INTEGER NOT NULL,
  programa TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Crear índice compuesto para evitar duplicados
  UNIQUE(cue, programa)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_programas_cue ON programas_x_cue(cue);
CREATE INDEX IF NOT EXISTS idx_programas_programa ON programas_x_cue(programa);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_programas_updated_at 
    BEFORE UPDATE ON programas_x_cue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentar la tabla
COMMENT ON TABLE programas_x_cue IS 'Tabla que almacena los programas educativos recibidos por cada establecimiento';
COMMENT ON COLUMN programas_x_cue.cue IS 'Código Único de Establecimiento (referencia a establecimientos.cue)';
COMMENT ON COLUMN programas_x_cue.programa IS 'Nombre del programa educativo recibido';

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO programas_x_cue (cue, programa) VALUES 
  (060123400, 'Primaria Digital'),
  (060123400, 'Programa de Alfabetización Digital (PAD)'),
  (060123500, 'Conectar Igualdad'),
  (060123500, 'Juana Manso'),
  (060123700, 'Aprender Conectados – Nivel Inicial')
ON CONFLICT (cue, programa) DO NOTHING;
