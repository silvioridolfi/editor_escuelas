-- Script para verificar y crear la estructura de equipamiento si no existe
DO $$
BEGIN
    -- Verificar si la tabla equipamiento_escolar existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'equipamiento_escolar') THEN
        -- Crear tabla de equipamiento escolar si no existe
        CREATE TABLE equipamiento_escolar (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            establecimiento_id UUID NOT NULL REFERENCES establecimientos(id) ON DELETE CASCADE,
            netbooks INTEGER DEFAULT 0,
            tablets INTEGER DEFAULT 0,
            kits_robotica INTEGER DEFAULT 0,
            impresoras_3d INTEGER DEFAULT 0,
            otros_recursos TEXT,
            programas_entregados TEXT,
            equipamiento_inicial TEXT,
            equipamiento_primario TEXT,
            equipamiento_secundario TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(establecimiento_id)
        );
        
        -- Crear índices
        CREATE INDEX idx_equipamiento_establecimiento_id ON equipamiento_escolar(establecimiento_id);
        CREATE INDEX idx_equipamiento_inicial ON equipamiento_escolar(equipamiento_inicial);
        CREATE INDEX idx_equipamiento_primario ON equipamiento_escolar(equipamiento_primario);
        CREATE INDEX idx_equipamiento_secundario ON equipamiento_escolar(equipamiento_secundario);
        
        RAISE NOTICE 'Tabla equipamiento_escolar creada con todos los campos';
    ELSE
        -- Agregar campos faltantes si la tabla ya existe
        ALTER TABLE equipamiento_escolar 
        ADD COLUMN IF NOT EXISTS equipamiento_inicial TEXT,
        ADD COLUMN IF NOT EXISTS equipamiento_primario TEXT,
        ADD COLUMN IF NOT EXISTS equipamiento_secundario TEXT;
        
        -- Crear índices si no existen
        CREATE INDEX IF NOT EXISTS idx_equipamiento_inicial ON equipamiento_escolar(equipamiento_inicial);
        CREATE INDEX IF NOT EXISTS idx_equipamiento_primario ON equipamiento_escolar(equipamiento_primario);
        CREATE INDEX IF NOT EXISTS idx_equipamiento_secundario ON equipamiento_escolar(equipamiento_secundario);
        
        RAISE NOTICE 'Campos de equipamiento por nivel agregados a tabla existente';
    END IF;
    
    -- Crear función para actualizar updated_at si no existe
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $func$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $func$ language 'plpgsql';
    
    -- Crear trigger si no existe
    DROP TRIGGER IF EXISTS update_equipamiento_updated_at ON equipamiento_escolar;
    CREATE TRIGGER update_equipamiento_updated_at 
        BEFORE UPDATE ON equipamiento_escolar 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        
    -- Comentarios para documentar los campos
    COMMENT ON COLUMN equipamiento_escolar.equipamiento_inicial IS 'Equipamiento específico para Nivel Inicial almacenado como JSON string';
    COMMENT ON COLUMN equipamiento_escolar.equipamiento_primario IS 'Equipamiento específico para Nivel Primario almacenado como JSON string';
    COMMENT ON COLUMN equipamiento_escolar.equipamiento_secundario IS 'Equipamiento específico para Nivel Secundario almacenado como JSON string';
    
END $$;
