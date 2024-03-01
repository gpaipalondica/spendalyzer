import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import img1 from '../assets/img.png'
import '../Styles/Home.css'
import Loader from './Loader'

function Home() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
      setTimeout(() =>{
        setLoading(false)
      },800)
  })

  let nav2 = useNavigate()

  function navLogin(){
    nav2('/login')
  }

  return (
    <div className='home'>
      {loading? <Loader/>: 
      <>
      <h1 className='home-text'>Welcome to Spendalyzer</h1>
      <img className='home-img' src={img1} alt="" />
      <button onClick={navLogin}>Get Started</button>
      </>
      }
    </div>

  )
}

export default Home