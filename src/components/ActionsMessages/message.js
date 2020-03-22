import React from 'react';
import styled from 'styled-components'
import { Typography } from '@material-ui/core'
import Icons from '@material-ui/core/Icon'
import { theme } from '../../Theme/Theme'

const Background = styled.div`
    margin: 25px 0px 0px 0px;
    padding: 15px 10px 15px 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 300px;
    border-radius: 10px;
    ${({ type }) => type && `
        color: ${theme.palette[type].main}
        border: ${theme.palette[type].main} 2px solid;

    `}
    ${({ type }) => type === 'done' && `

    `}
`

const Title = styled(Typography)`
    font-size: 14pt;
    color: inherit;
`

const Icon = styled(Icons)`
    color: inherit;
    font-size: 40pt;
`

export default function Message(props) {

    const icon = (text) => {
        switch (text) {
            case 'success':
                return 'done'
            case 'error':
                return 'error'
            case 'warning':
                return 'warning'
            case 'info':
                return 'info'
        }
    }
    return (
        <Background type={props.type}>
            <Icon>{icon(props.type)}</Icon>
            <Title>
                {props.message}
            </Title>
        </Background>
    )
}