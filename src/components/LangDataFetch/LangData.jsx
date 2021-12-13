import React, {useState, useEffect} from 'react';
import GhPolyglot from 'gh-polyglot';
import './LangData.scss';
import { useLocation } from 'react-router'
import UserRepo from '../UserRepo/UserRepo'
import {Pie, Doughnut, Radar} from 'react-chartjs-2'


export default function LangData () {

    const search = useLocation()
    const userSearch = search.pathname.slice(10)
    const [repoData, setRepoData] = useState([])
    const [langData, setLangData] = useState([])
    const [errorPolyglot, setErrorPolyglot] = useState(false)
    const [Error, setError] = useState({active:false, type: 200})
    
    
    
  
    /*.................... Start Handle repoData fetch...........................*/
    
            const repoDataFetch = (userSearch) => {
                
                const apiUrl = `https://api.github.com/users/${userSearch}/repos?per_page=100`
                        fetch(apiUrl)
                            .then(res => {
                                if(res.status === 403){
                                    return setError({active: true, type: 403})
                                } 
                                return res.json()
                            })
                            .then(data => setRepoData(data) )
                                .catch(error => {
                                console.log('Error Message',error)
                            })
                        
            }
    /*....................End Handle repoData fetch...........................*/
    

    /*....................Start Handle userLang Data Fetch..........*/
            const getLangData =  (userSearch) => {
                const me =  new  GhPolyglot(`${userSearch}`)
                me.userStats((err,stats) => {
                    if(err) {
                        console.log('Me Error from Plyglot',err)
                        setErrorPolyglot(true)
                    }
                    setLangData(stats)
                })
            }
    /*....................End Handle userLang Data Fetch..........*/
    
    /*.....................Start Create Most Used Lang chart with langData............. */

            const labels = !errorPolyglot ? langData.map(lang => lang.label) : []
            const data = !errorPolyglot ? langData.map(lang => lang.value)  : []
            const backgroundColor = !errorPolyglot ? langData.map( lang => `${lang.color}` ) : []
            const borderColor = !errorPolyglot && langData.map(lang => `${lang.color}`)   
            const state = {
                labels: labels,
                datasets: [
                    {
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        data: data
                    }
                ]
            }

    /*....................End Create Most Used Lang Chart..........................*/

   
    /*.....................Start Create Most started Repo chart............. */
    
                const Limit = 5;
                const sortProperty = 'stargazers_count';
                const mostStaredRepo = !errorPolyglot && repoData
                    .filter(repo => !repo.fork)
                    .sort((a, b) => b[sortProperty] - a[sortProperty])
                    .slice(0, Limit);
                const mostStaredRepoLabels = !errorPolyglot && mostStaredRepo.map(repo => repo.name);
                const mostStaredRepoData = !errorPolyglot && mostStaredRepo.map(repo => repo[sortProperty]);

                const mostStaredRepoState = {
                    labels: mostStaredRepoLabels,
                    datasets: [
                        {
                            label: 'Most Stared Repo',
                            backgroundColor: backgroundColor,
                            data: mostStaredRepoData,
                        }
                    ]
                }
               

        /*.....................End Create Most Started Repo chart............. */
        
        /*.....................Start Create Most started Language chart............. */        
   
    
                const filteredRepos = !errorPolyglot && repoData.filter(repo => !repo.fork && repo.stargazers_count > 0)
                const uniqueLang = !errorPolyglot && new Set(filteredRepos.map(repo => repo.language))
                
                const mostStaredLangLabels = !errorPolyglot && Array.from(uniqueLang.values()).filter(l => l) 
                const mostStaredLangData = !errorPolyglot && mostStaredLangLabels.map(lang => {
                    const repos = !errorPolyglot && filteredRepos.filter(repo => repo.language === lang)
                    const starsArr = !errorPolyglot && repos.map(repo => repo.stargazers_count)
                    const starSum = starsArr.reduce((a, b) => a + b, 0)
                    return starSum;
                })

                const mostStaredLangState = {
                    labels: mostStaredLangLabels,
                    datasets: [
                        {
                            label: 'Most Stared Repo',
                            backgroundColor: backgroundColor,
                            data: mostStaredLangData
                        }
                    ]
                }
   
        /*.....................End Create Most started Language chart............. */
       
        useEffect(() => {
            let componentMount = false;
            if(!componentMount){
                repoDataFetch(userSearch)
                getLangData(userSearch)
            }
            return () => {
                componentMount = true
            }
        },[userSearch]) 



        //  console.log(Error)   

        return (
        <>
            {!errorPolyglot ? 
                <>
                <section className='sectionContainer'>
                        <div className="repoContainer">
                            
                            <div className="chartInfo">
                                <header><h2>Top Languages</h2></header>
                                <div className="chart" style={{height:300}}>
                                <Pie data={state}  style={{height:200,width:300}}/>

                                </div>
                            </div>
                            <div className="chartInfo">
                                <header ><h2>Most Stared </h2></header>
                                <div className="chart" style={{height:300,paddingTop:15}}>
                                    <Doughnut data={mostStaredRepoState}   style={{height:'100%',width:'100%'}}/>
                                
                                </div>
                            </div>
                            <div className="chartInfo">
                                <header><h2>Stars Language</h2></header>
                                <div className="chart" style={{height:300,paddingTop:15}}>
                                    <Radar data={mostStaredLangState} />
                                </div>
                            </div>
                        </div>
                </section>
            <UserRepo userSearch={userSearch}/>
            </>   : <div className="errorPolyglot" style={{marginTop: -30, color: 'whitesmoke'}}>This User  doesn't have any public Repositories</div> 
            }  
        </>
    )
}