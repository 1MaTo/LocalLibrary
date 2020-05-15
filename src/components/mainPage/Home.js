import React from 'react';
import HeaderMenu from '../menu/HeaderMenu'
import BookList from '../Books/bookList'
import { styled } from '@material-ui/styles';
import { Container } from '@material-ui/core';

const BookContainer = styled(Container)`

`

export default function Home() {

  return (
    <div>
      <HeaderMenu />
      <BookContainer>
        <BookList />
      </BookContainer>
    </div>
  )
}