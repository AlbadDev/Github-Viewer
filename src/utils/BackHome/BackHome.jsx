import React from 'react'
import { Link } from 'react-router-dom'
import './BackHome.scss'

const BackHome = () => {
    return (
        <section className='back_section'>
            <Link to='/' className='back_link'>Back Home</Link>
        </section>
    )
}

export default BackHome
