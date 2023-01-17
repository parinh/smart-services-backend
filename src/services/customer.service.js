const db = require('../configs/sql.config');
const { customer_groups, branches } = db
db.sequelize.sync();

async function updateBranch(body) {
    try {
        console.log(body);
        let result = await branches.update(

            {
                cust_code: body.cust_code,
                branch_code: body.branch_code,
                cus_group_name: body.cus_group_name ,
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
            },
            {
                where: { branch_id: body.bid }
                
            },)
            console.log(result);
        return { status: 'success', data: result }
    } catch (error) {
        console.log(error);
        return { status: error }
    }

}

async function createBranch(body) {
    try {
        let count = await branches.count({
            where: {
                branch_code: body.branch_code,
            }
        })
        if (count > 0) {
            return { status: 'duplicate' }
        }
        else {
            let result = await db.branches.create({
                cust_code: body.cust_code,
                branch_code: body.branch_code,
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
            return { status: 'success', data: result }
        }

    }
    catch (err) {
        console.log(err);
        return err
    }

}

async function findAll() {
    let result = await db.branches.findAll({

    })
    return result
}

async function findLike(word) {
    let result = await db.branches.findAll({
        where: {
            // branch_name: { [db.op.substring]: word },
            [db.op.or]: [
                { branch_name: { [db.op.substring]: word } },
                { branch_code: { [db.op.substring]: word } },
                { cust_code: { [db.op.substring]: word } }
            ]
        }
    })


    return result
}

async function findCustomerGroups(){
    try {
        let results = await db.customer_groups.findAll()
        
        return results
        
    } catch (err) {
        console.log(err)
        return err
    }
}




module.exports = {
    createBranch,
    findAll,
    updateBranch,
    findLike,
    findCustomerGroups
}