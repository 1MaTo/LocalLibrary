import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import { Button, Typography, Container } from '@material-ui/core';
import styled from 'styled-components'
import { Password } from "./LoginInput/Password";
import { TextInput } from "./LoginInput/TextInput";
import { theme } from '../../Theme/Theme'
import { AccountCircle } from '@material-ui/icons/';
import { Loading } from '../Loading/Loading'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import md5 from 'md5'
import axios from 'axios'

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 250px;
    padding: 30px;
    background: ${theme.background.dark};
`

const LoginPage = styled(Container)`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const LoginLabel = styled(Typography)`
    margin: auto;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
`

const LoginIcon = styled(AccountCircle)`
    margin: auto;
    font-size: 35px;
    margin-right: 10px;
`

const InvalidInput = styled(Typography)`
    margin-top: 20px;
    text-align: center;
`

const RegisterLink = styled(Link)`
    color: ${theme.primary.main};
    &:hover {
        text-decoration: underline;
    }
`
const Register = styled(Typography)`
        font-size: 0.85em;
    margin-top: 5px;
    color: ${theme.secondary.main};
    width: fit-content;
    align-self: center;
`

export default function SignUp(props) {

    const dispatch = useDispatch()
    const [errors, setErrors] = useState({
        error: false,
    })

    const [loading, setLoading] = useState(false)

    const handleSubmit = data => {
        data.password = md5(data.password)
        setLoading(true)
        axios
            .post('/api/login', data)
            .then((response) => {
                if (response.status === 200) {
                    axios
                        .get('/api/user/info')
                        .then((response) => {
                            if (response.status === 200) {
                                setLoading(false)
                                dispatch({ type: "SET_USER", user: response.data })
                                const user = response.data
                                console.log(user)
                            }
                        })
                        .catch((error) => {
                            setLoading(false)
                            setErrors({ ...errors, error: true })
                        })
                }
            })
            .catch(error => {
                setLoading(false)
                setErrors({ ...errors, error: true })
            })
    }

    return (
        <LoginPage>
            {loading ? <Loading /> :
                <Form
                    onSubmit={handleSubmit}
                    render={({ handleSubmit, reset, submitting, pristine, values }) => (
                        <LoginForm onSubmit={handleSubmit}>
                            <LoginLabel variant="h5" color="primary">
                                <LoginIcon color="primary" />{'ВХОД'}
                            </LoginLabel>
                            <Field name='email'>
                                {props => (
                                    <TextInput
                                        props={props}
                                        error={errors.error}
                                        label={'Email'}
                                    />)}
                            </Field>
                            <Field name='password'>
                                {props => (<Password props={props} error={errors.error} />)}
                            </Field>
                            <Button variant="contained" color="primary" type="submit" disabled={submitting || pristine}>
                                {'Войти'}
                            </Button>
                            <Register variant="subtitle2">{'Нет аккаунта? '}<RegisterLink to="/auth/registration">{'Зарегистрируйтесь'}</RegisterLink></Register>
                            {
                                errors.error ?
                                    <InvalidInput color="error">
                                        {'Неправильный адрес почты или пароль'}
                                    </InvalidInput> : null
                            }
                        </LoginForm>
                    )} />}
        </LoginPage>
    )
}