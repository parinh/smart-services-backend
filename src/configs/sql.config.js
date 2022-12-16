const { Sequelize } = require('sequelize');
const { Op ,models} = require("sequelize");
require('dotenv').config()

const db_name = process.env.DB_NAME ||'smart_services_dump'
const db_username = process.env.DB_USERNAME || 'root'
const db_password = process.env.DB_PASSWORD || 'password'
const db_host = process.env.DB_HOST || 'localhost'

console.log(db_host );


const sequelize = new Sequelize(
  db_name,
  db_username,
  db_password,
  {
  host: db_host,
  port: 3306,
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
  db.models = models

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
  db.warehouses = require("../models/warehouses")(sequelize , Sequelize)
  db.orderTypes = require("../models/orderTypes")(sequelize ,Sequelize)
  db.problem_status = require("../models/problem_status")(sequelize ,Sequelize)
  db.check_lists = require("../models/check_lists")(sequelize ,Sequelize)
  db.cost_mapping = require("../models/cost_mapping")(sequelize ,Sequelize)
  db.cost_k_type = require("../models/cost_k_type")(sequelize ,Sequelize)
  db.cost_area_type = require("../models/cost_area_type")(sequelize ,Sequelize)
  db.orders_cost = require("../models/orders_cost")(sequelize ,Sequelize)
  db.fuel_percent = require("../models/fuelPercent")(sequelize ,Sequelize)
  db.user_roles = require("../models/userRoles")(sequelize ,Sequelize)

  db.WSO_lists.hasMany(db.WSO_goods, { foreignKey: 'wlid'});
  db.WSO_goods.belongsTo(db.WSO_lists, { foreignKey: 'wlid'});

  db.ASO_lists.hasMany(db.ASO_goods, { foreignKey: 'alid'});
  db.ASO_goods.belongsTo(db.ASO_lists, { foreignKey: 'alid', targetKey:'alid' });

  db.ASO_lists.hasOne(db.orders,{foreignKey:'alid'});  //* PK hasone FK
  db.orders.belongsTo(db.ASO_lists,{foreignKey:'alid', targetKey: 'alid'}); //* FK -> PK

  db.WSO_lists.hasOne(db.orders,{foreignKey:'wlid'}) //* 1:1
  db.orders.belongsTo(db.WSO_lists,{foreignKey:'wlid', targetKey:'wlid'});

  db.customer_groups.hasMany(db.branches,{foreignKey:'cus_group_name'})
  db.branches.belongsTo(db.customer_groups,{foreignKey:'cus_group_name', targetKey:'cus_group_name'});

  db.provinces.hasMany(db.districts,{foreignKey:'province_id'});
  db.districts.hasMany(db.sub_districts,{foreignKey:'district_id'});
  db.sub_districts.belongsTo(db.districts,{foreignKey:'district_id', targetKey:'district_id'})

  db.branches.hasOne(db.orders,{foreignKey:'branch_id'});
  db.orders.belongsTo(db.branches,{foreignKey:'branch_id',targetKey: 'branch_id'})

  db.member_options.hasMany(db.truck_orders,{foreignKey:'mbid'})
  db.truck_orders.belongsTo(db.member_options,{foreignKey:'mbid',targetKey:'mbid'})

  db.truck_orders.hasMany(db.orders,{foreignKey:'toid'})
  db.orders.belongsTo(db.truck_orders,{foreignKey:'toid', targetKey:'toid'})

  db.warehouses.hasMany(db.truck_orders,{foreignKey:'warehouse_id'})
  db.truck_orders.belongsTo(db.warehouses,{foreignKey:'warehouse_id', targetKey:'warehouse_id'})

  db.vehicle_types.hasMany(db.member_options,{foreignKey:'vtid'})
  db.member_options.belongsTo(db.vehicle_types,{foreignKey:'vtid', targetKey:'vtid'})

  db.orderTypes.hasMany(db.orders,{foreignKey:'order_type_id'})
  db.orders.belongsTo(db.orderTypes,{foreignKey:'order_type_id',targetKey:"order_type_id"})

  db.WSO_goods.hasMany(db.check_lists,{foreignKey:'wgid'})
  db.check_lists.belongsTo(db.WSO_goods,{foreignKey:'wgid',targetKey:'wgid'})

  db.truck_orders.hasMany(db.check_lists,{foreignKey:'toid'})
  db.check_lists.belongsTo(db.truck_orders,{foreignKey:'toid',targetKey:'toid'})
  
  db.warehouses.hasMany(db.cost_mapping,{foreignKey:'warehouse_id'})
  db.cost_mapping.belongsTo(db.warehouses,{foreignKey:'warehouse_id',targetKey:'warehouse_id'})


  db.cost_k_type.hasMany(db.cost_mapping,{foreignKey:'kcid'})
  db.cost_mapping.belongsTo(db.cost_k_type,{foreignKey:'kcid',targetKey:'kcid'})

  db.cost_area_type.hasMany(db.cost_mapping,{foreignKey:'acid'})
  db.cost_mapping.belongsTo(db.cost_area_type,{foreignKey:'acid',targetKey:'acid'})
  
  db.truck_orders.hasMany(db.orders_cost,{foreignKey:'toid'})
  db.orders_cost.belongsTo(db.truck_orders,{foreignKey:'toid',targetKey:'toid'})

  db.branches.hasMany(db.orders_cost,{foreignKey:'branch_id'})
  db.orders_cost.belongsTo(db.branches,{foreignKey:'branch_id',targetKey:'branch_id'})

  db.orders.hasMany(db.orders_cost,{foreignKey:'oid'})
  db.orders_cost.belongsTo(db.orders,{foreignKey:'oid',targetKey:'oid'})

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

//TODO: ทำ field เก็บปัญหาเวลาออกเดอร์ยืนยันใน truck เก็บที่ order cost