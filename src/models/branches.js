module.exports = (sequelize, Sequelize) => {
  const branches = sequelize.define(
    'branches',
    {

      branch_id:{type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'branch_id' },
      cus_group_name:{type: Sequelize.STRING(255),allowNull: true,default:'general',field: 'cus_group_name' },
      province:{type: Sequelize.STRING(255), allowNull: true, field: 'province' },
      branch_name:{type: Sequelize.STRING(255), allowNull: true, field: 'branch_name' },
      zip_code:{type: Sequelize.INTEGER(5),allowNull: true,field: 'zip_code' },
      sub_district_name:{type: Sequelize.STRING(255), allowNull: true, field: 'sub_district_name' },
      district_name:{type: Sequelize.STRING(255), allowNull: true, field: 'district_name' },
      address:{type: Sequelize.TEXT, allowNull: true, field: 'address'},
      lat:{type: Sequelize.DECIMAL(10,7), allowNull: true, field: 'lat'},
      lng:{type: Sequelize.DECIMAL(10,7), allowNull: true, field: 'lng'},
      cont_name:{type: Sequelize.STRING(255), allowNull: true, field: 'cont_name' },
      cont_tel:{type: Sequelize.STRING(15), allowNull: true, field: 'cont_tel'},
      zone:{type: Sequelize.STRING(5), allowNull: true, field: 'zone'},
      l_no:{type: Sequelize.INTEGER(5),allowNull: true,field: 'l_no' },

      billing_province:{type: Sequelize.STRING(255), allowNull: true, field: 'province' },
      billing_zip_code:{type: Sequelize.INTEGER(5),allowNull: true,field: 'zip_code' },
      billing_sub_district_name:{type: Sequelize.STRING(255), allowNull: true, field: 'billing_sub_district_name' },
      billing_district_name:{type: Sequelize.STRING(255), allowNull: true, field: 'billing_district_name' },

      cust_code:{type: Sequelize.STRING(512), allowNull: true, field: 'cust_code' },
      cust_name:{type: Sequelize.STRING(512), allowNull: true, field: 'cust_name' },
      branch_code:{type: Sequelize.STRING(512), allowNull: true, field: 'branch_code' },
      create_by:{type: Sequelize.STRING(255), allowNull: true, field: 'create_by' },


    },
    {
      tableName: 'branches'
    }
  );

  return branches;
}
