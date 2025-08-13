# Dashboard de Escuelas - Provincia de Buenos Aires

Dashboard moderno para gestionar establecimientos educativos siguiendo el manual de marca institucional de la Provincia de Buenos Aires.

## 🎨 Diseño y Estética

### Paleta de Colores Institucional PBA
- **Azul institucional**: `#417099` - Encabezados, textos destacados, bordes
- **Cian institucional**: `#00AEC3` - Botones principales, links, elementos interactivos  
- **Rosa institucional**: `#e81f76` - Botones de advertencia, mensajes de error

### Características de Diseño
- **Tipografía**: Encode Sans (Google Fonts)
- **Bordes**: Redondeados (`rounded-2xl`)
- **Sombras**: Suaves y elegantes
- **Animaciones**: Framer Motion para transiciones fluidas
- **Responsive**: Optimizado para netbooks y móviles

## 🚀 Funcionalidades

### 1. Buscador Manual
- Filtrado por CUE, nombre o localidad
- Activación solo con Enter o botón "Buscar"
- Búsqueda inteligente (detecta números para CUE)

### 2. Visualización de Resultados
- **Vista de tarjetas**: Diseño moderno con información clave
- **Vista de tabla**: Formato compacto para más datos
- Información: CUE, nombre, distrito, ciudad, tipo, FED

### 3. Panel de Detalles Editable
- **Datos generales**: Información del establecimiento
- **Contacto institucional**: Directivos y referentes
- **Equipamiento**: Tecnología disponible
- Navegación por pestañas con iconos

### 4. Eliminación Segura
- Botón en zona de peligro
- Modal de confirmación detallado
- Eliminación en cascada automática

## 🛠️ Configuración

### Variables de Entorno
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
\`\`\`

### Base de Datos
1. Ejecutar `scripts/crear-tabla-equipamiento.sql` en Supabase
2. Configurar las tablas `establecimientos` y `contactos`
3. Verificar las relaciones entre tablas

## 📱 Experiencia de Usuario

- **Animaciones fluidas** con Framer Motion
- **Feedback visual** inmediato
- **Estados de carga** informativos
- **Confirmaciones** para acciones importantes
- **Diseño responsive** para todos los dispositivos

## 🔧 Tecnologías

- Next.js 14 con App Router
- Supabase como base de datos
- shadcn/ui para componentes
- Tailwind CSS con colores personalizados PBA
- Framer Motion para animaciones
- TypeScript para tipado seguro

## 🎯 Uso

1. **Buscar**: Ingresa CUE, nombre o localidad y presiona Enter
2. **Explorar**: Cambia entre vista de tarjetas y tabla
3. **Editar**: Haz clic en "Ver detalles" para editar información
4. **Guardar**: Usa "Guardar cambios" para persistir modificaciones
5. **Eliminar**: Usa la zona de peligro con confirmación

El dashboard está optimizado para administradores educativos y sigue las mejores prácticas de UX/UI institucional.
