module.exports = (sequelize, Sequelize) => {
  const vehicle_types = sequelize.define(
    'vehicle_types',
    {
      vtid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'vtid' },
      vehicle: { type: Sequelize.STRING(255), allowNull: true, field: 'vehicle'},
    
    },
    { 
      tableName: 'vehicle_types'
    }
  );

  return vehicle_types;
}
 