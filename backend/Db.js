import config from './config.js';
import { Model, DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize(config.db.DB_NAME, config.db.USERNAME, config.db.PASSWORD, {
    dialect: 'postgres',
    host: config.db.HOST,
    port: config.db.PORT,
  });

const User = sequelize.define('users', {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
}, { timestamps: false});


const Post = sequelize.define('posts', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        foreignKey: true
    }
}, {timestamps: false});
User.hasMany(Post, { foreignKey: 'user_id' });
Post.belongsTo(User, {foreignKey: 'user_id'}); // связь между моделями Post и User
  
await sequelize.sync();
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}

export { sequelize, User, Post };