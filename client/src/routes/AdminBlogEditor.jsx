import React, {useEffect, useContext} from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import AdminBlogPeek from "../components/AdminBlogPeek"
import BlogAPI from "../apis/BlogAPI"
import { BlogContext } from '../context/BlogContext';
import { useHistory } from 'react-router-dom'

const AdminBlogEditor = (props) => {

    const history = useHistory();
    const {blogPosts, setBlogPosts} = useContext(BlogContext)

    useEffect(() => {

        const checkLogin = async () => {
            try {
                await BlogAPI.get("admin/authenticate", 
                { headers: {'Authorization': "Bearer " + window.localStorage.getItem('token')} })
            } catch (err) {
		history.push('/')
            }
        }

        const fetchData = async () => {
            try {
                const response = await BlogAPI.get("/")
                setBlogPosts(response.data.data.blog)
            } catch (err) {
                console.log(err)
            }
        }

        checkLogin();
        fetchData();
    }, [history, setBlogPosts])

    return (
        <div className="d-flex flex-column pageContainer">
            <Navbar />

            <div className="container-fluid">
                <div className="adminblog mb-5">
                    <h2 className="text-center m-4">All Blog Posts</h2>

                    <a className="btn btn-primary mt-4" href="/adminblog/new">NEW POST</a>

                    {blogPosts.map(post => {
                        return (
                            <AdminBlogPeek post={post} key={post.id}/> 
                        )
                    })}
                </div>
                
            </div>

            <Footer />
        </div>
    )
}

export default AdminBlogEditor
