module.exports = (sequelize, Sequelize) => {
  const customer_groups = sequelize.define(
    'customer_groups',
    {

      cus_group_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'cus_group_id' },
      cus_group_name:{type: Sequelize.STRING(255),foreignKey:true, allowNull: true, field: 'cus_group_name' },

    },
    {
      tableName: 'customer_groups'
    }
  );

  return customer_groups;
}
