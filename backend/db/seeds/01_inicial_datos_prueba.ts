import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
    await knex("calificaciones").del();
    await knex("inscripciones").del();
    await knex("materias").del();
    await knex("usuarios").del();

    const password_hash = bcrypt.hashSync("123456", 10);

    // 2. Insertar Usuarios (Forzamos los IDs para poder relacionarlos fácilmente)
    await knex("usuarios").insert([
        // Maestros
        { id: 1, nombre: "Maestro Alan Turing", email: "alan@ua.edu", password_hash, rol: "maestro" },
        { id: 2, nombre: "Maestra Ada Lovelace", email: "ada@ua.edu", password_hash, rol: "maestro" },
        // Alumnos
        { id: 3, nombre: "Alberto Carlos Manjarrez Alcaraz", email: "alberto@ua.edu", password_hash, rol: "alumno" },
        { id: 4, nombre: "Ingrid Cosio Tello", email: "ingrid@ua.edu", password_hash, rol: "alumno" },
        { id: 5, nombre: "Jesús Iván Villalba González", email: "jesus@ua.edu", password_hash, rol: "alumno" },
        { id: 6, nombre: "María García", email: "maria@ua.edu", password_hash, rol: "alumno" }
    ]);

    // 3. Insertar Materias
    await knex("materias").insert([
        { id: 1, nombre: "Ingeniería de Software", descripcion: "Metodologías y arquitectura", maestro_id: 1 },
        { id: 2, nombre: "Estructura de Datos", descripcion: "Algoritmos y eficiencia", maestro_id: 2 },
        { id: 3, nombre: "Desarrollo Web", descripcion: "Frontend y Backend", maestro_id: 1 }
    ]);

    // 4. Insertar Inscripciones (Asignar alumnos a las materias)
    await knex("inscripciones").insert([
        { alumno_id: 3, materia_id: 1 }, { alumno_id: 3, materia_id: 2 },
        { alumno_id: 4, materia_id: 1 }, { alumno_id: 4, materia_id: 3 },
        { alumno_id: 5, materia_id: 2 }, { alumno_id: 5, materia_id: 3 },
        { alumno_id: 6, materia_id: 1 }, { alumno_id: 6, materia_id: 2 }, { alumno_id: 6, materia_id: 3 }
    ]);

    // 5. Insertar Calificaciones de muestra
    await knex("calificaciones").insert([
        { alumno_id: 3, materia_id: 1, calificacion: 9.8, periodo: "primer parcial", observaciones: "Excelente desempeño" },
        { alumno_id: 3, materia_id: 2, calificacion: 9.8, periodo: "primer parcial", observaciones: "Buen dominio" },
        { alumno_id: 4, materia_id: 1, calificacion: 9.0, periodo: "primer parcial", observaciones: "Buen trabajo en equipo" },
        { alumno_id: 5, materia_id: 2, calificacion: 8.5, periodo: "primer parcial", observaciones: "Mejorar tiempos de entrega" }
    ]);

    // Opcional en PostgreSQL: Sincronizar las secuencias de IDs para evitar errores al crear nuevos registros después
    await knex.raw(`SELECT setval('usuarios_id_seq', (SELECT MAX(id) FROM usuarios))`);
    await knex.raw(`SELECT setval('materias_id_seq', (SELECT MAX(id) FROM materias))`);
}