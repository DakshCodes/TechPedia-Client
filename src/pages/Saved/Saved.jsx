import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Saved.css';
import { gsap } from "gsap";
import { Expo } from 'gsap/dist/gsap';
import Blogcard from '../../components/Blog-card/Blog-card';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SetUser } from '../../redux/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '..//../redux/loadersSlice';
import { useLocation } from 'react-router-dom';

const Saved = () => {
    const app = useRef();
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [saved, setSaved] = useState([]);

    const fetchSaved = async () => {
        try {
            dispatch(SetLoader(true));
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/getmysaved`, {
                headers: {
                    "authorization": `Bearer ${token}`
                },
                cache: 'no-store'
            });
            dispatch(SetLoader(false));
            const data = await res.json();
            // console.log(data)
            if (data.success) {
                setSaved(data?.data[0].saved);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    console.log(saved)

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


    useEffect(() => {
        fetchSaved();
    }, [])

    return (<>
        <div className='collection-main' ref={app}>
            <div className="loader">
                <h1>Saved</h1>
                <h2>PAGE</h2>
            </div>
            <h1 className='head'>My-Saved</h1>
            <div className="container">
                {saved.map((blog) => (
                    <Blogcard key={blog._id} blog={blog} />
                ))}
            </div>
        </div>
    </>
    )
}

export default Saved
