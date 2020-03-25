import React from 'react';
import { Typography, Button, Avatar, Popper, Paper, Divider } from '@material-ui/core';
import styled from 'styled-components'
import Icons from '@material-ui/core/Icon'
import { useSelector, useDispatch } from 'react-redux'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { theme } from '../../../Theme/Theme'
import { LogOut, Profile } from './ActionButtons'


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

const MenuList = styled(Paper)`
    display: flex;
    flex-direction: column;
    background: ${theme.palette.background.dark};

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