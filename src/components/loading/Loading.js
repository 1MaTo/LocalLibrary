import React from 'react';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components'

const Loader = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

export function Loading() {
    return (
        <Loader>
            <CircularProgress color={"secondary"} />
        </Loader>
    )
}