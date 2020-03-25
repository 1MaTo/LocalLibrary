import React, { useEffect, useState } from 'react'
import { List } from '@material-ui/core'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import UserListItem from './userLIstItem'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, ListSubheader } from '@material-ui/core'

export default function UserList() {

    const userList = useSelector(state => state.userList)
    const enqueueSnackbar = useSnackbar()
    const dispatch = useDispatch()
    const [checked, setChecked] = useState([0]);

    const handleSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant });
    }

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const [roles] = useState([
        {
            name: 'admin',
            label: 'Администраторы'
        }, {
            name: 'moderator',
            label: 'Модераторы'
        }, {
            name: 'user',
            label: 'Пользователи'
        }, {
            name: 'banned',
            label: 'Забанены'
        }, {
            name: 'unconfirmed',
            label: 'Не подтвержденные'
        },
        
    ])

    useEffect(() => {
        axios
            .get('/api/users/')
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "SET_USERLIST", userList: response.data })
                }
            })
            .catch(error => {
                console.log('Ошибка при получении списка пользователей', error)
                handleSnackbar('Ошибка при получении данных от сервера', 'error')
            })
    }, [])

    return (
        <List>
            {roles.map(role => {
                return (userList.findIndex(user => user.role === role.name) !== -1) ?
                    <div key={role.name}>
                        <ListSubheader>{role.label}</ListSubheader>
                        {userList.map(user => user.role === role.name ?
                            <div key={user.id}>
                                <UserListItem
                                    key={user.id}
                                    user={user}
                                    handleToggle={handleToggle}
                                    checked={checked} />
                                <Divider />
                            </div> : null
                        )}
                    </div> : null
            })}
        </List >
    )
}