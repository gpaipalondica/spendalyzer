import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../Styles/Navbar.css'
import Loader from './Loader'

function Navbar({userData, authToken, setAuthToken, setUserData}) {


  const [ loading, setLoading ] = useState(false)
  
  let nav2 = useNavigate()

      const logmeout = () => {
        // Implement logout logic and clear user data from sessionStorage
        setLoading(true)
        closeNav()

        setAuthToken('')
        setUserData(null)

        sessionStorage.clear()

        
        setTimeout(() => {
          // window.location.href = '/'
          nav2('/')
          setLoading(false)
        },500)

    };


    function extendNav(e){
        let x = e.target.className
        console.log(x);

        if(x === 'burger'){
          document.querySelector('.burger').classList.add('active')
          document.querySelector('.burger').innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>`
          document.querySelector('.nav-right').style.top = '70px'
          setTimeout(()=>{
            document.querySelector('.backdrop').style.display = 'block'
          },200)
        }
        else if(x === 'burger active'){
            closeNav()
        }
      }
      
      
      
      function closeNav(){
        document.querySelector('.burger').classList.remove('active')
        document.querySelector('.burger').innerHTML = `<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path  d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z"></path></svg>`
        document.querySelector('.nav-right').style.top = '-250px'
        document.querySelector('.backdrop').style.display = 'none'
      }

  return (
    <>
      <div className='navbar'>
        {loading && <Loader/>}
        <div className="nav-left">
            <h2><span>$</span>pendalyzer</h2>
            <div className="burger" onClick={extendNav}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path  d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z"></path></svg>
            </div>
        </div>
        <div className="nav-right">
            {authToken ? (
                <>
                <Link onClick={closeNav} to='/expense'>Expenses</Link>
                <Link onClick={logmeout}>Logout</Link>
              </>
            ) : (
                <>
                <Link to='/' onClick={closeNav}>Home</Link>
                <Link to='/login' onClick={closeNav}>Login</Link>
                <Link to='/register' onClick={closeNav}>Register</Link>
                </>
            )}
        </div>
      </div>

      <div className="backdrop"></div>
    </>
  )
}

export default Navbar