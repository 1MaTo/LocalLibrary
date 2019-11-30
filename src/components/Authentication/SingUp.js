import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Loading } from '../Loading/Loading'
import styled from 'styled-components'
import { theme } from '../../Theme/Theme'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Password } from "./LoginInput/Password";
import { TextInput } from './LoginInput/TextInput'
import { Link } from 'react-router-dom'

const SingUpPage = styled(Container)`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const SingUpForm = styled.form`
    display: inline-flex;
    flex-direction: column;
    width: 600px;
    padding: 30px;
    background: ${theme.background.dark};
    @media (max-width: 600px) {
        width: 300px;
    }
`

const SingUpLabel = styled(Typography)`
    margin: auto;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
`

const SingUpIcon = styled(AccountCircle)`
    margin: auto;
    font-size: 35px;
    margin-right: 10px;
`

const InvalidInput = styled(Typography)`
    margin-top: 20px;
    text-align: center;
`

const LoginLink = styled(Link)`
    color: ${theme.primary.main};
    &:hover {
        text-decoration: underline;
    }
`
const LoginToolTip = styled(Typography)`
    font-size: 0.85em;
    margin-top: 5px;
    color: ${theme.secondary.main};
    width: fit-content;
    align-self: center;
`

const Image = styled.div`
`

const PassForm = styled(Grid)`
    display: inline-flex;
    justify-content: space-around;
`

export default function SignUp() {

    const [loading, setLoading] = useState(false)

    const [errors, setErrors] = useState({
        firstName: false,
        secondName: false,
        password: false,
        email: false,
        img: false,
        gender: false,

    })

    const handleSubmit = data => {
        console.log(data)
    }

    return (
        <SingUpPage>
            {loading ? <Loading /> : <Form
                onSubmit={handleSubmit}
                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                    <SingUpForm onSubmit={handleSubmit}>
                        <SingUpLabel variant="h5" color="primary">
                            <SingUpIcon color="primary" />{'Регистрация'}
                        </SingUpLabel>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={7}>
                                <Image>Картинка</Image>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Field name='firstName'>
                                    {props => (
                                        <TextInput
                                            props={props}
                                            error={errors.name}
                                            label={'Имя'}
                                        />)}
                                </Field>
                                <Field name='secondName'>
                                    {props => (
                                        <TextInput
                                            props={props}
                                            error={errors.name}
                                            label={'Фамилия'}
                                        />)}
                                </Field>
                                <Field name='email'>
                                    {props => (
                                        <TextInput
                                            props={props}
                                            error={errors.email}
                                            label={'Email'}
                                        />)}
                                </Field>
                            </Grid>
                            <PassForm container item xs={12}>
                                <Grid item xs={12} sm={5}>
                                    <Field name='password'>
                                        {props => (<Password props={props} error={errors.error} />)}
                                    </Field>
                                </Grid>
                                <Grid item xs={12} sm={5}>
                                    <Field name='confirmPassword'>
                                        {props => (<Password props={props} text={'Повторите пароль'} error={errors.error} />)}
                                    </Field>
                                </Grid>
                            </PassForm>
                        </Grid>
                        <Button variant="contained" color="primary" type="submit" disabled={submitting || pristine}>
                            {'Зарегистрироваться'}
                        </Button>
                        <LoginToolTip variant="subtitle2">
                            {'Уже есть аккаунт? '}
                            <LoginLink to="/auth/login">
                                {'Войдите'}
                            </LoginLink>
                        </LoginToolTip>
                        {
                            errors.error ?
                                <InvalidInput color="error">
                                    {'Неправильный адрес почты или пароль'}
                                </InvalidInput> : null
                        }
                    </ SingUpForm>
                )} />}
        </SingUpPage>
    );
}