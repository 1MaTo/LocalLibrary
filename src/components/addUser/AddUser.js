import React from 'react'
import { Form, Field } from 'react-final-form'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import sha256 from 'js-sha256'

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
        background: 'inherit'
    },
}));

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

const onSubmit = async (values) => {
    const data = {
        username: values.username,
        password: sha256(values.password)
    }
    alert(`Логин: ${data.username}\nПароль: ${data.password}`)
    /*var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/addUser', true);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function (res) {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) {
            console.log('Wrong data')
        } else {
        }
    }*/
}


export default function SignUp(props) {
    const classes = useStyles();
    return (
        <div className={classes.background}>
            <Form
                onSubmit={onSubmit}
                validate={validate}
                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                    <Container component="main" maxWidth="xs">
                        <div className={classes.paper}>
                            <Typography component="h1" variant="h5">Добавить нового пользователя</Typography>
                            <form onSubmit={handleSubmit} className={classes.form} validate>
                                <Grid container spacing={2}>
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
                                        Добавить
                                </Button>
                            </form>
                        </div>
                    </Container>
                )}
            />
        </div>
    )
}