import React, { useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiSearch } from 'react-icons/hi';
import './Navbar.css';
import { useEffect } from 'react';
import { gsap } from "gsap";
import { Expo } from 'gsap/dist/gsap';
import { SetUser } from '../../redux/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '..//../redux/loadersSlice';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
    const [isopen, setopen] = useState(false);

    const handleClickopen = () => {
        setopen(!isopen);
    }

    const [url, seturl] = useState('')
    const app = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.users);
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/').filter(segment => segment !== '');

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // use scoped selectors
            const tl = gsap.timeline();
            tl
                .from(".logo", 2, {
                    opacity: 0,
                    x: -20,
                    ease: Expo.easeInOut
                })
                .from("nav ul li", {
                    opacity: 0,
                    x: -20,
                    stagger: 0.5,
                    delay: -1,
                    ease: Expo.easeInOut
                })
                .from(".btn", {
                    opacity: 0,
                    y: -20,
                    ease: Expo.easeInOut
                })
                .from(".img", {
                    opacity: 0,
                    y: -20,
                    ease: Expo.easeInOut
                })
                .from(".search", {
                    opacity: 0,
                    x: -20,
                    ease: Expo.easeInOut
                })

        }, app);

        return () => ctx.revert();
    }, []);

    const validateToken = async () => {
        try {
            dispatch(SetLoader(true));
            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/get-current-user`, {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            });
            dispatch(SetLoader(false));

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Parse the JSON response

            // Check the received data
            console.log(data);

            if (data.success) {
                dispatch(SetUser(data.data))
            } else {
                navigate("/auth")
            }

        } catch (error) {
            dispatch(SetLoader(false));
            navigate("/auth")
        }
    }
    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
        } else {
            toast.error("Please Login to Continue");
            navigate("/auth")
        }

    }, [])

    const handleClick = () => {
        localStorage.clear();
        navigate('/auth')
    }

    return (
        <nav ref={app} className="nav-main">
            {isopen ?
                <div className='!xl:hidden  min-w-[80vw] bg-[#ff3131]/90 h-[40vh]  flex flex-col  justify-between items-center fixed top-16 left-10 -translate-x-10 -translate-y-16 z-[9999]  dark:bg-light/75 rounded-[10%]  backdrop-blur-sm py-32 '>
                    <nav className='flex items-center flex-col h-[90%] justify-around '>
                        <Link to={'/collection'}>
                            <button className={`bg-transparent border-none  relative group text-xl font-normal hover:border-[#000000] transition-all duration-500 ease-in-out  dark:text-dark my-2 text-[#fff]`} onClick={handleClickopen}>
                                Collection
                                <span
                                    className={`h-[2px] inline-block bg-light  dark:bg-black absolute left-0 -bottom-0.5
                                    group-hover:w-full transition-[width] ease duration-300 `}
                                >&nbsp;</span>
                            </button>
                        </Link>
                        <Link to={'/create-blog'}>
                            <button className={`bg-transparent border-none  relative group text-xl font-normal hover:border-[#000000] transition-all duration-500 ease-in-out  dark:text-dark my-2 text-[#fff]`} onClick={handleClickopen}>
                                Create Your
                                <span
                                    className={`h-[2px] inline-block bg-light  dark:bg-black absolute left-0 -bottom-0.5
                                    group-hover:w-full transition-[width] ease duration-300 `}
                                >&nbsp;</span>
                            </button>
                        </Link>
                        <Link to={'/saved'}>
                            <button className={`bg-transparent border-none  relative group text-xl font-normal hover:border-[#000000] transition-all duration-500 ease-in-out  dark:text-dark my-2 text-[#fff]`} onClick={handleClickopen}>
                                Your Saved
                                <span
                                    className={`h-[2px] inline-block bg-light  dark:bg-black absolute left-0 -bottom-0.5
                                    group-hover:w-full transition-[width] ease duration-300 `}
                                >&nbsp;</span>
                            </button>
                        </Link>
                    </nav>
                </div>
                : null
            }
            {
                !isopen ? (
                    <div className="icon" onClick={handleClickopen}>
                        <i class="ri-menu-2-line"></i>
                        {/* <img src={burger} alt="" /> */}
                    </div>
                )
                    : (
                        <div className="icon" onClick={handleClickopen}>
                            <i class="ri-close-line"></i>
                        </div>
                    )
            }
            <div className="logo">
                <Link to={'/'} onClick={() => seturl("")}>
                    <span>TechPedia</span>
                </Link>
            </div>
            <ul>
                <li className={`${pathSegments[0] === "collection" && "active"}`} onClick={() => seturl("collection")}><Link to={'/collection'}>Collection</Link></li>
                <li className={`${pathSegments[0] === "create-blog" && "active"}`} onClick={() => seturl("create-blog")}><Link to={'/create-blog'}>Create Blog</Link></li>
                <li className={`${pathSegments[0] === "saved" && "active"}`} onClick={() => seturl("saved")}><Link to={'/saved'}>Saved</Link></li>
            </ul>

            {user ? (
                <div className="img" >
                    <img src={user?.profilePic || "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"} className="rounded-full w-28 " alt="profile picture" />
                    <button onClick={handleClick}>LogOut</button>
                </div>
            ) : (
                < div className='btn'>
                    <Link to={'/auth'}>
                        <button>Sign Up</button>
                    </Link>
                </div>
            )
            }
        </nav >
    )
}

export default Navbar
