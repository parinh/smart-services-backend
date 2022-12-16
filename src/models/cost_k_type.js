module.exports = (sequelize, Sequelize) => {
  const cost_k_type = sequelize.define(
    'cost_k_type',
    {

      kcid:{type: Sequelize.INTEGER(11), primaryKey: true, field: 'kcid' },
      type:{type: Sequelize.STRING(255),allowNull: false,field: 'type' },
      cost_four_wheels:{type: Sequelize.FLOAT(20.5),allowNull: false,field: 'cost_four_wheels' },
      cost_six_wheels:{type: Sequelize.FLOAT(20.5),allowNull: false,field: 'cost_six_wheels' },
      cost_ten_wheels:{type: Sequelize.FLOAT(20.5),allowNull: false,field: 'cost_ten_wheels' },
      
      
    },
    {
      tableName: 'cost_k_type'
    }
  );

  return cost_k_type;
}
