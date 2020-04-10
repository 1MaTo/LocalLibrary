import React from 'react'
import styled from 'styled-components'
import Icons from '@material-ui/core/Icon'
import { Button, Typography } from '@material-ui/core'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useUpdate } from '../../../store/updateStore'
import { useSnackbar } from 'notistack'

const ItemButton = styled(Button)`
    &&{
        color: black;
        width: auto;
        border-radius: unset;
        justify-content: flex-start;
        padding: 13px 15px 13px 15px;
    }
`
const ButtonText = styled(Typography)`
    text-transform: none;
`

const Icon = styled(Icons)`
    font-size: 1.2rem;
    margin-right: 5px;
`

const MenuButton = ({ icon, text, action, path }) => {
    return (
        <Link to={path}>
            <ItemButton onClick={action ? action : null}>
                {icon ? <Icon>{icon}</Icon> : null}
                {text ? <ButtonText>{text}</ButtonText> : null}
            </ItemButton >
        </Link>
    )
}

export const LogOut = () => {
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

    return (
        <MenuButton
            path={'/auth/login'}
            icon={'exit_to_app'}
            text={'Выйти'}
            action={handleLogOut}
        />
    )
}

export const Profile = () => {
    return (
        <MenuButton
            path={'/lk'}
            text={'Профиль'}
            icon={'settings'} />
    )
}

export const ChangeUserRole = ({ text, id, role, icon }) => {

    const updateUserList = useUpdate('USERLIST')
    const { enqueueSnackbar } = useSnackbar();

    const handleSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant, autoHideDuration: 1000 });
    }

    const handleAction = () => {
        axios
            .post(`api/update/user/${id}`, { role: role })
            .then((response) => {
                if (response.status === 200) {
                    updateUserList()
                    handleSnackbar('Роль пользователя успешно изменена', 'success')
                }
            })
            .catch(error => {
                handleSnackbar('Ошибка при обновлении роли у пользователя', 'error')
            })
    }
    return (
        <MenuButton
            path={'/lk'}
            text={text}
            icon={icon ? icon : false}
            action={handleAction}
        />
    )
}