import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/connect.png';
import { Disabled } from '../disabled/Disabled';
import axios from 'axios';
import { AuthContext } from '../../context/Auth';
import { url } from '../../baseUrl';
import googleicon from './google.png';

export const LoginCard = () => {
    const context = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state

    const login = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.post(`${url}/auth/login`, {
                text: username,
                password
            });
            if (response && response.data) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem("access_token", response.data.access_token);
                localStorage.setItem("refresh_token", response.data.refresh_token);
                context.setAuth(response.data.user);
                window.location.reload();
            } else {
                context.throwErr('Unexpected response format from server.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
            context.throwErr(errorMessage);
            console.log(errorMessage);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="right-logins" style={{ backgroundColor: "#3C006B" }}>
            <div className="login-boxs" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <img style={{ width: '15%', padding: "20px" }} src={logo} alt="Logo" />
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='border'
                    style={{ marginTop: '10px', width: '75%', height: '37px', fontSize: '13px', outline: 'none', borderRadius: '5px', backgroundColor: '#fafafa' }}
                    type="text"
                    placeholder='Username or email address'
                    disabled={loading} // Disable during loading
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border'
                    style={{ marginTop: '15px', width: '75%', height: '37px', fontSize: '13px', backgroundColor: '#fafafa', outline: 'none', borderRadius: '5px' }}
                    type="password"
                    placeholder='Password'
                    disabled={loading} // Disable during loading
                />
                {
                    username !== '' && password !== ''
                        ? <button
                            onClick={login}
                            style={{ border: 'none', outline: 'none', background: loading ? '#ccc' : '#790496', padding: '7px 9px', borderRadius: '5px', color: 'white', marginTop: '18px', fontSize: '13px', width: '75%', fontWeight: 'bold' }}
                            disabled={loading} // Disable button during loading
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        : <Disabled text={"Log in"} />
                }
                <div className="line" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '38px' }}>
                    <div style={{ backgroundColor: '#cac7c7', height: '1px', width: '120px' }}></div>
                    <span style={{ margin: '0 8px', color: 'white', fontSize: '11.5px', fontWeight: 'bold' }}>OR</span>
                    <div style={{ backgroundColor: '#cac7c7', height: '1px', width: '120px' }}></div>
                </div>
                <Link to="/forgot" style={{ marginTop: '25px', color: 'white', fontSize: '13.15px', textDecoration: 'none' }}>Forgotten your password?</Link>
            </div>
            <div className="signup-action-box" style={{ textAlign: 'center' }}>
                <p style={{ color: 'white', fontSize: '14px' }}>
                    Don't have an account?
                    <Link to="/signup" style={{ color: '#2196f3', fontWeight: 'bold', marginLeft: '6px', textDecoration: 'none', fontSize: '13.25px' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};
