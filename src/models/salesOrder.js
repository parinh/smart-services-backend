module.exports = ( sequelize , Sequelize ) => {
    const salesOrder = sequelize.define(
      'sales_order',
      {
        id: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'id' },
        job_no:{type: Sequelize.STRING(255), allowNull: false, field: 'job_no'},
        quotation_no:{type: Sequelize.STRING(512), allowNull: false, field: 'quotation_no'},
        department:{type: Sequelize.STRING(512), allowNull: false, field: 'department'},
        sales:{type:Sequelize.STRING(512), allowNull: false, field: 'sales'},
        customer_code:{type:Sequelize.STRING(512), allowNull: false,field: 'customer_code'},
        cf_cust_code:{type:Sequelize.STRING(512), allowNull: false,field: 'cf_cust_code'},
        customer_name:{type:Sequelize.STRING(512), allowNull: false,field: 'customer_name'},
        cf_cust_name:{type:Sequelize.STRING(512), allowNull: false,field: 'cf_cust_name'},
        branch_code:{type:Sequelize.STRING(512), allowNull: false,field: 'branch_code'},
        cf_branch_code:{type:Sequelize.STRING(512), allowNull: false,field: 'cf_branch_code'},
        branch_name:{type:Sequelize.STRING(512), allowNull: false,field: 'branch_name'},
        cf_branch_name:{type:Sequelize.STRING(512), allowNull: false,field: 'cf_branch_name'},
        lat:{type:Sequelize.DECIMAL(12,7), allowNull: true,field: 'lat'},
        lng:{type:Sequelize.DECIMAL(12,7), allowNull: true,field: 'lng'},
        project:{type:Sequelize.STRING(512), allowNull: false,field: 'project'},
        foreman:{type:Sequelize.STRING(512), allowNull: false,field: 'foreman'},
        job_type:{type:Sequelize.STRING(512), allowNull: false,field: 'job_type'},
        description:{type:Sequelize.TEXT, allowNull: true,field: 'description'},
        payment:{type:Sequelize.STRING(512), allowNull: false,field: 'payment'},
        value:{type:Sequelize.STRING(512), allowNull: false,field: 'value'},
        need_date:{type:Sequelize.DATEONLY, allowNull: false,field: 'need_date'},
        appoint_date:{type:Sequelize.DATE, allowNull: false,field: 'appoint_date'},
        trips:{type:Sequelize.INTEGER.UNSIGNED, allowNull: true,field: 'trips'},
        province:{type:Sequelize.STRING(255), allowNull: false,field: 'province'},
        cf_province:{type:Sequelize.STRING(255), allowNull: false, field: 'cf_province'},
        amphure:{type:Sequelize.STRING(255), allowNull: false,field: 'amphure'},
        cf_amphure:{type:Sequelize.STRING(255), allowNull: false, field: 'cf_amphure'},
        district:{type:Sequelize.STRING(255), allowNull: false,field: 'district'},
        cf_district:{type:Sequelize.STRING(255), allowNull: false, field: 'cf_district'},
        zone:{type:Sequelize.STRING(5), allowNull: false, field: 'zone'},
        l_no:{type:Sequelize.INTEGER(11), allowNull: false,field: 'l_no'},
        is_valid:{type:Sequelize.TINYINT(1), allowNull: false,field: 'is_valid'},
        is_confirm:{type:Sequelize.TINYINT(1), allowNull: false,field: 'is_confirm'},
        create_by:{type:Sequelize.INTEGER(11), allowNull: false,field: 'create_by'}


      },
      {
          tableName: 'sales_order' 
      }
    );
    
    return salesOrder;
  }
   