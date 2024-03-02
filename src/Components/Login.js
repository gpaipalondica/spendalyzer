import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/Login.css'
import Loader from './Loader'


const Login = (props) => {

  const [loading, setLoading] = useState(false);

  const url = 'https://spendalyzerbackend.azurewebsites.net'


  let navigate = useNavigate()

    function loginUser(x){

        let name = x.username
    
        const data = {
            "username": name,
        }
    
        fetch(url+'/login',{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // console.log("POST data", data);
    
            if(data.accessToken){
                let accTok = data.accessToken
                // console.log("AT",accTok);
                tokenVerify(x,accTok)
            }
            else{
                // console.log("No Access Token");
            }
        })
        .catch(err => {
            console.log("POST error: ",err);
        })
    
    }

    async function getExpByUser(name) {
        return fetch(url+'/list/'+name, {
          method: 'GET'
        })
          .then(response => response.json())
          .then(data => {
            return data; // Return the data inside the Promise chain
          })
          .catch(error => {
            console.log('Error in GET function', error);
            throw error; // Rethrow the error to propagate it
          });
      }

      async function verifyUser(passedUser){
        return fetch(url+'/users',{
                method:"GET"
               }).then(response => response.json())
              .then(data => {
                  let allUsers = data
                  // console.log("AU",allUsers);
                  // console.log("PU",passedUser);
                  let count = 0
                  for(let user in allUsers){
                    let au = (allUsers[user].username).toLowerCase()
                    let pu = (passedUser.username).toLowerCase()
                      if(au === pu || allUsers[user].email === pu){
                          // console.log("USERNAME matched")
                          count++;
                          
                          let data3 = {
                              "plaintext": passedUser.password,
                              "hashed": allUsers[user].password
                          }

                          // console.log("data3", data3);
    
                         return fetch(url+'/verifyUser', {
                              method:"POST",
                              headers:{
                                  'Content-type': 'application/json'
                              },
                              body: JSON.stringify(data3)
                          }).then(response => response.json())
                          .then(data => {
                              // console.log("HERE", data);
                              return {"data":data, "user": allUsers[user]}
                          })
                          .catch(err => {
                          console.log(err);
                          })
                      }
                      // else{
                      //   return {message:"user not found"}
                      // }
                  }
                  if(count === 0){
                    return {message:"user not found"}
                  }
                  }) 
                  .catch(error => {
                  console.log('ERROR IN VERIFY USER FUNCTION', error);
                  });

      }

      function tokenVerify(x2,x) {
        let accTok = x; 
        let userDetails = {
          "user_id":x2.user_id,
          "username": x2.username,
          "email": x2.email
        }

        // console.log(userDetails);

    
        // const url = 'http://localhost:3000/posts';
        const token = accTok
    
        const auth = `Bearer ${token}`
    
        // console.log(auth);
    
        fetch(url+'/posts', {
        method: 'GET',
        headers: {
            'Authorization': auth
        }
        })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // console.log(data); 
        sessionStorage.setItem('user', JSON.stringify(userDetails))
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('data', JSON.stringify(data))

        props.setAuthToken(token)
        props.setUserData(JSON.stringify(data))
        setLoading(false)
        navigate('/expense')
      
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
    }

     const loginDetails = async (e)  => {
        e.preventDefault()
        // console.log('hello');
        setLoading(true)
        let form = document.getElementById('loginForm')
    
        let formDetails = new FormData(form)
        let data = {}
        formDetails.forEach((val,key) => {
            data[key] = val
        })

        // console.log(data);
    
        let uname = data.name
        let pw = data.password
        let user = {'username': uname, "password": pw}
    
        // console.log(user);
        
        let isVerified 
        try{
            isVerified = await verifyUser(user)
        }catch(error){
            console.error('Error', error);
        }
    
        // console.log("IV", isVerified);
    
        if(isVerified.data === true){
            let fullData;
            try {
              fullData = await getExpByUser(uname); // Use await to wait for the Promise to resolve
            } catch (error) {
              console.error('Error in :', error);
            }
        
            // console.log("FD",fullData);
        
            loginUser(isVerified.user)
        }
        else if (isVerified.data === false){
             alert("Incorrect credentials");
             setLoading(false)
        }else if(isVerified.message){
            alert("User not found")
            setLoading(false)
        }
    }

    let [showPassLogin, letShowPassLogin] = useState(false)

    function showPassword(e){

      let tar = e.currentTarget.parentNode.querySelector('input')
      console.log(tar);
      if(!showPassLogin){
        tar.type = "text"
      }
      else{
          tar.type="password"
      }
      letShowPassLogin(!showPassLogin)
    }

    let nav2 = useNavigate()
    function navToReg(){
      nav2('/register')
    }

  return (
    <div className='login'>
      {loading && <Loader />}
          <h2>Login</h2>
        <div className="formcontent">
          <form id="loginForm" onSubmit={loginDetails} method="POST">
              <div className="form-group">
                <label htmlFor="name">Username</label>
                <input required type="text" className="form-control" id="name" name="name" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input required type="password" className="form-control" id="password" name="password" />
                {showPassLogin? 
                  <svg className='eyeLogin' onClick={showPassword} fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 0 0 0-51.5zm-63.57-320.64L836 122.88a8 8 0 0 0-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 0 0 0 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 0 0 0 11.31L155.17 889a8 8 0 0 0 11.31 0l712.15-712.12a8 8 0 0 0 0-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 0 0-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 0 1 146.2-106.69L401.31 546.2A112 112 0 0 1 396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 0 0 227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 0 1-112 112z"></path></svg>
                  :
                  <svg className='eyeLogin' onClick={showPassword} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>                    
                }
              </div>
      
              <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
        <p className='bottomtext'>Not a member? <span onClick={navToReg}>Register Now</span></p>
    </div>
  )
}

export default Login