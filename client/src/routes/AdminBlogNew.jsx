import React, {useContext, useState, useEffect} from 'react'
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { Link, useHistory} from 'react-router-dom'
import BlogAPI from "../apis/BlogAPI"
import { BlogContext } from '../context/BlogContext';

const AdminBlogNew = (props) => {

    const { addBlogPosts } = useContext(BlogContext);

    let history = useHistory();

    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [content, setContent] = useState("")

    useEffect(() => {

        const checkLogin = async () => {
            try {
                await BlogAPI.get("admin/authenticate", 
                { headers: {'Authorization': "Bearer " + window.localStorage.getItem('token')} })
            } catch (err) {
                history.push('/')
            }
        }

        checkLogin();
    }, [history])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await BlogAPI.post("/", {
                title,
                category,
                content
            });

            addBlogPosts(response.data.data.blogPost)
            history.push("/adminblog");
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className="d-flex flex-column pageContainer">
            <Navbar />
            <div className="container-fluid">
                <div className="adminblog">
                    <h2 className="my-4 text-center">New Post</h2>
                    <div className="card-block">
                        <form action="">
                            <div className="form-row my-2">
                                <label htmlFor="title">Title</label>
                                <input
                                    value={title}
                                    id="title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                            <div className="form-row my-2">
                            <label htmlFor="category">Category</label>
                                <input
                                    value={category}
                                    id="category"
                                    onChange={(e) => setCategory(e.target.value)}
                                    type="text"
                                    className="form-control"
                                />
                            </div>
                            <div className="form-row my-2">
                            <label htmlFor="content">Content</label>
                                <textarea
                                    value={content}
                                    id="content"
                                    onChange={(e) => setContent(e.target.value)}
                                    type="text"
                                    className="form-control mb-4"
                                    rows="19"
                                />
                            </div>
                            <Link to="/admin/blog">
                                <button onClick={handleSubmit} type="submit" className="btn btn-primary">
                                    ADD
                                </button>
                            </Link>
                            <Link to="/admin/blog">
                                <button className="btn btn-secondary mx-2">
                                    CANCEL
                                </button>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default AdminBlogNew
