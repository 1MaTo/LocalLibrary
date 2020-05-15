import React, { useEffect, useState } from 'react'
import { List, Button, Typography } from '@material-ui/core'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, ListSubheader } from '@material-ui/core'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../Theme/Theme'
import BookListItem from './bookCard'
import { useUpdate } from '../../store/updateStore'
import { Loading } from '../Loading/Loading'

const ItemList = styled.div`
    display: flex;
    padding: 10px;
    flex-wrap: wrap;
`

export default function BookList() {

    const books = useSelector(store => store.bookList)
    const loadBooks = useUpdate("BOOKS")

    useEffect(() => {
        loadBooks()
    }, [])

    return (
        <ItemList>
            {!books.length ? <Loading /> :
                <>
                    {books.map(book =>
                        <BookListItem
                            kei={keyframes.id}
                            id={book.id}
                            avatar={book.avatar}
                            name={book.name}
                            pages={book.pages}
                            releaseYear={book.releaseYear} />
                    )}
                </>
            }
        </ItemList>
    )
}