module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    action: {
      type: DataTypes.ENUM('LOGIN', 'DELETE'),
      allowNull: false
    }
  }, {
    updatedAt: false
  });

  return AuditLog;
};