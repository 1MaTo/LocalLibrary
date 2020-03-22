var express = require('express');
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var mail = require('./nodeMailer/nodeMailerWithTemp');
var md5 = require('md5')
var app = express();

// database connection
const Client = require('pg').Client;
var serverURL = 'http://localhost:8181';
const pg = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'LocalLibraryDb',
    password: 'root',
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
    bookName: `"Books".name`,
    year: `"Books"."releaseYear"`,
    update: `"Books"."lastUpdate"`,
    author: `"Books".author`,
}

const actions = {
    DELETE: 'DELETE',
    ADD: 'ADD',
    UPDATE: 'UPDATE',
    LIKE: 'LIKE',
    DISLIKE: 'DISLIKE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT'
}

const roles = {
    UNCONFIRMED: 'unconfirmed',
    USER: 'user',
    ADMIN: 'administrator',
    MODERATOR: 'moderator',
}

// middleware
app.listen(8181, function () {
});
app.use(express.json({ limit: '100mb' }));
app.use(cookieParser())
app.use(cookieSession({
    name: 'session',
    id: 0,
    keys: ["key1", "key2"],

    maxAge: 43200000
}))

app.all('*', (request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.setHeader('Access-Control-Request-Methods', 'POST, GET, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.setHeader('Content-Type', 'application/json')
    next()
})

app.options('*', (request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.setHeader('Access-Control-Request-Methods', 'POST, GET, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.setHeader('Content-Type', 'application/json')
    response.status(200).send()
})

app.all('*', (request, response, next) => {
    const date = new Date()
    const hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    console.log(`[${hh}:${mm}:${ss}] Request to ${request.originalUrl}`)
    next()
})

// login
app.post('/api/login', (req, res) => {
    checkLoginData(req.body.email, req.body.password)
        .then(
            result => {
                req.session.id = result
                log(actions.LOGIN, 'user', result, result)
                res.status(200).send('successful logged')
            },
            error => {
                console.log(error)
                res.status(404).send('user not found')
            }
        )
        .catch(
            error => {
                console.log(error)
                res.status(404).send('user not found')
            }
        )
})

app.get('/api/confirmMail/:token', (req, res) => {
    pg.query(`select id from "Users" where "registerToken" = '${req.params.token}'`, (err, response) => {
        if (err != null) {
            console.log(err)
        } else {
            if (response.rowCount !== 0) {
                pg.query(`UPDATE "Users" SET role = '${roles.USER}'`, (err, response) => {
                    if (err != null) {
                        res.status(400).send('DataBase error')
                        console.log(err)
                    } else {
                        res.status(200).send('Ваш адресс эклектронной почты подтвержден')
                    }
                })
            }
        }
    })
})

app.get('/api/resendMail/:id', (req, res) => {
    pg.query(`SELECT email, "firstName", "registerToken" 
    from "Users" where id = ${req.params.id} and role = '${roles.UNCONFIRMED}'`, (err, response) => {
        if (err != null) {
            console.log(err)
            res.status(400).send('DataBase error')
        } else {
            if (response.rowCount !== 0) {
                mail.sendVerify(response.rows[0].email, response.rows[0].firstName, serverURL + '/api/confirmMail/' + response.rows[0].registerToken)
                res.status(200).send('Письмо отправлено')
            } else {
                res.status(404).send('Пользователь не найден')
            }
        }
    })
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
    const query = `
        select
        "Books".id,
        "Books".name,
        "Books".author,
        "Books"."releaseYear",
        "Books".about,
        "Books".tags,
        "Books".amount,
        "Books"."lastUpdate",
        encode("Images".data, 'base64') as data, "Images".type,
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
            const data = response.rows.map(book => {
                return ({
                    id : book.id,
                    name : book.name,
                    author : book.author,
                    releaseYear : book.releaseYear,
                    about : book.about,
                    tags : book.tags,
                    amount : book.amount,
                    lastUpdate : book.lastUpdate,
                    avatar: `data:image/${book.type};base64, ${book.data}`
                })
            })
            res.status(200).send(JSON.stringify(data));
            //console.log(response.rows)
        }
    });
    //req.data.time = new Date() - req.data.time
    //console.log(req.data)
})

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

//Add user
app.post('/api/add/user', (req, res) => {
    checkEmail(req.body.email).then(
        result => {
            addImage(req.body.avatar).then(
                result => {
                    let token = md5(req.body.firstName + req.body.email + Date())
                    const query = `
                        INSERT INTO "Users" 
                            ("firstName", "secondName", "email", "password", "role", "avatar", "gender", "registerToken")
                        VALUES 
                            ('${req.body.firstName}',
                            '${req.body.secondName}',
                            '${req.body.email}',
                            '${req.body.password}',
                            '${roles.UNCONFIRMED}',
                            ${result},
                            '${req.body.gender}',
                            '${token}') RETURNING id;`
                    pg.query(query, (err, response) => {
                        if (err != null) {
                            res.status(400).send('Could not add user')
                            console.log(err)
                        } else {
                            mail.sendVerify(req.body.email, req.body.firstName, serverURL + '/api/confirmMail/' + token)
                            log(actions.ADD, 'user', response.rows[0].id, response.rows[0].id)
                            res.status(200).send("Пользователь добавлен");
                        }
                    });
                },
                error => {
                    console.log(error)
                    res.status(400).send('Error on image')
                }
            )
        },
        error => {
            res.status(400).send('Пользователь с таким email уже зарегистрирован')
        }
    )
})

//For AUTHORIZED users only

//Check login
app.use('/api/*', (req, res, next) => {
    if (req.session.length) {
        next()
    } else {
        res.status(404).send('you are not logged, please login')
    }
});

//logout
app.post('/api/logout', (req, res) => {
    log(actions.LOGOUT, 'user', req.session.id, req.session.id)
    req.session = null
    res.status(200).send("User logout")
})

//Send comment
app.post('/api/user/comment/send', (req, res) => {
    const query = `INSERT INTO "Comments"("userId", "bookId", message)
    VALUES (${req.session.id}, ${req.body.bookId}, '${req.body.message}') RETURNING id;`
    pg.query(query, (err, response) => {
        if (err != null) {
            console.log(err)
            res.status(400).send('Ошибка при добавлении коментария')
        } else {
            log(actions.ADD, 'comment', response.rows[0].id, req.session.id)
            res.status(200).send('Коментарий добавлен')
        }
    })

})

//Like or Dislike book
app.post('/api/user/reaction/:object', (req, res) => {
    checkRating(req.session.id, req.body.bookId, req.body.rate, 'book')
        .then(
            equal => {
                pg.query(`DELETE FROM "Ratings" WHERE id = ${equal}`, (err, response) => {
                    if (err != null) {
                        console.log(err)
                        res.status(400).send('Ошибка при удалении текущего рейтинга')
                    } else {
                        res.status(200).send('Рейтинг обновлен(удален)')
                    }
                })
            },
            different => {
                if (different != null && different !== 'error') {
                    pg.query(`UPDATE "Ratings" SET "rate" = ${req.body.rate} WHERE id = ${different}`, (err, response) => {
                        if (err != null) {
                            console.log(err)
                            res.status(400).send('Ошибка при удалении текущего рейтинга')
                        } else {
                            log(req.body.rate > 0 ? actions.LIKE : actions.DISLIKE, 'rating', req.body.bookId, req.session.id)
                            res.status(200).send('Рейтинг обновлен')
                        }
                    })
                } else {
                    let query = `INSERT INTO "Ratings" ("objectId", "userId", "rate", "objectType")
                        VALUES (${req.body.bookId}, ${req.session.id}, ${req.body.rate}, 'book');`
                    pg.query(query, (err, response) => {
                        if (err != null) {
                            console.log(err)
                            res.status(400).send('Ошибка при добавлении рейтинга')
                        } else {
                            log(req.body.rate > 0 ? actions.LIKE : actions.DISLIKE, 'rating', req.body.bookId, req.session.id)
                            res.status(200).send('Рейтинг добавлен')
                        }
                    })
                }
            }
        )
})

//Get account info
app.get('/api/user/info', (req, res) => {
    const query = `
    select 
        id,
        "firstName",
        "secondName",
        "registerDate",
        email,
        password,
        role,
        avatar,
        gender
    from "Users"
    where id = ${req.session.id}`

    console.log(req.session.id)
    pg.query(query, (err, response) => {
        if (err != null) {
            console.log(err)
            res.status(404).send('Ошибка при получении данных о пользователе')
        } else {
            getImage(response.rows[0].avatar)
                .then((result) => {
                    response.rows[0].avatar = result
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    res.status(200).send(JSON.stringify(response.rows[0]))
                })
        }
    })
})

//Update user
app.post('/api/update/user/:id', (req, res) => {
    let updateObjects = []
    for (var key in req.body) {
        if (key !== 'imgData') {
            updateObjects.push(`"${key}"='${req.body[key]}'`)
        }
    }
    updateImage(req.body.imgData, req.params.id, 'user')
        .then(
            result => {
                if (updateObjects.length !== 0) {
                    updateObjects = updateObjects.join(',')
                    let query = `UPDATE public."Users"
                        SET 
                            ${updateObjects}
                        WHERE id = ${req.params.id};`
                    pg.query(query, (err, response) => {
                        if (err != null) {
                            res.status(400).send('Пользователь не обновлен')
                            console.log(err)
                        } else {
                            log(actions.UPDATE, 'user', req.params.userId, req.session.id)
                            res.status(200).send("Данные обновлены");
                        }
                    });
                } else {
                    log(actions.UPDATE, 'user', req.params.id, req.session.id)
                    res.status(200).send("Изображение обновлено");
                }
            },
            error => {
                console.log(error)
                res.status(400).send('Ошибка при обновлении изображения')
            }
        )
})

//Delete user
app.post('/api/delete/user/:id', (req, res) => {
    const imagesQuery = `DELETE FROM "Images" where id = (select "avatar" from "Users" where id = ${req.params.id})`
    const ratingsQuery = `DELETE FROM "Ratings" where "userId" = ${req.params.id}`
    const userBookListQuery = `DELETE FROM "UserBookList" where "userId" = ${req.params.id}`
    const usersQuery = `DELETE FROM "Users" where id = ${req.params.id}`

    pg.query('BEGIN', (err, response) => {
        if (err != null) {
            console.log(err)
            return
        } else {
            pg.query(imagesQuery, (err, response) => {
                if (err != null) {
                    console.log(err)
                    return pg.query('ROLLBACK')
                } else {
                    console.log('Image deleted')
                    pg.query(userBookListQuery, (err, response) => {
                        if (err != null) {
                            console.log(err)
                            return pg.query('ROLLBACK')
                        } else {
                            console.log('UserBookList deleted')
                            pg.query(ratingsQuery, (err, response) => {
                                if (err != null) {
                                    console.log(err)
                                    return pg.query('ROLLBACK')
                                } else {
                                    console.log('Ratings deleted')
                                    pg.query(usersQuery, (err, response) => {
                                        if (err != null) {
                                            console.log(err)
                                            return pg.query('ROLLBACK')
                                        } else {
                                            console.log('Users deleted')
                                            pg.query('COMMIT', (err, response) => {
                                                if (err != null) {
                                                    console.log(err)
                                                    pg.query('ROLLBACK')
                                                    res.status(400).send('Ошибка при удалении прользователя, не удален')
                                                } else {
                                                    log(actions.DELETE, 'user', req.params.id, req.session.id)
                                                    res.status(200).send('Пользователь удален')
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        };
    })
})

//Add book
app.post('/api/add/book', (req, res) => {
    const allowedTypes = ['png', 'jpg', 'jpeg']
    const img = req.body.imgData === null ? {
        type: null,
        data: null
    } : {
            type: req.body.imgData.slice(req.body.imgData.indexOf('/') + 1, req.body.imgData.indexOf(';')),
            data: req.body.imgData.slice(req.body.imgData.indexOf(',') + 1)
        }
    if (!checkData(req.body)) {

        res.status(406).send('Недопустимые данные для добавления книги')
    } else {
        if (allowedTypes.indexOf(img.type) === -1 && img.type !== null) {

            res.status(406).send('Изображение должно быть одного из следуюших форматов: jpg, jpeg, png')
        } else {

            const imgQuery = `INSERT INTO "Images"(type, data) VALUES ('${img.type}', decode('${img.data}', 'base64')) RETURNING id;`
            pg.query(imgQuery, (err, response) => {
                if (err != null) {

                    res.status(415).send('Could not add image in database')
                    console.log(err)
                } else {

                    const tags = `{"${req.body.tags.join("\", \"")}"}`
                    const author = `{"${req.body.author.join("\", \"")}"}`
                    const query = `
                    INSERT INTO public."Books"(
                        name, "releaseYear", about, tags, amount, pages, "publicDate", image, author)
                    VALUES (
                        '${req.body.name}',
                        '${new Date(req.body.releaseYear).toISOString()}',
                        '${req.body.about}',
                        '${tags}',
                        ${req.body.amount},
                        ${req.body.pages},
                        '${new Date(req.body.publicDate).toISOString()}',
                        ${response.rows[0].id},
                        '${author}') RETURNING id;`
                    pg.query(query, (err, response) => {
                        if (err != null) {
                            res.status(400).send('Could not add book in database')
                            console.log(err)
                        } else {
                            log(actions.ADD, 'book', response.rows[0].id, req.session.id)
                            res.status(200).send("Книга успешно добавлена");
                        }
                    });
                }
            })
        }
    }
})

//Update Book
app.post('/api/update/book/:id', (req, res) => {
    let updateObjects = []
    for (var key in req.body) {
        if (key === 'tags' || key === 'author') {
            req.body[key] = `{"${req.body[key].join("\", \"")}"}`
        }
        if (key === 'releaseYear') {
            req.body[key] = `${new Date(req.body.releaseYear).toISOString()}`
        }
        if (key !== 'imgData') {
            updateObjects.push(`"${key}"='${req.body[key]}'`)
        }
    }

    let imgUpdate = updateImage(req.body.imgData, req.params.id, 'book')

    imgUpdate.then(
        result => {
            updateObjects = updateObjects.join(',')
            const query = `UPDATE public."Books"
                    SET 
                        ${updateObjects}
                    WHERE id = ${req.params.id};`
            pg.query(query, (err, response) => {
                if (err != null) {
                    res.status(400).send('Could not update book')
                    console.log(err)
                } else {
                    log(actions.UPDATE, 'book', req.params.id, req.session.id)
                    res.status(200).send("Данные обновлены");
                }
            });
        },
        error => {
            console.log(error)
            res.status(400).send('Error on image')
        }
    )
})

//Delete Book
app.post('/api/delete/book/:id', (req, res) => {

    const imagesQuery = `DELETE FROM "Images" where id = (select "image" from "Books" where id = ${req.params.id})`
    const commentsQuery = `DELETE FROM "Comments" where "bookId" = ${req.params.id}`
    const raitingsQuery = `DELETE FROM "Ratings" where "objectId" = ${req.params.id} and "objectType" = 'book'`
    const userBookListQuery = `DELETE FROM "UserBookList" where "bookId" = ${req.params.id}`
    const booksQuery = `DELETE FROM "Books" where id = ${req.params.id}`

    pg.query('BEGIN', (err, response) => {
        if (err != null) {
            console.log(err)
            return
        } else {
            pg.query(imagesQuery, (err, response) => {
                if (err != null) {
                    console.log(err)
                    return pg.query('ROLLBACK')
                } else {
                    pg.query(commentsQuery, (err, response) => {
                        if (err != null) {
                            console.log(err)
                            return pg.query('ROLLBACK')
                        } else {
                            pg.query(raitingsQuery, (err, response) => {
                                if (err != null) {
                                    console.log(err)
                                    return pg.query('ROLLBACK')
                                } else {
                                    pg.query(userBookListQuery, (err, response) => {
                                        if (err != null) {
                                            console.log(err)
                                            return pg.query('ROLLBACK')
                                        } else {
                                            pg.query(booksQuery, (err, response) => {
                                                if (err != null) {
                                                    console.log(err)
                                                    return pg.query('ROLLBACK')
                                                } else {
                                                    pg.query('COMMIT', (err, response) => {
                                                        if (err != null) {
                                                            console.log(err)
                                                            pg.query('ROLLBACK')
                                                            res.status(400).send('Ошибка при удалении книги')
                                                        } else {
                                                            log(actions.DELETE, 'book', req.params.id, req.session.id)
                                                            res.status(200).send('Книга и все данные о ней удалены')
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        };
    })
})

// 404 page
app.get('*', (req, res) => {
    res.status(404).send("Page not found")
})

// 404 page
app.post('*', (req, res) => {
    res.status(404).send("Page not found")
})

function getImage(id) {
    return new Promise((resolve, reject) => {
        const query = `select type, encode(data, 'base64') as data from "Images" where id = ${id}`
        pg.query(query, (err, response) => {
            if (err) {
                reject(err)
            } else {
                const data = JSON.parse(JSON.stringify(response.rows[0].data))
                resolve(response.rowCount ? `data:image/${response.rows[0].type};base64, ${data}` : null)
            }
        })
    })
}

// Check data before adding in data base
function checkData(data) {
    return data.name.length > 80 ? false :
        Date.parse(new Date(data.releaseYear)) === NaN ? false :
            data.about.length > 200 ? false :
                checkMass(data.tags) ? false :
                    !(isFinite(data.amount)) || data.amount.toString().length > 5 ? false :
                        !(isFinite(data.pages)) || data.pages.toString().length > 5 ? false :
                            Date.parse(new Date(data.publicDate)) === NaN || (Math.abs((new Date(data.publicDate) - new Date()) / 86400000) > 1) ? false :
                                checkMass(data.author) ? false : true
}

// Check data in massives for max length
function checkMass(mass) {
    var wrongMass = false
    mass.forEach(item => {
        if (item.length > 20) wrongMass = true
    });
    return wrongMass
}

// Promise to update image to object with id
function updateImage(imgData, id, type) {
    return new Promise((resolve, reject) => {
        if (imgData !== undefined) {
            const allowedTypes = ['png', 'jpg', 'jpeg']
            const img = {
                type: imgData.slice(imgData.indexOf('/') + 1, imgData.indexOf(';')),
                data: imgData.slice(imgData.indexOf(',') + 1)
            }
            if (allowedTypes.indexOf(img.type) === -1) {
                reject('Bad image type')
            } else {
                const imgQuery = `UPDATE "Images"  
                                    SET "type"='${img.type}', 
                                    "data"='${img.data}' 
                                    WHERE id = (select 
                                        ${type === 'book' ? `"image" from "Books"` : `"avatar" from "Users"`} 
                                        where id = ${id});`
                pg.query(imgQuery, (err, response) => {
                    if (err != null) {
                        reject('BD error: ', err)
                        console.log(err)
                    } else {
                        resolve('image updated')
                    }
                })
            }
        } else {
            resolve('nothing updated')
        }
    })
}

// Promise to add image for object
function addImage(imgData) {
    return new Promise((resolve, reject) => {
        const allowedTypes = ['png', 'jpg', 'jpeg']
        const img = imgData === null ? {
            type: null,
            data: null
        } : {
                type: imgData.slice(imgData.indexOf('/') + 1, imgData.indexOf(';')),
                data: imgData.slice(imgData.indexOf(',') + 1)
            }
        if (allowedTypes.indexOf(img.type) === -1 && img.type !== null) {
            reject('Bad image type')
        } else {

            const imgQuery = `INSERT INTO "Images"(type, data) VALUES ('${img.type}', decode('${img.data}', 'base64')) RETURNING id;`
            pg.query(imgQuery, (err, response) => {
                if (err != null) {
                    reject('Could not add image in database')
                } else {
                    resolve(response.rows[0].id)
                }
            })

        }
    })
}

function checkEmail(email) {
    return new Promise((resolve, reject) => {
        pg.query(`SELECT id from "Users" where email = '${email}'`, (err, response) => {
            if (err !== null) {
                console.log(err)
                reject('Error with checking email')
            } else {
                if (response.rowCount === 0) {
                    resolve('No users with such email')
                } else {
                    reject('User with such email has already exist')
                }
            }
        })
    })
}

function checkRating(userId, objectId, rate, type) {
    return new Promise((resolve, reject) => {
        const query = `
            select id, rate
            from "Ratings" 
            where 
                "userId" = ${userId} and 
                "objectId" = ${objectId} and
                "objectType" = '${type}'`
        pg.query(query, (err, response) => {
            if (err !== null) {
                console.log(err)
                reject('error')
            } else if (response.rowCount === 0) {
                reject(null)
            } else if (response.rows[0].rate === rate) {
                resolve(response.rows[0].id)
            } else {
                reject(response.rows[0].id)
            }
        })
    })
}

function log(action, object, objectId, userId) {
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO "Logs"(action, date, object, "objectId", "userId")
        VALUES ('${action}','${new Date(Date()).toISOString()}','${object}',${objectId},${userId})`
        pg.query(query, (err, response) => {
            if (err !== null) {
                console.log(err)
                reject('Error: ' + err)
            } else {
                resolve('log added')
            }
        })
    })
}

function checkLoginData(email, password) {
    return new Promise((resolve, reject) => {
        const query = `select id, role from "Users" where email = '${email}'
        and password = '${password}'`
        pg.query(query, (err, response) => {
            if (err !== null) {
                console.log(err)
                reject('Data base error')
            } else {
                if (response.rowCount !== 0) {
                    if (response.rows[0].role === roles.UNCONFIRMED) {
                        reject('Your email adress not confirmed yet')
                    } else {
                        resolve(response.rows[0].id)
                    }
                } else {
                    reject('user not found')
                }
            }
        })
    })
}