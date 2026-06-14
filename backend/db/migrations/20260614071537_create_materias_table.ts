import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("materias", (table) => {
    table.increments("id").primary();
    table.string("nombre").notNullable();
    table.text("descripcion");
    table.integer("maestro_id").unsigned().notNullable()
         .references("id").inTable("usuarios").onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("materias");
}