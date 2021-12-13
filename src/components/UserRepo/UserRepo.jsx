import React, {useState, useEffect} from 'react'
import './UserRepo.scss'
import { langColors } from '../../utils/LangColor'
import { RepoIcon } from '@primer/octicons-react'


export default function UserRepo({userSearch}) {
    const [topRepos, setTopRepos] = useState([])
    const [sortType, setSortType] = useState('forks')
    const [Error, setError] = useState({active: false, type: 200})
    const [componentMount, setComponentMount] = useState(false)

    const sortTypes = ['size', 'forks', 'star']
    
     /*.................... Start Handle repoData fetch...........................*/
    const repoDataFetch = async (userSearch) => {
        const apiUrl = `https://api.github.com/users/${userSearch}/repos?per_page=100`
           await fetch(apiUrl)
                .then( res => {
                    if(res.status === 403) {
                        return setError({active: true, type: 403})
                    }
                    return res.json()
                })                    
                .then( data => {
                   return setTopRepos(data)
                })
                .catch(error => {
                    setError({active: true, type: 400})
                    console.log('error: ', error)
                })
    }
    /*....................End Handle repoData fetch...........................*/


    /*.....................Start Sort repositorie by start fork or size ...................*/
    const sortRepoFunc = type => {
        const sortObject = {
            star : 'stargazers_count',
            forks : 'forks_count',
            size  : 'size'
            }
        const sortByType = sortObject[type]
        const sortedRepo =!Error.active && topRepos
            .filter(repo => !repo.fork )
            .sort((a, b) => {
                return  b[sortByType] - a[sortByType]     
            })
    
           setTopRepos(sortedRepo)
    }
    /*.....................End Sort repositorie by start fork or size ...................*/
    
    const changeRepoSort = e => {
        setSortType(e.target.value)
    }

    
    useEffect(() => {
        if(!componentMount){
            repoDataFetch(userSearch)
        }
        return () => {
            setComponentMount(true)
        }
     })

     useEffect(() => sortRepoFunc(sortType), [sortType])

    //  console.log('My Status Code ',Error)
    return (

        <section className='homeContainer bg-white'>
            <div className="repoContainer">
                <header className='repoHeader header '>
                    <h2>Top Repos</h2>
                    <div className="dropdownContainer " >
                        <span className='label m-2 '>by</span>
                            <div className="dropdown" >
                                <select onChange={changeRepoSort}>
                                    {sortTypes.map((type, i) => (
                                        <option value={type} key={i}>{type}</option>
                                    ))}
                                </select>
                            </div>
                    </div>
                </header>
                <div className="repoList ">
                        {Error.type !== 404  && Error.type === 200 && topRepos.map(repo => (
                            <div className='repoListContainer' key={repo.id}>
                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className='repo'  >
                                        <div className="repo_top ">
                                            <div className="repo_name">
                                                <div className="repoHeader">
                                                    <RepoIcon className='icon' size={16} />
                                                    <h3>{repo.name}</h3>
                                                </div>
                                                <p>{repo.description}</p>
                                            </div>
                                            
                                        </div>
                                        <div className="repo_stats">
                                            <div className="repo_stats_left">
                                                <span   >
                                                    <div className="language" style={{backgroundColor: langColors[repo.language] , width:20, height:20,borderRadius:50}} >.</div>
                                                    {repo.language}
                            
                                                </span>
                                                <span>
                                                    <svg aria-hidden="true" className="octicon" height="16" role="img" viewBox="0 0 14 16" width="14"><path fillRule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>
                                                    {repo.stargazers_count.toLocaleString()}
                                                </span>
                                                <span   >
                                                <svg aria-hidden="true" className="octicon" height="16" role="img" viewBox="0 0 10 16" width="10" ><path fillRule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
                                                    {repo.forks.toLocaleString() }
                                                </span>
                                            </div>
                                            <div className="repo_stats_right">
                                                <span>
                                                    {repo.size.toLocaleString()} KB
                                                </span>
                                            </div>
                                        </div>
                                </a>
                            </div >
                        )) 
                    }
                </div>
            </div>
            <br />
            <hr />
            <div className="footer">
                <span>Build with : </span>
                <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React.js</a>
                <a href="https://www.chartjs.org/" target="_blank" rel="noopener noreferrer">Chart.js</a>·
                <a href="https://github.com/IonicaBizau/node-gh-polyglot" target="_blank" rel="noopener noreferrer">GitHub Polyglot</a>·
                <a href="https://sass-lang.com/" target="_blank" rel="noopener noreferrer">Sass</a>·
                <span>and more!</span>
            </div>
        </section>
    )
}
