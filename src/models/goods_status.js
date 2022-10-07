module.exports = (sequelize, Sequelize) => {
    const goods_status = sequelize.define(
      'goods_status',
      {
  
        number:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'number' },
        status:{type: Sequelize.TEXT, primaryKey: true,field: 'status' },

  
      },
      {
        tableName: 'goods_status'
      }
    );
  
    return goods_status;
  }
  