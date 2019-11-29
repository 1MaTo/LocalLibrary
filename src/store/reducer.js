const initialState = {
    bookList: [],
    book: null,
    user: {
        loggedIn : false
    },
}

export function reducer(state = initialState, action) {
    switch (action.type) {
        case "SET_BOOKS":
            return {
                ...state,
                bookList: action.books
            }
        case "SET_BOOK":
            return {
                ...state,
                book: action.book
            }
        case "DELETE_BOOK":
            return {
                ...state,
                book: null
            }
        case "SET_USER":
            return {
                ...state,
                user: action.user
            }
        default:
            return state
    }
}