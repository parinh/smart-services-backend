module.exports = ( sequelize , Sequelize ) => {
    const ASO_lists = sequelize.define(
      'ASO_lists',
      {
          alid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'alid' },
          cus_id: { type: Sequelize.STRING(50), allowNull: true, field: 'cus_id' },
          aso_id: { type: Sequelize.STRING(255), allowNull: true, field: 'aso_id' },
          doc_date: { type: Sequelize.DATE, allowNull: true, field: 'doc_date' },
          sum_good_price: { type: Sequelize.FLOAT(11,5), allowNull: true, field: 'sum_good_price' },
          cus_po_id: { type: Sequelize.STRING(255), allowNull: true, field: 'cus_po_id' },
          ref_no: { type: Sequelize.STRING(255), allowNull: true, field: 'ref_no' },
          ship_date: { type: Sequelize.DATE, allowNull: true,field:'ship_date'},
          cus_name: { type: Sequelize.STRING(255), allowNull: true, field: 'cus_name' },
          address: { type: Sequelize.TEXT, allowNull: true, field: 'address' },
          cont_tel: { type: Sequelize.STRING(255), allowNull: true, field: 'cont_tel' },
          cont_name: { type: Sequelize.STRING(255), allowNull: true, field: 'cont_name' },
          sale_area_code: { type: Sequelize.STRING(255), allowNull: true,field:'sale_area_code'},
          job_code: { type: Sequelize.STRING(50), allowNull: true, field: 'job_code' },
          job_name: { type: Sequelize.STRING(255), allowNull: true, field: 'job_name' },
          emp_name: { type: Sequelize.STRING(255), allowNull: true, field: 'emp_name' },
          aso_file_path: { type: Sequelize.STRING(255), allowNull: true, field: 'aso_file_path' },

      },
      {
          tableName: 'ASO_lists' 
      }
    );
    
    return ASO_lists;
  }
   