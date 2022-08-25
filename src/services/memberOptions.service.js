const db = require('../configs/sql.config');
const { member_options} = db
db.sequelize.sync();

async function findByType(type) {
    let result = await member_options.findAll({
        attributes: ['mbid','name','phone_number','plate_number','vehicle_type'],
        where:{
            typeAccount:type
        }
    });
    return (result)
}

async function findByID(id) {
    let result = await member_options.findOne({
        attributes: ['mbid','name','phone_number','plate_number','vehicle_type'],
        where:{
            mbid:id
        }
    });
    return (result)
}


async function findByVehicle(vehicle_type) {
    let result = await member_options.findAll({
        attributes: ['mbid','name','phone_number','plate_number','vehicle_type'],
        where:{
            vehicle_type:vehicle_type
        }
    });
    return (result)
}




module.exports = {
    findByType,
    findByID,
    findByVehicle
}