import React, {useState, createContext} from "react";

export const BlogContext = createContext();

export const BlogContextProvider = props => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedBlogPost, setSelectedBlogPost] = useState(null);

    const addBlogPosts = (blogPost) => {
        setBlogPosts([...blogPosts, blogPost]);
    }

    return (
        <BlogContext.Provider value={{
            blogPosts, 
            setBlogPosts, 
            addBlogPosts, 
            selectedBlogPost,
            setSelectedBlogPost
        }}>
            {props.children}
        </BlogContext.Provider>
    )
}