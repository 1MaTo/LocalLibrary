import React from 'react';
import {
    FormLabel,
    FormControlLabel,
    Radio
} from '@material-ui/core';
import styled from 'styled-components'
import { Field } from 'react-final-form'

const ButtonList = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 15px;
`

const RadioGroup = styled.div`
    margin: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
`

export function RadioButtonInput({ values, name }) {

    const array = values.map(element => {
        return (
            <Field key={element.value} name={name.value} type="radio" value={element.value}>
                {props => (
                    <FormControlLabel
                        key={props.input.value}
                        value={props.input.value}
                        control={<Radio />}
                        label={element.label}
                        checked={props.input.checked}
                        onChange={props.input.onChange} />
                )}
            </Field>)
    })

    return (
        <RadioGroup>
            <FormLabel component="legend">{name.label}</FormLabel>
            <ButtonList>
                {array}
            </ButtonList>
        </RadioGroup>
    )
}