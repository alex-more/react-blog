import React from 'react'
import '../styles.css';

const BlogPeek = (props) => {

    let shortened = "";
    if(props.post.content) {
        shortened = props.post.content.substring(0, 200);
    }

    let postId = ""
    let postUrl = ""
    if(props.post.id) {
        postId = props.post.id;
        postUrl = "/blog/" + postId;
    }

    return (
        <div className="blogpeek card hover-darken m-3">
            <div className="card-header">
                <div className="right-align">
                    <h6 className="category-peek text-end">{props.post.category}</h6>
                </div>
                <h4 className="card-title blog-title">{props.post.title}</h4>
            </div>
            <a className="card-block stretched-link text-decoration-none link-dark p-3" href={postUrl}>
                <p className="card-text">{shortened}</p>
            </a>
        </div>
    )
}

export default BlogPeek
