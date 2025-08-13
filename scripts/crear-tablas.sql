-- Habilitar Row Level Security (RLS) si es necesario
-- ALTER TABLE establecimientos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE equipamiento_escolar ENABLE ROW LEVEL SECURITY;

-- Crear tabla de establecimientos si no existe
CREATE TABLE IF NOT EXISTS establecimientos (
  id BIGSERIAL PRIMARY KEY,
  cue VARCHAR(50) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(255),
  localidad VARCHAR(100),
  tipo VARCHAR(100),
  nivel VARCHAR(100),
  predio VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de contactos si no existe
CREATE TABLE IF NOT EXISTS contactos (
  id BIGSERIAL PRIMARY KEY,
  establecimiento_id BIGINT NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  nombre_directivo VARCHAR(255),
  telefono VARCHAR(50),
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(establecimiento_id)
);

-- Crear tabla de equipamiento escolar si no existe
CREATE TABLE IF NOT EXISTS equipamiento_escolar (
  id BIGSERIAL PRIMARY KEY,
  establecimiento_id BIGINT NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
  netbooks INTEGER DEFAULT 0,
  tablets INTEGER DEFAULT 0,
  kits_robotica INTEGER DEFAULT 0,
  impresoras_3d INTEGER DEFAULT 0,
  otros_recursos TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(establecimiento_id)
);

-- Crear índices para mejorar el rendimiento de las búsquedas
CREATE INDEX IF NOT EXISTS idx_establecimientos_nombre ON establecimientos(nombre);
CREATE INDEX IF NOT EXISTS idx_establecimientos_cue ON establecimientos(cue);
CREATE INDEX IF NOT EXISTS idx_establecimientos_localidad ON establecimientos(localidad);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_establecimientos_updated_at BEFORE UPDATE ON establecimientos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contactos_updated_at BEFORE UPDATE ON contactos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipamiento_updated_at BEFORE UPDATE ON equipamiento_escolar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
