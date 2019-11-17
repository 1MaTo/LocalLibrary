import React, { useState } from 'react';
import {
    InputLabel,
    FormControl,
    Input,
    FormHelperText
} from '@material-ui/core';

export function TextInput({ props, error, errorText, label }) {

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
            />
            {error ? <FormHelperText>{ errorText }</FormHelperText> : null}
        </FormControl>
    )
}