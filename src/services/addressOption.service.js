const db = require('../configs/sql.config');
const { provinces, districts, sub_districts,warehouses} = db
db.sequelize.sync();

async function find(province) {
    let result = await provinces.findAll({
        where: {name_th:province},
        include: [
            {
                model: districts,
                required: true,
                include: [{
                    model: sub_districts,
                    required: true,
                }
                ]
            }
        ],

    });
    return (result)
}

async function findAllProvinces(){
    let result = await provinces.findAll();

    return (result)
}

async function findAllWarehouses(){
    let result = await warehouses.findAll();

    return result
}



module.exports = {
    find,
    findAllProvinces,
    findAllWarehouses
}