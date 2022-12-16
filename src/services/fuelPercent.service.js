const db = require('../configs/sql.config');
const { fuel_percent, } = db
db.sequelize.sync();

async function findOne() {
    try {
        let result = await fuel_percent.findAll({
            attributes:['value'],

        });
        return {
            status: 'success', data: result
        }
    } catch (error) {
        return { status: 'error'}
    }
    
}

module.exports = {
    findOne
}