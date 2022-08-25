module.exports = (sequelize, Sequelize) => {
  const provinces = sequelize.define(
    'province_options',
    {

      province_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'province_id' },
      code:{type: Sequelize.STRING(2), allowNull: true,field: 'code' },
      name_th:{type: Sequelize.STRING(150), allowNull: true, field: 'name_th' },
      name_en:{type: Sequelize.STRING(150), allowNull: true, field: 'name_en' },
    },
    {
      tableName: 'province_options'
    }
  );

  return provinces;
}
