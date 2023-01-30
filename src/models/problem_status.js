module.exports = (sequelize, Sequelize) => {
    const problem_status = sequelize.define(
      'problem_status',
      {
  
        problem_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'problem_id' },
        name:{type: Sequelize.TEXT, primaryKey: true,field: 'name' },
        type:{type: Sequelize.STRING(255), primaryKey: true,field: 'type' },

  
      },
      {
        tableName: 'problem_status'
      }
    );
  
    return problem_status;
  }
  