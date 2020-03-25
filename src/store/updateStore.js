import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'


export function useUpdate(type) {

    const { enqueueSnackbar } = useSnackbar();

    const handleSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant, autoHideDuration: 1000});
    }

    const dispatch = useDispatch()

    const user = () =>
        axios
            .get('/api/user/info')
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "SET_USER", user: response.data })
                    //handleSnackbar('Данные обновлены', 'success')
                    console.log(response.data)
                }
            })
            .catch(error => {
                console.log('User not logged in')
                handleSnackbar('Ошибка при получении данных от сервера', 'error')
            })

    const userList = () => {
        axios
            .get('/api/users/')
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "SET_USERLIST", userList: response.data })
                    //handleSnackbar('Данные списка пользоветелей обновлены', 'success')
                }
            })
            .catch(error => {
                console.log('Ошибка при получении списка пользователей', error)
                handleSnackbar('Ошибка при получении данных от сервера', 'error')
            })
    }

    switch (type) {
        case 'USER':
            return user
        case 'USERLIST':
            return userList
        default:
            return false
    }
}
