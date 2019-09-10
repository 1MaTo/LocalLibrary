var express = require('express');
var bookData = require('./books.json')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var app = express();

app.listen(8080, function () {
});

app.use(express.json());
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    id: 0,
    keys: ["key1", "key2"],

    maxAge: 60000
}))

app.all('*', (request, response, next) => {
    console.log("Request to " + request.originalUrl)
    response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

app.get('/api/login', (req, res) => {
    req.body.user !== "kek" ? res.status(404).send("User not found") : false
    req.session.name = req.body.user + req.body.password
    req.session.userId = req.body.userId
    res.status(200).send("User login")
})

app.get('/api/logout', (req, res) => {
    req.session = null
    res.status(200).send("User logout")
})

app.get('/api/setSession/:id', (req, res) => {
    req.session.name = 'user' + req.params.id
    req.session.id = req.params.id
    res.status(200).send()
});

app.get('/api/checkSession', (req, res) => {
    if (req.session.length) {
        console.log(JSON.stringify(req.session.length))
        res.status(200).send()
    } else {
        res.status(404).send('timeout')
    }
});

app.get('/api/books', (req, res) => {
    res.status(200).send(bookData)
});

app.get('/api/book/:id', (req, res) => {
    const book = bookData.filter(book => book.id + '' === req.params.id + '')
    book.length !== 0 ? res.status(200).send(book) : res.status(404).send('Book not found')
})
