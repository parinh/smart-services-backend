module.exports = (sequelize, Sequelize) => {
  const member_options = sequelize.define(
    'member_options',
    {
      mbid: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true, field: 'mbid' },
      vtid: { type: Sequelize.STRING(255),foreignKey: 'vtid', allowNull: true, field: 'vtid'},
      type_account:{type: Sequelize.STRING(10),allowNull: true, field: 'typeAccount'},
      name:{type: Sequelize.TEXT,allowNull: true, field: 'name'},
      phone_number:{type: Sequelize.TEXT('medium'),allowNull: true, field: 'phone_number'},
      plate_number:{type: Sequelize.TEXT,allowNull: true, field: 'plate_number'},
      // vehicle_type:{type: Sequelize.TEXT,allowNull: true, field: 'vehicle_type'},
      username:{type: Sequelize.TEXT('medium'),allowNull: true, field: 'username'},
      password:{type: Sequelize.TEXT('medium'),allowNull: true, field: 'password'},
      sub_contract:{type: Sequelize.STRING(150),allowNull: true, field: 'sub_contract'},
      affiliate:{type: Sequelize.STRING(512),allowNull: true, field: 'affiliate'},
      type:{type: Sequelize.STRING(512),allowNull: true, field: 'type'},
      is_allocate:{type: Sequelize.TINYINT(1),allowNull: true, field: 'is_allocate'},
      created_at:{type: Sequelize.DATE, field: 'created_at'},
    },
    { 
      tableName: 'member_options'
    }
  );

  return member_options;
}
 