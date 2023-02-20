const db = require('../configs/sql.config');
const { orders_cost,orders,truck_orders,branches} = db
db.sequelize.sync();


async function AddOrdersCost(body) {
    try {
        var toid = body.toid
        var amount = body.summary_cost
        var fuel_percent = body.fuel_percent
        for (var order of body.orders) {
            for(var i = 1 ; i <= 2 ; i++){ //* สร้าง order_cost มา 2 ตัว ตัวแรกเป็น log ตัวสองตัวแก้
                await upsertOrderCost(order,amount,fuel_percent,toid,i)
            }
        }
        return {status : 'success'}
    }
    catch (err) {
        console.log(err.message);
        return { status: 'error' }
    }
}

async function upsertOrderCost(order,amount,fuel_percent,toid,i){
    return new Promise(async(resolve, reject) => {
        try {
            var find = await orders_cost.count({
                where: {
                    toid: toid,
                    oid: order.oid,
                    sequence:i
                },
                // defaults: {
                //     toid: toid,
                //     oid: order.oid,
                //     sequence:i,
                //     cost_k: order.cost_detail.cost_k,
                //     drop_cost: order.cost_detail.drop_cost,
                //     day_cost: order.cost_detail.day_cost,
                //     distance_cost: order.cost_detail.distance_cost,
                //     sum : order.cost_detail.sum,
                //     amount:amount,
                //     fuel_percent:fuel_percent,
                //     fuel_cost : order.cost_detail.fuel_cost,
                //     branch_id : order.branch_id,
                //     alid: order.alid,
                //     wlid: order.wlid,
                //     cus_po_id: order.cus_po_id,
                //     ship_date: order.ship_date,
                //     sale_id: order.sale_id,
                //     confirm_date: order.confirm_date,
                //     l_no:order.l_no,
                //     job_type: order.job_type,
                //     dead_line_date: order.dead_line_date,
                //     order_type_id: order.order_type_id,
                //     days:order.cost_detail.days,
                //     distance:order.cost_detail.distance,
                //     chance_cost:order.cost_detail.chance_cost,
                //     reimburse_day_cost:order.cost_detail.reimburse_day_cost,
                //     stuck_cost:order.cost_detail.stuck_cost,
                //     back_cost:order.cost_detail.back_cost,
                //     over_distance_cost:order.cost_detail.over_distance_cost,
                //     extra: order.cost_detail.extra,
                //     sub_cost:order.cost_detail.sub_cost,
                //     is_show_cost: order.is_show_cost,
                //     remark: order.remark

                // }
            })
            if (find != 0) { //* false to update
                // console.log('update');
                await orders_cost.update({
                    toid: toid,
                    oid: order.oid,
                    cost_k: order.cost_detail.cost_k ?? 0,
                    drop_cost: order.cost_detail.drop_cost ?? 0,
                    day_cost: order.cost_detail.day_cost ?? 0,
                    distance_cost: order.cost_detail.distance_cost ?? 0,
                    sum : order.cost_detail.sum ?? 0,
                    amount:amount ,
                    fuel_percent:fuel_percent,
                    fuel_cost : order.cost_detail.fuel_cost ?? 0,
                    branch_id : order.branch_id,
                    alid: order.alid ,
                    wlid: order.wlid ,
                    cus_po_id: order.cus_po_id ,
                    ship_date: order.ship_date,
                    sale_id: order.sale_id,
                    confirm_date: order.confirm_date,
                    l_no:order.l_no,
                    job_type: order.job_type,
                    dead_line_date: order.dead_line_date,
                    order_type_id: order.order_type_id,
                    days:order.cost_detail.days ?? 0,
                    distance:order.cost_detail.distance ?? 0,
                    chance_cost:order.cost_detail.chance_cost ?? 0,
                    reimburse_day_cost:order.cost_detail.reimburse_day_cost ?? 0,
                    stuck_cost:order.cost_detail.stuck_cost ?? 0,
                    back_cost:order.cost_detail.back_cost ?? 0,
                    over_distance_cost:order.cost_detail.over_distance_cost ?? 0,
                    extra: order.cost_detail.extra ?? 0,
                    sub_cost:order.cost_detail.sub_cost ?? 0,
                    is_show_cost: order.is_show_cost,
                    remark: order.remark
                }, {
                    where: {
                        toid: toid,
                        oid: order.oid
                    },
                })
                resolve(true)
            }
            else{
                await orders_cost.create({
                    toid: toid,
                    oid: order.oid,
                    sequence:i,
                    cost_k: order.cost_detail.cost_k ?? 0,
                    drop_cost: order.cost_detail.drop_cost ?? 0,
                    day_cost: order.cost_detail.day_cost ?? 0,
                    distance_cost: order.cost_detail.distance_cost ?? 0,
                    sum : order.cost_detail.sum ?? 0,
                    amount:amount ,
                    fuel_percent:fuel_percent,
                    fuel_cost : order.cost_detail.fuel_cost ?? 0,
                    branch_id : order.branch_id,
                    alid: order.alid ,
                    wlid: order.wlid ,
                    cus_po_id: order.cus_po_id ,
                    ship_date: order.ship_date,
                    sale_id: order.sale_id,
                    confirm_date: order.confirm_date,
                    l_no:order.l_no,
                    job_type: order.job_type,
                    dead_line_date: order.dead_line_date,
                    order_type_id: order.order_type_id,
                    days:order.cost_detail.days ?? 0,
                    distance:order.cost_detail.distance ?? 0,
                    chance_cost:order.cost_detail.chance_cost ?? 0,
                    reimburse_day_cost:order.cost_detail.reimburse_day_cost ?? 0,
                    stuck_cost:order.cost_detail.stuck_cost ?? 0,
                    back_cost:order.cost_detail.back_cost ?? 0,
                    over_distance_cost:order.cost_detail.over_distance_cost ?? 0,
                    extra: order.cost_detail.extra ?? 0,
                    sub_cost:order.cost_detail.sub_cost ?? 0,
                    is_show_cost: order.is_show_cost,
                    remark: order.remark
                })
                resolve(true)
            }
            
        } catch (error) {
            reject(error)
        }
    })
}

async function FindOrderCostByTruckOrder(toid){
    try{
        let result = await truck_orders.findOne({
            where: {toid: toid},
            include:[
                {
                model:orders,
                required:true,
                include: [
                    {
                        model:orders_cost,
                        where:{
                            toid:toid
                        },
                        required:true
                    },
                    {
                        model:branches,
                        required:true
                    }
                ]
            },
        ]
        })
        return {status: 'success' ,data:result}
    }
    catch (err) {
        
        return { status: 'error' }
    }
}

async function UpdateOrdersCost(body){
    try{
        var toid = body.toid
        var amount = body.summary_cost

        for (var order of body.orders) {
            // order.cost_k
            let result = await orders_cost.update({
                cost_k: order.cost_k,
                drop_cost: order.drop_cost,
                day_cost: order.day_cost,
                distance_cost: order.distance_cost,
                sum : order.sum,
                amount:amount,
                fuel_cost : order.fuel_cost,
                l_no:order.l_no,
                days:order.days,
                chance_cost:order.chance_cost,
                reimburse_day_cost:order.reimburse_day_cost,
                stuck_cost:order.stuck_cost,
                back_cost:order.back_cost,
                over_distance_cost:order.over_distance_cost,
                extra: order.extra,
                sub_cost:order.sub_cost
            }, {
                where: {
                    toid: toid,
                    oid: order.oid,
                    sequence:2
                },
            })
        }
        return { status: 'success'}
        
    }
    catch (err) {
        
        return { status: 'error' }
    }
}

async function resetOrderCostToSeqOne(toid){
    try{
        var _orders = await orders.findAll({
            attributes: ['oid'],
            where: {
                toid: toid
            },
            include: [
                {
                    model:  orders_cost,
                    where:{toid:toid},
                    separate: true,
                } 
            ]
        })
        await truck_orders.update(
            {
                to_status:5
            },
            {
            where:{toid:toid}
        }
        )
        _orders.forEach(async(order) => {
            var oid = order.oid
            var order_costs = order.orders_costs[0] //*seq_1

            await orders_cost.update(
                {
                    cost_k:order_costs.cost_k,
                    day_cost: order_costs.day_cost,
                    distance_cost: order_costs.distance_cost,
                    drop_cost: order_costs.drop_cost,
                    sum: order_costs.sum,
                    amount: order_costs.amount,
                    fuel_cost: order_costs.fuel_cost,
                    chance_cost: order_costs.chance_cost,
                    reimburse_day_cost: order_costs.reimburse_day_cost,
                    stuck_cost: order_costs.stuck_cost,
                    back_cost: order_costs.back_cost,
                    over_distance_cost: order_costs.over_distance_cost,
                    extra: order_costs.extra,
                    sub_cost: order_costs.sub_cost,
                    problems: order_costs.problems,
                    problem_remark: order_costs.problem_remark,
                    is_finish: order_costs.is_finish,
                },
                {
                where:{oid: oid,toid:toid,sequence:2},
                } 
            )
        })
        return({
            status:'success'
        })

    }
    catch (err) {
        
        return({
            status:'error'
        })
    }
    
}

async function deleteOrderCost(toid,oid){
    try {
        await orders_cost.destroy({
            where:{toid:toid,oid:oid}
        })
        return({
            status:'success'
        })
    } catch (error) {
        return({
            status:'error'
        })
    }
    
}


module.exports = {
    AddOrdersCost,
    FindOrderCostByTruckOrder,
    UpdateOrdersCost,
    resetOrderCostToSeqOne,
    deleteOrderCost
}