import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Typography, Container, Avatar } from '@material-ui/core';
import BookCard from './bookCard'

const  Background = styled(Container)`
    padding: none;
`

export default function BookList(props) {

    return (
        <Background>
            <BookCard/>
        </Background>
    )
}