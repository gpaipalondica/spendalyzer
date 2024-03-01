import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
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

  return (
    <div className='home'>
      {loading? <Loader/>: 
      <>
      <h1 className='home-text'>Welcome to Spendalyzer</h1>
      <img className='home-img' src={img1} alt="" />
      </>
      }
    </div>

  )
}

export default Home