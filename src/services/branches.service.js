const db = require('../configs/sql.config');
const { branches, cost_mapping, orders, truck_orders, orders_cost } = db
db.sequelize.sync();

async function findAll() {
    let result = await branches.findAll({
    });
    return (result)
}

async function findById(id) {
    let result = await branches.findOne({
        where: { branch_id: id }
    })
    return result
}


//TODO : update branch
async function updateOneBranches(body) {
    // let update_result = await branches.update({
    //     cus_group_name: ,
    //     branch_name: ,
    //     province: ,
    //     zip_code: ,
    //     sub_district_name: ,
    //     district_name: ,
    //     address: ,
    //     lat: ,
    //     lng: ,
    //     cont_name: ,
    //     cont_tel: ,
    //     zone: ,
    //     l_no: ,
    //     billing_province: ,
    //     billing_zip_code: ,
    //     billing_sub_district_name: ,
    //     billing_district_name: ,
    //     billing_address: ,
    // })
}

async function test() {
    try {
        console.log("test");
        let toids = await orders_cost.findAll({
            attributes: ['ocid','toid', 'oid'],
            where: {
                ship_date: null
            }
        })
        console.log(toids);

        for (var ele of toids) {
            var result = await truck_orders.findOne({
                attributes: ['start_date'],
                where: { toid: ele.toid }
            })
            // console.log(result);
            await orders_cost.update({
                ship_date: result.start_date
            }, {
                where: { toid: ele.toid, oid:ele.oid}
            })
            // return result
        }



        // console.log(toids);
        // for (var order of _orders){
        //     console.log(order.oid);
        //     await orders_cost.update({
        //         confirm_date: order.confirm_date
        //     },{
        //         where:{oid:order.oid}
        //     })
        // }



        return toids
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    findAll,
    findById,
    test
}