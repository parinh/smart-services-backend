module.exports = ( sequelize , Sequelize ) => {
    const WSO_lists = sequelize.define(
      'WSO_lists',
      {
          wlid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'wlid' },
          // wl_status: { type: Sequelize.INTEGER(11), allowNull: true, field: 'wl_status' },
          so_number: { type: Sequelize.STRING(255), allowNull: true, field: 'so_number' },
          wso_id: { type: Sequelize.STRING(255), allowNull: true, field: 'wso_id' },
          doc_date: { type: Sequelize.STRING(255), allowNull: true, field: 'doc_date' },
          ship_date: { type: Sequelize.DATE, allowNull: true,field:'ship_date'},
          cus_code: { type: Sequelize.STRING(50), allowNull: true, field: 'cus_code' },
          cus_name: { type: Sequelize.STRING(255), allowNull: true, field: 'cus_name' },
          job_code: { type: Sequelize.STRING(50), allowNull: true, field: 'job_code' },
          job_name: { type: Sequelize.STRING(255), allowNull: true, field: 'job_name' },
          dep_name: { type: Sequelize.STRING(50), allowNullL:true,field: 'dep_name' },
          wso_file_path: { type: Sequelize.STRING(255), allowNull: true, field: 'wso_file_path' },
          problem_types: { type: Sequelize.JSON, allowNull: true,defaultValue: [], field: 'problem_types' },
      },
      {
          tableName: 'WSO_lists' 
      }
    );
    
    return WSO_lists;
  }
   