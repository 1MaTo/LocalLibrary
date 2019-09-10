import React from "react";
import { Link } from "react-router-dom"
import { makeStyles, Theme } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import RateUp from '@material-ui/icons/ThumbUpAlt';
import RateDown from '@material-ui/icons/ThumbDownAlt';
import ArrowFoward from '@material-ui/icons/ArrowForwardIos';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import { useDispatch } from "react-redux"

const useStyles = makeStyles((theme: Theme) => ({
    '@keyframes hoverBook': {
        '0%': {
            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
            transform: 'scale(1)'
        },
        '100%': {
            boxShadow: '0px 9px 15px 0px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.01)'
        }
    },
    book: {
        flexGrow: 1,
        width: 'fit-content',
        padding: theme.spacing(1),
        '&:hover .rating': {
            display: 'flex',
        },
    },
    paper: {
        padding: theme.spacing(1),
        margin: 'auto',
        maxWidth: 800,
        minWidth: 400,
        '&:hover': {
            animation: '$hoverBook 0.05s normal ease-in-out',
            boxShadow: '0px 9px 15px 0px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1.01)'
        }
    },
    image: {
        height: 220,
        width: 165,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
        height: 'fit-content',

    },
    rating: {
        position: 'absolute',
        bottom: '4px',
        background: '#000000aa',
        width: 165,
        right: '4px',
        display: 'none',
    },
    rateButton: {
        'border-radius': '6px',
        color: '#ffffffab',
        'text-align': 'center',
        height: 30,
    },
    avatar: {
        position: `relative`,
        marginRight: 10,
    },
    subInfo: {
        color: '#9f9f9f'
    },
    aboutInfo: {
        display: '-webkit-box',
        '-webkit-line-clamp': 3,
        '-webkit-box-orient': 'vertical',
        'overflow': 'hidden',
        'text-overflow': 'ellipsis',
    },
    tag: {
        margin: theme.spacing(0.3),
        '&:hover': {
            background: '#c4c4c4'
        }
    },
    title: {
        height: 25,
    },
    subFooter: {
        color: '#9f9f9f',
        marginTop: 7,
    },
    bookFooter: {
        height: 18,
    },
    '@media (max-width: 600px)': {
        title: {
            height: 35,
        },
        avatar: {
            margin: 'auto',
            marginBottom: 20,
        },
        bookFooter: {
            height: 'inherit',
        },
    }
}))

export function GetTags(props) {
    const classes = useStyles();
    const items = props.tags
    return items !== undefined ? items.map(item => {
        return <Chip className={classes.tag} variant="outlined" color="default" size="small" label={item} key={item} />
    }) : <div>Empty</div>
}

export function Books(props) {
    const classes = useStyles();
    const dispatch = useDispatch()

    const book = props.bookData;
    return (
        <Container className={classes.book}>
            <Paper className={classes.paper}>
                <Grid container spacing={0}>
                    <Grid item className={classes.avatar} >
                        <ButtonBase className={classes.image}>
                            <img className={classes.img} alt="complex" src={book.img} />
                        </ButtonBase>
                        <Grid justify="flex-end" container spacing={1} className={`${classes.rating} ${'rating'}`}>
                            <Grid xs={6} item style={{ textAlign: 'center' }}>
                                <ButtonBase className={classes.rateButton}>
                                    <RateUp color='inherit' fontSize="small" />
                                    <Typography variant="subtitle2" style={{ marginLeft: 5 }}>{book.ratesUp}</Typography>
                                </ButtonBase>
                            </Grid>
                            <Grid xs={6} item style={{ textAlign: 'center' }}>
                                <ButtonBase className={classes.rateButton}>
                                    <RateDown color='inherit' fontSize="small" />
                                    <Typography variant="subtitle2" style={{ marginLeft: 5 }}>{book.ratesDown}</Typography>
                                </ButtonBase>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm container style={{ cursor: 'default' }} direction="row">
                        <Grid item xs={12} className={classes.title}>
                            <Typography gutterBottom variant="h6" style={{ marginBottom: '0px' }}>
                                {book.name}
                            </Typography>
                            <Divider />
                        </Grid>
                        <Grid item className={classes.subInfo} xs={12} container justify="space-between">
                            <Grid item xs={9}>
                                <Typography gutterBottom variant="subtitle2">
                                    {book.author}
                                </Typography>
                            </Grid>
                            <Grid item xs={3} style={{ textAlign: 'right' }}>
                                <Typography gutterBottom variant="subtitle2">
                                    {new Date(book.date).getFullYear() + ' г.'}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography className={classes.aboutInfo} variant="body2">
                                {book.about}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <GetTags tags={book.tags} />
                        </Grid>
                        <Grid item xs={12} className={classes.bookFooter}>
                            <Divider />
                            <Grid item className={classes.subFooter} xs={12} container justify="space-between">
                                <Grid item xs={5}>
                                    <Typography gutterBottom variant="subtitle2">
                                        {`Читают: ${book.currentInUsing} из ${book.totalAmount}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={5} style={{ textAlign: 'right' }}>
                                    <Link to={'/book/' + book.id} onClick={() => dispatch({ type: "DELETE_BOOK"})} >
                                        <Typography style={{ width: 'fit-content', float: 'right' }} gutterBottom variant="subtitle2">
                                        Подробнее <ArrowFoward style={{ fontSize: '1.0rem', verticalAlign: 'text-top' }} />
                                    </Typography>
                                    </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                </Grid>
            </Paper>
        </Container >
    )
}

