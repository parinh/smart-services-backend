const db = require('../configs/sql.config');
const { branches, cost_mapping, orders, truck_orders, orders_cost } = db
db.sequelize.sync();

async function findAll() {
    let result = await branches.findAll({
        order: [
            ['province', 'ASC'],
            ['district_name', 'ASC'],
            ['sub_district_name', 'ASC'],
        ],
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
        let orders = await orders_cost.findAll({
            attributes:['oid','toid'],
            group:['oid','toid']
        })
        // console.log(orders);
        for (const order of orders) {
            // console.log(order.oid);
            let count = await orders_cost.count({
                where:{oid:order.oid,toid:order.toid}
            })
            if(count > 2){
                console.log(">>>>>>>>",order.oid);
            }
        }
        return "succ"
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    findAll,
    findById,
    test
}