# echo-mock

> echo mock data, support query. use github code.

Source: http://github.com/onface/echo/tree/mock/pass
Online: http://echo.onface.cc/onface/echo/mock/pass

## pass

http://echo.onface.cc/onface/echo/mock/pass

```json
{
	"status": "success"
}
```

## fail

http://echo.onface.cc/onface/echo/mock/fail


```json
{
	"status": "error",
	"msg": "Error message"
}
```

## other project

1. http://echo.onface.cc/vuejs/vue/dev/package.json
2. http://echo.onface.cc/facebook/react/master/package.json


## html

http://echo.onface.cc/onface/echo/mock/html

```html
<section class="intro" id="zen-intro">
<header role="banner">
	<h1>CSS 禅意花园</h1>
	<h2><abbr title="Cascading Style Sheets">CSS</abbr> 设计之美</h2>
</header>
...
<p>这是一个范例，同时又是一个学习练习。你可以保留图片的完整著作权（有限的例外情况，请参见 <a href="http://www.mezzoblue.com/zengarden/submit/guidelines/">投稿方针</a>），但是我们要求你使用 <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/" title="查看禅意花园的许可信息。">与本站相同</a>的知识共享授权公开发布你的 <abbr title="Cascading Style Sheets">CSS</abbr> 作品，以便他人可以从中学习。</p>
````

## poem

http://echo.onface.cc/onface/echo/mock/fail

```
红豆生南国，春来发几枝。
愿君多采撷，此物最相思。
```

## list

**Source data:**

[http://github.com/onface/echo/blob/mock/list](http://github.com/onface/echo/blob/mock/list)

** URL:**

| Action | URL | Project | Branch | Path | Query |
| :---- | :------------- | :------------- | :------------- | :------------- | :--------------|
| All data | http://echo.onface.cc/onface/echo/mock/list       | `onface/echo`       | `mock`       |  `list`       | ``|
| Second page | http://echo.onface.cc/onface/echo/mock/list?page=2       | `onface/echo`       | `mock`       |  `list`       | `?page=2` |
| Big page | http://echo.onface.cc/onface/echo/mock/list?page=9999       | `onface/echo`       | `mock`       |  `list`       | `?page=999` |
| Query | http://echo.onface.cc/onface/echo/mock/list?idol=nimo       | `onface/echo`       | `mock`       |  `list`       | `?idol=nimo` |
| Query second page | http://echo.onface.cc/onface/echo/mock/list?page=2&idol=nimo       | `onface/echo`       | `mock`       |  `list`       | `?page=2&idol=nimo` |


## $clear

echo-mock will use the cache by default, you can use $clear clear cache.

[http://echo.onface.cc/onface/echo/mock/list?$clear](http://echo.onface.cc/onface/echo/mock/list?$clear)

> success! /onface/echo/mock/list

## $delay

[http://echo.onface.cc/onface/echo/mock/list?$delay=1000](http://echo.onface.cc/onface/echo/mock/list?$delay=1000)



## Create your own server

```js
var express = require('express')
var echoMock = require('echo-mock')
var app = express()
app.use(echoMock({
    dbFile: __dirname + '/db.json'
}))
var port = 3000
app.listen(port, function () {
    console.log('http://127.0.0.1:' + port)
})
```
