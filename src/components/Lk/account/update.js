import React, { useState, useEffect } from 'react'
import { Form, Field } from 'react-final-form'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Loading } from '../../Loading/Loading'
import styled from 'styled-components'
import { theme } from '../../../Theme/Theme'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { Password } from "../../Authentication/LoginInput/Password";
import { TextInput } from '../../Authentication/LoginInput/TextInput'
import { Link } from 'react-router-dom'
import { Avatar } from '@material-ui/core';
import { FileInput } from '../../Authentication/LoginInput/FileInput'
import { RadioButtonInput } from '../../Authentication/LoginInput/RadioButtonInput'
import md5 from 'md5'
import axios from 'axios'
import Message from '../../ActionsMessages/message'
import { useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { useUpdate } from '../../../store/updateStore'

const SingUpPage = styled(Container)`
    display: flex;
    justify-content: center;
    align-items: center;
`

const SingUpForm = styled.form`
    display: inline-flex;
    flex-direction: column;
    width: 600px;
    padding: 30px;
    background: ${theme.palette.background.dark};
    @media (max-width: 600px) {
        width: 300px;
    }
`

const ImageContainer = styled(Grid)`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 150px;
    height: 150px;
`

const Image = styled(Avatar)`
    width: inherit;
    height: inherit;
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

const SingUpButton = styled(Button)`
    margin: 5px auto 5px auto;
`

export default function Update() {

    const user = useSelector(state => state.user)

    const [loading, setLoading] = useState(false)

    const [image, setImage] = useState(user.avatar)

    const [message, setMessage] = useState(null)

    const updateUser = useUpdate('USER')

    const { enqueueSnackbar } = useSnackbar();

    const handleSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant });
    }

    const handleSubmit = data => {
        var parsedData = {
            firstName: data.firstName,
            secondName: data.secondName,
            imgData: data.avatar,
            gender: data.gender
        }
        if (data.oldPassword) {
            parsedData.password = md5(data.newPassword)
        }
        setLoading(true)
        axios
            .post(`api/update/user/${user.id}`, parsedData)
            .then((response) => {
                if (response.status === 200) {
                    updateUser()
                    handleSnackbar('Данные обновлены', 'success')
                    setLoading(false)
                }
            })
            .catch(error => {
                handleSnackbar('Ошибка при обновлении данных', 'error')
                setLoading(false)
            })
    }


    const getNameAvatar = (first, second) => {
        return Boolean(first) && Boolean(second) ?
            first[0].toUpperCase() + second[0].toUpperCase() : ''
    }

    const validate = (values) => {
        const errors = {}
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
        if (values.oldPassword) {
            if (!values.newPassword) {
                errors.newPassword = ''
            } else if (values.confirmNewPassword !== values.newPassword) {
                errors.confirmNewPassword = 'Пароли должны совпадать'
            }
        }
        return errors
    }

    return (
        <SingUpPage>
            {message ? <Message message={message.text} type={message.type} /> : loading ? <Loading /> : <Form
                onSubmit={handleSubmit}
                initialValues={user}
                validate={values => validate(values)}
                render={({ handleSubmit, reset, submitting, pristine, values, valid }) => (
                    <SingUpForm onSubmit={handleSubmit}>
                        <InputsContainer container spacing={2}>
                            <Grid container item xs={12} sm={5}>
                                <ImageContainer item xs={12}>
                                    <Image src={image}>
                                        {getNameAvatar(values.firstName, values.secondName)}
                                    </Image>
                                    <Field name='avatar' defaultValue={image}>
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
                                            disabled={true}
                                            props={props}
                                            label={'Email'}
                                        />)}
                                </Field>
                            </Grid>
                            <GridForm container item xs={12} sm={5}>
                                <RadioButtonInput
                                    values={[
                                        {
                                            value: "male",
                                            label: "Мужской"
                                        }, {
                                            value: "female",
                                            label: "Женский"
                                        },
                                    ]}
                                    name={{ value: "gender", label: "Пол" }}
                                />
                            </GridForm>
                            <GridForm container item xs={12} sm={6}>
                                <Grid item xs={12}>
                                    <Field name='oldPassword'>
                                        {props => (<Password props={props} />)}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name='newPassword'>
                                        {props => (<Password checkPass={user.password} disabled={values.oldPassword ? values.oldPassword : true} props={props} text={'Введите новый пароль'} />)}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field name='confirmNewPassword'>
                                        {props => (<Password checkPass={user.password} disabled={values.oldPassword ? values.oldPassword : true} props={props} text={'Повторите новый пароль'} />)}
                                    </Field>
                                </Grid>
                            </GridForm>
                        </InputsContainer>
                        <SingUpButton variant="contained" color="primary" type="submit" disabled={!valid}>
                            {'Сохранить изменения'}
                        </SingUpButton>
                    </ SingUpForm>
                )} />}
        </SingUpPage>
    );
}