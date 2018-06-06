var request = require('request')
var extend = require('extend')
var Mock = require('mockjs')
var json5 = require('json5')
var isJSON = require('./isJSON')
var jsonformat = require('json-format')
var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var markrun = require('markrun')
var sham = require('shamjs')
var indexHTMLCache = ''
var jsonModif = require('json-modif')
var index = function (req, res, next) {
    if (typeof req.query.$clear !== 'undefined') {
        indexHTMLCache = ''
    }
    function echoHTML (html) {
        res.type('html')
        res.send(html)
    }
    if (indexHTMLCache) {
        echoHTML(indexHTMLCache)
        return
    }
    else {
        request('https://raw.githubusercontent.com/onface/echo/master/README.md', function (err, response, content) {
            var html = markrun(content, {
                template: require('markrun-themes').vue({
                    header: markrun.string([
                            '<a class="markdown-header-logo" href="https://github.com/onface/echo">',
                            '    <img class="markdown-header-logo-photo"  src="https://avatars1.githubusercontent.com/u/20395258?s=200&v=4" />',
                            '    <span class="markdown-header-logo-text">echo-mock</span>',
                            '</a>',
                    		'<ul class="markdown-header-nav" >',
                            '    <li>',
                            '        <a href="https://github.com/onface/echo/issues" class="markdown-header-nav-link">社区</a>',
                            '    </li>',
                    		'</ul>'
                        ]),
                    sidebar: '<h1 id="markrunCurrentPageTitle"></h1>'
                })
            })
            indexHTMLCache = html
            echoHTML(html)
            return
        })
    }
}


module.exports = function (options) {
    var adapter = new FileSync(options.dbFile)
    var db = low(adapter)
    db.defaults({cache: []}).write()
    return function (req, res, next) {
        if (req.path === '/') {
            index(req, res, next)
            return
        }
        res.header('Access-Control-Allow-Origin', '*')
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
        var echoMock = function (content, req) {
            var data = null
            var mockData = null
            var contentIsJSON = isJSON(content)
            if (contentIsJSON) {
                data = json5.parse(content)
                if (req.query.$attr) {
                    data = jsonModif.query(req.query.$attr, data)
                }
                mockData = Mock.mock(data)
                if (Array.isArray(mockData.data)) {
                    var queryParam = extend(true, {}, req.query)
                    // $前缀的 query 是系统配置，不是查询参数
                    Object.keys(queryParam).forEach(function (key) {
                        if (queryParam[key].trim() === '') {
                            delete queryParam[key]
                        }
                        if (key[0] === '$') {
                            delete queryParam[key]
                        }
                    })
                    delete queryParam.callback
                    var queryResult = sham.query(mockData.data, {
                        query: queryParam
                    })
                    var list = queryResult.data
                    // 改变数据排序
                    delete mockData.data
                    delete queryResult.data
                    extend(true, mockData, queryResult)
                    mockData.data = list
                }
                if (req.query.callback) {
                    content = JSON.stringify(mockData)
                }
                else {
                    content = jsonformat(mockData)
                }
            }
            var resMethod = 'send'
            if (typeof req.query.callback !== 'undefined') {
                resMethod = 'jsonp'
            }
            setTimeout(function (){
                res.type('text')
                res[resMethod](content)
                next()
            }, req.query.$delay || 0)
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
            echoMock(cacheData.content, req)
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
                echoMock(body, req)
                return
            })
        }
    }
}
