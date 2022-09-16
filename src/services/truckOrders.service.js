const db = require('../configs/sql.config');
const { truck_orders, orders, member_options, branches, vehicle_types, warehouses } = db
db.sequelize.sync();

// async function find(province) {
//     console.log('find')
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

async function findAll() {
    let result = await truck_orders.findAll({
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

    return (result)
}


async function findById(id) {
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
                    }
                ]
            },

        ]
    })

    return (result)
}


async function create(body) {
    try {

        let result = await truck_orders.create({
            drops: body
        })
        for (let i = 0; i < body.length; i++) {
            var update_result = await orders.update({
                order_status: "truck_order",
                toid: result.toid,
            }, {
                where: { oid: body[i] }
            }
            )
        }
        return result
    }
    catch (err) {
        return err
    }
}

async function update(toid, body) {
    try {
        let result = await truck_orders.update({
            mbid: body.mbid,
            sup_amount: body.sup_amount,
            emps: body.emps,
            remark: body.remark,
            warehouse_id: body.warehouse_id,
            start_date: body.start_date,
            drops: body.drops
        }, {
            where: { toid: toid }
        })

        return result[0]
    }
    catch (err) {

        return err
    }

}

async function destroy(toid) {
    try {
        await orders.update({
            toid: null,
            order_status: 'order_lists'
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
        return result
    }
    catch (err) {
        return err
    }
}

async function getVehicleTypes() {
    let result = await vehicle_types.findAll()

    return result
}

async function updateStatus(target, toid) {
    try {
        let result = await truck_orders.update({
            to_status: target
        }, {
            where: { toid: toid }
        })
        return result
    }
    catch (err) {
        return err
    }

}

async function removeOrder(toid, oid) {
    try {
        await orders.update({
            toid: null,
            order_status: "order_lists"
        },
            {
                where: {
                    oid: oid
                }
            }


        )
        let drops = []
        let truck_order =  await truck_orders.findOne({
            where:{toid:toid}
        })

        //* remove drop in drops array
        truck_order.drops.map((drop) =>{
            if(drop != oid){
                drops.push(drop)
            }
        })

        //* update to
        let result = await truck_orders.update({
            drops:drops
        }
        ,{
            where:{toid:toid}
        }
        )
        return result
        

    }
    catch (err) {
        return err
    }
}




module.exports = {
    create,
    update,
    findAll,
    findById,
    getVehicleTypes,
    destroy,
    updateStatus,
    removeOrder
}