import React, { useState } from 'react';
import {
    InputLabel,
    FormControl,
    Input,
    InputAdornment,
    IconButton,
    FormHelperText,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import styled from 'styled-components'
import { theme } from '../../../Theme/Theme'

const TextInput = styled(Input)`
    .MuiIconButton-root {
        &:hover {
            background: transparent;
        }
    }
`

export function Password({ props, error }) {
    const [values, setValues] = useState({
        showPassword: false,
    })

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword })
    }

    const handleMouseDownPassword = event => {
        event.preventDefault();
    }

    return (
        <FormControl>
            <InputLabel>{'Пароль'}</InputLabel>
            <TextInput
                color='primary'
                name={props.input.name}
                autoComplete="current-password"
                error={error}
                type={values.showPassword ? 'text' : 'password'}
                value={props.input.value}
                onChange={props.input.onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
            />
            {error ? <FormHelperText>{}</FormHelperText> : null}
        </FormControl>
    )
}