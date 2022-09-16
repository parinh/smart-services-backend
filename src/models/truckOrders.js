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
      to_status:{type: Sequelize.STRING(255),allowNull: true,default:'pending', field: 'to_status'},
      start_date:{type: Sequelize.DATE, field: 'start_date'},
      created_at:{type: Sequelize.DATE, field: 'created_at'},
      updated_at: { type: Sequelize.DATE, field: 'updated_at' },
      
    },
    { 
      tableName: 'truck_orders'
    }
  );

  return truck_orders;
}
 