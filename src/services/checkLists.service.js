const db = require('../configs/sql.config');
const moment = require('moment');
const { warehouses, orders, WSO_lists, WSO_goods, problem_status, check_lists, truck_orders } = db
db.sequelize.sync();

async function findAllOrderWithWSO() {
    try {
        let result = await orders.findAll({
            where: {
                wlid: {
                    [db.op.not]: null
                }
            },
            attributes: ['wlid', 'cus_po_id', 'dead_line_date'],

            include: [
                {
                    model: WSO_lists,
                    required: true,
                    attributes: ['wso_id', 'cus_name', 'job_code'],
                    // include: [{
                    //     model: WSO_goods,
                    //     required: true,
                    // }
                    // ]  
                }
            ],

        });
        return (result)
    }
    catch (err) {

    }

}


async function findWSOById(wlid, toid) {
    try {
        var where_obj = {}
        if (toid) {
            where_obj = { toid: toid }
        }
        let result = await WSO_lists.findOne(
            {
                where: { wlid: wlid },
                include: [{
                    model: WSO_goods,
                    required: false,
                    include: [{
                        model: warehouses
                    }, {
                        model: check_lists,
                        required: false,
                        where: where_obj,
                        separate: true,
                        include: [{
                            model: warehouses
                        }, {
                            model: truck_orders,
                            attributes: ['toid', 'truck_code']
                        }]
                    }]
                }
                ]
            }
        )

        return { status: 'success', data: result }
    }
    catch (err) {

        return { status: err }
    }

}

async function findWaitingPutOut(toid) {
    try {
        //* หยิบ wlid ทั้งหมดใน toid นี้มาแล้วเช็คว่าอันไหนทำแล้วบ้างจาก wl_status
        var result = await orders.findAll({
            where: { toid: toid, wlid: { [db.op.ne]: null } },
            include: [
                {
                    model: truck_orders,
                    attributes: ['truck_code'],
                    required: true
                },
                {
                    model: WSO_lists,
                    require: true,
                    // include: [
                    //    {
                    //     model:WSO_goods
                    //    }
                    // ]
                }]
        })
        return { status: 'success', data: result }

    } catch (error) {

        return { status: 'error' }
    }

}

async function updateShortageGoods(goods) {
    try {
        for (let i = 0; i < goods.length; i++) {
            var new_shortage = {
                warehouse: goods[i].warehouse,
                car: goods[i].car,
                work: goods[i].work
            }
            let shortage_result = await WSO_goods.findOne({
                where: { wgid: goods[i].wgid },
                attributes: ['shortage'],
            })
            var shortage = shortage_result.dataValues.shortage
            shortage.splice(shortage.length - 1, 1) //* remove last index in array
            shortage.push(new_shortage) //* push new obj
            await WSO_goods.update({
                shortage: shortage
            }, {

                where: { wgid: goods[i].wgid },

            })
        }
        return true
    }
    catch (err) {

        return false
    }

}

async function getGoodsStatus() {
    try {
        let result = await problem_status.findAll()

        return {
            status: 'success',
            data: result
        }
    }
    catch (err) {

        return {
            status: 'error',
            data: err
        }
    }
}

async function updateCheckLists(goods) {
    try {
        console.log(goods);
        // for (let good of goods) {
        //     await check_lists.update({
        //         number: good.number,
        //         detail: good.detail,
        //         out_number: good.out_number,
        //         put_out_time: good.put_out_time
        //     }
        //         , {
        //             where: { clid: good.clid }
        //         })
        // }
        // return { status: "success" }

    } catch (error) {

        return { status: "error" }

    }
}
async function updateCheckListsOutNumber(body) {
    try {
        let now = moment().format()
        let goods = body.goods
        let wlid = body.wlid
        // console.log(wlid);
        for (let good of goods) {
            await check_lists.update({
                out_number: good.out_number,
                put_out_time: now,
                problems: good.problems,
                is_put_out: 1
            }
                , {
                    where: { clid: good.clid }
                })
        }
        await this.calSumAllCheckList(wlid)
        return { status: "success" }

    } catch (error) {

        return { status: "error" }

    }
}

async function createChecklists(body) {
    try {
        var goods = body.goods
        var wlid = body.wlid
        //*เอาแค่ตัวแรกมาดูว่ามีชุดนี้กีชุดแล้ว
        var count = await check_lists.count({
            where: {
                toid: goods[0].toid,
                wgid: goods[0].wgid
            },
            // include:[
            //     {
            //         model:WSO_goods
            //     }
            // ]
        })

        // var wlid = _check_lists[0].WSO_good.wlid
        var times = count + 1
        for (let good of goods) {
            await check_lists.create({
                wgid: good.wgid,
                toid: good.toid,
                status: good.status,
                number: good.number ?? 0,
                detail: good.detail,
                warehouse_id: good.warehouse_id,
                times: times
            })
        }
        var result = await this.calSumAllCheckList(wlid)
        // console.log(result);

        // let find = await check_lists.findOrCreate({
        //     where: {
        //         wgid: good.wgid,
        //         toid: good.toid,
        //     },
        //     defaults: {
        //         wgid: good.wgid,
        //         toid: good.toid,
        //         status: good.status,
        //         shortage_type: good.shortage_type,
        //         number: good.number,
        //         detail: good.detail
        //     }
        // })

        // if (!find[1]) { //* false to update
        //     await check_lists.update({
        //         wgid: good.wgid,
        //         toid: good.toid,
        //         status: good.status,
        //         shortage_type: good.shortage_type,
        //         number: good.number,
        //         detail: good.detail

        //     }, {
        //         where: {
        //             wgid: good.wgid,
        //             toid: good.toid,
        //             shortage_type: good.shortage_type,
        //         },
        //     })

        // }

        // //* update missing qty in wso_goods
        // var total_missing =  good.missing_quantity - good.number
        // if(good.missing_quantity != 0){



        // }
        // await WSO_goods.update({
        //     missing_quantity : total_missing
        // },{
        //     where : {
        //         wgid : good.wgid,
        //     }
        // })


        return { status: 'success', data: result }

    }
    catch (err) {
        console.log(err);
        return { status: 'error', data: err.message }
    }
}

async function calSumAllCheckList(wlid) {
    return new Promise(async (resolve, reject) => {
        try {
            var wso_list = await WSO_lists.findOne({
                where: {
                    wlid: wlid
                },
                include: [
                    {
                        model: WSO_goods,
                        include: [
                            {
                                model: check_lists
                            }
                        ]
                    }
                ]
            })
            var goods = wso_list.WSO_goods
            for (var good of goods) {
                var wgid = good.wgid
                var new_missing = good.wso_good_quantity
                var sum_pick_in = 0
                var sum_pick_out = 0

                for (var check_list of good.check_lists) {
                    //* รวมจำนวนขึ้น - ลง
                    sum_pick_in += check_list.number
                    sum_pick_out += check_list.out_number

                    //* รวมจำนวนของค้าง
                    if (check_list.is_put_out == 0) {
                        new_missing -= check_list.number
                    }
                    else {
                        new_missing -= check_list.out_number
                    }
                }
                await WSO_goods.update({
                    missing_quantity: new_missing,
                    sum_pick_in: sum_pick_in,
                    sum_pick_out: sum_pick_out

                }, {
                    where: { wgid: wgid }
                })
                // console.log(new_missing);
            }
            resolve(goods)
        } catch (error) {
            console.log(error.message);
            reject(error)
        }
    })




}

async function updateMissingQuantity(goods) {
    try {
        for (const good of goods) {
            await WSO_goods.update(
                {
                    missing_quantity: good.missing_quantity
                }, {
                where: { wgid: good.wgid }
            }
            )
        }
        return { status: 'success' }
    } catch (error) {

        return { status: 'error' }
    }

}

async function findByTimes(toid, times, wlid) {
    try {
        var result = await WSO_lists.findOne({
            attributes: ['wlid'],
            where: {
                wlid: wlid
            },
            include: [{
                attributes: ['wgid'],
                model: WSO_goods,
                separate: true,
                include: [
                    {

                        model: check_lists,
                        where: {
                            toid: toid,
                            times: times
                        }

                    }
                ]
            }]
        })
        return { status: 'success', data: result }
    } catch (err) {

        return { status: 'error' }
    }

}
async function findCheckListForPickOutForm(query) {
    try {
        let wlid = query.wlid;
        let toid = query.toid;
        console.log(toid);
        let result = await WSO_lists.findOne({
            where: { wlid: wlid, },
            include: [{
                model: WSO_goods,
                include: [{
                    where: {
                        is_put_out: 0,
                        toid: toid
                    },
                    model: check_lists
                }]
            }]

        })
        return { status: 'success', data: result }
    } catch (error) {
        console.log(error.message);
        return { status: 'error' }
    }
}

async function destroyCheckList(query) {
    try {
        var toid = query.toid
        var times = query.times
        var wlid = query.wlid
        let result = await check_lists.destroy({
            where: {
                toid: toid,
                times: times
            }
        })
        await this.calSumAllCheckList(wlid)

        return { status: 'success' }

    } catch (error) {
        console.log(error.message);
        return { status: 'error', data: error.message }
    }
}

async function updateWSOListStatus(body) {
    try {
        const wlid = body.wlid
        const status_target = body.status_target


        await WSO_lists.update({
            wl_status: status_target
        }, {
            where: {
                wlid: wlid,
            }
        })
        // await truck_orders.update({
        //     cl_status:status_target
        // },{
        //     where : {
        //         toid:toid
        //     }
        // })

        return { status: 'success' }

    } catch (error) {

        return { status: 'error' }
    }
}

async function updateWSOGoodWareHouse(goods) {
    try {
        for (let good of goods) {
            // 
            await WSO_goods.update(
                {
                    warehouse_id: good.warehouse_id
                }, {
                where: { wgid: good.wgid }
            }
            )
        }
        return ({ status: 'success' })
    } catch (error) {

        return ({ stauts: 'error', data: error.message })
    }
}

async function getWSOLists() {
    try {
        let result = await WSO_lists.findAndCountAll({
            include: {
                model: WSO_goods,
                where: {
                    missing_quantity: { [db.op.ne]: 0 },
                    // sum_pick_out:{[db.op.eq]: 0}
                }
            }
        })
        return ({ status: 'success', data: result })
    } catch (error) {
        console.log(error);
        return ({ stauts: 'error', data: error.message })
    }
}

async function updateIsConfirm(body) {
    console.log('status_target,toid: ', body);

}


// async function findAllProvinces(){
//     let result = await provinces.findAll();

//     return (result)
// }

// async function findAllWarehouses(){
//     let result = await warehouses.findAll();

//     return result
// }




module.exports = {
    findAllOrderWithWSO,
    findWSOById,
    updateShortageGoods,
    getGoodsStatus,
    createChecklists,
    updateMissingQuantity,
    findByTimes,
    destroyCheckList,
    updateWSOListStatus,
    findWaitingPutOut,
    findCheckListForPickOutForm,
    updateCheckListsOutNumber,
    updateCheckLists,
    updateWSOGoodWareHouse,
    calSumAllCheckList,
    getWSOLists,
    updateIsConfirm

}