import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useSnackbar } from 'notistack'


export function useUpdate(type) {

    const { enqueueSnackbar } = useSnackbar();

    const handleSnackbar = (message, variant) => {
        enqueueSnackbar(message, { variant, autoHideDuration: 1000 });
    }

    const dispatch = useDispatch()

    const user = () =>
        axios
            .get('/api/user/info')
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "SET_USER", user: response.data })
                    //handleSnackbar('Данные обновлены', 'success')
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

    const bookList = () =>
        axios
            .get('/api/books/')
            .then((response) => {
                if (response.status === 200) {
                    dispatch({ type: "SET_BOOKS", books: response.data })
                    return (response.data)
                }
            })
            .catch(error => {
                console.log('Cant get books')
            })

    const bookReadingStat = (id) =>
        axios.get(`/api/book/users/reading/${id}`)

    const getBookInfo = (id) =>
        axios.get(`/api/book/${id}`)

    const deleteBooks = (id) => {
        return Promise.all(id.map(id => {
            return axios.post(`/api/delete/book/${id}`)
        }))
            .then(ok => {
                handleSnackbar('Книги удалены', 'success')
                return (true)
            })
            .catch(error => {
                console.log(error)
                handleSnackbar('Ошибка во время удаления', 'error')
                return (false)
            })
    }

    switch (type) {
        case 'USER':
            return user
        case 'USERLIST':
            return userList
        case 'BOOKS':
            return bookList
        case 'BOOK_READING_STAT':
            return bookReadingStat
        case 'GET_BOOK':
            return getBookInfo
        case 'DELETE_BOOKS':
            return deleteBooks
        default:
            return false
    }
}
