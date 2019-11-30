import React from 'react';
import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components'

const Loader = styled.div`
    && {
    }
`;

export function Loading() {
    return (
        <Loader>
            <CircularProgress color={"secondary"} />
        </Loader>
    )
}