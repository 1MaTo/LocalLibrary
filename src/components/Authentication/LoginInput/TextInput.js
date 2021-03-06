import React from 'react';
import {
    InputLabel,
    FormControl,
    Input,
    FormHelperText
} from '@material-ui/core';
import styled from 'styled-components'
import { theme } from '../../../Theme/Theme'

const ErrosMessage = styled(FormHelperText)`
    position: absolute;
    top: 45px;
    color: ${theme.palette.error.main};
`

export function TextInput({ props, error, errorText, label, variant = 'Input', disabled = false, multiline = false, autoComplete = "off" }) {
    return (
        <FormControl>
            <InputLabel>{label}</InputLabel>
            <Input
                autoComplete={autoComplete}
                name={props.input.name}
                error={error}
                type={'text'}
                value={props.input.value}
                onChange={props.input.onChange}
                variant={variant}
                disabled={disabled}
                multiline={multiline}
            />
            {props.meta.error && props.meta.touched && <ErrosMessage>{props.meta.error}</ErrosMessage>}
        </FormControl>
    )
}