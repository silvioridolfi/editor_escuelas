-- Agregar campo alias a la tabla establecimientos
ALTER TABLE establecimientos 
ADD COLUMN IF NOT EXISTS alias VARCHAR(100);

-- Agregar campo programas_entregados a la tabla equipamiento_escolar
-- Usamos TEXT para almacenar los programas como JSON string
ALTER TABLE equipamiento_escolar 
ADD COLUMN IF NOT EXISTS programas_entregados TEXT;

-- Crear índice para búsquedas por alias
CREATE INDEX IF NOT EXISTS idx_establecimientos_alias ON establecimientos(alias);

-- Comentarios para documentar los campos
COMMENT ON COLUMN establecimientos.alias IS 'Nombre corto o alias del establecimiento (ej: EP 12, JI 922, EES 3)';
COMMENT ON COLUMN equipamiento_escolar.programas_entregados IS 'Programas educativos entregados según nivel, almacenado como JSON string';
