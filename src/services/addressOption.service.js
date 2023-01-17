const { Sequelize } = require('../configs/sql.config');
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

async function findAllAddress(){
    try {
        let sub_district = await sub_districts.findAll();
        let district = await districts.findAll();
        let province = await provinces.findAll();
        let zip_code = await sub_districts.findAll({
            // attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('zip_code')), 'zip_code']]
            attributes:['zip_code'],
            group:'zip_code'
            // attributes:[[Sequelize.literal('DISTINCT `zip_code`'), 'zip_code']],
            // attributes:[Sequelize.fn('DISTINCT', Sequelize.col('zip_code'))]
            
            
        })      
        return {
            sub_district: sub_district,
            district: district,
            province: province,
            zip_code: zip_code
        }

    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    find,
    findAllProvinces,
    findAllWarehouses,
    findAllAddress
}

// [Sequelize.fn('DISTINCT', Sequelize.col('country')) ,'country'],