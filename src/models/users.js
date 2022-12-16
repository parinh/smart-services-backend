module.exports = ( sequelize , Sequelize ) => {
    const users = sequelize.define(
      'users',
      {
          uid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'uid' },
          name: { type: Sequelize.STRING(50), allowNull: false, field: 'name' },
          tel: { type: Sequelize.STRING(10), allowNull: false, field: 'tel' },
          role_id: { type: Sequelize.STRING(125), allowNull: false, field: 'role_id' },
          l_no: { type: Sequelize.INTEGER(2), allowNull: true, field: 'l_no' },
          username: { type: Sequelize.STRING(50), allowNull: false, field: 'username' },
          password: { type: Sequelize.TEXT, allowNull: false, field: 'password' },
      },
      {
          tableName: 'users' 
      }
    );
    
    return users;
  }
   