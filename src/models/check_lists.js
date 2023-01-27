module.exports = (sequelize, Sequelize) => {
    const check_lists = sequelize.define(
      'check_lists',
      {
        clid:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'clid' },
        wgid:{type: Sequelize.INTEGER(11),foreignKey:true, allowNull: true, field: 'wgid' },
        toid:{type: Sequelize.INTEGER(11),foreignKey:true, allowNull: true, field: 'toid' },
        is_put_out:{type: Sequelize.TINYINT(1), field: 'is_put_out' },
        // shortage_type:{type: Sequelize.ENUM(['ขาดนับคลัง','ขาดหน้ารถ','ขาดหน้างาน']),default:'ขาดนับคลัง' , field: 'shortage_type' },

        number:{type: Sequelize.INTEGER(11),default:0 ,allowNull: true, field: 'number' },
        out_number:{type: Sequelize.INTEGER(11),default:0 ,allowNull: true, field: 'out_number' },
        // status:{type: Sequelize.INTEGER(11),default:0 ,allowNull: true, field: 'status' },
        times:{type: Sequelize.INTEGER(11),field: 'times' },
        detail:{type: Sequelize.TEXT,allowNull: true, field: 'detail' }, 
        created_at:{type: Sequelize.DATE, field: 'created_at'},
        put_out_time:{type: Sequelize.DATE,allowNull: true, field: 'put_out_time'},
        warehouse_id: { type: Sequelize.INTEGER(11), defaultValue: 1, field: 'warehouse_id' },
        problems:{type: Sequelize.JSON,allowNull: true, field: 'problems'},
        is_confirm:{type: Sequelize.TINYINT(1),defaultValue: 0, field: 'is_confirm' },


      },
      {
        tableName: 'check_lists'
      }
    );
  
    return check_lists;
  }
  