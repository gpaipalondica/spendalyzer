import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import img1 from '../assets/img.png'
import '../Styles/Home.css'
import Loader from './Loader'

function Home() {

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
      if(sessionStorage.getItem( "user" ) !== null){
          setLoggedIn( true );
      } else {
        setLoggedIn(false)
      }
  },[])

  let nav2 = useNavigate()

  function navTo(x){
    nav2('/'+x)
  }

  return (
    <div className='home'>
      {isLoaded? 
      <>
      <h1 className='home-text'>Welcome to Spendalyzer</h1>
      <p>Keep track of your expenses</p>
      <img className='home-img' src={img1} alt="" />
      {loggedIn ? <button onClick={() => navTo('expense')}>View My Expenses</button>
      :  
      <button onClick={() => navTo('login')}>Get Started</button>
      }
      </>
      :
      <Loader/>
      }
    </div>

  )
}

export default Home