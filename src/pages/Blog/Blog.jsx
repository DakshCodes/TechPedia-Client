import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TfiBackLeft } from 'react-icons/tfi'
import { BsFillSaveFill } from 'react-icons/bs'
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import './Blog.css';
import { gsap } from "gsap";
import { Expo } from 'gsap/dist/gsap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { SetLoader } from '..//../redux/loadersSlice';


const BlogDetails = () => {
    const dispatch = useDispatch();
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
                .from('.container .div', {
                    opacity: 0,
                    x: -800,
                    stagger: 0.5,
                    ease: Expo.easeInOut
                })


        }, app);

        return () => ctx.revert();
    }, []);
    const { id } = useParams(); // This extracts the "id" parameter from the URL
    const [blogDetails, setBlogDetails] = useState({})
    const [isLiked, setIsLiked] = useState(false);
    const [blogLikes, setBlogLikes] = useState(0);
    const { user } = useSelector((state) => state.users);

    const [commentText, setCommentText] = useState("")
    const [comments, setComments] = useState([])

    useEffect(() => {
        async function fetchComments() {
            dispatch(SetLoader(true));
            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/${id}/comment`,)
            dispatch(SetLoader(false));
            const comments = await response.json()
            setComments(comments.comment)
        }
        fetchComments()
    }, [user])
    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/${id}/like`, {
                headers: {
                    "authorization": `Bearer ${token}`,
                },
                method: 'PUT',
            });

            const data = await response.json();
            if (data.success) {
                setIsLiked(prev => !prev);
                setBlogLikes(prev => isLiked ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/getblog/${id}`, {
                    method: "GET"
                });
                if (!res.ok) {
                    throw new Error(`Fetch failed with status: ${res.status}`);
                }
                const blog = await res.json()
                console.log(blog);
                // console.log(blog?.likes?.length + "length");
                setBlogDetails(blog.blog);
                // setIsLiked(blog?.likes?.includes(user?._id));
                // setBlogLikes(blog?.likes?.length || 0);
                console.log("user in blog")
                console.log(user)
                // console.log(isLiked)
                setIsLiked(blog?.blog?.likes?.includes(user?._id))
                setBlogLikes(blog?.blog?.likes?.length || 0)
            } catch (error) {
                console.error(error);
            }
        }
        fetchBlog();
    }, [user]);

    const handleComment = async (e) => {
        e.preventDefault()
        if (commentText?.length < 2) {
            toast.error("Comment must be at least 2 characters long")
            return
        }
        try {
            const body = {
                blogId: id,
                authorId: user?._id,
                text: commentText
            }

            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const newComment = await response.json()

            setComments((prev) => {
                return [newComment, ...prev]
            })

            setCommentText("")
        } catch (error) {
            console.log(error)
        }
    }


    const SavedBlog = async (e) => {
        e.preventDefault()
        try {
            const body = {
                title: blogDetails?.title,
                desc: blogDetails?.desc,
                imageUrl: blogDetails?.imageUrl,
                authorId: blogDetails?.authorId,
                blogid: id,
            }

            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/saved`, {
                method: "POST",
                headers: {
                    "authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const saved = await response.json()
            console.log(saved)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='main-blog' ref={app}>
            <span onClick={SavedBlog} className='save-icon'>
                <BsFillSaveFill />
                <span>Save</span>
            </span>
            {/* blog Content */}
            <div class="card-blog">
                <div class="thumbnail">
                    <img class="left"
                        src={blogDetails?.imageUrl}
                    />
                </div>
                <div className='detail-scroll'>
                    <div class="right">
                        <p className='date'>
                            {blogDetails?.createdAt?.split("T")[0]}
                        </p>
                        <h1>
                            {blogDetails?.title}
                        </h1>
                        <div class="author">
                            <img
                                src={blogDetails?.authorId?.profilePic}
                            />
                            <h2>
                                {/* DakshCodes */}
                                {blogDetails?.authorId?.username}
                            </h2>
                        </div>
                        <div class="separator"></div>
                        <p className='para'>
                            {/* THis Is Descreiption */}
                            {blogDetails?.desc}
                        </p>
                    </div>
                    <div className="h-[500px] w-full font-[poppins] ">
                        <div class="flex justify-around items-center text-center  shadow-lg  mx-3 mb-7 ">
                            <div className='flex flex-col items-center bg-white'>
                                <p className='text-xl font-[poppins]'>Likes</p>
                                <div className='w-10 flex justify-between'>
                                    {
                                        blogLikes
                                    }
                                    {user && (isLiked ? <AiFillLike className='cursor-pointer' size={20} onClick={handleLike} /> : <AiOutlineLike size={20} onClick={handleLike} />)}
                                </div>
                            </div>
                            <form class="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
                                <div class="flex flex-wrap -mx-3 mb-1">
                                    <h2 class="px-4 pt-2 pb-2 text-gray-800 text-lg ">Add a new comment</h2>
                                    <div class="w-full md:w-full px-3 mb-3 mt-2 ">
                                        <textarea onChange={(e) => setCommentText(e.target.value)} class="bg-gray-100 rounded leading-normal resize-none w-full h-20 py-2 px-3 font-[poppins] placeholder-gray-700 focus:outline-none focus:bg-white" name="body" placeholder='Type Your Comment' required></textarea>
                                    </div>
                                    <div class="w-full md:w-full flex items-start md:w-full px-3 mb-4">
                                        <div class="-mr-1">
                                            <input type='submit' class="bg-white text-gray-700 font-[poppins] py-1 px-4 border border-[#ff3131] rounded-lg tracking-wide mr-1 hover:bg-[#ff3131] transition-all duration-300 hover:text-[#fff]" onClick={handleComment} value='Post Comment' />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <section class=" relative flex flex-col h-[100%] !w-full  antialiased bg-white  ">
                            <h1 className='px-5'>Comments</h1>
                            <div class="comment w-full bg-[#ff3131] flex flex-col gap-2 h-full overflow-auto scroll-smooth items-start">
                                {
                                    comments.map((comment, index) => {
                                        return (
                                            <div key={index}
                                                class="flex-col !w-[90%] mt-3 m-auto bg-white   sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm md:w-2/3">
                                                <div class="flex flex-row md-10">
                                                    <img class="w-12 h-12 border-2 border-gray-300 rounded-full" alt="Anonymous's avatar"
                                                        src={comment?.authorId?.profilePic} />
                                                    <div class="flex-col mt-1">
                                                        <div class="flex items-center flex-1 px-4 font-bold leading-tight">{comment?.authorId?.username}
                                                            <span class="ml-2 text-xs font-normal text-gray-500">{comment?.updatedAt?.split("T")[0]}</span>
                                                        </div>
                                                        <div class="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">{comment?.text}
                                                        </div>
                                                    </div>                                    </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >

    )
}

export default BlogDetails;