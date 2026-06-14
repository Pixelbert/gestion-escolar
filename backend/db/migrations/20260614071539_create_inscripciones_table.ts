import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("inscripciones", (table) => {
    table.increments("id").primary();
    table.integer("alumno_id").unsigned().notNullable()
         .references("id").inTable("usuarios").onDelete("CASCADE");
    table.integer("materia_id").unsigned().notNullable()
         .references("id").inTable("materias").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("inscripciones");
}