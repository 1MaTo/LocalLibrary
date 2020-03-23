import React from 'react';
import { Container } from '@material-ui/core';
import styled from 'styled-components'
import { theme } from '../../Theme/Theme'
import MenuButton from './Buttons/MenuButton'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import axios from 'axios';
import UserMenu from './Buttons/UserMenu'

const BackgroundMenu = styled(Container)`
    height: 50px;
    background-color: ${theme.background.menuBackGround};
    border-bottom: 2px solid ${theme.palette.primary.main};
    display: flex;
    max-width: none;
    margin-bottom: 50px;
`

const LeftMenuBar = styled(Container)`
    display: flex;
    justify-content: flex-start;
`

const RightMenuBar = styled(Container)`
    display: flex;
    justify-content: flex-end;
`


export default function Menu() {

    const user = useSelector(state => state.user)

    const Home = () => {
        return (
            <MenuButton
                path={'/'}
                icon={'home'}
                text={'Главная'}
            />
        )
    }

    const SingUp = () => {
        return (
            <MenuButton
                path={'/auth/registration'}
                icon={'person_add'}
                text={'Создать аккаунт'}
            />
        )
    }

    const LogIn = () => {
        return (
            <MenuButton
                path={'/auth/login'}
                icon={'account_circle'}
                text={'Вход'}
            />
        )
    }

    return (
        <BackgroundMenu>
            <LeftMenuBar>
                <Home />
            </LeftMenuBar>
            {user ?
                <RightMenuBar>
                    <UserMenu/>
                </RightMenuBar>
                :
                <RightMenuBar>
                    <LogIn />
                    <SingUp />
                </RightMenuBar>
            }

        </BackgroundMenu>
    )
}