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
        //
        let costs = await orders_cost.findAll({
        })
        console.log(costs.length); 
        for (let cost of costs) {
            console.log(cost.ocid);
            let new_sum = cost.cost_k + cost.day_cost + cost.distance_cost + cost.drop_cost + cost.fuel_cost + cost.chance_cost + cost.reimburse_day_cost + cost.stuck_cost + cost.back_cost + cost.over_distance_cost + cost.extra + cost.sub_cost
            let update_result = await orders_cost.update({
                sum:new_sum
            },{
                where: {ocid:cost.ocid}
            })
            console.log("result",update_result);
        }
        console.log(costs.length); 
        return "success"
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    findAll,
    findById,
    test
}