module.exports = (sequelize, Sequelize) => {
  const orders = sequelize.define(
    'orders',
    {
      oid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'oid' },
      cus_group_name:{type:Sequelize.STRING(255),foreignKey: true ,field: 'cus_group_name'},
      branch_id:{type:Sequelize.INTEGER(11),foreignKey: true ,field: 'branch_id'},
      alid: { type: Sequelize.INTEGER(11), foreignKey: true, field: 'alid' },
      wlid: { type: Sequelize.INTEGER(11), foreignKey: true, field: 'wlid' },
      cus_po_id: { type: Sequelize.STRING(255), allowNull: true, field: 'cus_po_id' },
      sale_id: { type: Sequelize.STRING(255), allowNull: true, field: 'sale_id' },
      ship_date: { type: Sequelize.DATE, allowNull: true, field: 'ship_date' },
      // cus_name: { type: Sequelize.STRING(255), allowNull: true, field: 'cus_name' },
      // address: { type: Sequelize.TEXT, allowNull: true, field: 'address' }, //*ต้อง relate ตาม branch?
      order_status: { type: Sequelize.INTEGER(11), default: 1  ,field: 'order_status' },
      created_by: { type: Sequelize.STRING(255), field: 'created_by' },
      created_at: { type: Sequelize.DATE, field: 'created_at' },
      updated_at: { type: Sequelize.DATE, field: 'updated_at' },
      confirm_date:{type: Sequelize.DATE, allowNull: true, field: 'confirm_date'},
      l_no:{ type: Sequelize.STRING(5), allowNull: true, field: 'l_no' },
      job_type:{ type: Sequelize.STRING(255), allowNull: true, field: 'job_type' },
      dead_line_date:{ type: Sequelize.DATE,allowNull: true, field: 'dead_line_date' },
      order_type_id:{ type: Sequelize.STRING(255),defaultValue:1, field: 'order_type_id'},

      aso_file:{type: Sequelize.TEXT,allowNull: true, field: 'aso_file'},
      wso_file:{type: Sequelize.TEXT,allowNull: true, field: 'wso_file'},
      spec_sheet_file:{type: Sequelize.TEXT,allowNull: true, field: 'spec_sheet_file'},
      other_files:{type: Sequelize.JSON,allowNull: true, field: 'other_files'},

      toid:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'toid' },
      remark:{type: Sequelize.TEXT,allowNull: true, field: 'remark'},

    },
    { 
      tableName: 'orders'
    }
  );

  return orders;
}
 