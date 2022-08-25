const db = require('../configs/sql.config');
const { customer_groups, branches } = db
db.sequelize.sync();


async function createBranch(body) {
    let result = await db.branches.create({
        cus_group_name: body.cus_group_name,
        branch_name: body.branch_name,
        province: body.province,
        zip_code: body.zip_code,
        sub_district_name: body.sub_district_name,
        district_name: body.district_name,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        cont_name: body.cont_name,
        cont_tel: body.cont_tel,
    })
    return result
}

async function findAll() {
    let result = await db.branches.findAll({
      
    })
    return result
}

async function findLike(word){
    console.log(word)
    let result = await db.branches.findAll({
        where: {
            branch_name : {[db.op.substring] : word}
            // [db.op.or]: [
                // {branch_name : {[db.op.substring] : word}},
                // {cus_group_name : {[db.op.substring] : word}}
            // ]
        }
    })

    console.log(result)

    return result
}




module.exports = {
    createBranch,
    findAll,
    findLike
}