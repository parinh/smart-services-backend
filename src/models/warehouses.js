module.exports = (sequelize, Sequelize) => {
  const warehouses = sequelize.define(
    'warehouses',
    {

      warehouse_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'warehouse_id' },
      name:{type: Sequelize.STRING(512),allowNull: true,field: 'name' },
      lat:{type: Sequelize.DECIMAL(10,7), allowNull: true, field: 'lat'},
      lng:{type: Sequelize.DECIMAL(10,7), allowNull: true, field: 'lng'},


    },
    {
      tableName: 'warehouses'
    }
  );

  return warehouses;
}
