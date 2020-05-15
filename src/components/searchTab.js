import React, { useState } from 'react'
import { Paper, IconButton, InputBase, Divider } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import { theme } from '../Theme/Theme';
import ClearIcon from '@material-ui/icons/Clear';


const Background = styled(Paper)`
    background: ${theme.palette.primary.main};
    padding: 0px 5px 0px 10px;
    height: 48px;
    display: flex;
    min-width: 300px;
    width: 100%;
    transition: width 0.3s ease-in-out;
`

const Input = styled(InputBase)`
    width: 100%;
    color: ${theme.palette.text.main};
    border-radius: 3px;
    padding-left: 10px;
    height: 70%;
    background: #ffffff1a;
    margin: auto;
`

const Divide = styled(Divider)`
    height: 35px;
    margin: auto 5px auto 5px;
    width: 1px;
`
const Icon = styled(IconButton)`
    color: ${theme.palette.secondary.main};
`

const Clear = styled(IconButton)`
    color: ${theme.palette.secondary.main};
    padding: 0px;
    height: 30px;
    width: ${props => props.visible ? '30px' : '0px'};
    margin: auto 0px auto 5px;
    transition: all 0.3s ease-in-out;
    opacity: ${props => props.visible ? '100%' : '0%'};
    transform: ${props => props.visible ?
        'scale(1) rotate(0deg);'
        : 'scale(0) rotate(270deg);'};
    margin-left: ${props => props.visible ? '5px' : '0px'};
`

export default function Search({ disabled = false, placeholder = "Поиск...", items, handleResults, searchKey = "name" }) {

    const [searchWords, setSearchWords] = useState([])

    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (e) => {
        const input = e.target.value
        setInputValue(input)
        if (input) {
            setSearchWords(input.toLowerCase().trim().split(' '))

        } else {
            setSearchWords([])
        }
        handleSearch(null)((input.toLowerCase().trim().split(' ')))
    }

    const handleSearch = e => searchWords => {
        if (e) {
            e.preventDefault()
        }
        if (searchWords.length === 0) {
            handleResults(items)
        } else {
            let result = []
            items.forEach(book => {
                if (searchWords.every(word => book[searchKey].toLowerCase().includes(word)))
                    result.push(book)
            })
            handleResults(result)
        }
    }

    const handleClearSearch = () => {
        setInputValue('')
        setSearchWords([])
        handleSearch(null)([])
    }

    return (
        <Background color="primary" component="form">
            <Input
                disabled={disabled}
                onChange={handleInputChange}
                placeholder={placeholder}
                value={inputValue} />
            <Clear
                visible={searchWords.length ? true : false}
                disabled={disabled}
                onClick={handleClearSearch}>
                <ClearIcon />
            </Clear>
            <Divide orientation="vertical" />
            <Icon disabled={disabled} onClick={(e) => handleSearch(e)(searchWords)} type="submit">
                <SearchIcon />
            </Icon>

        </Background>
    )
}