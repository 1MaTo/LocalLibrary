import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'


export function useUpdate(type) {

    const { enqueueSnackbar } = useSnackbar();

    const handleSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant });
    }
    
    const dispatch = useDispatch()

    const user = () =>
        axios
            .get('/api/user/info')
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "SET_USER", user: response.data })
                    handleSnackbar('Данные обновлены', 'success')
                    console.log(response.data)
                }
            })
            .catch(error => {
                console.log('User not logged in')
                handleSnackbar('Ошибка при получении данных от сервера', 'error')
            })

    switch (type) {
        case 'USER':
            return user
        default:
            return false
    }
}
