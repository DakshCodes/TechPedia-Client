import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineFileImage } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Create-Blog.css'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '..//../redux/loadersSlice';

const CreateBlog = () => {

    const CLOUD_NAME = 'dylnk52kz'
    const UPLOAD_PRESET = 'my_blog_project_daksh'

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [category, setCategory] = useState("Tech")
    const [photo, setPhoto] = useState('')
    const [url, seturl] = useState('')
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!photo || !title || !category || !desc) {
                toast.error("All fields are required");
                return;
            }

            // Image upload process
            const data = new FormData();
            data.append("file", photo);
            data.append("upload_preset", "my-uploads");
            data.append("cloud_name", "dylnk52kz");

            const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dylnk52kz/image/upload', {
                method: "POST",
                body: data
            });

            if (!uploadResponse.ok) {
                toast.error("Error uploading the image");
                return;
            }

            const uploadData = await uploadResponse.json();
            const imageUrl = uploadData.url;

            // API call to create the blog post
            dispatch(SetLoader(true));
            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/blog/add-blog`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ title, desc, category, imageUrl, authorId: user?._id })
            });
            dispatch(SetLoader(false));
            if (response.status) {
                const blog = await response.json();
                toast.success("Successfully Created");
                navigate(`/blog/${blog.newBlog._id}`);
            } else {
                toast.error("Error occurred while Creating");
            }
        } catch (error) {
            console.log(error);
        }
    };
    // const validateToken = async () => {
    //     try {
    //         dispatch(SetLoader(true));
    //         const token = localStorage.getItem("token");

    //         const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/users/get-current-user`, {
    //             headers: {
    //                 "authorization": `Bearer ${token}`
    //             }
    //         });
    //         dispatch(SetLoader(false));

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json(); // Parse the JSON response

    //         // Check the received data
    //         console.log(data);

    //         if (data.success) {
    //             dispatch(SetUser(data.data))
    //             navigate("/create-blog")
    //         } else {
    //             navigate("/auth")
    //         }

    //     } catch (error) {
    //         dispatch(SetLoader(false));
    //         navigate("/auth")
    //     }
    // }


    // useEffect(() => {
    //     if (localStorage.getItem("token")) {
    //         validateToken();
    //     } else {
    //         toast.error("Please Login to Continue");
    //         navigate("/auth")
    //     }

    // }, [])



    return (<>
        <div className='create-container'>
            <div class="container-create">
                <header>
                    <h1>
                        <a href="#">
                            <img src="https://cdn.pixabay.com/photo/2016/10/10/01/49/leave-1727488_1280.png" alt="Authentic Collection" />
                        </a>
                    </h1>
                </header>
                <h1 class="text-center">Create-Blog</h1>
                <form class="registration-form" onSubmit={handleSubmit}>
                    <label class="col-one-half">
                        <span class="label-text">Title..</span>
                        <input type="text" name="title" onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label class="col-one-half">
                        <span class="label-text">Description..</span>
                        <input type="text" name="description" onChange={(e) => setDesc(e.target.value)} />
                    </label>
                    <div className="option">
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="Select">Select</option>
                            <option value="Tech">Tech</option>
                        </select>
                    </div>
                    <div className="uploads">
                        <label htmlFor='image'>
                            Upload Image <AiOutlineFileImage />
                        </label>
                        <input id='image' type="file" style={{ display: 'none' }} onChange={(e) => setPhoto(e.target.files[0])} />
                    </div>
                    <div class="text-center" id="submit">
                        <button class="submit-btn">Create Blog</button>
                    </div>
                </form>
            </div>
        </div>
    </>
    )
}

export default CreateBlog