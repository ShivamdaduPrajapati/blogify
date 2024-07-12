const bcrypt = require("bcryptjs")

function createhash(password){
    return bcrypt.hash(password,10);
}

function comparehash(hashpassword,password){
    return bcrypt.compare(password,hashpassword)
}

module.exports = {
    createhash,
    comparehash
}

