const db = require('../configs/sql.config');
const { truck_orders, orders, member_options ,branches , vehicle_types } = db
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
        where : { toid: id},
        include: [
            {
                model: member_options,
                required: false,
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
    try{

        let result = await truck_orders.create()
    
        for (let i = 0; i < body.length; i++) {
            await orders.update({
                order_status: "truck_order",
                toid: result.toid,
            }, {
                where: { oid: body[i] }
            }
            )
        }
        return result
    }
    catch(err){
        return err
    }
}

async function update(toid,body){
    try{
        let result = await truck_orders.update({
            mbid: body.mbid,
            sup_amount: body.sup_amount,
            emps:body.emps,
            remark: body.remark
        },{
            where: { toid:toid }
        })

        return result[0]
    }
    catch(err){
        return err
    }

}

async function getVehicleTypes(){
    let result = await vehicle_types.findAll()

    return result
}




module.exports = {
    create,
    update,
    findAll,
    findById,
    getVehicleTypes
}