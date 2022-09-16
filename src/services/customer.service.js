const db = require('../configs/sql.config');
const { customer_groups, branches } = db
db.sequelize.sync();


async function createBranch(body) {
    try {
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
            zone: body.zone,
            l_no: body.l_no,
            billing_province: body.billing_province,
            billing_zip_code: body.billing_zip_code,
            billing_sub_district_name: body.billing_sub_district_name,
            billing_district_name: body.billing_district_name,
            billing_address: body.billing_address
        })
        return result
    }
    catch (err) {
        return err
    }

}

async function findAll() {
    let result = await db.branches.findAll({

    })
    return result
}

async function findLike(word) {
    console.log(word)
    let result = await db.branches.findAll({
        where: {
            branch_name: { [db.op.substring]: word }
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