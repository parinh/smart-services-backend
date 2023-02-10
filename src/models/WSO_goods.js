module.exports = (sequelize, Sequelize) => {
  const WSO_goods = sequelize.define(
    'WSO_goods',
    {
      wgid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'wgid' },
      wlid: { type: Sequelize.INTEGER(11), foreignKey: true, field: 'wlid' },
      wso_id: { type: Sequelize.STRING(255), allowNull: true, field: 'wso_id' },
      wso_good_code: { type: Sequelize.STRING(255), allowNull: true, field: 'wso_good_code' },
      wso_good_name: { type: Sequelize.TEXT, allowNull: true, field: 'wso_good_name' },
      wso_good_quantity: { type: Sequelize.INTEGER(20), allowNull: true, field: 'wso_good_quantity' },
      wso_good_price: { type: Sequelize.INTEGER(20), allowNull: true, field: 'wso_good_price' },
      wso_good_amount: { type: Sequelize.FLOAT(20, 5), allowNull: true, field: 'wso_good_amount' },
      missing_quantity: { type: Sequelize.INTEGER(20), allowNull: true, field: 'missing_quantity' },
      warehouse_id: { type: Sequelize.INTEGER(11), defaultValue: 1, field: 'warehouse_id' },
      sum_pick_in: { type: Sequelize.INTEGER(11), defaultValue: 0, field: 'sum_pick_in' },
      sum_pick_out: { type: Sequelize.INTEGER(11), defaultValue: 0, field: 'sum_pick_out' },
      problems: { type: Sequelize.JSON, field: 'problems' },

    },
    {
      tableName: 'WSO_goods'
    }
  );
 
  return WSO_goods;
}
