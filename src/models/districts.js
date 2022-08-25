module.exports = (sequelize, Sequelize) => {
  const districts = sequelize.define(
    'district_options',
    {

      district_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'district_id' },
      code:{type: Sequelize.STRING(4),allowNull: true,field: 'code' },
      name_th:{type: Sequelize.STRING(150), allowNull: true, field: 'name_th' },
      name_en:{type: Sequelize.STRING(150),allowNull: true,field: 'name_en' },
      province_id:{type: Sequelize.INTEGER(11), allowNull: true, field: 'province_id' },

    },
    {
      tableName: 'district_options'
    }
  );

  return districts;
}
