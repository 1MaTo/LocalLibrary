import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import ButtonBase from '@material-ui/core/ButtonBase';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import HeaderMenu from '../menu/HeaderMenu'
import { Grid } from '@material-ui/core';
import { GetTags } from '../bookList/Book'
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from "react-router-dom"
import {
    CircularProgressbar,
    buildStyles,
} from 'react-circular-progressbar';
import moment from 'moment/min/moment-with-locales'
import 'react-circular-progressbar/dist/styles.css';
import { Loading } from '../loading/Loading'
import { serverUrl } from '../../config'
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: '70%',
            minWidth: 340,
            margin: 'auto',
            display: 'flex'
        },
        background: {
            background: '#f9f9f9',
        },
        image: {
            height: 450,
            width: 320,
        },
        img: {
            margin: 'auto',
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            height: 'fit-content',

        },
        imgPaper: {
            padding: theme.spacing(0.5),
            marginRight: '20px',
            height: 'fit-content',
            width: 'min-content',
        },
        infoPaper: {
            position: 'relative',
            padding: theme.spacing(1.5),
            width: 'inherit',
            cursor: 'default',
            height: 'fit-content'
        },
        date: {
            float: 'right',
        },
        tips: {
            color: '#939393'
        },
        chip: {
            margin: theme.spacing(0.7)
        },
        button: {
            width: 320,
            marginTop: 4,
        },
        progressBar: {
            width: 40,
            marginLeft: -44,
        },
        bookFooter: {
        },
        adminPanel: {
            color: '#5b5b5b',
            padding: 5,
            position: 'absolute',
            right: 0,
            top: 6,
        },
        adminButton: {
            marginLeft: 10,
            borderRadius: 20,
            padding: 6,
        },
        '@media (max-width: 1000px)': {
            root: {
                flexWrap: 'wrap',
            },
            imgPaper: {
                margin: 'auto',
                marginBottom: 20,
            },
            infoPaper: {
                margin: 'auto',
            },
            button: {
                width: 320
            },
        },
        '@media (max-width: 600px)': {
            date: {
                float: 'unset',
            },
        },
    })
);

function BookInfo({ id }) {
    const classes = useStyles()

    const book = useSelector(state => state.book)
    const dispatch = useDispatch()

    useEffect(() => {
        axios
            .get(`${serverUrl}/api/book/${id}`)
            .then(res => {
                if (JSON.stringify(book) !== JSON.stringify(res.data[0]))
                    dispatch({ type: "SET_BOOK", book: res.data[0] })
            })
    }, [book, dispatch, id]);

    return (
        (book) ?
            <div className={classes.root}>
                <Paper className={classes.imgPaper}>
                    <ButtonBase className={classes.image}>
                        <img className={classes.img} alt="complex" src={book.img} />
                    </ButtonBase>
                    <Button
                        disabled={book.currentInUsing === book.totalAmount ? true : false}
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        size="large"
                    >
                        Взять книгу
                </Button>
                </Paper>
                <Paper className={classes.infoPaper}>
                    {true ? <AdminPanel bookId={book.id} /> : <div></div>}
                    <Grid container spacing={3}>
                        <Grid item container xs={12}>
                            <Typography variant="h6">{book.name}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <Typography variant="subtitle2"><span className={classes.tips}>{'Автор: '}</span>{book.author}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={7}>
                            <Typography className={classes.date} variant="subtitle2"><span className={classes.tips}>{'Год издания: '}</span>{new Date(book.date).getFullYear() + ' г.'}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><span className={classes.tips}>{'О книге: '}</span>{book.about}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><span className={classes.tips}>{'Теги: '}</span><GetTags tags={book.tags} /></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><span className={classes.tips}>{'Книг свободно: '}</span>{(book.totalAmount - book.currentInUsing) + ' из ' + book.totalAmount}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><span className={classes.tips}>{'Сейчас читают: '}</span></Typography>
                            <ReadingUsers list={book.userList} pages={book.pages} />
                        </Grid>
                        <Grid item xs={12} style={{ position: "relative" }}>
                            <Divider style={{ marginBottom: 5 }} />
                            <Typography variant="caption" className={classes.bookFooter}><span className={classes.tips}>{`Обновлено: ${moment(new Date(book.lastUpdate)).locale('ru').format('LLLL')}`}</span></Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
            : <Loading />
    )
}

function AdminPanel(props) {
    const id = props.bookId
    const classes = useStyles()
    return (
        <div className={classes.adminPanel}>
            <Link to={'/book/edit/' + id}>
                <ButtonBase className={classes.adminButton}>
                    <EditIcon fontSize="small" />
                </ButtonBase>
            </Link>
            <Link to={'/book/delete/' + id}>
                <ButtonBase className={classes.adminButton}>
                    <DeleteIcon fontSize="small" />
                </ButtonBase>
            </Link>
        </div>
    )
}

function ReadingUsers({ list, pages }) {
    const classes = useStyles()
    const userList = list
    return userList ? userList.map(user => {
        return <Chip
            key={user.id}
            avatar={user.avatar ? <Avatar alt={user.name} src={user.avatar} /> : <Avatar>{user.name.split(' ').map(function (item) { return item[0] }).join('')}</Avatar>}
            label={<div>
                <CircularProgressbar
                    className={classes.progressBar}
                    strokeWidth={10}
                    maxValue={pages}
                    value={user.completedPages}
                    styles={buildStyles({
                        backgroundColor: '#ffffff00',
                        textColor: '#000',
                        pathColor: '#f50057',
                        trailColor: 'transparent',
                        textSize: 0,
                        fontFamily: 'inherit',
                        strokeLinecap: 'butt'
                    })}
                /><span style={{ marginLeft: 5 }}>{user.name}</span>
            </div>
            }
            className={classes.chip}
            variant="outlined"
        />
    }) : <div></div>
}

const BookData = {
    id: '1',
    img: 'https://exploringjs.com/impatient-js/img-homepage/cover-homepage.jpg',
    name: 'Выразительный JavaScript',
    author: 'Marijn Haverbeke',
    date: Date(),
    about: `Перевод книги Marijn Haverbeke "Eloquent JavaScript". Лицензия Creative Commons attribution-noncommercial license. Код предоставляется под лицензией MIT. Перевод книги Marijn Haverbeke "Eloquent JavaScript".`,
    tags: ['JS', 'Junior'],
    currentInUsing: 5,
    totalAmount: 8,
    pages: 500,
    ratesUp: 100,
    ratesDown: 5,
    lastUpdate: Date(),
    userList: [
        {
            id: 1,
            name: 'Илья Киселев',
            completedPages: 0,
            avatar: 'https://media.tenor.com/images/1f17a34f47d78938ed941618264b3ff1/raw'
        },
        {
            id: 2,
            name: 'Иван Иванов',
            completedPages: 1,
            avatar: '',
        }, {
            id: 1,
            name: 'Илья Киселев',
            completedPages: 100,
            avatar: 'https://media.tenor.com/images/1f17a34f47d78938ed941618264b3ff1/raw'
        }, {
            id: 1,
            name: 'Илья Киселев',
            completedPages: 250,
            avatar: 'https://media.tenor.com/images/1f17a34f47d78938ed941618264b3ff1/raw'
        }, {
            id: 1,
            name: 'Илья Киселев',
            completedPages: 400,
            avatar: 'https://media.tenor.com/images/1f17a34f47d78938ed941618264b3ff1/raw'
        }, {
            id: 1,
            name: 'Илья Киселев',
            completedPages: 499,
            avatar: 'https://media.tenor.com/images/1f17a34f47d78938ed941618264b3ff1/raw'
        },
    ]
}

export default function SingleBook({ match }) {
    const classes = useStyles()
    //console.log(match.params.id)
    return (
        <div className={classes.background}>
            <HeaderMenu />
            <BookInfo id={match.params.id} data={BookData} />
        </div>
    )
}