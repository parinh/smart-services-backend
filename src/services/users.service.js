const bcrypt = require('bcrypt');
const jwt = require('../services/jwt.service');

const db = require('../configs/sql.config');
const { users, user_roles } = db
db.sequelize.sync();

const saltRounds = 12;

async function find() {
    var result = await users.findAll();
    return (result)
}

async function findById(id) {
    var result = await users.findOne({
        where: { uid: id },
    })

    return (result)
}


async function getUserRoles() {
    try {
        var result = await user_roles.findAll()
        return ({
            status: 'success', data: result
        })
    } catch (error) {
        console.log(error);
        return ({
            status: 'error',
        })
    }

}

async function findByUsername(username) {
    return await users.findOne({ username: username });
}

async function authenticated(AuthRequired) {
    // var founded = await findByUsername(AuthRequired.username);
    var founded = await users.findOne({
        where: { username: AuthRequired.username }
    })
    if (founded) {
        var result = await bcrypt.compare(AuthRequired.password, founded.password)
        if (result) {
            var user = {
                id: founded.id,
                name: founded.name,
                tel: founded.tel,
                role_id: founded.role_id,
                username: founded.username,
                l_no: founded.l_no
            }
            var token = jwt.signToken(user);
            return {
                result: true,
                data: user,
                token: token
            }
        }
        else {
            return {
                result: false,
                data: '',
            }
        }

    }
    else {
        return {
            result: false,
            data: '',
        }
    }
}

async function update(body, id) {
    result = await users.update({
        name: body.name,
        tel: body.tel,
        role_id: body.role_id,
        username: body.username
    }, {
        where: { uid: id }
    })
    return (result)
}

async function genPassWord(body) {
    try {

        let hash = await hashPassword('x')


        var result = await users.update({
            password: hash,

        }
            , {
                where: { uid: 6 }
            }
        )

        return 'success'
    }
    catch (err) {

        return 'error'
    }
}


function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hashPassword) {
                resolve(hashPassword)
            });
        })


    })
}

async function create(body) {
    let hash = await hashPassword(body.password)
    let count = await users.count({
        where: { username: body.username }
    })

    if (count == 0) { //* is DupUser
        let result = await users.create({
            name: body.name,
            tel: body.tel,
            role_id: body.role_id,
            username: body.username,
            password: hash

        })
        return (result)
    }
    else {
        let result = "Duplicate Username"
        return (result)
    }
}

async function destroy(id) {
    let result = await users.destroy({
        where: { uid: id }
    })
    return (result)
}

module.exports = {
    find,
    findById,
    create,
    findByUsername,
    authenticated,
    update,
    destroy,
    genPassWord,
    getUserRoles
}