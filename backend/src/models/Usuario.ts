import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Usuario extends Model {
  declare id: number;
  declare nombre: string;
  declare email: string;
  declare password_hash: string;
  declare rol: 'maestro' | 'alumno';
}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.ENUM('maestro', 'alumno'), allowNull: false },
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);