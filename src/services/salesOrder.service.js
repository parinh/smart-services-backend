require("dotenv").config();
const utf8 = require("utf8");
const xlsxFile = require("read-excel-file/node");
const moment = require("moment");

const fs = require("fs");
const path = require("path");

const db = require("../configs/sql.config");
const { truck_orders } = require("../configs/sql.config");

const {
  salesOrder,
  ASO_goods,
  ASO_lists,
  WSO_lists,
  WSO_goods,
  orders,
  branches,
  orderTypes,
  problem_status,
  orders_cost,
} = db;
db.sequelize.sync();
let l_no = "0";

// async function testReadFile(aso_file) {

//     var status = await store_file(aso_file, './public/test/' + aso_file.name)
//     if (status) {
//         var row = xlsxFile('./public/test/' + aso_file.name).then((rows) => {

//             console.table(rows);

//         })
//         return row

//     }

// }
function setLNo(_l_no) {
  l_no = _l_no ?? "0";
}

async function test() {
  try {
    const str = "T";
    let month = moment().format("MM").toString().padStart(2, "0");
    let year = moment().format("YY").toString().padStart(2, "0");

    var count = await orders.count({
      where: {
        created_at: {
          [db.op.between]: [moment().startOf("month"), moment().endOf("month")],
        },
      },
    });
    count = count.toString().padStart(3, "0");
    var order_code = str + year + month + count;
    return count;
  } catch (err) {}
}

async function search(query) {
  try {
    let result = await orders.findAll({
      where: {},
    });
    return { status: "success" };
  } catch (error) {
    return { status: "error", massage: error.message };
  }
}

async function find() {
  let result = await orders.findAll({
    include: [
      {
        model: ASO_lists,
        required: false,
      },
      {
        model: WSO_lists,
        required: false,
      },
      {
        model: branches,
        required: false,
      },
    ],
  });
  return result;
}
//TODO branch search by name cust code

async function updateShowCost(_orders) {
  try {
    for (let order of _orders) {
      await orders.update(
        {
          is_show_cost: order.is_show_cost,
        },
        {
          where: { oid: order.oid },
        }
      );
    }
    return { status: "success" };
  } catch (error) {
    return { status: "error", massage: error.massage };
  }
}

async function findByProblem() {
  try {
    var result = await orders.findAll({
      where: {
        order_type_id: 2,
      },
      include: [
        {
          model: branches,
        },
      ],
    });
    return { status: "success", data: result };
  } catch (error) {
    return { status: "error", massage: error.massage };
  }
}

async function findByStatus(status, option) {
  var query_str = { order_status: status };
  if (option == "no_confirm_date") {
    query_str.confirm_date = { [db.op.eq]: null };
  }
  if (option == "confirm_date") {
    query_str.confirm_date = { [db.op.ne]: null };
  }
  if (l_no != "0") {
    query_str.l_no = l_no;
  }
  let result = await orders.findAll({
    order: [["oid", "DESC"]],
    where: query_str,
    include: [
      {
        model: ASO_lists,
        required: false,
      },
      {
        model: WSO_lists,
        required: false,
      },
      {
        model: branches,
        required: false,
      },
      {
        model: orderTypes,
        required: false,
      },
    ],
  });
  //
  return result;
}

async function findByHasTruckOrder(query) {
  try {
    //* ItemsPerPage กับ page จาก Frontend----------------------------
    let page = parseInt(query.page); //*
    let itemsPerPage = parseInt(query.itemsPerPage); //*
    console.log("page ::", page, "itemsPerPage ::", itemsPerPage); //*
    //*--------------------------------------------------------------

    let where_str = { toid: { [db.op.ne]: null } };
    if (l_no != "0") {
      where_str.l_no = l_no;
    }
    let result = await orders.findAndCountAll({
      order: [
        // db.fn('max',db.col('branch_id'))
        ["oid", "DESC"],
      ],
      where: where_str,
      include: [
        {
          model: branches,
          required: false,
        },
      ],
      offset: itemsPerPage * (page - 1),
      limit: itemsPerPage,
    });
    return {
      status: "success",
      data: result.rows,
      count: result.count,
    };
  } catch (err) {
    return { status: "error", message: err.message };
  }
}

async function findByConfirmed(value) {
  let result = await orders.findAll({
    where: { is_confirm: value },
  });
  return result;
}

async function findById(id) {
  let result = await orders.findOne({
    where: { oid: id },
    include: [
      {
        model: branches,
        required: false,
      },
    ],
  });
  return result;
}

async function findOrderByIdArray(oids) {
  try {
    var result = await orders.findAll({
      where: {
        oid: { [db.op.in]: oids },
      },
      include: [
        {
          model: branches,
          required: false,
        },
      ],
    });
    return { status: "success", data: result };
  } catch (err) {
    return { status: "error" };
  }
}

async function genOrderCode() {
  return new Promise(async (resolve, reject) => {
    const str = "B";
    let month = moment().format("MM").toString().padStart(2, "0");
    let year = moment().format("YY").toString().padStart(2, "0");

    var count = await orders.count({
      where: {
        created_at: {
          [db.op.between]: [moment().startOf("month"), moment().endOf("month")],
        },
      },
    });
    count = (count + 1).toString().padStart(3, "0");
    var order_code = str + year + month + count;
    resolve(order_code);
  });
}

async function create_by_form(body, files = "") {
  try {
    let form = JSON.parse(body.form);
    let aso_result = "";
    let wso_result = "";

    //*create file set
    if (body.aso_detail) {
      let aso_detail = JSON.parse(body.aso_detail);
      aso_result = await create_aso_set(
        aso_detail.aso_lists,
        aso_detail.aso_goods
      );
    }
    if (body.wso_detail) {
      let wso_detail = JSON.parse(body.wso_detail);
      wso_result = await create_wso_set(
        wso_detail.wso_lists,
        wso_detail.wso_goods
      );
    }
    if (body.spec_sheet_detail) {
      let spec_sheet_detail = JSON.parse(body.spec_sheet_detail);

      //TODO อย่าลืมทำ read spec sheet detail
      // spec_sheet_result = await create_wso_set(wso_detail.wso_lists, wso_detail.wso_goods)
    }

    let order_code = await genOrderCode();

    //*create orders
    let result = await orders.create({
      cus_group_name: form.cus_group_name,
      branch_id: form.branch_id,
      cus_po_id: form.cus_po_id,
      sale_id: form.sale_id,
      ship_date: form.ship_date,
      created_by: form.created_by,
      confirm_date: form.confirm_date,
      dead_line_date: form.dead_line_date,
      job_type: form.job_type,
      l_no: form.l_no,
      remark: form.remark,
      alid: aso_result.alid,
      wlid: wso_result.wlid,
      order_code: order_code,
      order_status: 1,
    });

    //* get order_id add to path
    var dir_path = `${__dirname}/../../public/files/${result.oid}`; //process.env.DIR_FILE_PATH + result.oid
    var aso_dir_path = dir_path + process.env.ASO_FILE_PATH;
    var wso_dir_path = dir_path + process.env.WSO_FILE_PATH;
    var spec_sheet_dir_path = dir_path + process.env.SPEC_SHEET_FILE_PATH;
    var other_dir_path = dir_path + process.env.OTHER_FILE_PATH;

    //* make dir set
    await make_dir(dir_path);
    await make_dir(aso_dir_path);
    await make_dir(wso_dir_path);
    await make_dir(spec_sheet_dir_path);
    await make_dir(other_dir_path);

    //*store files
    if (result && files) {
      let aso_name = "";
      let wso_name = "";
      let spec_sheet_name = "";
      let other_name_array = [];

      if (files.aso_file) {
        aso_name = utf8.decode(files.aso_file.name);
        var file_path = aso_dir_path + aso_name;
        await store_file(files.aso_file, file_path);
      }
      if (files.wso_file) {
        wso_name = utf8.decode(files.wso_file.name);
        var file_path = wso_dir_path + wso_name;
        await store_file(files.wso_file, file_path);
      }
      if (files.spec_sheet_file) {
        spec_sheet_name = utf8.decode(files.spec_sheet_file.name);
        var file_path = spec_sheet_dir_path + spec_sheet_name;
        await store_file(files.spec_sheet_file, file_path);
      }
      if (files.other_file) {
        for (var i = 0; i < files.other_file.length; i++) {
          other_name_array.push(utf8.decode(files.other_file[i].name));
          var file_path =
            other_dir_path + utf8.decode(files.other_file[i].name);
          await store_file(files.other_file[i], file_path);
        }
      }

      await orders.update(
        {
          aso_file: aso_name,
          wso_file: wso_name,
          spec_sheet_file: spec_sheet_name,
          other_files: other_name_array,
        },
        {
          where: { oid: result.oid },
        }
      );
    }

    return { status: "success" };
  } catch (err) {
    return { status: "error", data: err.message };
  }
}

async function create_aso_set(aso_lists, aso_goods) {
  return new Promise(async (resolve, reject) => {
    try {
      var aso_result = await ASO_lists.create({
        cus_id: aso_lists.cus_id,
        aso_id: aso_lists.aso_id,
        doc_date: aso_lists.doc_date,
        sum_good_price: aso_lists.sum_good_price,
        cus_po_id: aso_lists.cus_po_id,
        ref_no: aso_lists.ref_no,
        ship_date: aso_lists.ship_date,
        cus_name: aso_lists.cus_name,
        address: aso_lists.address,
        cont_tel: aso_lists.cont_tel,
        cont_name: aso_lists.cont_name,
        sale_area_code: aso_lists.sale_area_code,
        job_code: aso_lists.job_code,
        job_name: aso_lists.job_name,
        emp_name: aso_lists.emp_name,
      });

      if (aso_result) {
        var aso_result_id = aso_result.alid;
        // ids.aso_id = aso_result_id

        for (let aso_good of aso_goods) {
          await ASO_goods.create({
            aso_id: aso_good.aso_id,
            alid: aso_result_id,
            list_num: aso_good.list_num,
            aso_good_code: aso_good.aso_good_code,
            aso_good_name: aso_good.aso_good_name,
            aso_good_amount: aso_good.aso_good_amount,
            aso_good_quantity: aso_good.aso_good_quantity,
            aso_good_price: aso_good.aso_good_price,
          });
        }
        resolve(aso_result);
      }
    } catch (err) {
      reject(err);
    }
  });
}

async function create_wso_set(wso_lists, wso_goods) {
  return new Promise(async (resolve, reject) => {
    try {
      var wso_result = await WSO_lists.create({
        wso_id: wso_lists.wso_id,
        doc_date: wso_lists.doc_date,
        ship_date: wso_lists.ship_date,
        cus_code: wso_lists.cus_code,
        cus_name: wso_lists.cus_name,
        job_code: wso_lists.job_code,
        job_name: wso_lists.job_name,
        dep_name: wso_lists.dep_name,
      });

      if (wso_result) {
        var wso_result_id = wso_result.wlid;

        for (let wso_good of wso_goods) {
          await WSO_goods.create({
            wso_id: wso_good.wso_id,
            wlid: wso_result_id,
            wso_good_code: wso_good.wso_good_code,
            wso_good_name: wso_good.wso_good_name,
            wso_good_amount: Number(wso_good.wso_good_amount),
            wso_good_quantity: Number(wso_good.wso_good_quantity),
            wso_good_price: Number(wso_good.wso_good_price),
            missing_quantity: Number(wso_good.wso_good_quantity),
          });
        }
        resolve(wso_result);
      }
    } catch (err) {
      reject(err);
    }
  });
}

async function create_by_files(body, aso_file, wso_file) {
  try {
    var ids = await create_with_file(body, aso_file, wso_file);

    if (ids) {
      await make_dir(process.env.ASO_FILE_PATH + ids.aso_id);

      await make_dir(process.env.WSO_FILE_PATH + ids.wso_id);

      var aso_file_path =
        process.env.ASO_FILE_PATH + ids.aso_id + "/" + aso_file.name + ".csv";
      var wso_file_path =
        process.env.WSO_FILE_PATH + ids.wso_id + "/" + wso_file.name + ".csv";

      await store_file(aso_file, aso_file_path);

      await store_file(wso_file, wso_file_path);
    }
  } catch (err) {}
}

async function deleteOneOtherFile(oid, file_name) {
  try {
    var dir_path =
      `${__dirname}/../../public/files/` + oid + process.env.OTHER_FILE_PATH;
    //get one order from dir
    var other_files = await listAllFileOnDir(dir_path);
    // remove file on dir
    fs.unlinkSync(dir_path + file_name);
    //update array on other_files[]
    var index = other_files.indexOf(file_name);
    if (index > -1) {
      other_files.splice(index, 1);
    }
    var result = await updateOtherFiles(oid, other_files);

    return result;
  } catch (err) {}
}

async function updateOtherFiles(oid, array) {
  var result = await orders.update(
    {
      other_files: array,
    },
    {
      where: { oid: oid },
    }
  );
  return result[0];
}

// async function deleteFileByPath(path) {
//     return new Promise(function (resolve, reject) {
//         try {
//             fs.unlink(path)
//             resolve(true)
//         }
//         catch (err) {
//             reject(err)
//         }
//     })
// }

async function make_dir(path) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}

async function store_file(file, path) {
  return new Promise((resolve, reject) => {
    file.mv(path, function (err) {
      reject(err);
    });
    resolve(true);
  });
}

async function create_with_file(body, aso_file = "", wso_file = "") {
  try {
    var ids = {};
    var aso = body.aso;
    var aso_goods = body.aso_goods;
    var wso = body.wso;
    var wso_goods = body.wso_goods;

    var aso_result = await ASO_lists.create({
      cus_id: aso.cus_id,
      aso_id: aso.aso_id,
      doc_date: aso.doc_date,
      sum_good_price: aso.sum_good_price,
      cus_po_id: aso.cus_po_id,
      ref_no: aso.ref_no,
      ship_date: aso.ship_date,
      cus_name: aso.cus_name,
      address: aso.address,
      cont_tel: aso.cont_tel,
      cont_name: aso.cont_name,
      sale_area_code: aso.sale_area_code,
      job_code: aso.job_code,
      job_name: aso.job_name,
      emp_name: aso.emp_name,
    });

    if (aso_result) {
      var aso_result_id = aso_result.alid;
      ids.aso_id = aso_result_id;

      for (let aso_good of aso_goods) {
        await ASO_goods.create({
          aso_id: aso_good.aso_id,
          alid: aso_result_id,
          list_num: aso_good.list_num,
          aso_good_code: aso_good.aso_good_code,
          aso_good_name: aso_good.aso_good_name,
          aso_good_amount: aso_good.aso_good_amount,
          aso_good_quantity: aso_good.aso_good_quantity,
          aso_good_price: aso_good.aso_good_price,
        });
      }

      var wso_result = await WSO_lists.create({
        wso_id: wso.wso_id,
        doc_date: wso.doc_date,
        ship_date: wso.ship_date,
        cus_code: wso.cus_code,
        cus_name: wso.cus_name,
        job_code: wso.job_code,
        job_name: wso.job_name,
        dep_name: wso.dep_name,
      });

      if (wso_result) {
        var wso_result_id = wso_result.wlid;
        ids.wso_id = wso_result_id;
        for (let wso_good of wso_goods) {
          await WSO_goods.create({
            wlid: wso_result_id,
            wso_id: wso_good.wso_id,
            wso_good_code: wso_good.wso_good_code,
            wso_good_name: wso_good.wso_good_name,
            wso_good_quantity: wso_good.wso_good_quantity,
          });
        }

        await orders.create({
          alid: aso_result_id,
          wlid: wso_result_id,
          cus_po_id: aso.cus_po_id,
          cus_name: aso.cus_name,
          address: aso.address,
          ship_date: aso.ship_date,
          created_by: body.created_by,
          order_status: 1,
        });
      }

      return ids;
    }
  } catch (err) {}
}

async function updateOneOrder(body, files = null) {
  try {
    let form = JSON.parse(body.form);
    //

    //* update order by id
    let update_result = await orders.update(
      {
        cus_group_name: form.cus_group_name,
        branch_id: form.branch_id,
        cus_po_id: form.cus_po_id,
        sale_id: form.sale_id,
        ship_date: form.ship_date,
        created_by: form.created_by,
        confirm_date: form.confirm_date,
        dead_line_date: form.dead_line_date,
        job_type: form.job_type,
        l_no: form.l_no,
        remark: form.remark,
      },
      {
        where: {
          oid: form.oid,
        },
      }
    );

    if (files) {
      var order = await findById(form.oid);
      var dir_path = `${__dirname}/../../public/files/${form.oid}`; //process.env.DIR_FILE_PATH + result.oid
      // var dir_path = process.env.DIR_FILE_PATH + form.oid

      if (files.aso_file) {
        await removeAllFilesOnDir(dir_path + process.env.ASO_FILE_PATH);
        await removeAsoBy_alid(order.alid);
        var file_path =
          dir_path +
          process.env.ASO_FILE_PATH +
          utf8.decode(files.aso_file.name);
        await store_file(files.aso_file, file_path);
        await orders.update(
          {
            aso_file: utf8.decode(files.aso_file.name),
          },
          { where: { oid: form.oid } }
        );
      }
      if (files.wso_file) {
        await removeAllFilesOnDir(dir_path + process.env.WSO_FILE_PATH);
        //TODO removeWSOBy_wlid
        var file_path =
          dir_path +
          process.env.WSO_FILE_PATH +
          utf8.decode(files.wso_file.name);
        await store_file(files.wso_file, file_path);
        await orders.update(
          {
            wso_file: utf8.decode(files.wso_file.name),
          },
          { where: { oid: form.oid } }
        );
      }
      if (files.spec_sheet_file) {
        await removeAllFilesOnDir(dir_path + process.env.SPEC_SHEET_FILE_PATH);
        //TODO removeshid
        var file_path =
          dir_path +
          process.env.SPEC_SHEET_FILE_PATH +
          utf8.decode(files.spec_sheet_file.name);
        await store_file(files.spec_sheet_file, file_path);
        await orders.update(
          {
            spec_sheet_file: utf8.decode(files.spec_sheet_file.name),
          },
          { where: { oid: form.oid } }
        );
      }
      if (files.other_file) {
        var other_file_path = dir_path + process.env.OTHER_FILE_PATH;
        //*list all file on other file folder
        var file_name_lists = await listAllFileOnDir(other_file_path);

        var temp_files = files.other_file;

        //*แยก files 1 อันให้เก็บใน array
        if (!files.other_file.length) {
          temp_files = [files.other_file];
        }

        for (var i = 0; i < temp_files.length; i++) {
          var file_path =
            other_file_path + "/" + utf8.decode(temp_files[i].name);
          await store_file(temp_files[i], file_path);
          file_name_lists.push(utf8.decode(temp_files[i].name));
        }
        await orders.update(
          {
            other_files: file_name_lists,
          },
          {
            where: { oid: form.oid },
          }
        );
      }

      //TODO: update aso.wso.spec.other file name on order
      return [1];
    }

    return update_result;
  } catch (err) {
    return err;
  }
}

async function listAllFileOnDir(path) {
  return new Promise(function (resolve, reject) {
    try {
      var array = [];
      fs.readdir(path, (err, files) => {
        files.forEach((file) => {
          array.push(file);
        });

        resolve(array);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function removeAsoBy_alid(alid) {
  // return new promise((resolve, reject) => {
  await ASO_lists.destroy({
    where: { alid: alid },
  });
  await ASO_goods.destroy({
    where: { alid: alid },
  });

  // })
}

async function removeAllFilesOnDir(dir_path) {
  fs.readdir(dir_path, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(dir_path, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

async function updateStatus(status_target, oid) {
  let update_result = await orders.update(
    {
      order_status: status_target,
    },
    {
      where: {
        oid: oid,
      },
    }
  );

  return update_result;
}

async function updateType(type_target, oid) {
  let update_result = await orders.update(
    {
      order_status: status_target,
    },
    {
      where: {
        oid: oid,
      },
    }
  );

  return update_result;
}

async function updateToFinished(
  status_target,
  type_target,
  oid,
  problems_target,
  problem_remark = null,
  toid
) {
  try {
    var option = {
      // toid: null,
      ship_date: null,
      confirm_date: null,
      order_status: status_target,
      problems: problems_target,
      order_type_id: type_target,
      problem_remark: problem_remark,
      is_show_cost: 1,
      is_finish: 1,
    };

    var update_result = await orders_cost.update(option, {
      where: { oid: oid, toid: toid, sequence: 2 },
    });
    if (update_result[0] == 1) {
      return { status: "success" };
    } else {
      return { status: "not changed" };
    }
  } catch (err) {
    return { status: "error" };
  }
}

async function getFilesById(target = "") {
  var dir_path = `${__dirname}/../../public/files/${form.oid}`;
  var path = dir_path + target;

  fs.readdirSync(path).forEach((file) => {});
}

async function addOrderToTruckOrder(body) {
  var _orders = body.orders;
  var toid = body.toid;
  var drops = body.drops;

  var object = _orders.map((order) => {
    return { oid: order };
  });

  await truck_orders.update(
    {
      drops: drops ?? [],
    },
    {
      where: {
        toid: toid,
      },
    }
  );

  var result = await orders.update(
    {
      toid: toid,
      order_status: 3,
    },
    {
      where: {
        [db.op.or]: object,
      },
    }
  );
  return result;
}

// async function searchOrders(value) {
//     try {
//         const query_str = {}
//         const join_query_str = {}
//         var required = true
//         const { cus_po_id, cus_name, order_status, has_truck } = value

//         query_str.order_status = order_status

//         if (has_truck) {
//             query_str.toid = { [db.op.ne]: null };
//         }
//         if (cus_po_id) {
//             query_str.cus_po_id = { [db.op.substring]: cus_po_id };
//             required = false
//         }
//         if (cus_name) {
//             join_query_str.branch_name = { [db.op.substring]: cus_name }
//         }

//         let result = await orders.findAll({
//             where: query_str,
//             include: [
//                 {

//                     model: branches,
//                     where: join_query_str,
//                     required: required
//                 }
//             ]
//         })

//         return { status: 'success', data: result }
//     }
//     catch (err) {

//     }

// }
async function searchOrders(params) {
  try {
    console.log("params :", params);
    var query_str = [];
    var arr = []
    var join_query_str = {};
    var required = true;
    const { search, order_status, has_truck } = params;
    console.log("search", search);
    console.log("order_status", order_status);
    console.log("has_truck", has_truck);

    query_str.order_status = order_status;
    arr.push({order_status:order_status})

    console.log("query_str.order_status", query_str.order_status);

    if (has_truck) {
    //   query_str.toid = { [db.op.ne]: null };
      arr.push({
        toid:{[db.op.ne] : null}
      })
    }
    if (search) {
    //   query_str.cus_po_id = { [db.op.substring]: search };
      arr.push({
        cus_po_id:{[db.op.substring] : search}
      })
    //   query_str.cus_group_name = { [db.op.substring]: search };
    //   query_str.job_type = { [db.op.substring]: search };
    //   query_str.order_code = { [db.op.substring]: search };
    //   query_str.sale_id = { [db.op.substring]: search };

    //   query_str.branch_name = { [db.op.substring]: search };
    //   query_str.cont_name = { [db.op.substring]: search };
    //   query_str.district_name = { [db.op.substring]: search };
    //   query_str.province = { [db.op.substring]: search };
    //   query_str.sub_district_name = { [db.op.substring]: search };
    //   query_str.zip_code = { [db.op.substring]: search };
    }

    console.log("query_str :: ", query_str);
    console.log(arr);

    let result = await orders.findAll({
      where: {
        [db.op.or]: [arr],
      },
      // include: [
      //     {
      //         model: branches,
      //         where: join_query_str,
      //         required: required
      //     }
      // ]
    });
    console.log("result :: ", result.length);
    return { status: "success", data: result };
  } catch (err) {
    console.log("error :: ", err.message);
  }
}

async function getProblemStatus() {
  try {
    var result = await problem_status.findAll();
    return { status: "success", data: result };
  } catch (err) {
    return { status: "error" };
  }
}

async function resetOrdersToSuccess(toid) {
  try {
    var _orders = await orders.findAll({
      attributes: ["oid"],
      where: { toid: toid },
      include: [
        {
          model: orders_cost,
          where: { is_finish: 1, sequence: 2, toid: toid },
        },
      ],
    });
    _orders.forEach(async (order) => {
      var oid = order.oid;
      var order_costs = order.orders_costs[0];
      var order_status = 2;
      if (order_costs.order_type_id == 4) {
        order_status = 4;
      }

      await orders.update(
        {
          toid: null,
          ship_date: null,
          confirm_date: null,
          order_status: 4,
          problems: order_costs.problems,
          order_type_id: order_costs.order_type_id,
          problem_remark: order_costs.problem_remark,
          order_status: order_status,
        },
        {
          where: { oid: oid },
        }
      );
    });
    return { status: "success" };
  } catch (err) {
    return { status: "error" };
  }
}

async function getWSOForChecklists(status) {
  try {
    var results = await truck_orders.findAll({
      attributes: ["toid", "truck_code"],
      where: {
        to_status: 3, //* สำหรับเช็คว่า wso ตัวนี้ใบรถยีนยันหรือยัง
      },
      include: [
        {
          attributes: ["wlid"],
          model: orders,
          include: [
            {
              model: WSO_lists,
              required: true,
              where: {
                wl_status: {
                  [db.op.in]: status,
                },
              },
            },
          ],
        },
      ],
    });
    var arr = results.filter((result) => {
      return result.orders.length > 0;
    });
    // var result = await WSO_lists.findAll({
    //     where: {
    //         wl_status:{
    //             [db.op.in]:status
    //         }
    //     },
    //     include: [
    //         {
    //             model:WSO_goods
    //         }
    //     ]
    // })
    return { status: "success", data: arr };
  } catch (error) {
    return { status: "error" };
  }
}

module.exports = {
  find,
  findByStatus,
  findById,
  findOrderByIdArray,
  findByConfirmed,
  create_by_files,
  create_by_form,
  updateOneOrder,
  updateStatus,
  make_dir,
  getFilesById,
  deleteOneOtherFile,
  addOrderToTruckOrder,
  updateType,
  findByHasTruckOrder,
  searchOrders,
  updateToFinished,
  getProblemStatus,
  genOrderCode,
  resetOrdersToSuccess,
  getWSOForChecklists,
  setLNo,
  search,
  updateShowCost,
  findByProblem,
  test,
};
