import React from 'react';
import { Typography, Button, Avatar, Popper, Paper, Divider } from '@material-ui/core';
import styled from 'styled-components'
import Icons from '@material-ui/core/Icon'
import { useSelector, useDispatch } from 'react-redux'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Link } from "react-router-dom";
import axios from 'axios'
import { theme } from '../../../Theme/Theme'


const Background = styled(Button)`
    align-self: center;
    display: flex;
    align-items: center;
    width: fit-content;
    margin: initial;
    padding: 4px 15px 4px 15px;
    text-transform: unset;
    margin: unset;
    border-radius: unset;
`

const Icon = styled(Icons)`
    font-size: 1.2rem;
    margin-right: 5px;
`

const UserAvatar = styled(Avatar)`
    margin-right: 10px;
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

const ButtonText = styled(Typography)`
    text-transform: none;
`

const MenuList = styled(Paper)`
    display: flex;
    flex-direction: column;
    background: ${theme.palette.background.dark};

`

const ItemButton = styled(Button)`
    &&{
        color: black;
        width: auto;
        border-radius: unset;
        justify-content: flex-start;
        padding: 15px 25px 15px 25px;
    }
`

export default function UserMenu() {

    const getNameAvatar = (first, second) => {
        return Boolean(first) && Boolean(second) ?
            first[0].toUpperCase() + second[0].toUpperCase() : ''
    }
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const id = open ? 'simple-popover' : undefined;

    const user = useSelector(state => state.user)

    const dispatch = useDispatch()

    const handleLogOut = () => {
        axios
            .post('api/logout')
            .then(response => {
                dispatch({ type: "SET_USER", user: null })
                dispatch({ type: "SET_LOGIN", isLogin: false })
                console.log('logOut')
            })
    }

    const MenuButton = ({ icon, text, action, path }) => {
        return (
            <Link to={path ? path : null}>
                <ItemButton onClick={action ? action : null}>
                    <Icon>{icon}</Icon>
                    <ButtonText>{text}</ButtonText>
                </ItemButton >
            </Link>
        )
    }

    const Profile = () => {
        return (
            <MenuButton
                path={'/lk'}
                text={'Профиль'}
                icon={'settings'} />
        )
    }

    const LogOut = () => {
        return (
            <MenuButton
                path={'/auth/login'}
                icon={'exit_to_app'}
                text={'Выйти'}
                action={handleLogOut}
            />
        )
    }

    return (
        <div>
            <ClickAwayListener onClickAway={handleClose}>
                <Background onClick={handleClick}>
                    <UserAvatar src={user.avatar}>
                        {getNameAvatar(user.firstName, user.secondName)}
                    </UserAvatar>
                    <Text>
                        {`${user.firstName} ${user.secondName}`}
                    </Text>
                </Background>
            </ClickAwayListener>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                disablePortal={false}
                modifiers={{
                    flip: {
                        enabled: false,
                    },
                    preventOverflow: {
                        enabled: true,
                        boundariesElement: 'scrollParent',
                    },
                }}
            >
                <MenuList>
                    <Profile />
                    <Divider />
                    <LogOut />
                </MenuList>
            </Popper>
        </div>
    )
}