import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Calificacion extends Model {
  declare id: number;
  declare alumno_id: number;
  declare materia_id: number;
  declare calificacion: number;
  declare periodo: string;
  declare observaciones: string;
}

Calificacion.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    alumno_id: { type: DataTypes.INTEGER, allowNull: false },
    materia_id: { type: DataTypes.INTEGER, allowNull: false },
    calificacion: { type: DataTypes.DECIMAL(4, 2), allowNull: false },
    periodo: { type: DataTypes.STRING, allowNull: false },
    observaciones: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: 'calificaciones',
    timestamps: true,
    createdAt: 'fecha_registro',
    updatedAt: false,
  }
);