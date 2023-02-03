module.exports = (sequelize, Sequelize) => {
  const l_no_details = sequelize.define(
    'l_no_details',
    {
      l_no: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'l_no' },
      name:{type:Sequelize.STRING(255),foreignKey: true ,field: 'name'},
    },
    { 
      tableName: 'l_no_details'
    }
  );

  return l_no_details;
}
 