var express = require('express')
var echoMock = require('./lib/index')
var app = express()
app.use(echoMock({
    dbFile: __dirname + '/db.json'
}))
var port = 9823
app.listen(port, function () {
    console.log('http://127.0.0.1:' + port)
})
