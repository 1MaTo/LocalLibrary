import React from 'react';
import {
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@material-ui/core';
import styled from 'styled-components'

const RadioInputForm = styled(FormControl)`
    justify-content: center;
`

export function RadioButtonInput({ props, values }) {

    return (
        <RadioInputForm>
            <FormLabel component={"legend"}>Пол</FormLabel>
            <RadioGroup name={props.input.name} value={props.input.value} onChange={props.input.onChange}>
                <ValueList values={values}/>
            </RadioGroup>
        </RadioInputForm>
    )
}

function ValueList({ values }) {
    const valuesArr = Array.from(values)
    return (
        valuesArr.map((value) => {
            return (<FormControlLabel key={value} value={value} control={<Radio />} label={value} />)
        })
    )
}