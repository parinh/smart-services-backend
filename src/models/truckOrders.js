module.exports = (sequelize, Sequelize) => {
  const truck_orders = sequelize.define(
    'truck_orders',
    {
      toid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'toid' },
      // vehicle_type: { type: Sequelize.STRING(20), allowNull: true, field: 'vehicle_type'},
      mbid:{type: Sequelize.INTEGER(11), foreignKey:true,allowNull: true, field: 'mbid'},
      warehouse_id:{type: Sequelize.INTEGER(11), foreignKey:true,allowNull: true, field: 'warehouse_id'},
      sup_amount:{type: Sequelize.INTEGER(11),allowNull: true, field: 'sup_amount'},
      emps:{type: Sequelize.JSON,allowNull: true, field: 'emps'},
      drops:{type: Sequelize.JSON,allowNull: true, field: 'drops'},
      remark:{type: Sequelize.TEXT,allowNull: true, field: 'remark'},
      truck_code:{type: Sequelize.STRING(25),allowNull: true, field: 'truck_code'},
      to_status:{type: Sequelize.INTEGER(1),default:1, field: 'to_status'},
      l_no:{type: Sequelize.INTEGER(2), field: 'l_no'},
      cost: { type: Sequelize.FLOAT(20,5), allowNull: true,default: 0,field:'cost'},
      start_date:{type: Sequelize.DATEONLY, field: 'start_date'},
      created_at:{type: Sequelize.DATE, field: 'created_at'},
      updated_at: { type: Sequelize.DATE, field: 'updated_at' },
      longest_province:{type: Sequelize.STRING(125),allowNull: true, field: 'longest_province'},
      longest_district:{type: Sequelize.STRING(125),allowNull: true, field: 'longest_district'},
      
    },
    { 
      tableName: 'truck_orders'
    }
  );

  return truck_orders;
}
 