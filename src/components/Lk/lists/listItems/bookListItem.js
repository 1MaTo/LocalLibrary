import React, { useState, useEffect } from 'react'
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
    ButtonBase,
    Typography,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/MoreVert'
import styled, { keyframes } from 'styled-components'
import { theme } from '../../../../Theme/Theme'
import { ChangeUserRole } from '../../../menu/Buttons/ActionButtons'
import PopperMenu from '../../../menu/PopperMenu'
import { useDispatch, useSelector } from 'react-redux'
import { useUpdate } from '../../../../store/updateStore'
import { Loading } from '../../../Loading/Loading'

const PopUp = keyframes`
    from {
        opacity: 0%;
        transform: translate(0px, 20px);
    }
    to { 
        opacity: 100%;
        transform: translate(0px, 0px);
    }
`

const OnHover = keyframes`
    from {
        transform: translate(0px, 0px);
        box-shadow: 0px 0px 0px 0px;
    } to {
        transform: translate(0px, -5px);
        box-shadow: 0px 10px 15px -5px;
    }
`

const BookCard = styled(ButtonBase)`
    margin: 0px 10px 10px 0px;
    padding: 0px;
    height: 370px;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    && {
        width: 200px;
    }
    transition: all 0.15s ease-out;
    animation: ${PopUp} 0.5s ease-out;
    &:hover {
        transform: translate(0px, -5px);
        box-shadow: 0px 10px 15px -5px;
    }
    &:active {
        transform: translate(0px, -2px);
        box-shadow: 0px 10px 10px -5px;
    }
`

const ImageContainer = styled(Avatar)`
    flex: 7;
    border-radius: 0px;
    width: 100%;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
`

const InfoPanel = styled.div`
    display: flex;
    flex: 2;
    flex-direction: column;
    background: ${theme.palette.secondary.main};
    width: 100%;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    color: ${theme.palette.text.main};
`

const Name = styled.div`
    padding: 3px;
    flex: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 23px;
    overflow: hidden;
    text-align: left;
    font-size: 14px;
    text-overflow: ellipsis;
`

const Statistic = styled.div`
    flex: 3;
    display: flex;
    flex-direction: row;
`

const StatisticItem = styled.div`
    flex: 1;
    background: ${props => props.color ? props.color : 'unset'};
    display: flex;
    justify-content: center;
    align-items: center;
`

const Text = styled.div`

`

export default function BookListItem({id, avatar, name}) {

    const getReservedCount = useUpdate("BOOK_READING_STAT")
    const [reservedCount, setReservedCount] = useState(0)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        getReservedCount(id)
            .then(response => {
                setReservedCount(response.data.length)
                setLoading(false)
            })
    }, [])

    return (
        <BookCard>
            {isLoading ? <Loading /> :
                <>
                    <ImageContainer imgProps={{ draggable: false }} variant="rounded" src={avatar} />
                    <InfoPanel>
                        <Name>
                            {name}
                        </Name>
                        <Statistic>
                            <StatisticItem>
                                <Text>{2012}</Text>
                            </StatisticItem>
                            <StatisticItem>
                                <Text>{reservedCount}</Text>
                            </StatisticItem>
                            <StatisticItem>
                                <Text>0</Text>
                            </StatisticItem>
                        </Statistic>
                    </InfoPanel>
                </>
            }
        </BookCard>
    )
}