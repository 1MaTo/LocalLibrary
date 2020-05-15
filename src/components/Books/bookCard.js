import { Avatar, ButtonBase } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { useUpdate } from '../../store/updateStore'
import { theme } from '../../Theme/Theme'
import { Loading } from '../Loading/Loading'

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
    flex: 1.8;
    flex-direction: column;
    background: ${theme.palette.secondary.main};
    width: 100%;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    color: ${theme.palette.text.main};
`

const Name = styled.div`
    padding: 4px 7px 0px 7px;
    flex: 2;
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
    font-size: 12px;
    flex: 1.3;
    display: flex;
    flex-direction: row;
`

const StatisticItem = styled.div`
    padding: 0;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    flex: 1;
    opacity: 0.75;
`

const Text = styled.div`
    ${props => props.right ? 'padding-right: 7px;' : null}
    ${props => props.left ? 'padding-left: 7px;' : null}
    text-align: ${props => props.right ? 'right' : 'left'};
    width: 100%;
`

const BookLink = styled(Link)`
    border-radius: inherit;
`

export default function BookListItem({ id, avatar, name, pages, releaseYear }) {

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
                <BookLink to={`/book/${id}`}>
                    <ImageContainer imgProps={{ draggable: false }} variant="rounded" src={avatar} />
                    <InfoPanel>
                        <Name>
                            {name}
                        </Name>
                        <Statistic>
                            <StatisticItem>
                                <Text left>{`${pages} стр.`}</Text>
                            </StatisticItem>
                            <StatisticItem>
                                <Text right>{`${releaseYear} г.`}</Text>
                            </StatisticItem>
                        </Statistic>
                    </InfoPanel>
                </BookLink>
            }
        </BookCard>
    )
}