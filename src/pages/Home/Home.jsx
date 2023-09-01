import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './Home.css';
import { gsap } from "gsap";
import { Expo } from 'gsap/dist/gsap';
import Blogcard from '../../components/Blog-card/Blog-card';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SetUser } from '../../redux/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import gi from './gi.webp'
import { SetLoader } from '..//../redux/loadersSlice';

const Home = () => {
    const app = useRef();
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/get-allblogs`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                setBlogs(data.data);
            } else {
                // Handle error case here
                console.log(data.message); // You can display an error message to the user or handle it in some other way
            }
        } catch (error) {
            console.log(error);
            // Handle error case here
        }
    };

    console.log(blogs)

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
                .from('.container .div', {
                    opacity: 0,
                    x: -800,
                    stagger: 0.5,
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
                navigate("/")
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
        fetchBlogs();

    }, [])

    return (
        <>
            <div className="loader" ref={app}>
                <h1>BLOGS</h1>
                <h2>PAGE</h2>
            </div>
            <div className="main" id="scrollbar1">
                <div className="container">
                    {/* Render blogs here */}
                    {blogs.map((blog) => (
                        <Blogcard key={blog._id} blog={blog} />
                    ))}
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Home
