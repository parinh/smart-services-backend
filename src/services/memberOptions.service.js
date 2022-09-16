const db = require('../configs/sql.config');
const { member_options} = db
db.sequelize.sync();

async function findByType(type) {
    try{
        let result = await member_options.findAll({
            attributes: ['mbid','name','phone_number','plate_number','vtid'],
            where:{
                typeAccount:type
            }
        });
        return (result)
    }
    catch(err){
        console.log(err)
    }
    
}

async function findByID(id) {
    let result = await member_options.findOne({
        attributes: ['mbid','name','phone_number','plate_number','vtid'],
        where:{
            mbid:id
        }
    });
    return (result)
}


async function findByVehicle(vehicle_type) {
    let result = await member_options.findAll({
        attributes: ['mbid','name','phone_number','plate_number','vtid'],
        where:{
            vtid:vtid
        }
    });
    return (result)
}




module.exports = {
    findByType,
    findByID,
    findByVehicle
}