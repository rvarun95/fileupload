import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../utils/constants';

const Register = (props) => {
    const [state, setState] = useState({
        userName: '',
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleRegister = async (event) => {
        event.preventDefault();
        console.log("state: ", state);
        try {
            const { userName, email, password } = state;

            if(userName.trim() !== '' && email.trim() !== '' && password.trim() !== '') {
                // const formData = new FormData();
                // formData.append('password', password);
                // formData.append('userName', userName);
                // formData.append('email', email);

                const payload = {
                    userName,
                    email,
                    password
                }

                setErrorMessage('');
                console.log("formData: ", payload)
                await axios.post(`${API_URL}/register`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                props.history.push('/login');
            } else {
                setErrorMessage('Please enter all the field values.');
            }
        } catch (error) {
            console.log("error:", error);
            setErrorMessage(error?.errors?.message);
        }
    }

    return (
        <React.Fragment>
            <div className="header">
                <h1>Register</h1>
            </div>
            <Form className='search-form' onSubmit={handleRegister}>
                {errorMessage && <p className="errorMsg">{errorMessage}</p>}
                <Row>
                    <Col>
                        <Form.Group controlId='=userName'>
                            <Form.Control 
                                type='text'
                                name='userName'
                                value={state.userName || ''}
                                placeholder='Enter Username'
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='=email'>
                            <Form.Control 
                                type='text'
                                name='email'
                                value={state.email || ''}
                                placeholder='Enter Email'
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='=password'>
                            <Form.Control 
                                type='text'
                                name='password'
                                value={state.password || ''}
                                placeholder='Enter Password'
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                {/* <Row>
                    <Col>
                        <Form.Group controlId='=email'>
                            <Form.Control 
                                type='text'
                                name='email'
                                value={state.email || ''}
                                placeholder='Enter Email'
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row> */}
                <Button variant="primary" type="submit">Register</Button>
            </Form>
        </React.Fragment>
    )
}

export default Register;