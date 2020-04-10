import React, { useState } from 'react'
import {
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Checkbox,
    MenuItem,
    Avatar,
    Menu,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/MoreVert'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../../../Theme/Theme'
import { ChangeUserRole } from '../../../menu/Buttons/ActionButtons'
import PopperMenu from '../../../menu/PopperMenu'

const Email = styled.span`
    color: rgba(0, 0, 0, 0.54);
`

const changeBackground = keyframes`
    from {background: ${theme.palette.background.dark}}
    to { background: ${theme.palette.background.highlight};}
`

const User = styled(ListItem)`
    background: ${props => theme.palette.background[props.checked ? 'highlight' : 'dark']};
    padding-right: 190px;
    cursor: default;
    transition: all 0.15s linear;
    &:hover {
        animation: ${props => !props.checked ? changeBackground : null} 0.15s linear;
        background: ${theme.palette.background.highlight};
    }
`

export default function UserListItem({ user, checked, handleToggle }) {

    const getNameAvatar = (first, second) => {
        return Boolean(first) && Boolean(second) ?
            first[0].toUpperCase() + second[0].toUpperCase() : ''
    }

    const PrimaryText = (name, email) => {
        return (
            <div>
                {name}
                <Email>{'#' + email}</Email>
            </div>
        )
    }

    const getDate = (date = new Date()) => {
        const time = {
            yy: date.getFullYear(),
            mm: date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
            dd: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
            hh: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
            min: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
            ss: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
        }
        return `${time.dd}-${time.mm}-${time.yy}`
    }

    const [roles] = useState([
        {
            name: 'admin',
            label: 'Администратор'
        }, {
            name: 'moderator',
            label: 'Модератор'
        }, {
            name: 'user',
            label: 'Пользователи'
        }, {
            name: 'banned',
            label: 'Забанить'
        }
    ])

    const RoleButtons = () => {

        let mass = []

        roles.forEach(role => {
            if (role.name !== user.role) {
                mass.push(<ChangeUserRole key={role.name} text={role.label} id={user.id} role={role.name} />)
            }
        })

        return (mass)
    }

    return (
        <User onClick={handleToggle(user.id)} checked={checked.indexOf(user.id) !== -1}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checked.indexOf(user.id) !== -1}
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': user.id }}
                />
            </ListItemIcon>
            <ListItemAvatar>
                <Avatar src={user.avatar}>
                    {getNameAvatar(user.firstName, user.secondName)}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                id={user.id}
                primary={PrimaryText(`${user.firstName} ${user.secondName}`, user.email)}
                secondary={`Регистрация: ${getDate(new Date(user.registerDate))}`} />
            <ListItemSecondaryAction>
                <PopperMenu
                    text={user.role}
                    info={user.id}
                    MenuButtons={RoleButtons} />
            </ListItemSecondaryAction>
        </User>
    )
}