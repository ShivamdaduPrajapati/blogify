const jwt = require("jsonwebtoken")
const secretKey = require("../config/token")

function verify(token) {
        const payload = jwt.verify(token , secretKey)
        return payload
}
module.exports = {
    verify
}