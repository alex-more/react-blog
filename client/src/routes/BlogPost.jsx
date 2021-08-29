import React, {useEffect, useState} from 'react'
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom'
import BlogAPI from "../apis/BlogAPI"

const BlogPost = (props) => {

    const {id} = useParams()

    const [blogPost, setBlogPost] = useState()
	
    let keygen = 0; // This is just to avoid a warning message

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BlogAPI.get("/" + id)
                setBlogPost(response.data.data.blogPost)
            } catch (err) {
    
            }
        }

        fetchData();
    }, [id])

    return (
        <div className="d-flex flex-column pageContainer">
            <Navbar />

            <div className="container-fluid blogpost">
                <h6 className="my-5 category">{blogPost && blogPost.category}</h6>
                <h1 className="my-5 bigtext">{blogPost && blogPost.title}</h1>
                <br />
                <br />
                <p className="card-content">{blogPost &&
			blogPost.content.split("\n").map(function(item) {
				return (
					<span key={++keygen}>
						{item}
						<br />
					</span>
				)
			})}
		</p>
            </div>

            <Footer />
        </div>
    )
}

export default BlogPost
