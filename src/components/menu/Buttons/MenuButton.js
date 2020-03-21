import React from 'react';
import { Typography, Button } from '@material-ui/core';
import styled from 'styled-components'
import Icons from '@material-ui/core/Icon'
import { Link } from "react-router-dom";


const Background = styled(Button)`
    display: flex;
    align-items: center;
    width: fit-content;
    margin: initial;
    padding-left: 15px;
    padding-right: 15px;
    text-transform: unset;
    margin: unset;
    border-radius: unset;
`

const Icon = styled(Icons)`
    font-size: 1.2rem;
    margin-right: 3px;
    margin-bottom: 1.8px;
    @media (max-width: 700px){
        font-size: 1.5rem;
        margin-right: 0px;
    }
`

const Text = styled(Typography)`
    @media (max-width: 700px){
        display: none;
    }
`

export default function MenuButton(props) {
    return (
        <Link to={props.path ? props.path : null}>
            <Background onClick={ props.handleAction ? props.handleAction : null}>
                <Icon>{props.icon}</Icon>
                <Text>
                    {props.text}
                </Text>
            </Background>
        </Link>
    )
}