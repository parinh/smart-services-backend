const db = require("../configs/sql.config");
const moment = require("moment");
const jwt_service = require("../services/jwt.service");
const { customer_groups, job_type_options } = require("../configs/sql.config");
const {
  orders_cost,
  truck_orders,
  orders,
  member_options,
  branches,
  vehicle_types,
  warehouses,
  WSO_lists,
  WSO_goods,
  cost_mapping,
  cost_area_type,
  cost_k_type,
  l_no_details,
} = db;

db.sequelize.sync();
let l_no = "0";

// async function find(province) {
//
//     let result = await provinces.findAll({
//         where: {name_th:province},
//         include: [
//             {
//                 model: districts,
//                 required: true,
//                 include: [{
//                     model: sub_districts,
//                     required: true,
//                 }
//                 ]
//             }
//         ],

//     });
//     return (result)
// }

function setLNo(headers) {
  let split_bearer = headers.authorization.split(" ")[1];
  l_no = jwt_service.decodeToken(split_bearer).data.l_no ?? l_no;
}

async function findAll(query) {
    
    try {
        let page = parseInt(query.page)
        let itemsPerPage = parseInt(query.itemsPerPage)
        let options = JSON.parse(query.options)
        console.log('page : ',page);
        console.log('itemsPerpage : ',itemsPerPage);
        console.log('options : ',options);
        let return_lno = l_no
        console.log('l_no : ',return_lno);
        let where_str = {}
        if (options.to_status) {
            where_str.to_status = {
                [db.op.in]: options.to_status
            }
        }
        if (l_no != "0") {
            where_str.l_no = l_no
        }
        console.log('str ',where_str);
        let result = await truck_orders.findAndCountAll({
            where: where_str,
            include: [
                {
                    model: member_options,
                    required: false,
                    include: [
                        {
                            model: vehicle_types,
                            required: false,
                        }
                    ]
                    
                },
                {
                    model: orders,
                    required: false,
                    include: [
                        {
                            model: branches,
                            required: false
                        }
                    ]
                },

            ],
            distinct: true,
            order: [['start_date', 'DESC']],
            offset: itemsPerPage * (page - 1),
            limit: itemsPerPage,
        });
        return { status: 'success', data: result.rows ,l_no:return_lno, count:result.count };
    }  
   catch (err) {
    return { status: "error", message: err.message };
  }
}

//*todo : search truck-orders ----------------------------------------------------------------
async function searchTruckOrdersBySearchObjects(query) {
  let search_object = JSON.parse(query.search_object);
  let page = parseInt(query.page);
  let itemsPerPage = parseInt(query.itemsPerPage);
  let options = JSON.parse(query.options);
  let query_object_truck_orders = [];
  let query_object_orders = {};
  let query_object_member_options = {};
  let query_object_branches = {};
  let query_object_vehicle_types = {};
  let return_lno = l_no;
  let require_truck_orders_bool = false
  let require_orders_bool = false
  let require_member_options_bool = false
  let require_branches_model = false
  let require_vehicle_type_model = false

  console.log("search_object : ",typeof(search_object.start_date[0]));
  // console.log("page : ",page);
  // console.log("itemsPerPage : ",itemsPerPage);
  // console.log("options : ",options);
  // console.log("l_no : ",l_no);
  try {
    if (options.to_status) {
      query_object_truck_orders.push({
        to_status: { [db.op.in]: options.to_status },
      });
    }
    //*query_object_truck_orders =================================================================================================================
    if (l_no != "0") {
      query_object_truck_orders.push({ l_no: l_no });
    }
    if (search_object.truck_code) {
      query_object_truck_orders.push({
        truck_code: { [db.op.substring]: search_object.truck_code },
      });
    }
    if (search_object.emps_length) {
      //   query_object_truck_orders.push(db.sequelize.where(db.sequelize.fn('JSON_LENGTH', db.sequelize.col('emps')),search_object.emps_length))
      emps_length_array = [
        db.sequelize.where(
          db.sequelize.fn("JSON_LENGTH", db.sequelize.col("emps")),
          search_object.emps_length
        ),
      ];

      if (search_object.emps_length == 0) {
        emps_length_array.push({ emps: null });
      }

      query_object_truck_orders.push({
        [db.op.or]: emps_length_array,
      });
    }
    if (search_object.start_date) {
        require_truck_orders_bool = true
      query_object_truck_orders.push({
        start_date: {
          [db.op.between]: [
            moment(search_object.start_date[0],'YYYY-MM-DD'),
            moment(search_object.start_date[1],'YYYY-MM-DD'),
            // search_object.start_date[1],
          ],
        },
      });
    }
    //*query_object_orders =================================================================================================================
    if (search_object.order_code) {
        require_orders_bool = true
      query_object_orders.order_code = {
        [db.op.substring]: search_object.order_code,
      };
    }
    if (search_object.cus_po_id) {
        require_orders_bool = true
      query_object_orders.cus_po_id = {
        [db.op.substring]: search_object.cus_po_id,
      };
    }
    if (search_object.select_job_type) {
        require_orders_bool = true
      query_object_orders.job_type = {
        [db.op.substring]: search_object.select_job_type,
      };
    }
    //*query_object_member_options =================================================================================================================
    if (search_object.select_member) {
      query_object_member_options.name = {
        [db.op.substring]: search_object.select_member,
      };
    }
    if (search_object.select_plate_number) {
      query_object_member_options.plate_number = {
        [db.op.substring]: search_object.select_plate_number,
      };
    }
    //*query_object_branches =================================================================================================================
    if (search_object.branch_name) {
      query_object_branches.branch_name = {
        [db.op.substring]: search_object.branch_name,
      };
    }
    //*query_object_vehicle_types =================================================================================================================
    if (search_object.vehicle_type) {
        require_vehicle_type_model = true
      query_object_vehicle_types.vehicle = {
        [db.op.substring]: search_object.vehicle_type,
      };
    }

    console.log("truck order : ", query_object_truck_orders[1]);
    console.log("order : ", query_object_orders);
    console.log("member_option : ", query_object_member_options);
    console.log("branch : ", query_object_branches);
    console.log("vehicle : ", query_object_vehicle_types);
    // let require_truck_orders_bool = false
    // let require_orders_bool = false
    // let require_member_options_bool = false
    // let require_branches_model = false
    let result = await truck_orders.findAndCountAll({
      where: {
        [db.op.and]: query_object_truck_orders,
      },
      include: [
        {
          model: member_options,
          where: {
            [db.op.and]: query_object_member_options,
          },
          required: true,
          include: [
            {
              model: vehicle_types,
              where: {
                [db.op.and]: query_object_vehicle_types,
              },
              required: require_vehicle_type_model,
            },
          ],
        },
        {
          model: orders,
          where: {
            [db.op.and]: query_object_orders,
          },
          required: require_orders_bool,
          include: [
            {
              model: branches,
              where: {
                [db.op.and]: query_object_branches,
              },
              required: false,
            },
          ],
        },
      ],
      distinct: true,
      order: [['start_date', 'DESC']],
      offset: itemsPerPage * (page - 1),
      limit: itemsPerPage,
        // include: [
        //   {
        //     model: orders,
        //     where: {
        //       [db.op.and]: query_object_orders,
        //     },
        //     require: false,
        //     include: [{
        //       model: branches,
        //       where: {
        //         [db.op.and]: query_object_branches,
        //       },
        //       require: false,
        //     }],
        //   },
        //   {
        //     model: member_options,
        //     where: {
        //       [db.op.and]: query_object_member_options,
        //     },
        //     require: false,
        //     include: [{
        //       model: vehicle_types,
        //       where: {
        //         [db.op.and]: query_object_vehicle_types,
        //       },
        //       require: false,
        //     }],
        //   },
        // ],require: false
      // where: db.sequelize.where(db.sequelize.fn('JSON_LENGTH', db.sequelize.col('emps')),search_object.emps_length)
    });
    console.log(result.count);
    return {
      status: "success",
      data: result.rows,
      count: result.count,
      l_no:return_lno
    };
  } catch (error) {
    console.log(error.message);
  }

  // try {
  // //*query_object_truck_orders =================================
  //     if(search_object.truck_code){
  //         query_object_truck_orders.truck_code = { [db.op.substring]: search_object.truck_code }
  //     }
  //     if(search_object.emps_length){
  //         query_object_truck_orders.truck_code =
  //     }
  //     if (options.to_status) {
  //         query_object_truck_orders.to_status = {[db.op.in]: options.to_status}
  //     }
  //     if (l_no != "0") {
  //         where_str.l_no = l_no
  //     }
  //     let result = await truck_orders.findAll({
  //         where: where_str,
  //         include: [
  //             {
  //                 model: member_options,
  //                 required: false,
  //                 include: [
  //                     {
  //                         model: vehicle_types,
  //                         required: false,
  //                     }
  //                 ]
  //             },
  //             {
  //                 model: orders,
  //                 required: false,
  //                 include: [
  //                     {
  //                         model: branches,
  //                         required: false
  //                     }
  //                 ]
  //             },

  //         ]
  //     });

  //     return { status: 'success', data: result ,l_no:return_lno };
  // }
  // catch (err) {
  //     return { status: 'error', message: err.message }
  // }
}
//*todo : search ----------------------------------------------------------------

async function findById(id) {
  try {
    let result = await truck_orders.findOne({
      where: { toid: id },
      include: [
        {
          model: member_options,
          required: false,
          include: [
            {
              model: vehicle_types,
              required: false,
            },
          ],
        },
        {
          model: warehouses,
          required: false,
        },
        {
          model: orders,
          required: false,
          include: [
            {
              model: branches,
              required: false,
            },
            {
              model: orders_cost,
              required: false,
              where: {
                toid: id,
              },
            },
          ],
        },
        {
          model: orders_cost,
          required: false,
          where: { sequence: 2 },
          include: [
            {
              model: branches,
              required: false,
            },
          ],
        },
        {
          model: l_no_details,
          required: false,
        },
      ],
    });
    return result;
  } catch (err) {
    console.log(err);
    return { status: "error", data: err.message };
  }
}

async function createByForm(form) {
  try {
    let truck_code = await genTruckCode();

    var result = await truck_orders.create({
      mbid: form.mbid,
      sup_amount: form.sup_amount,
      emps: form.emps,
      remark: form.remark,
      warehouse_id: form.warehouse_id,
      start_date: form.start_date,
      truck_code: truck_code,
      drops: [],
    });
    return { status: "success", data: result };
  } catch (err) {
    return { status: "error", data: err };
  }
}

async function genTruckCode() {
  return new Promise(async (resolve, reject) => {
    const str = "T";
    let month = moment().format("MM").toString().padStart(2, "0");
    let year = moment().format("YY").toString().padStart(2, "0");

    var count = await truck_orders.count({
      where: {
        created_at: {
          [db.op.between]: [moment().startOf("month"), moment().endOf("month")],
        },
      },
    });
    count = (count + 1).toString().padStart(3, "0");
    var truck_code = str + year + month + count;
    resolve(truck_code);
  });
}

async function create(body) {
  try {
    let oids = body.oids;
    let l_no = body.l_no;
    let truck_code = await genTruckCode();
    console.log(truck_code);
    let has_truck_oid = await orders.findAll({
      attributes: ["order_code"],
      where: {
        oid: { [db.op.in]: oids },
        toid: { [db.op.ne]: null },
      },
    });

    if (has_truck_oid.length > 0) {
      return { status: "has truck", data: has_truck_oid };
    } else {
      let result = await truck_orders.create({
        drops: oids ?? [],
        truck_code: truck_code,
        l_no: l_no,
      });

      for (let i = 0; i < oids.length; i++) {
        await orders.update(
          {
            order_status: 3,
            toid: result.toid,
          },
          {
            where: { oid: oids[i] },
          }
        );
      }
      console.log(result);
      return {
        status: "success",
        toid: result.toid,
      };
    }
  } catch (err) {
    console.log(err);
    return { status: "error", data: err.message };
  }
}

async function update(toid, body) {
  try {
    await truck_orders.update(
      {
        mbid: body.mbid,
        sup_amount: body.sup_amount,
        emps: body.emps,
        remark: body.remark,
        warehouse_id: body.warehouse_id,
        start_date: body.start_date,
        drops: body.drops ?? [],
        longest_province: body.longest_province,
        longest_district: body.longest_district,
        l_no: body.l_no,
      },
      {
        where: { toid: toid },
      }
    );

    var result = await truck_orders.findOne({
      where: {
        toid: toid,
      },
    });
    return { status: "success", data: result };
  } catch (err) {
    return { status: "error" };
  }
}

async function destroy(toid) {
  try {
    // let order = await orders.findOne({
    //   attributes: ["wlid"],
    //   where: { toid: toid },
    // });
    // // this.updateShortageGoods(order.wlid)
    // await orders.update(
    //   {
    //     toid: null,
    //     order_status: 2,
    //   },
    //   {
    //     where: {
    //       toid: toid,
    //     },
    //   }
    // );
    let result = await truck_orders.update(
      {
        to_status:0
      },
      {
        where: {
          toid: toid,
        },
      }
    );
    return { status: "success" };
  } catch (err) {
    return { status: "error", data: err };
  }
}

async function updateShortageGoods(wlid, obj = null) {
  return new Promise(async (resolve, reject) => {
    try {
      await WSO_goods.update(
        {
          shortage: obj,
        },
        {
          where: { wlid: wlid },
        }
      );
      resolve();
    } catch (err) {
      reject();
    }
  });
}

async function getVehicleTypes() {
  let result = await vehicle_types.findAll();

  return result;
}

async function updateStatus(target, toid) {
  try {
    // let shortage = [
    //     {
    //         "car": 0,
    //         "work": 0,
    //         "warehouse": 0,
    //         "status" : "",
    //         "toid": toid,
    //     },
    // ]
    //     if(target != 3) {
    //         for(let wlid of wlid_arr){ //*update shortage in wso_goods
    //             if(target == 1){
    //                 this.updateShortageGoods(wlid)
    //             }
    //             if(target == 2){
    //                 this.updateShortageGoods(wlid,shortage)
    //             }
    //         }
    //     }

    await truck_orders.update(
      {
        to_status: target,
      },
      {
        where: { toid: toid },
      }
    );

    return { status: "success" };
  } catch (err) {
    return { status: "error", data: err };
  }
}

async function updateMultipleStatus(target, toid_lists) {
  try {
    for (var toid of toid_lists) {
      await truck_orders.update(
        {
          to_status: target,
        },
        {
          where: { toid: toid },
        }
      );
    }
    return { status: "success" };
  } catch (err) {
    return { status: "error", data: err };
  }
}

async function getCost(vehicle_type, province, district, warehouse_id) {
  try {
    //
    var attribute = "";
    var attribute_join = "";
    if (vehicle_type == 1) {
      attribute = "four_wheels";
      attribute_join = "cost_four_wheels";
    }
    if (vehicle_type == 2) {
      attribute = "six_wheels";
      attribute_join = "cost_six_wheels";
    }
    if (vehicle_type == 3) {
      attribute = "ten_wheels";
      attribute_join = "cost_ten_wheels";
    }

    let result = await cost_mapping.findOne({
      attributes: [attribute, "days", "acid", "kcid", "distance"],
      where: {
        province_name: province,
        district_name: district,
        warehouse_id: warehouse_id,
      },
      include: [
        {
          attributes: [attribute_join],
          model: cost_area_type,
          required: true,
        },
        {
          attributes: [attribute_join, "kcid"],
          model: cost_k_type,
          required: false,
        },
      ],
    });
    if (result) {
      var obj = {
        distance_cost: result.dataValues[attribute],
        // cost_per_drop : result.dataValues.cost_per_drop,
        cost_k:
          result.dataValues?.cost_k_type?.dataValues[attribute_join] ?? null,
        cost_area:
          result.dataValues?.cost_area_type?.dataValues[attribute_join] ?? null,
        days: result.dataValues.days,
        distance: result.dataValues?.distance,
      };

      return { status: "success", data: obj };
    } else {
      return { status: "not found" };
    }
  } catch (err) {
    return { status: "error" };
  }
}

async function removeOrder(toid, oid) {
  try {
    await orders.update(
      {
        toid: null,
        order_status: 2,
      },
      {
        where: {
          oid: oid,
        },
      }
    );
    let drops = [];
    let truck_order = await truck_orders.findOne({
      where: { toid: toid },
    });

    //* remove drop in drops array
    truck_order.drops.map((drop) => {
      if (drop != oid) {
        drops.push(drop);
      }
    });

    //* update to
    let result = await truck_orders.update(
      {
        drops: drops ?? [],
      },
      {
        where: { toid: toid },
      }
    );
    return result;
  } catch (err) {
    return err;
  }
}

async function getDaily(date) {
  try {
    console.log(date);
    var result = await truck_orders.findAll({
      where: {
        // drops:{[db.op.notLike]:[]},
        start_date: {
          [db.op.eq]: date,
        },
        [db.op.or]: [
          { drops: { [db.op.notLike]: [] } },
          { drops: { [db.op.notLike]: null } },
        ],
      },
      // where: [db.sequelize.where(db.sequelize.fn('JSON_LENGTH', db.sequelize.col('drops')),0)],
      include: [
        {
          model: member_options,
          required: false,
          include: [{ model: vehicle_types }],
        },
      ],
    });
    console.log(result.length);
    return { status: "success", data: result };
  } catch (err) {
    //
    return { status: "error" };
  }
}

async function getCostDetail(toid) {
  try {
    var result = await truck_orders.findOne({
      // attributes: ['drops','toid','truck_code'],
      where: {
        toid: toid,
      },
      include: [
        {
          model: orders_cost,
          required: true,
          include: [
            {
              attributes: ["oid", "cus_po_id", "order_code", "order_type_id"],
              model: orders,
              required: true,
              include: [
                {
                  model: branches,
                },
              ],
            },
          ],
        },
      ],
    });
    return { status: "success", data: result };
  } catch (err) {
    return { status: "error" };
  }
}

async function searchByTruckCode(params) {
  try {
    let truck_code = params.truck_code;
    let status = params.status.split(",");

    let result = await truck_orders.findAll({
      where: {
        [db.op.and]: {
          truck_code: { [db.op.substring]: truck_code },
          to_status: { [db.op.in]: status },
        },
      },
      include: [
        {
          model: member_options,
          required: false,
          include: [
            {
              model: vehicle_types,
              required: false,
            },
          ],
        },
        {
          model: orders,
          required: false,
          include: [
            {
              model: branches,
              required: false,
            },
          ],
        },
      ],
    });

    return {
      status: "success",
      data: result,
    };
  } catch (err) {
    console.log(err);
    return {
      status: "error",
      data: err.message,
    };
  }
}

async function operationsReport(query){
  try {
    console.log(query);
    let start_date = JSON.parse(query);
    let query_str = {}
    query_str.to_status = 8
    if (start_date) {
      query_str.start_date = { [db.op.between]: [moment(start_date[0],'YYYY-MM-DD'), moment(start_date[1],'YYYY-MM-DD')] }
    }

    // let map_table = []
    // _cus_group_name.forEach(name => {
    //   let map1 = new Map()
    //   let map2 = new Map()
    //   _job_type_option.forEach(type => {
    //     map2.set(type.value,0)
    //   })
    //   map1.set(name.cus_group_name,Object.fromEntries(map2))
    //   map_table.push(Object.fromEntries(map1))
    // });

    let results = await truck_orders.findAll({
      where:query_str,
      include: [
        {
            model: orders_cost,
            require: true,
            where: {
                sequence: 2,
                is_show_cost:1
            },
            include: [
                { model: branches }
            ]
        },
        {
            model: member_options,
            require: true,
            include: [
                {
                    model: vehicle_types
                }
            ]
        },
      ]
    })

    return {
      status:'success',
      data:results,
    }
  } catch (error) {
    console.log(error);
    return error.message
  }
}

module.exports = {
  setLNo,
  create,
  update,
  findAll,
  findById,
  getVehicleTypes,
  destroy,
  updateStatus,
  updateMultipleStatus,
  removeOrder,
  updateShortageGoods,
  createByForm,
  getCost,
  getDaily,
  genTruckCode,
  getCostDetail,
  searchByTruckCode,
  searchTruckOrdersBySearchObjects,
  operationsReport
};

//! กลับมาไล่ทำ return ให้มันมี status ด้วย
