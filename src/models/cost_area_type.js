module.exports = (sequelize, Sequelize) => {
  const cost_area_type = sequelize.define(
    'cost_area_type',
    {

      acid:{type: Sequelize.INTEGER(11), primaryKey: true, field: 'acid' },
      area:{type: Sequelize.STRING(255),allowNull: false,field: 'area' },
      cost_four_wheels:{type: Sequelize.INTEGER(11),allowNull: false,field: 'cost_four_wheels' },
      cost_six_wheels:{type: Sequelize.INTEGER(11),allowNull: false,field: 'cost_six_wheels' },
      cost_ten_wheels:{type: Sequelize.INTEGER(11),allowNull: false,field: 'cost_ten_wheels' },
      
    },
    {
      tableName: 'cost_area_type'
    }
  );

  return cost_area_type;
}
