import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Form, Field } from 'react-final-form'
import { Button, Avatar } from '@material-ui/core'
import { TextInput } from '../Authentication/LoginInput/TextInput'
import { FileInput } from '../Authentication/LoginInput/FileInput'
import { theme } from '../../Theme/Theme'
import { DatePicker } from './DatePickers'
import moment from 'moment'
import { ChipInput } from './ChipInput'

const Image = styled(Avatar)`
    width: inherit;
    height: inherit;
    font-size: 4.0em;
    border-radius: inherit;
`

const ImageContainer = styled.div`
    display: flex;
    border-radius: 5px;
    width: 200px;
    height: 300px;
`

export default function AddBook() {

    const [image, setImage] = useState(`https://ipsumimage.appspot.com/200x300,${theme.palette.background.highlight.substr(1)}?l=Добавить|изображение&s=24&f=${theme.palette.primary.main.substr(1)}`)

    const [initialValues] = useState({
        releaseYear: moment().format(),
        publicDate: moment().format()
    })

    const onSubmit = values => {
        console.log(values)
    }

    const onlyNumber = value => {
        if (!value) return value
        const onlyNums = value.replace(/[^\d]/g, "")
        return onlyNums
    }

    const validate = (values) => {
        const errors = {}
        if (!values.name) {
            errors.name = ''
        }
        if (!values.about) {
            errors.about = ''
        }
        if (!values.pages) {
            errors.pages = ''
        }
        if (!values.amount) {
            errors.amount = ''
        }
        if (!values.releaseYear) {
            errors.releaseYear = ''
        }
        if (!values.publicDate) {
            errors.publicDate = ''
        }
        if (!values.tags || !values.tags.length) {
            errors.tags = ''
        }
        if (!values.author || !values.author.length) {
            errors.author = ''
        }
        if (!values.avatar) {
            errors.author = ''
        }
        return errors
    }

    return (
        <Form
            initialValues={initialValues}
            validate={values => validate(values)}
            onSubmit={onSubmit}
            render={({ handleSubmit, submitting, pristine, values, valid }) => (
                <form onSubmit={handleSubmit}>
                    <Field name='name'>
                        {props => (
                            <TextInput
                                props={props}
                                label={'Название книги'}
                            />)}
                    </Field>
                    <Field name='about'>
                        {props => (
                            <TextInput
                                props={props}
                                label={'Описание'}
                                multiline={true}
                            />)}
                    </Field>
                    <Field name='amount' parse={onlyNumber}>
                        {props => (
                            <TextInput
                                props={props}
                                label={'Количество книг'}
                            />)}
                    </Field>
                    <Field name='pages' parse={onlyNumber}>
                        {props => (
                            <TextInput
                                props={props}
                                label={'Кол-во страниц'}
                            />)}
                    </Field>
                    <Field name='releaseYear'>
                        {props => (
                            <DatePicker
                                props={props}
                                views={["year"]}
                                label={'Год издания книги'}
                                format={"YYYY"}
                            />)}
                    </Field>
                    <Field name='publicDate'>
                        {props => (
                            <DatePicker
                                views={["year", "month", "date"]}
                                props={props}
                                format={"DD/MM/YYYY"}
                                label={'Дата публицакии'}
                            />)}
                    </Field>
                    <Field
                        name='author'>
                        {props => (
                            <ChipInput
                                props={props}
                                label={'Авторы (нажмите enter что бы добавить автора)'}
                            />)}
                    </Field>
                    <Field
                        name='tags'>
                        {props => (
                            <ChipInput
                                props={props}
                                label={'Теги (нажмите enter что бы добавить тег)'}
                                toLowerCase={true}
                            />)}
                    </Field>
                    <ImageContainer>
                        <Image src={image} />
                        <Field name='avatar'>
                            {props => (
                                <FileInput
                                    formats='.png, .jpg, .jpeg'
                                    text={'Выбрать аватар'}
                                    image={setImage}
                                    {...props.input} />
                            )}
                        </Field>
                    </ImageContainer>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!valid}>
                        Добавить книгу
                    </Button>
                </ form>
            )}>
        </Form>
    )
}