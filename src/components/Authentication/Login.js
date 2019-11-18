import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import { Button, Typography, Container } from '@material-ui/core';
import styled from 'styled-components'
import { Password } from "./LoginInput/Password";
import { TextInput } from "./LoginInput/TextInput";
import { theme } from '../../Theme/Theme'
import { AccountCircle } from '@material-ui/icons/';

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

export default function SignUp(props) {

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
        <LoginPage>
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
                        {
                            errors.error ?
                                <InvalidInput color="error">
                                    {'Неправильный адрес почты или пароль'}
                                </InvalidInput> : null
                        }
                    </LoginForm>
                )}>
            </Form>
        </LoginPage>
    )
}