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
                    attributes: ['wso_id', 'cus_name', 'job_code', 'so_number'],
                    // include: [{
                    //     model: WSO_goods,
                    //     required: true,
                    // }
                    // ]  
                }
            ],

        });
        return { status: 'success', data: result }
    }
    catch (err) {
        return { status: 'error', data: err.message }
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
        for (let good of goods) {
            await check_lists.update({
                number: good.number,
                // detail: good.detail,
                out_number: good.out_number,
                warehouse_id: good.warehouse_id,
                problems: good.problems
            }
                , {
                    where: { clid: good.clid }
                })
        }
        return { status: "success" }

    } catch (error) {

        return { status: "error" }

    }
}
async function updateCheckListsOutNumber(body) {
    try {
        let now = moment().format()
        let goods = body.goods
        let wlid = body.wlid
        // 
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
        // 

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
                // 
            }
            resolve(goods)
        } catch (error) {

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

        return { status: 'error', data: error.message }
    }
}

 //* ทำเรื่องแยกฝ่ายให้ wso_lists เพื่อไปโชว์  , ทำรวมปัญหาของแต่ละของทั้งหมดไปเก็บที่ wso_good
function addProblems(good, wlid) {
    return new Promise(async (resolve, reject) => {
        try {
            let wso = await WSO_lists.findOne({
                where: { wlid: wlid },
                include: {
                    attributes: ['wgid'],
                    model: WSO_goods,
                    require: true,
                }
            })
            if (wso) {
                let problems = await problem_status.findAll({})
                let goods_ids = []
                for (const good of wso.WSO_goods) { //* เอา id good มาทุกตัว
                    goods_ids.push(good.wgid)
                }
                let lists = await check_lists.findAll({
                    where: { wgid: { [db.op.in]: goods_ids }, is_confirm: 1 },
                })
                let problems_types = []
                let good_problems_hm = new Map();
                
                for (const list of lists) { //* เอา problem ทุกตัวมาเก็บใน array
                    if (list.problems) {
                        for (const problem of list.problems) {
                            if (!problems_types.includes(problem.problem_id)) { //* เก็บใน array เพื่อไปทำ wso_list บอกฝ่ายที่เกี่ยวกับปัญหา
                                problems_types.push(problem.problem_id)
                            }

                            //* เอาปัญหาทั้งหมดมาแยกเป็นของว่าของมีปัญหาอะไร เก็บใน hm
                            if (good_problems_hm.get(list.wgid)){
                                let arr = good_problems_hm.get(list.wgid)
                                arr.push(problem.problem_id)
                                arr = [...new Set(arr)]
                                good_problems_hm.set(list.wgid,arr)
                            }
                            if(!good_problems_hm.get(list.wgid)){
                                good_problems_hm.set(list.wgid,[problem.problem_id])
                            }
                        }
                    }
                }
                //* ช่วงเช็ค ฝ่ายว่าฝ่ายไหนบ้างที่ตรงกับปห
                let types = []
                problems_types.forEach(problem_id => { //* เอาปหทุกตัวมาดูว่าเป็น type ไหกนบ่าง
                    let arr = problems[problem_id - 1].type
                    types.push(...arr)
                })
                types = [...new Set(types)]; //* เอาตัวซ้ำออก
                console.log(types);
                if (types.length == 0) {
                    types = null
                }

                for(let [key,value] of good_problems_hm){
                    await WSO_goods.update({
                        problems: value
                    },{
                        where:{wgid:key}
                    })
                }

                await WSO_lists.update({
                    problem_types: types
                }, {
                    where: { wlid: wlid }
                })
                resolve()

            }

            // console.log(result);
        } catch (error) {
            reject(error)
        }
    })
}

async function updateIsConfirm(body) {
    try {

        const toid = body.toid
        const times = body.times
        const status_target = body.status_target
        const good_ids = body.good_ids
        const wlid = body.wlid

        await check_lists.update({
            is_confirm: status_target
        }, {
            where: {
                toid: toid,
                times: times
            }
        })

        await addProblems(good_ids, wlid)
        return { status: 'success' }

    } catch (error) {
        console.log(error);
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

        return ({ status: 'error', data: error.message })
    }
}

async function getWSOLists(query) {
    try {
        let itemsPerPage = parseInt(query.items_per_page)
        let page = parseInt(query.page)
        let result = await WSO_lists.findAndCountAll({
            // where:{problem_types: {[db.op.ne]: null }},

            include: {
                model: WSO_goods,
                require: true,
                where: {
                    missing_quantity: { [db.op.ne]: 0 },
                    // sum_pick_out:{[db.op.eq]: 0}
                },
                offset: itemsPerPage * (page - 1),
                limit: itemsPerPage,
            },
        })

        return ({ status: 'success', data: result.rows, count: result.count })
    } catch (error) {
        console.log(error);
        return ({ status: 'error', data: error.message })
    }
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
    findWaitingPutOut,
    findCheckListForPickOutForm,
    updateCheckListsOutNumber,
    updateCheckLists,
    updateWSOGoodWareHouse,
    calSumAllCheckList,
    getWSOLists,
    updateIsConfirm

}