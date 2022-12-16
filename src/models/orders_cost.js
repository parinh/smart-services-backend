module.exports = (sequelize, Sequelize) => {
  const orders_cost = sequelize.define(
    'orders_cost',
    {

      ocid:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'ocid' },
      toid:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'toid' },
      oid:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'oid' },
      sequence:{type: Sequelize.INTEGER(1),field: 'sequence' },

      cost_k:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'cost_k' },
      day_cost:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'day_cost' },
      distance_cost:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'distance_cost' },
      drop_cost:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'drop_cost' },
      sum:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'sum' },
      amount:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'amount' },
      fuel_percent:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'fuel_percent' },
      fuel_cost:{type: Sequelize.FLOAT(20.5),allowNull: false,defaultValue: 0,field: 'fuel_cost' },
      branch_id:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'branch_id' },
      alid:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'alid' },
      wlid:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'wlid' },
      cus_po_id:{type: Sequelize.STRING(255),allowNull: true, field: 'cus_po_id' },
      ship_date:{type: Sequelize.DATEONLY,allowNull: true, field: 'ship_date' },
      sale_id:{type: Sequelize.STRING(255),allowNull: true, field: 'sale_id'},
      confirm_date: { type: Sequelize.DATEONLY,allowNull: true, field: 'confirm_date'},
      l_no: { type: Sequelize.INTEGER(11),allowNull: true, field: 'l_no'},
      job_type: { type: Sequelize.STRING(255),allowNull: true, field: 'job_type'},
      dead_line_date: { type: Sequelize.DATEONLY,allowNull: true, field: 'dead_line_date'},
      order_type_id: { type: Sequelize.INTEGER(11),allowNull: true, field: 'order_type_id'},
      days:{ type: Sequelize.INTEGER(11),allowNull: true, field: 'days'},
      created_at: { type: Sequelize.DATE,allowNull: true, field: 'created_at'},
      updated_at: { type: Sequelize.DATE,allowNull: true, field: 'updated_at'},
      distance: { type: Sequelize.FLOAT(20.5),allowNull: true, field: 'distance'},

      chance_cost:{ type: Sequelize.INTEGER(11),defaultValue: 0, field: 'chance_cost'},
      reimburse_day_cost:{ type: Sequelize.INTEGER(11),defaultValue: 0, field: 'reimburse_day_cost'},
      stuck_cost:{ type: Sequelize.INTEGER(11),defaultValue: 0, field: 'stuck_cost'},
      back_cost:{ type: Sequelize.INTEGER(11),defaultValue: 0, field: 'back_cost'},
      over_distance_cost:{ type: Sequelize.INTEGER(11),defaultValue: 0, field: 'over_distance_cost'},
      extra:{ type: Sequelize.INTEGER(11),defaultValue: 0, field: 'extra'},
      sub_cost:{ type: Sequelize.INTEGER(11),defaultValue: 0, field: 'sub_cost'},

      problems:{ type: Sequelize.JSON, field: 'problems'},
      problem_remark:{ type: Sequelize.TEXT, field: 'problem_remark'},
      is_finish:{ type: Sequelize.TINYINT(1), field: 'is_finish'},
      is_show_cost:{ type: Sequelize.TINYINT(1),defaultValue: 0, field: 'is_show_cost'},
    },
    {
      tableName: 'orders_cost'
    }
  );

  return orders_cost;
}
