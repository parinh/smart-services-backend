module.exports = (sequelize, Sequelize) => {
  const user_roles = sequelize.define(
    'user_roles',
    {

      // fid:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'fid' },
      role: { type: Sequelize.STRING(125),primaryKey: true, field: 'role'},

    },
    {
      tableName: 'user_roles'
    }
  );

  return user_roles;
}
