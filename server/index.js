var express = require('express');
var bookData = require('./books.json')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var app = express();

// database connection
const Client = require('pg').Client;
var serverURL = 'http://localhost:3000/';
const pg = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'LocalLibraryDb',
    password: '',
    port: 5432,
});
/*var serverURL = 'https://ani-library.herokuapp.com/';
const pg = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:true
});*/
pg.connect();

// constants

const order = {
    bookName : `"Books".name`,
    year : `"Books"."releaseYear"`,
    update : `"Books"."lastUpdate"`,
    author : `"Books".author`,
}

// middleware
app.listen(8181, function () {
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

// login/logout
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

//get user story for book
app.get('/api/book/users/reading/:id', (req, res) => {
    const query = `
    select
        "Users".id,
        "Users"."firstName",
        "Users"."secondName",
        "UserBookList".progress
    from "Books"
        inner join "UserBookList" on "Books".id = "UserBookList"."bookId" and "UserBookList".state = 'Читаю'
        inner join "Users" on "UserBookList"."userId" = "Users".id
    where "Books".id = ${req.params.id}`
    pg.query(`select id from "Books" where id = ${req.params.id}`, (err, response) => {
        if (err != null) {
            res.status(404).send('Bad request, database error')
            //console.log(err)
        } else {
            if (response.rows.length === 0)
                res.status(404).send("Book not found")
            else {
                pg.query(query, (err, response) => {
                    res.status(200).send(JSON.stringify(response.rows));
                })
            }
        }
    });
})

// get single book info
app.get('/api/book/:id', (req, res) => {
    const query = `
    select
        "Books".id,
        "Books".name,
        "Books"."releaseYear",
        "Books".about,
        "Books".tags,
        "Books".amount,
        "Books".pages,
        "Books"."lastUpdate",
        "Books"."publicDate",
        "Books".author,
        "Images".data,
        "Images".type,
        (select count ("Ratings".rate) filter (where "Ratings".rate > 0) as likes from "Ratings" where "Ratings"."objectId" = "Books".id),
        (select count ("Ratings".rate) filter (where "Ratings".rate < 0) as dislikes from "Ratings" where "Ratings"."objectId" = "Books".id)
    from "Books"
        inner join "Images" on "Books".image = "Images".id
    where "Books".id = ${req.params.id}`
    pg.query(`select id from "Books" where id = ${req.params.id}`, (err, response) => {
        if (err != null) {
            res.status(404).send('Bad request, database error')
            //console.log(err)
        } else {
            if (response.rows.length === 0)
                res.status(404).send("Book not found")
            else {
                pg.query(query, (err, response) => {
                    res.status(200).send(JSON.stringify(response.rows));
                })
            }
        }
    });
})

// get comment story book
app.get('/api/book/comments/:id', (req, res) => {
    const query = `
    select 
        "Comments".id,
        "Comments"."userId",
        "Comments".message,
        "Comments".date,
        "Users"."firstName",
        "Users"."secondName",
        "Users"."role",
        "Images".data,
        "Images".type
    from "Comments"
        inner join "Users" on "Comments"."userId" = "Users".id
        inner join "Books" on "Comments"."bookId" = "Books".id
        inner join "Images" on "Users".avatar = "Images".id
    where "Books".id = ${req.params.id}`
    pg.query(`select id from "Books" where id = ${req.params.id}`, (err, response) => {
        if (err != null) {
            res.status(404).send('Bad request, database error')
            //console.log(err)
        } else {
            if (response.rows.length === 0)
                res.status(404).send("no comments")
            else {
                pg.query(query, (err, response) => {
                    res.status(200).send(JSON.stringify(response.rows));
                })
            }
        }
    });
})

// get booklist
app.use('/api/books/', (req, res, next) => {
    console.log('searching books')
    req.data = {
        time: new Date(),
        order: order.bookName,
        tags: '',
        keywords: '',
        count: null,
        page: 1
    }
    next()
})
app.use('/api/books/*order/:order*', (req, res, next) => {
    req.data.order = null
    req.data.order = order[req.params.order]
    next()
})
app.use('/api/books/*tags/:tags*', (req, res, next) => {
    req.data.tags = ''
    var tags = req.params.tags.replace(/\s/g, '').split(',')
    var tagString = tags.map((tag) => {
        return `and ("Books".tags::text ilike '%'||'${tag}'||'%')`
    })
    req.data.tags = tagString.join(' ')
    next()
})
app.use('/api/books/*keywords/:keywords*', (req, res, next) => {
    req.data.keywords = req.params.keywords         
    next()
})
app.use('/api/books/*count/:count*', (req, res, next) => {
    req.data.count = req.params.count
    next()
})
app.use('/api/books/*page/:page*', (req, res, next) => {
    req.data.page = req.params.page
    next()
})
app.get('/api/books/*', (req, res) => {
    //database query
    const query =`
        select
        "Books".id,
        "Books".name,
        "Books".author,
        "Books"."releaseYear",
        "Books".about,
        "Books".tags,
        "Books".amount,
        "Books"."lastUpdate",
        "Images".data, "Images".type,
        (select count ("Ratings".rate) filter (where "Ratings".rate > 0) as likes from "Ratings" where "Ratings"."objectId" = "Books".id),
        (select count ("Ratings".rate) filter (where "Ratings".rate < 0) as dislikes from "Ratings" where "Ratings"."objectId" = "Books".id),
        (select count(id) as "commentsAmount" from "Comments" where "Comments"."bookId" = "Books".id)
        from "Books"
        inner join "Images" on "Books".image = "Images".id
        where (
            "Books".name ilike '%'||'${req.data.keywords}'||'%' or
            "Books".author::text ilike '%'||'${req.data.keywords}'||'%' or
            "Books".about ilike '%'||'${req.data.keywords}'||'%' or
            "Books"."releaseYear"::text ilike '%'||'${req.data.keywords}'||'%')
            ${req.data.tags}
        group by "Books".id, "Images".data, "Images".type
        order by ${req.data.order}
        limit ${req.data.count}
        offset ${(req.data.page - 1) * req.data.count}`
    //console.log(query)
    res.setHeader('Content-Type', 'application/json');
    pg.query(query, (err, response) => {
        if (err != null) {
            res.status(404).send('Bad request, database error')
            //console.log(err)
        } else {
            res.status(200).send(JSON.stringify(response.rows));
            //console.log(response.rows)
        }
    });
    //req.data.time = new Date() - req.data.time
    //console.log(req.data)
})


// 404 page
app.get('*', (req, res) => {
    res.status(404).send("Page not found")
})