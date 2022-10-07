const db = require('../configs/sql.config');
const { mapping_area } = db
db.sequelize.sync();

async function getAllAreaNumber() {
    let number_array = []
    let results = await mapping_area.findAll({
        attributes: ['l_no'],
        group: "l_no"
    });
    results.map((result) => {
        number_array.push(result.l_no)
    })
    number_array.sort(function (a, b) { //* sort array
        return a - b;
    });


    return (number_array)
}

async function mappingAreaNumber(address) {

    let result = await mapping_area.findOne({
        where: {
            district: address.district,
            province: address.province

        }
    })

    return result
}

async function mappingByZone(zone) {

    try {
        let result = await mapping_area.findOne({
            attributes: ['l_no'],
            where: {
                zone: zone
            }
        })
        return { status: 'success', data: result }

    }
    catch (err) {
        console.log(err);
        return { status: 'error' }
    }


}


module.exports = {
    getAllAreaNumber,
    mappingAreaNumber,
    mappingByZone
}