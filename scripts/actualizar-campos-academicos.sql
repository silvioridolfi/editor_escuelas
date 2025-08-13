-- Agregar campos académicos a la tabla establecimientos
ALTER TABLE establecimientos 
ADD COLUMN IF NOT EXISTS nivel VARCHAR(100),
ADD COLUMN IF NOT EXISTS modalidad VARCHAR(100),
ADD COLUMN IF NOT EXISTS matricula INTEGER,
ADD COLUMN IF NOT EXISTS varones INTEGER,
ADD COLUMN IF NOT EXISTS mujeres INTEGER,
ADD COLUMN IF NOT EXISTS secciones INTEGER,
ADD COLUMN IF NOT EXISTS turnos VARCHAR(100);

-- Crear índices para mejorar el rendimiento de las búsquedas
CREATE INDEX IF NOT EXISTS idx_establecimientos_nivel ON establecimientos(nivel);
CREATE INDEX IF NOT EXISTS idx_establecimientos_modalidad ON establecimientos(modalidad);

-- Comentarios para documentar los campos
COMMENT ON COLUMN establecimientos.nivel IS 'Nivel educativo del establecimiento (Inicial, Primario, Secundario, etc.)';
COMMENT ON COLUMN establecimientos.modalidad IS 'Modalidad educativa (Común, Técnica, Artística, etc.)';
COMMENT ON COLUMN establecimientos.matricula IS 'Matrícula total de estudiantes';
COMMENT ON COLUMN establecimientos.varones IS 'Cantidad de estudiantes varones';
COMMENT ON COLUMN establecimientos.mujeres IS 'Cantidad de estudiantes mujeres';
COMMENT ON COLUMN establecimientos.secciones IS 'Cantidad de secciones o divisiones';
COMMENT ON COLUMN establecimientos.turnos IS 'Turnos de funcionamiento (Mañana, Tarde, Vespertino, etc.)';
