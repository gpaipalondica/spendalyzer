import React from 'react'
import img1 from '../assets/img.jpeg'
import '../Styles/Home.css'

function Home() {
  return (
    <div className='home'>
        <h1 className='home-text'>Welcome to Spendalyzer</h1>
        <img className='home-img' src={img1} alt="" />
    </div>
  )
}

export default Home