import React, { useEffect } from 'react';
import { theme } from '../../Theme/Theme'
import { useDispatch } from 'react-redux'
import HeaderMenu from '../menu/HeaderMenu'
import axios from 'axios'



export default function Home() {

  /*axois
  .get('/api/user/info')
  .then((response) => {
      console.log(response.data)
  })
  .catch(error => {
      console.log(error.request)
  })*/

  return (
    <div>
      <HeaderMenu />
    </div>
  )
}