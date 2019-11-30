import React from 'react';
import {
    InputLabel,
    FormControl,
    Input,
    FormHelperText
} from '@material-ui/core';

export function TextInput({ props, error, errorText, label, variant = 'Input' }) {

    return (
        <FormControl>
            <InputLabel>{label}</InputLabel>
            <Input
                autoComplete="current-email"
                name={props.input.name}
                error={error}
                type={'text'}
                value={props.input.value}
                onChange={props.input.onChange}
                variant={variant}
            />
            {error ? <FormHelperText>{error}</FormHelperText> : null}
        </FormControl>
    )
}