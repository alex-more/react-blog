import React, { useState } from 'react'
import { Link , useHistory} from 'react-router-dom'
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import LoginAPI from "../apis/LoginAPI"

const Login = () => {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [valid, setValid] = useState(true);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await LoginAPI.post("/", {
                username,
                password
            });
            
            if(response) {
                window.localStorage.setItem('token', response.data.accessToken)
                
                if(window.localStorage.getItem('token') === 'invalid_token') {
                    setValid(false)
                } else {
                    history.push("/adminblog");
                }
            }
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className="d-flex flex-column pageContainer">
            
            <Navbar />

            <div className="container-fluid login">
                <br />
                <br />
                <br />

                <h2 className="text-center m-5">Admin Login</h2>

                <h6 className="text-center m-3 text-danger" style={{ display: valid? "none" : "inline" }}>
                    Sorry, that login information was invalid. Please try again.
                </h6>

                <form className="m-2" action="">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            id="username"
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group my-2">
                    <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="form-control"
                        />
                    </div>
                    
                    <button onClick={ handleLogin } type="submit" className="btn btn-primary my-3">
                        LOG IN
                    </button>
                    
                    <Link to="/">
                        <button className="btn btn-secondary mx-2">
                            CANCEL
                        </button>
                    </Link>
                </form>
            </div>
            
            <Footer />
        </div>
    )
}

export default Login
