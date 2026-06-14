import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("calificaciones", (table) => {
    table.increments("id").primary();
    table.integer("alumno_id").unsigned().notNullable()
         .references("id").inTable("usuarios").onDelete("CASCADE");
    table.integer("materia_id").unsigned().notNullable()
         .references("id").inTable("materias").onDelete("CASCADE");
    table.decimal("calificacion", 4, 2).notNullable();
    table.string("periodo").notNullable();
    table.text("observaciones");
    table.timestamp("fecha_registro").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("calificaciones");
}