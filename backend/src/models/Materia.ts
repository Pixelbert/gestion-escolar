import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Materia extends Model {
  declare id: number;
  declare nombre: string;
  declare descripcion: string;
  declare maestro_id: number;
}

Materia.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    maestro_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: 'materias',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);