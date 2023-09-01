import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import './Verified.css'

const Verified = () => {

    const { token } = useParams();
    const [valid, setValid] = useState(false);

    const verifyEmailUrl = async () => {

        try {

            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/confirm/${token}`)
            console.log(response)
            if (response.ok) {
                setValid(true)
            } else {
                setValid(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        verifyEmailUrl()
    }, [])

    return (
        (valid ?

            <div className='main-verified'>
                <div className="m-auto flex flex-col items-center">
                    Your account has been verified
                    <div>
                        Got to <Link to="/auth"><span className="">Login Page</span></Link>
                    </div>
                </div>
            </div>

            :
            <div className='main-verified'>
                <div className="m-auto flex flex-col items-center">
                    Something went wrong
                    <div>
                        Got to <Link to="/auth"><span className="underline">Login Page</span></Link>
                    </div>
                </div>
            </div>
        )



    )
}

export default Verified