import React, { useEffect, useState } from 'react'
import { Button, Typography } from '@material-ui/core'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useSelector, useDispatch } from 'react-redux'
import { Divider, ListSubheader } from '@material-ui/core'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../../Theme/Theme'
import BookListItem from './listItems/bookListItem'
import { useUpdate } from '../../../store/updateStore'
import { Loading } from '../../Loading/Loading'
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import Search from '../../searchTab'

const ItemList = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column;
`

const ControlPanel = styled.div`
    max-width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    margin: 0px 15px;
    flex-wrap: wrap;
    padding: 10px 0px;
`

const ListArea = styled.div`
    height: 100%;
`

const DeleteButton = styled(Button)`
    margin: 0px;
    margin-top: 10px;
    margin-right: 5px;
    height: 32px;
`

const SelectButton = styled(Button)`
    margin: 0px;
    margin-top: 10px;
    margin-right: 5px;
`

export default function BookList() {

    const books = useSelector(store => store.bookList)
    const loadBooks = useUpdate("BOOKS")
    const [checked, setChecked] = useState([])
    const [results, setResults] = useState([])
    const deleteBooks = useUpdate("DELETE_BOOKS")
    const [loading, setLoading] = useState(true)

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]
        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
    }

    const handleSelectAll = () => {
        const newChecked = results.map(book => book.id)
        setChecked(newChecked)
    }

    const handleUnselectAll = () => {
        setChecked([])
    }

    const handleDelete = () => {
        setLoading(true)
        deleteBooks(checked)
            .then(ok => {
                setChecked([])
                loadBooks()
                    .then((data) => {
                        setLoading(false)
                    })
            })
    }

    useEffect(() => {
        loadBooks()
            .then((data) => {
                setResults(data)
                setLoading(false)
            })
    }, [books.length])

    const Book = ({ index, style }) =>
        <BookListItem
            id={results[index].id}
            name={results[index].name}
            style={style}
            checked={checked.indexOf(results[index].id) !== -1}
            handleToggle={handleToggle} />

    return (
        <ItemList>
            <ControlPanel>
                <Search
                    disabled={loading}
                    items={books}
                    searchKey={"name"}
                    handleResults={setResults}
                    placeholder={"Поиск книг"} />
                <SelectButton
                    disabled={loading}
                    size='small'
                    color="secondary"
                    variant="outlined"
                    onClick={handleSelectAll}>
                    {'Выбрать все'}
                </SelectButton>
                <SelectButton
                    disabled={loading}
                    size='small'
                    color="secondary"
                    variant="outlined"
                    onClick={handleUnselectAll}>
                    {'Отменить выбор'}
                </SelectButton>
                <DeleteButton
                    disabled={!checked.length || loading}
                    size='small'
                    color="secondary"
                    variant="contained"
                    onClick={handleDelete}>
                    {'Удалить'}
                </DeleteButton>
            </ControlPanel>
            <ListArea>
                {!results.length || loading ? <Loading /> :
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                className="List"
                                height={height}
                                itemSize={58}
                                itemCount={results.length}
                                width={width}>
                                {Book}
                            </List>)}
                    </AutoSizer>}
            </ListArea>
        </ItemList>
    )
}