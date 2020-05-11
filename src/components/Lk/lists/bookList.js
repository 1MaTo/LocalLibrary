import React, { useEffect, useState } from 'react'
import { List, Button, Typography } from '@material-ui/core'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, ListSubheader } from '@material-ui/core'
import styled from 'styled-components'
import { theme } from '../../../Theme/Theme'
import BookListItem from './listItems/bookListItem'
import { useUpdate } from '../../../store/updateStore'
import { Loading } from '../../Loading/Loading'

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
                    <BookListItem
                        id={books[0].id}
                        avatar={books[0].avatar}
                        name={books[0].name} />
                </>
            }
        </ItemList>
    )
}