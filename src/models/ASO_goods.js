module.exports = ( sequelize , Sequelize ) => {
    const ASO_goods = sequelize.define(
      'ASO_goods',
      {
          agid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'agid' },
          alid: { type: Sequelize.INTEGER(11),foreignKey:true, field: 'alid' },
          aso_id: { type: Sequelize.STRING(255), allowNull: true, field: 'aso_id' },
          list_num: { type: Sequelize.INTEGER(20), allowNull: true, field: 'list_num' },
          aso_good_code: { type: Sequelize.STRING(255), allowNull: true, field: 'aso_good_code' },
          aso_good_name: { type: Sequelize.TEXT, allowNull: true, field: 'aso_good_name' },
          aso_good_amount: { type: Sequelize.FLOAT(20,5), allowNull: true, field: 'aso_good_amount' },
          aso_good_quantity: { type: Sequelize.INTEGER(20), allowNull: true,field:'aso_good_quantity'},
          aso_good_price: { type: Sequelize.FLOAT(20,5), allowNull: true, field: 'aso_good_price' },
      },
      {   
          tableName: 'ASO_goods' 
      }
    );
    
    return ASO_goods;
  }
   