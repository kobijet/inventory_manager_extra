import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3030/login', {
            username: username,
            password: password
        })
        .then((response) =>{
            // Handle success
            if (response.status === 200) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("refreshToken", response.data.refreshToken);
                navigate("home");
            }
        })
        .catch((error) => {
            // Handle errors
            console.log(error.response.data.error);
            setErrorMessage(error.response.data.error);
        });
    }

    return (
        <div id="login-page">
            <h1>Inventory Manager Extra</h1>
            <p>Login below to get started!</p>
            <p>{errorMessage}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input id="username" type="text" maxLength={20} placholder="Username" onChange={(element) => setUsername(element.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="text" maxLength={20} placholder="Password" onChange={(element) => setPassword(element.target.value)}/>
                </div>
                <input type="submit" />
            </form>
        </div>
    );
}

export default Login;
