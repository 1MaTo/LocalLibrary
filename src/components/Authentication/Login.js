import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Header from '../menu/HeaderMenu'
import sha256 from 'js-sha256'
import styled from 'styled-components'
import { Password } from "./LoginInput/Password";
import { TextInput } from "./LoginInput/TextInput";

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
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
    hiddenTooltip: {
        display: 'none',
        'margin-top': '10px',
        color: '#ff3333'
    }
}));

const dynamicStyles = (validate, tag) => {
    switch (tag) {
        case 'avatar':
            return (
                validate ? { 'background': '#196bff' } : { 'background': '#ff0000' }
            )
        case 'toolTip':
            return (
                validate ? { 'display': 'none' } : { 'display': 'block' }
            )
        default:
            break;
    }

}

const validate = values => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Required';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    return errors;
};

const LoginForm = styled(Form)`
    && {

    }
`

export default function SignUp(props) {
    const [isValidate, setValidate] = useState(true)
    const classes = useStyles();

    function changeLogin(values) {
        const data = {
            username: values.username,
            password: sha256(values.password)
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function (res) {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) {
                console.log('Wrong data')
                setValidate(false)
            } else {
                document.cookie = `sessionKey=${sha256(values.username + values.password)}`
                document.cookie = `username=${values.username}`
                console.log('key: ' + sha256(values.username + values.password))
                props.handleLoginChange({ isLogin: true, username: values.username })
                setValidate(true)
            }
        }
    }

    const [errors, setErrors] = useState({
        error: false,
    })

    const handleSubmit = data => {
        console.log(errors)
        setErrors({ ...errors, error: !errors.error })
        alert(JSON.stringify(data))
        console.log(errors)
    }

    return (
        <Form
            onSubmit={handleSubmit}
            render={({ handleSubmit, reset, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit}>
                    <Field name='email'>
                        {props => (
                            <TextInput
                                props={props}
                                error={errors.error}
                                errorText={'Неправильные данные'}
                                label={'Email'}
                            />)}
                    </Field>
                    <Field name='password'>
                        {props => (<Password props={props} error={errors.error} />)}
                    </Field>
                    <button type="submit" disabled={submitting || pristine}>
                        Submit
                    </button>
                </form>
            )}>
        </Form>
    )
    /*<div className={classes.background}>
        <Header />
        <Form
            onSubmit={changeLogin}
            validate={validate}
            render={({ handleSubmit, reset, submitting, pristine, values }) => (
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar} style={dynamicStyles(isValidate,'avatar')}><LockOutlinedIcon /></Avatar>
                        <Typography component="h1" variant="h5">Авторизация</Typography>
                        <Typography style={dynamicStyles(isValidate,'toolTip')} className={classes.hiddenTooltip} component="h4" >Неправильное имя пользователя или пароль</Typography>
                        <form onSubmit={handleSubmit} className={classes.form} validate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field name="username" > 
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
                                                autoFocus
                                            />
                                        )}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name="password">
                                        {props => (
                                            <TextField
                                                variant="outlined"
                                                required
                                                fullWidth
                                                type="password"
                                                id="password"
                                                label="Пароль"
                                                name={props.input.name}
                                                value={props.input.value}
                                                onChange={props.input.onChange}
                                                autoComplete="password"
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
                                Войти
                            </Button>
                            <Grid container justify="flex-end">
                            </Grid>
                        </form>
                    </div>
                </Container>
            )}
        />
    </div>
)*/
}