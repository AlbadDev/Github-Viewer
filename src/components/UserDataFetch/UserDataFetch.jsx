import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import './UserDataFetch.scss'
import GithubConerSvg from '../GithubConerSvg/GithubConerSvg'
import LangData from '../LangDataFetch/LangData'
import Error400 from '../ErrorComponent/Error400/Error400'
import Error403 from '../ErrorComponent/Error403/Error403'
import Error404 from '../ErrorComponent/Error404/Error404'
import ApiRateLimit from '../ApiRateLimit/ApiRateLimit'
import BackHome from '../../utils/BackHome/BackHome'



export default function UserDataFetch () {
    const [userData, setUserData] = useState(null)
    const [Error, setError] = useState({active: false, type: 200})
    const search = useLocation()
    const userSearch = search.pathname.slice(10)
    const [componentMount, setComponentMount] = useState(false) 

    

    
    /*...............Handle userData Fetch...............*/
        const dataFetch =  () => {
            const apiUrl = `https://api.github.com/users/${userSearch}`
            fetch(apiUrl)
                .then(response => {
                    if(response.status === 403) {
                        return setError({active: true, type: 403})
                    }
                    if(response.status === 404) {
                        return setError({active: true, type: 404})
                    }
                    return response.json()
                })
                .then(data => setUserData(data))
                .catch(error => {
                    setError({active: true, type: 400})
                    console.log('Error Message :',Error)
                })
            
        }
    /*...............End Handle Data Fetch...............*/

    useEffect(() => {
         if(!componentMount){
            dataFetch()
         }
         return () => {
            setComponentMount(true)
         }
        
    })
    // console.log('Error Message :',Error)

    return (
        <section className='wraper_container'>
            {!Error.active && Error.type !== 400 ?
                <section >
                <GithubConerSvg />
                <ApiRateLimit setError={setError}/>
                <div className="back" >
                    <BackHome />
                </div>
                <div  style={{backgroundColor: '#1A1E22',paddingBottom:10,height:525}}>
                    { userData ?
                    <>
                        <div className="userInfo d-col ">
                            <section className='headSection d-block'>
                                <div className="userInfoContainer d-flex">
                                    
                                    <div className="avatarContainer d-flex">
                                        <img src={userData.avatar_url} alt={userData.name} /> 
                                    </div>
                                    <h1>{userData.name}</h1>
                                    <h2>@{userData.login}</h2>
                                    <div className="accountInfo ">
                                        <span className='info_item'>
                                            <svg aria-hidden="true" className="octicon" height="20" role="img" viewBox="0 0 14 16" width="20" style={{display: 'inline-block',marginRight:10, fill: 'currentcolor', userSelect: 'none', verticalAlign: 'textBottom'}}><path fillRule="evenodd" d="M9 4V3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1v1H1c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1H9zM6 3h2v1H6V3zm7 6H8v1H6V9H1V5h1v3h10V5h1v4z"></path></svg> 
                                            {userData.company ||   'Unknow'}
                                        </span>
                                        <span className='info_item'>
                                        <svg aria-hidden="true" className="octicon" height="16" role="img" viewBox="0 0 12 16" width="12" style={{display: 'inline-block',marginRight:10, fill: 'currentcolor', userSelect: 'none', verticalAlign: 'textBottom'}} ><path fillRule="evenodd" d="M6 0C2.69 0 0 2.5 0 5.5 0 10.02 6 16 6 16s6-5.98 6-10.5C12 2.5 9.31 0 6 0zm0 14.55C4.14 12.52 1 8.44 1 5.5 1 3.02 3.25 1 6 1c1.34 0 2.61.48 3.56 1.36.92.86 1.44 1.97 1.44 3.14 0 2.94-3.14 7.02-5 9.05zM8 5.5c0 1.11-.89 2-2 2-1.11 0-2-.89-2-2 0-1.11.89-2 2-2 1.11 0 2 .89 2 2z"></path></svg>
                                            {userData.location || 'Unknow'}
                                            </span>
                                        <span className='info_item'>
                                            <svg aria-hidden="true" className="octicon" height="20" role="img" viewBox="0 0 14 16" width="20" style={{display: 'inline-block',marginRight:10, fill: 'currentcolor', userSelect: 'none', verticalAlign: 'textBottom'}}><path fillRule="evenodd" d="M13 2h-1v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H6v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h11v9zM5 3H4V1h1v2zm6 0h-1V1h1v2zM6 7H5V6h1v1zm2 0H7V6h1v1zm2 0H9V6h1v1zm2 0h-1V6h1v1zM4 9H3V8h1v1zm2 0H5V8h1v1zm2 0H7V8h1v1zm2 0H9V8h1v1zm2 0h-1V8h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1zm2 0h-1v-1h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1z"></path></svg>
                                            {new Date(userData.created_at).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="infoState">
                                        <div className="state_item">
                                            <span className='numSpan' >{userData.public_repos.toLocaleString()}</span>
                                            <span className='secondSpan'>REPOSITORIES</span> 
                                        </div>
                                        <div className="state_item">
                                            <span className='numSpan'>{userData.followers.toLocaleString()}</span>
                                            <span className='secondSpan'>FOLLOWERS</span>
                                        </div>
                                        <div className="state_item">
                                            <span className='numSpan'>{userData.following.toLocaleString()}</span>
                                            <span className='secondSpan'>FOLLOWING</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </>
                    : <h2 className='loading'>Data is Loading ... !</h2>  
                }
                </div>
              <LangData />                  
              </section> : (Error.type === 403) ? <Error403 setError={setError}/>
                : (Error.type === 404) ? <Error404 /> 
                : <Error400 />
                
            }

        </section>
    )
}
