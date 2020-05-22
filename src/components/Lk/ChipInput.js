import React, { useState, useEffect, useRef } from 'react';
import {
    InputLabel,
    FormControl,
    Input,
    FormHelperText,
    Chip
} from '@material-ui/core';
import styled from 'styled-components'
import { theme } from '../../Theme/Theme'

const ErrosMessage = styled(FormHelperText)`
    position: absolute;
    top: 45px;
    color: ${theme.palette.error.main};
`

const Chips = styled.div`
    padding: 10px 0px;
`

const StyledChip = styled(Chip)`
    height: 35px;
    border-radius: 10px;
    margin: 0px 5px 5px 0px;
`

export function ChipInput({ 
    props, 
    error, 
    errorText, 
    label, 
    variant = 'Input', 
    disabled = false, 
    multiline = false,
    toLowerCase = false}) {

    const [chips, setChips] = useState([])

    const [inputValue, setInputValue] = useState("")

    const [sameNameErr, setSameNameErr] = useState()

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const value = toLowerCase ? e.target.value.trim().toLowerCase() : e.target.value.trim() 
            if (value !== "") {
                if (chips.indexOf(value) === -1) {
                    setInputValue("")
                    props.input.onChange([...chips, value])
                    setSameNameErr()
                } else {
                    setSameNameErr("Поле с таким же названием уже существует")
                }
            }
        }
    }

    const handleDelete = (chipToDelete) => {
        props.input.onChange(chips.filter(chip => chip !== chipToDelete))
    }

    useEffect(() => {
        if (props.input.value) {
            setChips(props.input.value)
        }
    }, [props.input.value])

    return (
        <div>
            <FormControl>
                <InputLabel>{label}</InputLabel>
                <Input
                    autoComplete="off"
                    name={props.input.name}
                    error={error}
                    type={'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    variant={variant}
                    disabled={disabled}
                    multiline={multiline}
                    onKeyPress={handleKeyPress}
                />
                {sameNameErr && <ErrosMessage>{sameNameErr}</ErrosMessage>}
                {props.meta.error && props.meta.touched && <ErrosMessage>{props.meta.error}</ErrosMessage>}
            </FormControl>
            {chips.length > 0 && <Chips>
                {chips.map(word =>
                    <StyledChip
                        color="secondary"
                        key={word}
                        label={word}
                        onDelete={() => handleDelete(word)} />)}
            </Chips>}
        </div>
    )
}