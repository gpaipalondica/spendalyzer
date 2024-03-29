import React, { useEffect, useState } from 'react';
import '../Styles/Expense.css';
import Chart from './Chart';
import Loader from './Loader';

function Expense({ authToken }) {


  const [loading, setLoading] = useState(false)

  const url = 'https://spendalyzerbackend.azurewebsites.net'


    const [uname, setUname] = useState('My')
    const [chart, setChart] = useState(false)


  const allMonths2 = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  useEffect(() => {

    const getThisUser = sessionStorage.getItem('user')
    let thisUsername = JSON.parse(getThisUser).username

    setUname(thisUsername)

    const getData = sessionStorage.getItem('data');

    if (getData) {
      const parsedData = JSON.parse(getData);
      // Instead of calling the printData2 function, update state to trigger a render.
      setExpenseData(parsedData);
    }
  }, []);

  // Define your expense data as a state variable
  const [expenseData, setExpenseData] = useState([]);


  async function getDataByUser(){
    setLoading(true)
    const user=sessionStorage.getItem("user");
    let username = JSON.parse(user).username

    // console.log(username);

    let fetchedData = await getExpByUser(username)

    // console.log(fetchedData);
    setExpenseData(fetchedData)
  }

  async function getExpByUser(name) {
    return fetch(url+'/list/'+name, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setLoading(false)
        sessionStorage.setItem('data', JSON.stringify(data))
        return data; // Return the data inside the Promise chain
      })
      .catch(error => {
        console.log('Error in GET function', error);
        throw error; // Rethrow the error to propagate it
      });
  }


  function openForm(){
    document.querySelector('.formArea').style.display = 'flex'
}
function closeForm(){
    document.querySelector('.formArea').style.display = 'none'
    document.querySelector('.formArea input[type="date"]').classList.remove('clicked')
    document.querySelector('.formArea input[type="date"]').value = ''
    document.getElementById('myForm').reset()
}
function closeForm2(){
    document.querySelector('.formArea2').style.display = 'none'
}

  function addExp(e){
    e.preventDefault()
    const user=sessionStorage.getItem("user");
    let username = JSON.parse(user).username

    let newExp = document.getElementById('myForm') 

    let val={}
     let formData = new FormData(newExp)
     formData.forEach((value, key) => {
        val[key] = value
    });

    setLoading(true)
    
    if (isNaN(val.amount) || val.amount.trim() === '') {
      alert('Amount must be a number');
        setLoading(false)
    } else {

      let data = {
          "title": val.title,
          "amount": val.amount,
          "date" : val.date,
          "username": username
      }
      // console.log(data);
    
  
      fetch(url+'/expense',{
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data =>{
          // console.log(data);
          document.querySelector('.formArea').style.display = 'none'
          document.querySelector('.formArea input[type="date"]').classList.remove('clicked')
          document.querySelector('.formArea input[type="date"]').value = ''
          newExp.reset()
          getDataByUser()
      })
      .catch(error => {
          console.error("POST Error", error)
      });
    }
}



  function keyhandle(event){
    if (event.keyCode === 13) {
        event.preventDefault();
      }
  }

  let t
  function editMonthDiv(event){
    t = event.currentTarget

    let rows = t.parentNode.querySelectorAll('.inData .twoBtns'),i;

    console.log(t);
    if(t.innerHTML === `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M7,17.013l4.413-0.015l9.632-9.54c0.378-0.378,0.586-0.88,0.586-1.414s-0.208-1.036-0.586-1.414l-1.586-1.586	c-0.756-0.756-2.075-0.752-2.825-0.003L7,12.583V17.013z M18.045,4.458l1.589,1.583l-1.597,1.582l-1.586-1.585L18.045,4.458z M9,13.417l6.03-5.973l1.586,1.586l-6.029,5.971L9,15.006V13.417z"></path><path d="M5,21h14c1.103,0,2-0.897,2-2v-8.668l-2,2V19H8.158c-0.026,0-0.053,0.01-0.079,0.01c-0.033,0-0.066-0.009-0.1-0.01H5V5	h6.847l2-2H5C3.897,3,3,3.897,3,5v14C3,20.103,3.897,21,5,21z"></path></svg>`){
        t.innerHTML = '<svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM695.5 365.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L308.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H689c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>'
        for(i=0; i<rows.length; i++){
            rows[i].style.display = 'flex'
        }        
    }
    else if(t.innerHTML === '<svg stroke="currentColor" fill="red" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM695.5 365.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L308.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H689c6.5 0 10.3 7.4 6.5 12.7z"></path></svg>'){
        t.innerHTML = '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M7,17.013l4.413-0.015l9.632-9.54c0.378-0.378,0.586-0.88,0.586-1.414s-0.208-1.036-0.586-1.414l-1.586-1.586	c-0.756-0.756-2.075-0.752-2.825-0.003L7,12.583V17.013z M18.045,4.458l1.589,1.583l-1.597,1.582l-1.586-1.585L18.045,4.458z M9,13.417l6.03-5.973l1.586,1.586l-6.029,5.971L9,15.006V13.417z"></path><path d="M5,21h14c1.103,0,2-0.897,2-2v-8.668l-2,2V19H8.158c-0.026,0-0.053,0.01-0.079,0.01c-0.033,0-0.066-0.009-0.1-0.01H5V5	h6.847l2-2H5C3.897,3,3,3.897,3,5v14C3,20.103,3.897,21,5,21z"></path></svg>'
        for(i=0; i<rows.length; i++){
            rows[i].style.display = 'none'
        }
        
    }
  }

  function editThis(s){
    let selNode = s.currentTarget.parentNode.parentNode;

    // console.log(selNode);
    let id = selNode.id
    // console.log(id);

    let selTitle = selNode.children[0].innerHTML
    let selAmount= parseFloat((selNode.children[1].innerHTML).substring(1))

    document.getElementById('f2-id').value = `${id}`
    document.getElementById('f2-title').value = selTitle
    document.getElementById('f2-amt').value = selAmount

    document.querySelector('.formArea2').style.display='flex'

}

function editSubmit(e) {
    e.preventDefault()
    
    let newExp = document.getElementById('myForm2') 
    setLoading(true)
    let val={}
     let formData = new FormData(newExp)
     formData.forEach((value, key) => {
        val[key] = value
    });

    // console.log(val);

    let id = val.id
    
    let data = {
        "title": val.title,
        "amount": parseFloat(val.amount)
    }
    // console.log(data);

    if (isNaN(val.amount) || val.amount.trim() === '') {
      alert('Amount must be a number');
        setLoading(false)
    } else {
    fetch(url+'/expense/'+id,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data =>{
        // console.log("UPDATED", data);
        closeForm2()
        newExp.reset()
        getDataByUser()
    })
    .catch(error => {
        console.log("UPDATE ERROR", error);
    })
    }
}

function deleteThis(d){
    let tar = d.currentTarget.parentNode.parentNode
    // console.log("tar",tar);

    let tarTitle = tar.children[0].innerHTML

    let tarId = tar.id
    // console.log(tarId);

    let thatMonth = tar.parentNode.parentNode.parentNode.querySelector('.editBtnPerMonth')
    // console.log(thatMonth);

    
    let conf = window.confirm(`Are you sure to delete "${tarTitle}"?`)

    // console.log(conf);

    if(conf){
      setLoading(true)
        fetch(url+'/expense/'+tarId,{
            method: "DELETE",
        })
        .then(response => response.json())
        .then(data =>{
            // console.log('DELETED',data);
            let allbtns = document.querySelectorAll('.twoBtns'),j
            
            for(j=0; j<allbtns.length; j++){
                allbtns[j].style.display = 'none'
            }

            // for(k=0;k<thatMonth.length; k++){
            //    let test = thatMonth[k].querySelectorAll('.twoBtns'),l
            //    for (l=0 ; l <test.length; l++) {
            //     test[l].style.display = 'flex'
            //    }
            // }

           thatMonth.innerHTML = '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>'
            getDataByUser()

        })
        .catch(error => {
            console.error("DELETE Error", error)
        });
    }else{
        // console.log('not deleted');
    }

}


function changeView(e){
  //change from list to graph and viceversa
  let id = e.currentTarget.id
  // console.log(id);


  let both = document.querySelectorAll('.btnViews'),i;
  for(i=0;i<both.length;i++){
      both[i].classList.remove('active')
  }

  document.getElementById(id).classList.add('active')

  if(id === 'graphView'){
      document.querySelector('.listings').style.display = 'none'
      document.querySelector('.addForm').style.display = 'none'
      document.querySelector('.refreshBtn').style.display = 'none'
      setChart(true)
    }
    else if(id === 'listView'){
      document.querySelector('.listings').style.display = 'flex'
      document.querySelector('.addForm').style.display = 'grid'
      document.querySelector('.refreshBtn').style.display = 'grid'
      setChart(false)
  }
}

function removePlaceholder(e){
  console.log("hi");
  let tar = e.currentTarget

  tar.classList.add('clicked')
}

const [maxDate, setMaxDate] = useState('3000-01-01');

function handleFocus(){
  let today = new Date()
  let date2 = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  setMaxDate(date2);
}
  
  return (
    <div className="myExpenses">
    {loading && <Loader/>}
    <div className="formArea">
        <form id="myForm" onSubmit={addExp} method="POST">
            <button type="button" onClick={closeForm}>X</button>
            <div className="form-item">
                <label htmlFor="title">Title</label>
                <input required id="hello" type="text" name="title"  onKeyDown={keyhandle}/>
            </div>
            <div className="form-item">
                <label htmlFor="amount">Amount</label>
                <input required type="text" name="amount" placeholder='$' onKeyDown={keyhandle}/>
            </div>
            <div className="form-item">
                <label htmlFor="date">Date</label>
                <input required type="date" name="date" placeholder="MM/DD/YYYY" max={maxDate} onFocus={handleFocus} onTouchStart={removePlaceholder} onKeyDown={keyhandle}/>
            </div>
            <input type="submit" value="Add Expense"/>
        </form>
    </div>

    <div className="formArea2">
            <form id="myForm2" onSubmit={editSubmit}>
                <button type="button" onClick={closeForm2}>X</button>
                <div className="form-item"  style={{display: 'none'}}>
                    <label htmlFor="id">id</label>
                    <input id="f2-id" readOnly type="text" name="id" onKeyDown={keyhandle} />
                </div>
                <div className="form-item">
                    <label htmlFor="title">Title</label>
                    <input id="f2-title"type="text" required name="title" onKeyDown={keyhandle} />
                </div>
                <div className="form-item">
                    <label htmlFor="amount">Amount</label>
                    <input id="f2-amt" type="text" required name="amount" placeholder='$'  onKeyDown={keyhandle} />
                </div>
                <input type="submit" value="Modify" />
            </form>
      </div>
        

      {authToken ? (
        <div>
          <h1 className='userDetail'>{uname}'s Expenses</h1>

          <button className="refreshBtn" onClick={getDataByUser} ><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 11H7.101c0-.003 0-.006.001-.009.065-.319.163-.634.291-.937.126-.297.281-.583.461-.85.178-.264.384-.513.61-.74C8.691 8.238 8.94 8.032 9.206 7.853c.266-.18.551-.334.848-.46.302-.128.617-.226.938-.291.658-.135 1.357-.135 2.018 0 .318.065.634.163.937.291.296.125.581.281.85.461.266.179.514.384.738.609l1.416-1.412c-.314-.316-.664-.604-1.036-.855-.373-.252-.773-.47-1.188-.646-.425-.18-.868-.317-1.315-.408-.923-.189-1.899-.189-2.819 0-.449.092-.892.229-1.316.409C8.858 5.727 8.458 5.944 8.086 6.196 7.716 6.445 7.368 6.733 7.05 7.05S6.445 7.716 6.197 8.085c-.252.373-.47.773-.646 1.19-.18.424-.317.867-.408 1.315C5.115 10.725 5.1 10.863 5.08 11H2l4 4L10 11zM14 13h2.899c-.001.003 0 .006-.001.008-.066.324-.164.639-.292.938-.123.293-.278.579-.459.848-.179.264-.385.514-.613.742-.225.225-.473.43-.739.61-.268.18-.553.335-.849.461-.303.128-.618.226-.938.291-.657.135-1.357.135-2.017 0-.319-.065-.634-.163-.937-.291-.297-.126-.583-.281-.85-.461-.264-.178-.513-.384-.74-.61L7.05 16.95c.317.317.666.605 1.035.854.373.252.773.47 1.19.646.424.18.867.317 1.315.408C11.051 18.952 11.525 19 12 19s.949-.048 1.408-.142c.449-.091.893-.229 1.317-.409.415-.176.815-.393 1.188-.645.372-.251.722-.54 1.035-.854.317-.317.605-.666.855-1.037.254-.377.472-.777.645-1.187.178-.42.315-.863.408-1.316.027-.135.043-.273.063-.41H22l-4-4L14 13z"></path></svg></button>
          <button className="addForm" onClick={openForm}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" t="1551322312294" viewBox="0 0 1024 1024" height="1em" width="1em" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z"></path><path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z"></path></svg></button>

          <div className="viewModes">
            <button id="listView" className="btnViews active" onClick={changeView}>
              List
            </button>
            <button id="graphView" className="btnViews" onClick={changeView}>
              Graph
            </button>
          </div>

          <div className="listings">
            {expenseData.length> 0 ? 
            <div id="printDataNow">
            <div>
              {expenseData.map((dataItem, index) => (
              <div key={index} className="expMonth">
                <h2 className="month-disp">
                  <p>{allMonths2[dataItem.Month - 1]} {dataItem.Year}:</p> 
                  <p>${dataItem.MonthlyAmount.toFixed(2)}</p>
                </h2>
                <button className="editBtnPerMonth" onClick={editMonthDiv}> 
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M7,17.013l4.413-0.015l9.632-9.54c0.378-0.378,0.586-0.88,0.586-1.414s-0.208-1.036-0.586-1.414l-1.586-1.586	c-0.756-0.756-2.075-0.752-2.825-0.003L7,12.583V17.013z M18.045,4.458l1.589,1.583l-1.597,1.582l-1.586-1.585L18.045,4.458z M9,13.417l6.03-5.973l1.586,1.586l-6.029,5.971L9,15.006V13.417z"></path><path d="M5,21h14c1.103,0,2-0.897,2-2v-8.668l-2,2V19H8.158c-0.026,0-0.053,0.01-0.079,0.01c-0.033,0-0.066-0.009-0.1-0.01H5V5	h6.847l2-2H5C3.897,3,3,3.897,3,5v14C3,20.103,3.897,21,5,21z"></path></svg>
                </button>
                {/* Render inData here */}
                {dataItem.MonthData.map((monthDataItem, monthDataIndex) => (
                  <div key={monthDataIndex} className="expense-row">
                    <div className="headerRow">
                      <h3>{allMonths2[monthDataItem.Date.split('-')[1] - 1]} {monthDataItem.Date.split('-')[2]}</h3>
                      <h3>${monthDataItem.DailyAmount.toFixed(2)}</h3>
                    </div>
                    <div className="outData">
                      {monthDataItem.Data.map((inDataItem, inDataIndex) => (
                        <div key={inDataIndex} className="inData" id={inDataItem._id}>
                          <p>{inDataItem.Title}</p>
                          <p>${inDataItem.Amount.toFixed(2)}</p>
                          <div className="twoBtns">
                            <button className="btnEdit" onClick={editThis}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z"></path></svg></button>
                            <button className="btnDel" onClick={deleteThis}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg></button>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </div> 
          </div>
            :
            <div>
              <p style={{textAlign:'center', marginTop:'30px'}}>** Create your first expense **</p>  
            </div>}
            
          </div>

        
            {chart===true && 
            <Chart /> 
            }
              
        </div>
      ) : (
        <div>

        </div>
      )}

    </div>
  );
}

export default Expense;
