import React, { useEffect, useState } from 'react'
import { List, Button, Typography } from '@material-ui/core'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import UserListItem from './listItems/userLIstItem'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, ListSubheader } from '@material-ui/core'
import styled from 'styled-components'
import { theme } from '../../../Theme/Theme'

const ActionPanel = styled.div`
    background: #b7b7b7;
    bottom: 0px;
    left: 0;
    position: sticky;
    width: -webkit-fill-available;
    padding: 15px;
`

const SubHeaderTitle = styled(ListSubheader)`
    background: #0000007a;
    color: white;
`

const SelectedText = styled(Typography)`
    margin-bottom: 10px;
    font-size: 0.9rem;
    color: ${theme.palette.primary.main};
`

const DeleteButton = styled(Button)`
    margin: 0px;
    margin-right: 5px;
`

const SelectButton = styled(Button)`
    margin: 0px;
    margin-right: 5px;
`

const StyledList = styled(List)`
    padding: 0px;
`

export default function UserList() {

    const userList = useSelector(state => state.userList)
    const { enqueueSnackbar } = useSnackbar()
    const dispatch = useDispatch()
    const [checked, setChecked] = useState([]);

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

    const handleSelectAll = () => {
        const newChecked = userList.map(user => user.id)
        setChecked(newChecked)
    }

    const handleUnselectAll = () => {
        setChecked([])
    }

    const handleDelete = () => {
        const currentChecked = checked
        const deleteRequests = currentChecked.map(id => {
            return new Promise((resolve, reject) => {
                axios
                    .post(`api/delete/user/${id}`)
                    .then((response) => {
                        if (response.status === 200) {
                            resolve(true)
                        } else {
                            reject(false)
                        }
                    })
                    .catch(error => {
                        console.log('Ошибка при удалении пользователя', error)
                        reject(false)
                    })
            })
        })
        Promise.all(deleteRequests)
            .then(resolve => {
                handleSnackbar('Выбранные пользователи удалены', 'success')
                handleUnselectAll()
                updateInfo()
            })
            .catch(err => {
                console.log(err)
                handleSnackbar('Ошибка во время удаления пользователя', 'error')
                handleUnselectAll()
                updateInfo()
            })
    }

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

    const updateInfo = () => {
        axios
            .get('/api/users/')
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "SET_USERLIST", userList: response.data })
                }
            })
            .catch(error => {
                handleSnackbar('Ошибка при получении данных от сервера', 'error')
            })
    }

    useEffect(() => {
        updateInfo()
    }, [])

    return (
        <div>
            <StyledList>
                {roles.map(role => {
                    return (userList.findIndex(user => user.role === role.name) !== -1) ?
                        <div key={role.name}>
                            <SubHeaderTitle>{role.label}</SubHeaderTitle>
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
            </StyledList >
            {checked.length ? <ActionPanel>
                <SelectedText>{`Выбрано: ${checked.length}`}</SelectedText>
                <SelectButton
                    size='small'
                    color="secondary"
                    variant="outlined"
                    onClick={handleSelectAll}>
                    {'Выбрать все'}
                </SelectButton>
                <SelectButton
                    size='small'
                    color="secondary"
                    variant="outlined"
                    onClick={handleUnselectAll}>
                    {'Отменить выбор'}
                </SelectButton>
                <DeleteButton
                    size='small'
                    color="secondary"
                    variant="contained"
                    onClick={handleDelete}>
                    {'Удалить'}
                </DeleteButton>
            </ActionPanel> : null}
        </div>
    )
}