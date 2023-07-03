import React,{useState, useEffect} from 'react'
import './ApiRateLimit.scss'




export default function ApiRateLimit({setError}) {
    const [rateLimit, setRateLimit] = useState(null)

    const rateLimitFunc = () => {
        const rateLimitApi = `https://api.github.com/rate_limit`
        fetch(rateLimitApi)
        .then(response => response.json())
        .then(data => {
            setRateLimit(data.resources.core)
            if(data.resources.core.remaining === 0) {
                setError({active: true, type: 403})
            }     
        })
    }

    useEffect(() => {
        rateLimitFunc()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <div className='rateLimit_container '>
            
            <div className="rateLimit">
                { rateLimit &&
                    <div className="limit ">
                
                        <div className="num">{`${rateLimit.used} / ${rateLimit.limit}`}</div>
                        <p>REQUESTS DONE</p>
                    </div>   
                }
            </div>
        </div>
    )
}
