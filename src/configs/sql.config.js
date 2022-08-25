const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

const sequelize = new Sequelize(
  'smart_service',
  'root',
  "'t}Squ'i:00bZ@j8",
  {
  host: '34.126.118.107', 
  dialect: 'mysql',
  define: {
    timestamps: false,
    createdAt : "create_at",
    updatedAt : "update_at"
  },
  logging: false
});

  const db = {};
  db.op = Op

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.users = require("../models/users")( sequelize , Sequelize );
  db.salesOrder = require("../models/salesOrder")( sequelize , Sequelize );
  db.ASO_lists = require("../models/ASO_lists")( sequelize , Sequelize );
  db.ASO_goods = require("../models/ASO_goods")( sequelize , Sequelize );
  db.WSO_lists = require("../models/WSO_lists")( sequelize , Sequelize);
  db.WSO_goods = require("../models/WSO_goods")(sequelize , Sequelize);
  db.branches = require("../models/branches")(sequelize , Sequelize);
  db.customer_groups = require("../models/customerGroups")(sequelize , Sequelize);
  db.orders = require("../models/orders")( sequelize , Sequelize);
  db.provinces = require("../models/provinces")(sequelize , Sequelize);
  db.districts = require("../models/districts")(sequelize , Sequelize);
  db.sub_districts = require("../models/subDistricts")(sequelize , Sequelize);
  db.mapping_area = require("../models/mappingArea")(sequelize , Sequelize);
  db.job_type_options = require("../models/jobTypeOptions")(sequelize , Sequelize)
  db.truck_orders = require("../models/truckOrders")(sequelize , Sequelize)
  db.member_options = require("../models/memberOptions")(sequelize , Sequelize)
  db.vehicle_types = require("../models/vehicleTypes")(sequelize , Sequelize)
  

  db.WSO_lists.hasMany(db.WSO_goods, { foreignKey: 'wlid'});
  db.WSO_goods.belongsTo(db.WSO_lists, { foreignKey: 'wlid'});

  db.ASO_lists.hasMany(db.ASO_goods, { foreignKey: 'alid'});
  db.ASO_goods.belongsTo(db.ASO_lists, { foreignKey: 'alid', targetKey:'alid' });

  db.ASO_lists.hasOne(db.orders,{foreignKey:'alid'});  //* PK hasone FK
  db.orders.belongsTo(db.ASO_lists,{foreignKey:'alid', targetKey: 'alid'}); //* FK -> PK

  db.WSO_lists.hasOne(db.orders,{foreignKey:'wlid'})
  db.orders.belongsTo(db.WSO_lists,{foreignKey:'wlid', targetKey:'wlid'});

  db.customer_groups.hasMany(db.branches,{foreignKey:'cus_group_name'})
  db.branches.belongsTo(db.customer_groups,{foreignKey:'cus_group_name', targetKey:'cus_group_name'});

  db.provinces.hasMany(db.districts,{foreignKey:'province_id'});
  db.districts.hasMany(db.sub_districts,{foreignKey:'district_id'});
  db.sub_districts.belongsTo(db.districts,{foreignKey:'district_id', targetKey:'district_id'})

  db.branches.hasOne(db.orders,{foreignKey:'branch_id'});
  db.orders.belongsTo(db.branches,{foreignKey:'branch_id',targetKey: 'branch_id'})

  db.member_options.hasOne(db.truck_orders,{foreignKey:'mbid'})
  db.truck_orders.belongsTo(db.member_options,{foreignKey:'mbid',targetKey:'mbid'})

  db.truck_orders.hasMany(db.orders,{foreignKey:'toid'})
  db.orders.belongsTo(db.truck_orders,{foreignKey:'toid', targetKey:'toid'})



  // db.team.hasMany(
  //   db.player, 
  //   {
  //       foreignKey: { name: 'tid', field: 'tid' },
  //   }
  // );
  // db.player.belongsTo(db.team, { foreignKey: 'tid' });

  module.exports = db;



// select cf_cust_code,cf_cust_name,cf_branch_code,cf_branch_name,lat,lng,cf_province,cf_amphure,cf_district from sales_order
// where not ((lower(cf_cust_name) LIKE '%big%' or lower(cf_cust_name) LIKE '%บิ_ก%') or  (lower(cf_cust_name) LIKE '7%'  or lower(cf_cust_name) LIKE '%เซเ%' or lower(cf_cust_name) LIKE '%seven%'  ) or (lower(cf_cust_name) LIKE '%tus%'  or lower(cf_cust_name) LIKE '%ตัส%' and cf_cust_name != ''))

// /*  where not lower(cf_cust_name) LIKE '7%'  or lower(cf_cust_name) LIKE '%เซเ%' or lower(cf_cust_name) LIKE '%seven%'  
//  where not lower(cf_cust_name) LIKE '%tus%'  or lower(cf_cust_name) LIKE '%ตัส%' and cf_cust_name != '' */

// group by cf_branch_name