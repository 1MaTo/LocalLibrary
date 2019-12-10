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
import { Avatar } from '@material-ui/core';
import { FileInput } from './LoginInput/FileInput'
import { RadioButtonInput } from './LoginInput/RadioButtonInput'

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

const ImageContainer = styled(Grid)`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Image = styled(Avatar)`
    width: 150px;
    height: 150px;
    font-size: 4.0em;
`

const GridForm = styled(Grid)`
    display: inline-flex;
    justify-content: space-around;
`

const ResetButton = styled(Grid)`
    text-align: center;
    margin-top: 20px;
`

const InputsContainer = styled(Grid)`
    margin-bottom: 10px;
`

export default function SignUp() {

    const [loading, setLoading] = useState(false)

    const [image, setImage] = useState(null)

    const handleSubmit = data => {
        console.log(data)
    }

    const getNameAvatar = (first, second) => {
        return Boolean(first) && Boolean(second) ?
            first[0].toUpperCase() + second[0].toUpperCase() : ''
    }

    const validate = (values) => {
        const errors={}
        if (!values.firstName) {
            errors.firstName = ''
        }
        if (!values.secondName) {
            errors.secondName = ''
        }
        if (!values.email) {
            errors.email = ''
        }
        if (!values.gender) {
            errors.gender = ''
        }
        if (!values.password) {
            errors.password = ''
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Пароли должны совпадать'
        }
        return errors
    }

    return (
        <SingUpPage>
            {loading ? <Loading /> : <Form
                onSubmit={handleSubmit}
                validate= {values => validate(values)}
                render={({ handleSubmit, reset, submitting, pristine, values, valid }) => (
                    <SingUpForm onSubmit={handleSubmit}>
                        <SingUpLabel variant="h5" color="primary">
                            <SingUpIcon color="primary" />{'Регистрация'}
                        </SingUpLabel>
                        <InputsContainer container spacing={2}>
                            <Grid container item xs={12} sm={5}>
                                <ImageContainer item xs={12}>
                                    <Image src={image}>
                                        {getNameAvatar(values.firstName, values.secondName)}
                                    </Image>
                                    <Field name='avatar' defaultValue={null}>
                                        {props => (
                                            <FileInput
                                                formats='.png, .jpg, .jpeg'
                                                text={'Выбрать аватар'}
                                                image={setImage}
                                                {...props.input} />
                                        )}
                                    </Field>
                                </ImageContainer>
                                <ResetButton item xs={12}>
                                    <Button onClick={() => { setImage(null); values.avatar = null }} variant="contained" color="secondary">
                                        {'Сбросить'}
                                    </Button>
                                </ResetButton>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field name='firstName'>
                                    {props => (
                                        <TextInput
                                            props={props}
                                            label={'Имя'}
                                        />)}
                                </Field>
                                <Field name='secondName'>
                                    {props => (
                                        <TextInput
                                            props={props}
                                            label={'Фамилия'}
                                        />)}
                                </Field>
                                <Field name='email'>
                                    {props => (
                                        <TextInput
                                            props={props}
                                            label={'Email'}
                                        />)}
                                </Field>
                            </Grid>
                            <GridForm container item xs={12} sm={5}>
                                <Field name="gender">
                                    {props => (<RadioButtonInput type="radio" props={props} values={['Мужской', 'Женский']} />)}
                                </Field>
                            </GridForm>
                            <GridForm container item xs={12} sm={6}>
                                <Grid item xs={12}>
                                    <Field name='password'>
                                        {(props, meta) => (<Password props={props} />)}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name='confirmPassword'>
                                        {props => (<Password props={props} text={'Повторите пароль'} />)}
                                    </Field>
                                </Grid>
                            </GridForm>
                        </InputsContainer>
                        <Button variant="contained" color="primary" type="submit" disabled={!valid}>
                            {'Зарегистрироваться'}
                        </Button>
                        <LoginToolTip variant="subtitle2">
                            {'Уже есть аккаунт? '}
                            <LoginLink to="/auth/login">
                                {'Войдите'}
                            </LoginLink>
                        </LoginToolTip>
                    </ SingUpForm>
                )} />}
        </SingUpPage>
    );
}