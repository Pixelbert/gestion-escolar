# Backend - Sistema de Gestión Escolar

API RESTful construida con Node.js, Express, TypeScript y PostgreSQL. Utiliza Knex para el manejo de migraciones y seeders, y Sequelize como ORM para la lógica de negocio.

## Requisitos Previos
- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)

## Instalación y Configuración

1. **Instalar dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Variables de Entorno:**
   Crea un archivo llamado `.env` en la raíz del proyecto basándote en el archivo `.env.example`.

3. **Base de Datos:**
   Crea una base de datos vacía en PostgreSQL que coincida con el nombre especificado en tu archivo `.env`.

4. **Ejecutar Migraciones:**
   Construye la estructura de tablas relacionales:
   \`\`\`bash
   npx knex migrate:latest
   \`\`\`

5. **Inyectar Datos de Prueba (Seeders):**
   Genera los usuarios, materias y calificaciones iniciales requeridas:
   \`\`\`bash
   npx knex seed:run
   \`\`\`

## Ejecución del Servidor

Para iniciar el servidor en modo de desarrollo (con recarga automática):
\`\`\`bash
npm run dev
\`\`\`
El servidor estará escuchando en `http://localhost:3000`.

## Cuentas de Prueba
El sistema incluye cuentas preconfiguradas con la contraseña \`123456\`:
- **Maestro:** alan@ua.edu
- **Alumno:** alberto@ua.edu