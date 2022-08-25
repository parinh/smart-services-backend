module.exports = (sequelize, Sequelize) => {
  const mapping_area = sequelize.define(
    'mapping',
    {

      district:{type: Sequelize.STRING(150),primaryKey: true, field: 'district' },
      province:{type: Sequelize.STRING(150), field: 'province' },
      zone:{type: Sequelize.STRING(150), field: 'zone' },
      l_no:{type: Sequelize.INTEGER(11), field: 'l_no' },

    },
    {
      tableName: 'mapping'
    }
  );

  return mapping_area;
}
