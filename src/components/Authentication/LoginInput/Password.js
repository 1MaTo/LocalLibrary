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

const PasswordForm = styled(FormControl)`
    && {
        
    }
`
const TextInput = styled(Input)`
    && {
        
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
        <PasswordForm>
            <InputLabel>{'Пароль'}</InputLabel>
            <TextInput
                color='secondary'
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
            {error ? <FormHelperText>{'Неправильные данные'}</FormHelperText> : null}
        </PasswordForm>
    )
}