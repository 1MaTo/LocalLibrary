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
import md5 from 'md5'

const TextInput = styled(Input)`
    .MuiIconButton-root {
        display: inline-flex;
        &:hover {
            background: transparent;
        }
    }
`

const ErrosMessage = styled(FormHelperText)`
    position: absolute;
    top: 45px;
    color: ${theme.palette.error};
`

export function Password({ props, error, text = 'Пароль', disabled = false, checkPass }) {
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
            <InputLabel>{text}</InputLabel>
            <TextInput
                disabled={disabled ? md5(disabled) !== checkPass : false}
                onFocus={() => {
                    props.input.onFocus()
                    props.input.onBlur()
                }}
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
            {props.meta.error && props.meta.touched && <ErrosMessage>{props.meta.error}</ErrosMessage>}
        </FormControl>
    )
}