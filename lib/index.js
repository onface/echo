var request = require('request')
var Mock = require('mockjs')
var json5 = require('json5')
var isJSON = require('./isJSON')
var jsonformat = require('json-format')
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
module.exports = function (options) {
    var adapter = new FileSync(options.dbFile)
    var db = low(adapter)
    db.defaults({cache: []}).write()
    return function (req, res, next) {
        req.db = db
        var paramArray = req.path.split('/')
        paramArray.shift()
        if (paramArray.length < 4) {
            return
        }
        var account = paramArray[0]
        var repo = paramArray[1]
        var branch = paramArray[2]
        var path = paramArray.slice(3).join('/')
        var cache = req.db.get('cache')
        var echoMock = function (content) {
            var data = null
            var mockData = null
            if (isJSON(content)) {
                data = json5.parse(content)
                mockData = Mock.mock(data)
                content = jsonformat(mockData)
            }
            res.type('text')
            res.send(content)
            return
        }
        if (req.query.$clear) {
            cache.remove({path: req.path}).write()
            res.send({
                status: 'success'
            })
            return
        }
        var cacheData = cache.find({path: req.path}).value()
        if (cacheData) {
            echoMock(cacheData.content)
            return
        }
        else {
            request('https://raw.githubusercontent.com' + req.path, function (err, response, body) {
                if (err) {res.send(err);return}
                var content = body
                cache.push({
                    path: req.path,
                    content: content
                }).write()
                echoMock(content)
                return
            })
        }
    }
}
