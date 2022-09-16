module.exports = (sequelize, Sequelize) => {
  const order_types = sequelize.define(
    'order_types',
    {

      order_type_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'order_type_id' },
      type_th:{type: Sequelize.STRING(255),allowNull: true,field: 'type_th' },
      type_en:{type: Sequelize.STRING(255), allowNull: true, field: 'type_en'},


    },
    {
      tableName: 'order_types'
    }
  );

  return order_types;
}
