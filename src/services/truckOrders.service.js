const db = require('../configs/sql.config');
const moment = require('moment');
const jwt_service = require('../services/jwt.service');
const { orders_cost, truck_orders, orders, member_options, branches, vehicle_types, warehouses, WSO_lists, WSO_goods, cost_mapping, cost_area_type, cost_k_type,l_no_details } = db
db.sequelize.sync();
let l_no = "0"

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
    let split_bearer = headers.authorization.split(' ')[1]
    l_no = jwt_service.decodeToken(split_bearer).data.l_no ?? l_no
}

async function findAll(status = []) {
    try {
        let return_lno = l_no
        console.log('l_no : ',return_lno);
        let where_str = {}
        if (status) {
            where_str.to_status = {
                [db.op.in]: status
            }
        }
        if (l_no != "0") {
            where_str.l_no = l_no
        }
        let result = await truck_orders.findAll({
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

            ]
        });

        return { status: 'success', data: result ,l_no:return_lno };
    }
    catch (err) {
        return { status: 'error', message: err.message }
    }

}


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
                            required: false
                        }
                    ]
                },
                {
                    model: warehouses,
                    required: false
                },
                {
                    model: orders,
                    required: false,
                    include: [
                        {
                            model: branches,
                            required: false
                        },
                        {
                            model: orders_cost,
                            required: false,
                            where: {
                                toid: id
                            }
                        }
                    ]
                },
                {
                    model: orders_cost,
                    required: false,
                    where: { sequence: 2 },
                    include: [
                        {
                            model: branches,
                            required: false
                        }
                    ]
                },
                {
                    model:l_no_details,
                    required: false,
                }

            ]
        })
        return (result)
    }
    catch (err) {
        console.log(err);
        return ({ status: 'error', data: err.message })
    }

}

async function createByForm(form) {
    try {

        let truck_code = await genTruckCode()

        var result = await truck_orders.create({
            mbid: form.mbid,
            sup_amount: form.sup_amount,
            emps: form.emps,
            remark: form.remark,
            warehouse_id: form.warehouse_id,
            start_date: form.start_date,
            truck_code: truck_code,
            drops: []
        })
        return { status: 'success', data: result }

    }
    catch (err) {

        return { status: 'error', data: err }
    }

}

async function genTruckCode() {
    return new Promise(async (resolve, reject) => {
        const str = "T"
        let month = moment().format('MM').toString().padStart(2, '0')
        let year = moment().format('YY').toString().padStart(2, '0')

        var count = await truck_orders.count({
            where: {
                created_at: {
                    [db.op.between]: [
                        moment().startOf('month'),
                        moment().endOf('month')
                    ]
                }
            }
        })
        count = (count + 1).toString().padStart(3, '0')
        var truck_code = str + year + month + count
        resolve(truck_code)
    })
}


async function create(body) {
    try {
        let oids = body.oids
        let l_no = body.l_no
        let truck_code = await genTruckCode()
        console.log(truck_code);
        let has_truck_oid = await orders.findAll({
            attributes: ['order_code'],
            where: {
                oid: { [db.op.in]: oids },
                toid: { [db.op.ne]: null }
            }
        })

        if (has_truck_oid.length > 0) {
            return { status: 'has truck', data: has_truck_oid }
        }
        else {

            let result = await truck_orders.create({
                drops: oids ?? [],
                truck_code: truck_code,
                l_no: l_no
            })

            for (let i = 0; i < oids.length; i++) {
                await orders.update({
                    order_status: 3,
                    toid: result.toid,

                }, {
                    where: { oid: oids[i] }
                }
                )
            }
            console.log(result);
            return { 
                status: 'success',
                toid : result.toid
             }
        }



    }
    catch (err) {
        console.log(err);
        return { status: "error", data: err.message }
    }
}

async function update(toid, body) {
    try {
        await truck_orders.update({
            mbid: body.mbid,
            sup_amount: body.sup_amount,
            emps: body.emps,
            remark: body.remark,
            warehouse_id: body.warehouse_id,
            start_date: body.start_date,
            drops: body.drops ?? [],
            longest_province: body.longest_province,
            longest_district: body.longest_district,
            l_no: body.l_no

        }, {
            where: { toid: toid }
        })

        var result = await truck_orders.findOne({
            where: {
                toid: toid
            }
        })
        return { status: 'success', data: result }



    }
    catch (err) {

        return { status: 'error' }
    }

}

async function destroy(toid) {
    try {
        let order = await orders.findOne({
            attributes: ['wlid'],
            where: { toid: toid }
        })
        // this.updateShortageGoods(order.wlid)
        await orders.update({
            toid: null,
            order_status: 2
        }, {
            where: {
                toid: toid
            }
        })
        let result = await truck_orders.destroy({
            where: {
                toid: toid
            }
        })
        return { status: 'success' }
    }
    catch (err) {

        return err
    }
}

async function updateShortageGoods(wlid, obj = null) {
    return new Promise(async (resolve, reject) => {
        try {
            await WSO_goods.update({
                shortage: obj,
            }, {
                where: { wlid: wlid },

            }
            )
            resolve()
        }
        catch (err) {

            reject()
        }

    })
}

async function getVehicleTypes() {
    let result = await vehicle_types.findAll()

    return result
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

        await truck_orders.update({
            to_status: target,
        }, {
            where: { toid: toid }
        })

        return { status: 'success' }

    }
    catch (err) {

        return { status: 'error', data: err }
    }

}

async function updateMultipleStatus(target, toid_lists) {
    try {
        for (var toid of toid_lists) {
            await truck_orders.update({
                to_status: target,
            }, {
                where: { toid: toid }
            })
        }
        return { status: 'success' }
    }
    catch (err) {

        return { status: 'error', data: err }
    }
}

async function getCost(vehicle_type, province, district, warehouse_id) {
    try {
        // 
        var attribute = ''
        var attribute_join = ''
        if (vehicle_type == 1) {
            attribute = 'four_wheels'
            attribute_join = 'cost_four_wheels'
        }
        if (vehicle_type == 2) {
            attribute = 'six_wheels'
            attribute_join = 'cost_six_wheels'
        }
        if (vehicle_type == 3) {
            attribute = 'ten_wheels'
            attribute_join = 'cost_ten_wheels'
        }

        let result = await cost_mapping.findOne({
            attributes: [attribute, 'days', 'acid', 'kcid', 'distance'],
            where: {
                province_name: province,
                district_name: district,
                warehouse_id: warehouse_id
            },
            include: [
                {
                    attributes: [attribute_join],
                    model: cost_area_type,
                    required: true,
                },
                {
                    attributes: [attribute_join, 'kcid'],
                    model: cost_k_type,
                    required: false,
                }
            ],
        })
        if (result) {

            var obj = {
                distance_cost: result.dataValues[attribute],
                // cost_per_drop : result.dataValues.cost_per_drop,
                cost_k: (result.dataValues?.cost_k_type?.dataValues[attribute_join] ?? null),
                cost_area: (result.dataValues?.cost_area_type?.dataValues[attribute_join] ?? null),
                days: result.dataValues.days,
                distance: result.dataValues?.distance
            };

            return { status: 'success', data: obj }
        }
        else {

            return { status: 'not found' }
        }



    }
    catch (err) {

        return { status: 'error' }
    }
}

async function removeOrder(toid, oid) {
    try {
        await orders.update({
            toid: null,
            order_status: 2
        },
            {
                where: {
                    oid: oid
                }
            }


        )
        let drops = []
        let truck_order = await truck_orders.findOne({
            where: { toid: toid }
        })

        //* remove drop in drops array
        truck_order.drops.map((drop) => {
            if (drop != oid) {
                drops.push(drop)
            }
        })

        //* update to
        let result = await truck_orders.update({
            drops: drops ?? []
        }
            , {
                where: { toid: toid }
            }
        )
        return result


    }
    catch (err) {

        return err
    }
}

async function getDaily(date) {
    try {
        console.log(date);
        var result = await truck_orders.findAll({
            where: {
                // drops:{[db.op.notLike]:[]},
                start_date: {
                    [db.op.eq]: date
                },
                [db.op.or]:[
                    { drops:{[db.op.notLike]:[]} },
                    { drops:{[db.op.notLike]:null} },
                ]
            },
            // where: [db.sequelize.where(db.sequelize.fn('JSON_LENGTH', db.sequelize.col('drops')),0)],
            include: [
                {
                    model: member_options,
                    required: false,
                    include: [
                        { model: vehicle_types }
                    ]
                }

            ]
        })
        console.log(result.length);
        return { status: 'success', data: result }
    }
    catch (err) {
        // 
        return { status: 'error' }
    }

}

async function getCostDetail(toid) {
    try {
        var result = await truck_orders.findOne({
            // attributes: ['drops','toid','truck_code'],
            where: {
                toid: toid
            },
            include: [
                {
                    model: orders_cost,
                    required: true,
                    include: [
                        {
                            attributes: ['oid', 'cus_po_id', 'order_code', 'order_type_id'],
                            model: orders,
                            required: true,
                            include: [{
                                model: branches
                            }]
                        }
                    ]
                }
            ]
        })
        return { status: 'success', data: result }
    }
    catch (err) {
        return { status: 'error' }
    }
}



async function searchByTruckCode(params) {
    try {
        let truck_code = params.truck_code
        let status = params.status.split(',')

        let result = await truck_orders.findAll({
            where: {
                [db.op.and]: {
                    truck_code: { [db.op.substring]: truck_code },
                    to_status: { [db.op.in]: status }
                }
            },
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

            ]
        });

        return {
            status: 'success',
            data: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: 'error',
            data: err.message
        }
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
    searchByTruckCode
}


//! กลับมาไล่ทำ return ให้มันมี status ด้วย