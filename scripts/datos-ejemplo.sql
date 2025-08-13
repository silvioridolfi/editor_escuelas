-- Insertar datos de ejemplo en la tabla establecimientos
INSERT INTO establecimientos (cue, nombre, direccion, localidad, tipo, nivel, predio)
VALUES 
  ('060123400', 'Escuela Primaria N° 1', 'Av. San Martín 123', 'La Plata', 'Pública', 'Primario', 'Propio'),
  ('060123500', 'Escuela Secundaria N° 2', 'Calle 7 n° 456', 'La Plata', 'Pública', 'Secundario', 'Compartido'),
  ('060123600', 'Instituto Técnico N° 3', 'Calle 13 n° 789', 'La Plata', 'Pública', 'Técnico', 'Propio'),
  ('060123700', 'Jardín de Infantes N° 901', 'Calle 54 n° 234', 'La Plata', 'Pública', 'Inicial', 'Propio'),
  ('060123800', 'Escuela Primaria N° 5', 'Av. 44 n° 567', 'Berisso', 'Pública', 'Primario', 'Alquilado'),
  ('060123900', 'Escuela Secundaria N° 6', 'Calle 25 n° 890', 'Ensenada', 'Pública', 'Secundario', 'Propio')
ON CONFLICT (id) DO NOTHING;

-- Insertar datos de ejemplo en la tabla contactos
INSERT INTO contactos (establecimiento_id, nombre_directivo, telefono, email)
VALUES 
  (1, 'María López', '221-4567890', 'mlopez@escuela1.edu.ar'),
  (2, 'Carlos Gómez', '221-5678901', 'cgomez@escuela2.edu.ar'),
  (3, 'Laura Martínez', '221-6789012', 'lmartinez@instituto3.edu.ar')
ON CONFLICT (establecimiento_id) DO NOTHING;

-- Insertar datos de ejemplo en la tabla equipamiento_escolar
INSERT INTO equipamiento_escolar (establecimiento_id, netbooks, tablets, kits_robotica, impresoras_3d, otros_recursos)
VALUES 
  (1, 30, 15, 5, 1, 'Proyector, pantalla interactiva'),
  (2, 45, 0, 2, 2, 'Laboratorio de informática con 20 PC'),
  (3, 60, 20, 10, 3, 'Taller de electrónica, equipamiento CNC')
ON CONFLICT (establecimiento_id) DO NOTHING;
