const db = require('../configs/sql.config');
const { job_type_options, } = db
db.sequelize.sync();

async function findAll() {
    let result = await job_type_options.findAll({});
    return (result)
}

module.exports = {
    findAll
}