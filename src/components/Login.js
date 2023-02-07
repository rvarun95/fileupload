import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../utils/constants';
// import { propTypes } from 'react-bootstrap/esm/Image';

const Login = (props) => {
    const [state, setState] = useState({
        userName: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const { userName, password } = state;

            if(userName.trim() !== '' && password.trim() !== '') {
                // const formData = new FormData();
                // formData.append('userName', userName);
                // formData.append('password', password);
                const payload = {
                    userName,
                    password
                }

                setErrorMessage('');
                await axios.post(`${API_URL}/login`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                props.history.push('/home');
            } else {
                setErrorMessage('Please enter all the field values.');
            }
        } catch (error) {
            error.response && setErrorMessage(error.response.data);
        }
    }

    return (
        <React.Fragment>
            <div data-testid="content">
                <div className="header" data-testid="header">
                    <h1>Login</h1>
                </div>
                <Form className='login-form' onSubmit={handleLogin} data-testid="login-form">
                    {errorMessage && <p className="errorMsg">{errorMessage}</p>}
                    <Row>
                        <Col>
                            <Form.Group controlId='=userName'>
                                <Form.Control 
                                    type='text'
                                    name='userName'
                                    value={state.userName || ''}
                                    placeholder='Enter userName'
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId='=password'>
                                <Form.Control 
                                    type='password'
                                    name='password'
                                    value={state.password || ''}
                                    placeholder='Enter password'
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit">Login</Button>
                </Form>
            </div>
        </React.Fragment>
    )
}

export default Login;