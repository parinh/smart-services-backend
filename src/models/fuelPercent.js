module.exports = (sequelize, Sequelize) => {
  const fuel_percent = sequelize.define(
    'fuel_percent',
    {

      // fid:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'fid' },
      value:{type: Sequelize.FLOAT(20,5),allowNull: true,field: 'value' },
      updated_at: { type: Sequelize.DATE,allowNull: true, field: 'updated_at'},

    },
    {
      tableName: 'fuel_percent'
    }
  );

  return fuel_percent;
}
