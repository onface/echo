var request = require('request')
var extend = require('extend')
var Mock = require('mockjs')
var json5 = require('json5')
var isJSON = require('./isJSON')
var jsonformat = require('json-format')
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var sham = require('shamjs')
module.exports = function (options) {
    var adapter = new FileSync(options.dbFile)
    var db = low(adapter)
    db.defaults({cache: []}).write()
    return function (req, res, next) {
        req.db = db
        var paramArray = req.path.split('/')
        paramArray.shift()
        if (paramArray.length < 4) {
            next()
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
                if (Array.isArray(mockData.data)) {
                    var queryResult = sham.query(mockData.data, {
                        query: req.query
                    })
                    var list = queryResult.data
                    // 改变数据排序
                    delete mockData.data
                    delete queryResult.data
                    extend(true, mockData, queryResult)
                    mockData.data = list
                }
                content = jsonformat(mockData)
            }
            res.type('text')
            res.send(content)
            return
        }
        if (typeof req.query.$clear !== 'undefined') {
            cache.remove({path: req.path}).write()
            res.type('html')
            res.send('success! <a href="' + req.path + '">' + req.path + '</a>')
            next()
            return
        }
        var cacheData = cache.find({path: req.path}).value()
        if (cacheData) {
            echoMock(cacheData.content)
            next()
            return
        }
        else {
            request('https://raw.githubusercontent.com' + req.path, function (err, response, body) {
                if (err) {res.send(err);return}
                if (response.statusCode === 404) {
                    res.status(404)
                    res.send(body)
                    return
                }
                cache.push({
                    path: req.path,
                    content: body
                }).write()
                echoMock(body)
                next()
                return
            })
        }
    }
}
