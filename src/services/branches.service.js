const db = require('../configs/sql.config');
const { branches, cost_mapping, orders, truck_orders , orders_cost } = db
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
    console.log("test");
    let _orders = await orders.findAll({
        attributes: ['oid','confirm_date']
    })

    for (var order of _orders){
        console.log(order.oid);
        await orders_cost.update({
            confirm_date: order.confirm_date
        },{
            where:{oid:order.oid}
        })
    }



    return "success !!!"
}

module.exports = {
    findAll,
    findById,
    test
}