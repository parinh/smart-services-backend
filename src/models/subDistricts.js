module.exports = (sequelize, Sequelize) => {
  const sub_districts = sequelize.define(
    'sub_district_options',
    {

      sub_district_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'sub_district_id' },
      name_th:{type: Sequelize.STRING(150),allowNull: true,field: 'name_th' },
      name_en:{type: Sequelize.STRING(150), allowNull: true, field: 'name_en' },
      zip_code:{type: Sequelize.INTEGER(11),allowNull: true,field: 'zip_code' },
      district_id:{type: Sequelize.INTEGER(11), allowNull: true, field: 'district_id' },


    },
    {
      tableName: 'sub_district_options'
    }
  );

  return sub_districts;
}
