const db = require('../configs/sql.config');
const { orders, WSO_lists, WSO_goods, goods_status, check_lists } = db
db.sequelize.sync();

async function findAllOrderWithWSO() {
    try {
        let result = await orders.findAll({
            where: {
                toid: {
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
        console.error(err)
    }

}


async function findWSOById(wlid,toid) {
    try{
        var where_obj = {}
        if(toid){
            where_obj = {toid:toid}
        }
        let result = await WSO_lists.findOne(
            {
                where: { wlid: wlid },
                include: [{
                    model: WSO_goods,
                    required: false,
                    include: [{
                        model:check_lists,
                        required: false,
                        where: where_obj
                    }]
                }
                ]
            }
        )
        return {status:'success',data:result}
    }
    catch (err) {
        return {status:error}
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
        console.log(err);
        return false
    }

}

async function getGoodsStatus() {
    try {
        let result = await goods_status.findAll()

        return {
            status: 'success',
            data: result
        }
    }
    catch (err) {
        console.log(err);
        return {
            status: 'error',
            data: err
        }
    }
}

async function upsertChecklists(goods) {
    try {
        console.log(goods);
        for (let good of goods) {
            let find = await check_lists.findOrCreate({
                where: {
                    wgid: good.wgid,
                    toid: good.toid,
                    shortage_type: good.shortage_type,
                },
                defaults:{
                    wgid: good.wgid,
                    toid: good.toid,
                    status: good.status,
                    shortage_type: good.shortage_type,
                    number: good.number,
                    detail: good.detail
                    }
            })
            
            if (!find[1]) { //* false to update
                await check_lists.update({
                    wgid: good.wgid,
                    toid: good.toid,
                    status: good.status,
                    shortage_type: good.shortage_type,
                    number: good.number,
                    detail: good.detail
                    
                },{
                    where: {
                        wgid: good.wgid,
                        toid: good.toid,
                        shortage_type: good.shortage_type,
                    },
                })
                
            }
        }

        return {status: 'success'}

    }
    catch (err) {
        console.log(err);
        return {status: 'error'}
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
    upsertChecklists

}