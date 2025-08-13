-- Agregar campos de equipamiento específico por nivel a la tabla equipamiento_escolar
ALTER TABLE equipamiento_escolar 
ADD COLUMN IF NOT EXISTS equipamiento_inicial TEXT,
ADD COLUMN IF NOT EXISTS equipamiento_primario TEXT,
ADD COLUMN IF NOT EXISTS equipamiento_secundario TEXT;

-- Crear índices para mejorar el rendimiento (usando TEXT en lugar de JSONB para compatibilidad)
CREATE INDEX IF NOT EXISTS idx_equipamiento_inicial ON equipamiento_escolar(equipamiento_inicial);
CREATE INDEX IF NOT EXISTS idx_equipamiento_primario ON equipamiento_escolar(equipamiento_primario);
CREATE INDEX IF NOT EXISTS idx_equipamiento_secundario ON equipamiento_escolar(equipamiento_secundario);

-- Comentarios para documentar los campos
COMMENT ON COLUMN equipamiento_escolar.equipamiento_inicial IS 'Equipamiento específico para Nivel Inicial (tablets, robotitas, etc.) almacenado como JSON string';
COMMENT ON COLUMN equipamiento_escolar.equipamiento_primario IS 'Equipamiento específico para Nivel Primario (ADM, netbooks, etc.) almacenado como JSON string';
COMMENT ON COLUMN equipamiento_escolar.equipamiento_secundario IS 'Equipamiento específico para Nivel Secundario (netbooks, impresoras 3D, etc.) almacenado como JSON string';

-- Ejemplo de estructura JSON para cada nivel:
-- equipamiento_inicial: '{"tablets": 5, "notebook_docente": 1, "robotitas": 2, "tarjetas_didacticas": 10, "parlante_bluetooth": 1, "disco_externo": 1, "proyector": 1, "pdi": 1, "ecap_servidor": 1, "carro_carga": 1}'
-- equipamiento_primario: '{"adm_aulas_digitales": 2, "netbooks": 30, "kits_robotica": 5, "pdi": 1, "tablets": 10}'
-- equipamiento_secundario: '{"netbooks": 50, "kits_robotica": 8, "impresora_3d": 2, "adm_aulas_digitales": 1}'
