-- Crear tabla de equipamiento escolar si no existe
CREATE TABLE IF NOT EXISTS equipamiento_escolar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  establecimiento_id UUID NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  netbooks INTEGER DEFAULT 0,
  tablets INTEGER DEFAULT 0,
  kits_robotica INTEGER DEFAULT 0,
  impresoras_3d INTEGER DEFAULT 0,
  otros_recursos TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(establecimiento_id)
);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_equipamiento_establecimiento_id ON equipamiento_escolar(establecimiento_id);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_equipamiento_updated_at 
    BEFORE UPDATE ON equipamiento_escolar 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
