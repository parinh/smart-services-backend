const moment = require('moment');
const { model } = require('mongoose');
const db = require('../configs/sql.config');
const { member_options, truck_orders, orders, orders_cost, branches, vehicle_types } = db
db.sequelize.sync();

async function findByType(type) {
    try {
        let result = await member_options.findAll({
            attributes: ['mbid', 'name', 'phone_number', 'plate_number', 'vtid'],
            where: {
                typeAccount: type
            }
        });
        return (result)
    }
    catch (err) {

    }

}

async function findByID(id) {
    let result = await member_options.findOne({
        attributes: ['mbid', 'name', 'phone_number', 'plate_number', 'vtid'],
        where: {
            mbid: id
        }
    });
    return (result)
}


async function findByVehicle(vehicle_type) {
    let result = await member_options.findAll({
        attributes: ['mbid', 'name', 'phone_number', 'plate_number', 'vtid'],
        where: {
            vtid: vehicle_type
        }
    });
    return (result)
}

async function groupSubContract() {
    try {
        let result = await member_options.findAll({
            attributes: ['sub_contract'],
            group: 'sub_contract'
        })
        return {
            status: 'success',
            data: result
        }
    }
    catch (err) {

        return {
            status: 'error'
        }
    }
}


async function findMonthlyData(params) {
    try {
        var mbids = await member_options.findAll({
            attributes: ['mbid'],
            where: {
                sub_contract: params.sub_contract
            }
        })
        // console.log(mbids);

        var where_str = {
            start_date: { [db.op.between]: [params.start_date, params.end_date] },
            to_status: 8
        }
        if (params.sub_contract) {
            var mbids = await member_options.findAll({
                attributes: ['mbid'],
                where: {
                    sub_contract: params.sub_contract
                }
            })
            var mbids_arr = mbids.map((obj) => {
                return obj.mbid
            })

            where_str.mbid = { [db.op.in]: mbids_arr }
        }
        else {
            console.log("else");
            where_str.mbid = { [db.op.ne]: null }
        }
        // console.log(where_str);
        var sub_contract_result = await truck_orders.findAll({
            // group:['sub_contract'],
            where: where_str,
            include: [

                {
                    model: orders_cost,
                    require: true,
                    where: {
                        sequence: 2,
                        is_show_cost:1
                    },
                    include: [
                        { model: branches }
                    ]
                },
                {
                    model: member_options,
                    require: true,
                    include: [
                        {
                            model: vehicle_types
                        }
                    ]
                }
            ]
  
    })
    return {
        status: 'success', data: sub_contract_result, mbids: mbids
    }
}
    catch (err) {
    console.log(err.message);
    return {
        status: 'error'
    }
}

}




module.exports = {
    findByType,
    findByID,
    findByVehicle,
    groupSubContract,
    findMonthlyData
}