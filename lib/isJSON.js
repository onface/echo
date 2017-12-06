var json5 = require('json5')
module.exports = function (json) {
    try{
        json5.parse(json)
    }
    catch(e) {
        return false
    }
    return true
}
