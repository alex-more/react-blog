import React, {useEffect, useContext } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import BlogPeek from "../components/BlogPeek"
import BlogAPI from "../apis/BlogAPI"
import { BlogContext } from '../context/BlogContext';

const Home = () => {
    
    const {blogPosts, setBlogPosts} = useContext(BlogContext)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BlogAPI.get("/")
                setBlogPosts(response.data.data.blog)
            } catch (err) {
                console.log(err)
            }
        }

        fetchData();
    }, [setBlogPosts])

    return (
        <div className="d-flex flex-column pageContainer">
            <Navbar />

            <div className="container-fluid d-flex flex-column align-items-center">
            <br />

                <h4 className="text-center m-4">This blog website is designed to be interacted with, by you.</h4>
                <h4 className="text-center">To try out the authentication and blog editor features, click on the admin panel button.</h4>
                
                <a href={"/login"} className="font-weight-light m-4 subtle-link">
                    <button type="button" className="btn btn-warning">
                        Admin Panel
                    </button>
                </a>

                <hr className="w-100"/>
                <h2 className="text-center m-4">Homepage</h2>
                <div className="blog-preview mb-5">
                    
                    {blogPosts.map(post => {
                        return (
                            <BlogPeek post={post} key={post.id}/> 
                        )
                    })}
                </div>

            </div>

            <Footer />
        </div>
    )
}

export default Home
