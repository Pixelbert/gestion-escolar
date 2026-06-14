import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Inscripcion extends Model {
  declare id: number;
  declare alumno_id: number;
  declare materia_id: number;
}

Inscripcion.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    alumno_id: { type: DataTypes.INTEGER, allowNull: false },
    materia_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: 'inscripciones',
    timestamps: false, // Esta tabla no tiene created_at
  }
);