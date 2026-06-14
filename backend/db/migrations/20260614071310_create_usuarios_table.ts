import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary();
    table.string("nombre").notNullable();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.enum("rol", ["maestro", "alumno"]).notNullable(); // Roles exactos solicitados 
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("usuarios");
}