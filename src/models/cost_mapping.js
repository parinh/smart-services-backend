module.exports = (sequelize, Sequelize) => {
  const cost_mapping = sequelize.define(
    'cost_mapping',
    {

      id:{type: Sequelize.INTEGER(11), primaryKey: true, field: 'id' },
      province_name:{type: Sequelize.STRING(255),allowNull: false,field: 'province_name' },
      district_name:{type: Sequelize.STRING(255),allowNull: false,field: 'district_name' },
      days:{type: Sequelize.INTEGER(11),allowNull: false,field: 'days' },
      distance:{type: Sequelize.INTEGER(11),allowNull: false,field: 'distance' },
      four_wheels:{type: Sequelize.FLOAT(20.5),allowNull: false,field: 'four_wheels' },
      six_wheels:{type: Sequelize.FLOAT(20.5),allowNull: false,field: 'six_wheels' },
      ten_wheels:{type: Sequelize.FLOAT(20.5),allowNull: false,field: 'ten_wheels' },
      warehouse_id:{type: Sequelize.INTEGER(11),allowNull: false,field: 'warehouse_id' },
      kcid:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'kcid' },
      acid:{type: Sequelize.INTEGER(11), foreignKey: true, field: 'acid' },
      
    },
    {
      tableName: 'cost_mapping'
    }
  );

  return cost_mapping;
}
