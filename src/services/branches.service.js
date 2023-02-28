const db = require('../configs/sql.config');
const { branches, cost_mapping, orders, truck_orders, orders_cost, member_options } = db
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
        //** ตัวเช็ค order_cost เกิน 2 ตัว */
        // let orders = await orders_cost.findAll({
        //     attributes:['oid','toid'],
        //     group:['oid','toid']
        // })
        // // console.log(orders);
        // for (const order of orders) {
        //     // console.log(order.oid);
        //     let count = await orders_cost.count({
        //         where:{oid:order.oid,toid:order.toid}
        //     })
        //     if(count > 2){
        //         console.log(">>>>>>>>",order.oid);
        //     }
        // }
        // return "succ"

        let _truck_orders = await truck_orders.findAll({
            attributes: ['truck_code'],
            group: ['truck_code']
        })
        for (let truck_order of _truck_orders) {
            let count = await truck_orders.count({
                where: { truck_code: truck_order.truck_code },
            })
            if (count != 1) {
                let trucks = await truck_orders.findAll({
                    
                    where: { truck_code: truck_order.truck_code },
                    // order: ['toid', 'ASC'],
                    raw: true,
                    nest: true,
                    include: [
                        { model: member_options, require: false },
                    ]
                })
                // console.log('trucks: ', trucks);
                for (let [i,truck] of trucks.entries()) {
                    await truck_orders.update({
                        truck_code: `${truck.truck_code}/${(i+1)}`
                    },{
                        where:{toid:truck.toid}

                    })
                    console.log(`${truck.truck_code}/${(i+1)} คนขับ:${truck.member_option.name}(${truck.member_option.sub_contract}) วันส่ง:${truck.start_date} ภาค:${truck.l_no ?? "ไม่มี"}`);
                }
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