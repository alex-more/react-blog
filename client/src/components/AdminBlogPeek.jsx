import React, {useContext} from 'react'
import BlogAPI from "../apis/BlogAPI"
import { BlogContext } from '../context/BlogContext';
import '../styles.css';

const AdminBlogPeek = (props) => {

    let shortened = "";
    if(props.post.content) {
        shortened = props.post.content.substring(0, 360);
	shortened = shortened + " (...)"
    }

    let postId = ""
    
    if(props.post.id) {
        postId = props.post.id;
    }

    const {blogPosts, setBlogPosts} = useContext(BlogContext)

    const handleDelete = async () => {
        
        if(window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await BlogAPI.delete("/" + postId)
                setBlogPosts(blogPosts.filter(blogPost => {
                    return blogPost.id !== postId;
                }))
            } catch (err) {
                console.log(err)
            }
        }
    }

    return (
        <div className="card my-3 text-dark">
            <div className="card-header">
                <div className="right-align">
                    <h6 className="category-peek text-end">{props.post.category}</h6>
                </div>
                <h4 className="card-title">{props.post.title}</h4>
            </div>
            <div className="card-block p-3">
                <p className="card-text">{shortened}</p>
                <a href={"/adminblog/" + postId} className="btn btn-warning">EDIT</a>
                <button className="btn btn-danger mx-2" onClick={() => handleDelete()}>DELETE</button>
            </div>
        </div>
    )
}

export default AdminBlogPeek
