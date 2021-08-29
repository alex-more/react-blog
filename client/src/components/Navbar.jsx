import React from 'react'

const Navbar = () => {
    return (
        <nav className="navbar navbar-dark text-light mb-4">
            <h2 className="mx-4">Someone</h2>
            <div className="text-end mx-4">
                <a href="/" className="link-info text-decoration-none m-2">Blog</a>
            </div>
        </nav>
    )
}

export default Navbar
