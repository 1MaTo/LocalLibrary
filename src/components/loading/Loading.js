import React from 'react';
import { Typography, Container, CircularProgress } from '@material-ui/core';
import styled from 'styled-components'

const Loader = styled(Container)`
    && {
        margin: auto;
        width: fit-content;
        align-content: center;
        margin-top: 50px;
        height: 100%;
    }
`;

export function Loading() {
    return (
        <Loader>
            <Typography variant="h5">
                Please wait
            </Typography>
            <Loader>
            <CircularProgress color={"secondary"} />
            </Loader>
        </Loader>
    )
}