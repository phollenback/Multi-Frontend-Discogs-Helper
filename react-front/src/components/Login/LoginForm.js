import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../AuthContext';
import '../../styles/LoginForm.css';

const LoginForm = () => {
    const { register, handleSubmit } = useForm();
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const [error, setError] = useState('');  // State to store the error message

    const submitForm = async (data) => {
        const response = await login(data);

        if(response) {
            console.log('signed in.');
            navigate('/home');
        } else {
            setError('Invalid credentials. Please try again.');  // Show error message
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(submitForm)} className="login-form">
                <div className="img">
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Discogs_logo_black.svg/220px-Discogs_logo_black.svg.png' alt='Discogs Logo' />
                </div>
                <div className="form-group">
                    <div className="col-auto">
                        <label htmlFor="email" className="col-form-label">Email</label>
                    </div>
                    <div className="col-auto">
                        <input
                            type="email"
                            className="form-input"
                            {...register('email')}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-auto">
                        <label htmlFor="password" className="col-form-label">Password</label>
                    </div>
                    <div className="col-auto">
                        <input
                            type="password"
                            className="form-input"
                            {...register('password')}
                            required
                        />
                    </div>
                    <div className="col-auto">
                        <span id="passwordHelpInline" className="form-text">
                            Must be 8-20 characters long.
                        </span>
                    </div>
                    <span>Just Browsing? Search discogs <Link to='/search'>here</Link> </span>
                </div>
                {/* Display error message if it exists */}
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="btn btn-primary col-2">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;