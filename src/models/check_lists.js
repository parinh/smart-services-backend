module.exports = (sequelize, Sequelize) => {
    const check_lists = sequelize.define(
      'check_lists',
      {
  
        clid:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'clid' },
        wgid:{type: Sequelize.INTEGER(11),foreignKey:true, allowNull: true, field: 'wgid' },
        toid:{type: Sequelize.INTEGER(11),foreignKey:true, allowNull: true, field: 'toid' },
        shortage_type:{type: Sequelize.ENUM(['ขาดนับคลัง','ขาดหน้ารถ','ขาดหน้างาน']),default:'ขาดนับคลัง' , field: 'shortage_type' },

        number:{type: Sequelize.INTEGER(11),default:0 ,allowNull: true, field: 'number' },
        status:{type: Sequelize.TEXT,default:0 ,allowNull: true, field: 'status' },
        detail:{type: Sequelize.TEXT,allowNull: true, field: 'detail' }, 

      
      },
      {
        tableName: 'check_lists'
      }
    );
  
    return check_lists;
  }
  