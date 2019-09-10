import React from 'react'
import { Form, Field } from 'react-final-form'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Header from './HeaderMenu'
import { withTheme } from '@material-ui/styles';

const onSubmit = async values => {
    window.alert(JSON.stringify(values, 0, 2))
}

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#83a2f9',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
        background: 'white',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    background: {
        background: '#f9f9f9'
    },
}));

const validate = values => {
    const errors = {};
    if (!values.firstName) {
        errors.firstName = 'Required';
    }
    if (!values.username) {
        errors.username = 'Required';
    }
    if (!values.lastName) {
        errors.lastName = 'Required';
    }
    if (!values.email) {
        errors.email = 'Required';
    }
    return errors;
};

export default function SignUp() {
    const classes = useStyles();

    return (
        <div className={classes.background}>
            <Header />
            <Form
                onSubmit={onSubmit}
                validate={validate}
                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={classes.paper}>
                            <Avatar className={classes.avatar}><LockOutlinedIcon /></Avatar>
                            <Typography component="h1" variant="h5">Регистрация</Typography>
                            <form onSubmit={handleSubmit} className={classes.form} validate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Field name="firstName">
                                            {props => (
                                                <TextField
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    autoComplete="fname"
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="firstName"
                                                    label="Имя"
                                                    autoFocus
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field name="lastName">
                                            {props => (
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="lastName"
                                                    label="Фамилия"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    autoComplete="lname"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field name="username">
                                            {props => (
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="username"
                                                    label="Логин"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    autoComplete="nickname"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field name="email">
                                            {props => (
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label="Адрес электронной почты"
                                                    name={props.input.name}
                                                    value={props.input.value}
                                                    onChange={props.input.onChange}
                                                    autoComplete="email"
                                                />
                                            )}
                                        </Field>
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}>
                                    Зарегистрироваться
                                </Button>
                                <Grid container justify="flex-end">
                                    <Grid item>
                                        <Link href="/login" variant="body2">
                                            У вас уже есть аккаунт? Авторизируйтесь
                                    </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Container>
                )}
            />
        </div>
    );
}