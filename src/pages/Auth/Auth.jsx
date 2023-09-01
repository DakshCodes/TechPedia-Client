import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Auth.css'
import { TfiBackLeft } from 'react-icons/tfi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from "gsap";
import { Expo } from 'gsap/dist/gsap';

const Auth = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loginemail, setloginEmail] = useState("")
    const [loginpassword, setLoginPassword] = useState("")

    const navigate = useNavigate();
    const app = useRef();
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // use scoped selectors
            const tl = gsap.timeline();
            tl
                .from('.loader h1', 5, {
                    x: 800
                }, 'start')
                .from('.loader h2', 5, {
                    x: -800
                }, 'start')
                .from('.form-structor', {
                    opacity: 0,
                    y: -800,
                    duration: 2,
                    ease: Expo.easeInOut
                })
        }, app);

        return () => ctx.revert();
    }, []);

    const logInOnFinish = async (values) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/login`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ loginemail, loginpassword })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Parse the JSON response

            console.log(data); // Check the received data

            if (data.success) {
                toast.success(data.message);
                localStorage.setItem("token", data.data);
                navigate("/");
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            // Handle errors here
            console.error(error.message);

            // Clear the token from localStorage when it's invalid or expired
            localStorage.removeItem("token");

            // You can also perform other actions like displaying an error message to the user or redirecting to a login page.
        }
    }


    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    }, [])

    const registerOnFinish = async () => {
        try {

            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/register`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            })

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Parse the JSON response

            console.log(data); // Check the received d
            if (data.success) {
                toast.success(data.message)
            } else {
                throw new Error(data.message);
            }

        } catch (error) {
            console.log(error.message)
        }
    }




    const handlloginpageopen = (e) => {
        const signupBtn = document.getElementById('signup');
        let parent = e.target.parentNode.parentNode;
        Array.from(e.target.parentNode.parentNode.classList).find((element) => {
            if (element !== "slide-up") {
                parent.classList.add('slide-up')
            } else {
                signupBtn.parentNode.classList.add('slide-up')
                parent.classList.remove('slide-up')
            }
        });
    }
    const handlregisterpageopen = (e) => {
        const loginBtn = document.getElementById('login');
        let parent = e.target.parentNode;
        Array.from(e.target.parentNode.classList).find((element) => {
            if (element !== "slide-up") {
                parent.classList.add('slide-up')
            } else {
                loginBtn.parentNode.parentNode.classList.add('slide-up')
                parent.classList.remove('slide-up')
            }
        });
    }


    return (<>
        <div className='main-register' ref={app}>
            <div className="loader">
                <h1>JOIN</h1>
                <h2>PAGE</h2>
            </div>
            <div className="form-structor">
                <div className="signup">
                    <h2 className="form-title" id="signup" onClick={handlregisterpageopen}><span>or</span>Sign up</h2>
                    <div className="form-holder">
                        <input type="text" className="input" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                        <input type="email" className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" className="input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button onClick={registerOnFinish} className="submit-btn">Sign up</button>
                </div>
                <div className="login slide-up">
                    <div className="center">
                        <h2 className="form-title" id="login" onClick={handlloginpageopen}><span>or</span>Log in</h2>
                        <div className="form-holder">
                            <input type="email" className="input" placeholder="Email" onChange={(e) => setloginEmail(e.target.value)} />
                            <input type="password" className="input" placeholder="Password" onChange={(e) => setLoginPassword(e.target.value)} />
                        </div>
                        <button className="submit-btn" onClick={logInOnFinish}>Log in</button>
                        <div className="forget">
                            <span>
                                <Link to={'/forget'}>Forgot Password ?</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer />
    </>
    )
}

export default Auth