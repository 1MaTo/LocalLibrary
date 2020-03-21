import React from 'react'
import styled from 'styled-components'
import { Container } from '@material-ui/core';
import BookCard from './bookCard'

const  Background = styled(Container)`
    padding: none;
`

export default function BookList() {

    return (
        <Background>
            <BookCard/>
        </Background>
    )
}