const db = require('../configs/sql.config');
const { orders,WSO_lists,WSO_goods} = db
db.sequelize.sync();

async function findAllOrderWithWSO() {
    let result = await orders.findAll({
        where: {toid:{
            [db.op.not]: null
        }},
        include: [
            {
                model: WSO_lists,
                required: true,
                include: [{
                    model: WSO_goods,
                    required: true,
                }
                ]
            }
        ],

    });
    return (result)
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

}