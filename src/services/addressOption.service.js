const { Sequelize } = require('../configs/sql.config');
const db = require('../configs/sql.config');
const { provinces, districts, sub_districts, warehouses } = db
db.sequelize.sync();

async function find(province) {
    try {
        let result = await provinces.findOne({
            where: { name_th: province },
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
            // order: [[sub_districts,districts, 'name_th', 'ASC'],],
            order: [[districts, 'name_th', 'ASC',],],
            // order: [{model: districts} , 'district_id'],


        });
        return (result)
    } catch (error) {
        console.log(error);
    }
}

async function findAllProvinces() {
    try {
        let result = await provinces.findAll({
            order: [['name_th', 'ASC']]
        });

        return (result)
    } catch (error) {
        console.log(error);
    }

}

async function findAllWarehouses() {
    let result = await warehouses.findAll();

    return result
}

async function findAllAddress() {
    try {
        let sub_district = await sub_districts.findAll(
            {
                order: [['name_th', 'ASC']]
            }
        );
        let district = await districts.findAll(
            {
                order: [['name_th', 'ASC']]
            }
        );
        let province = await provinces.findAll(
            {
                order: [['name_th', 'ASC']]
            }
        );
        let zip_code = await sub_districts.findAll({
            // attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('zip_code')), 'zip_code']]
            attributes: ['zip_code'],
            group: 'zip_code',
            order: [['zip_code', 'ASC']]
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