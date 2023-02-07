import React, { useRef, useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { API_URL } from '../utils/constants';
// import { propTypes } from 'react-bootstrap/esm/Image';
import Header from '../components/Header';

const App = (props) => {
    const [file, setFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState('');
    // const [fileDetails, setFileDetails] = useState({});
    const [state, setState] = useState({
        title: '',
        description: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);
    let pathName = window.location.pathname;
    const [fileId, setFileId] = useState(pathName.split('/')?.length > 2 ? pathName.split('/')?.[2] : '');
    const dropRef = useRef();
    // const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    useEffect(() => {
        const getFileById = async (id) => {
          try {
            const { data } = await axios.get(`${API_URL}/getFileById/${id}`);
            setErrorMessage('');
            // setFileDetails(data);
            console.log('file: ', data)
            setState({
                ...state,
                title: data?.title,
                description: data?.description,
            })
            
            setFile({
                mimetype: data?.file_mimetype,
                path: data?.file_path
            })
          } catch (error) {
            error.response && setErrorMessage(error.response.data);
          }
        };
        
        if(fileId) {
            getFileById(fileId);
        }
      }, [fileId]);


    const handleInputChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        try {
            const { title, description } = state;

            if(title.trim() !== '' && description.trim() !== '') {
                if(file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('title', title);
                    formData.append('description', description);

                    setErrorMessage('');
                    if(fileId) {
                        await axios.put(`${API_URL}/update/${fileId}`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    } else {
                        await axios.post(`${API_URL}/upload`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    }
                    props.history.push('/list');
                } else {
                    setErrorMessage('Please select a file');
                }
            } else {
                setErrorMessage('Please enter all the field values.');
            }
        } catch (error) {
            error.response && setErrorMessage(error.response.data);
        }
    }

    const onDrop = (files) => {
        const [uploadedFile] = files;
        console.log("*********", uploadedFile);
        setFile(uploadedFile);

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewSrc(fileReader.result);
        }
        fileReader.readAsDataURL(uploadedFile);
        setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
        dropRef.current.style.border = '2px dashed #e9ebeb';
    }

    const updateBorder = (dragState) => {
        if(dragState === 'over') {
            dropRef.current.style.border = '2px solid #000';
        } else if(dragState === 'leave') {
            dropRef.current.style.border = '2px dashed #e9ebeb';
        }
    }

    return (
        <React.Fragment>
            <Header />
            <Form className='search-form' onSubmit={handleOnSubmit}>
                {errorMessage && <p className="errorMsg">{errorMessage}</p>}
                <Row>
                    <Col>
                        <Form.Group controlId='=title'>
                            <Form.Control 
                                type='text'
                                name='title'
                                value={state.title || ''}
                                placeholder='Enter title'
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group controlId='=description'>
                            <Form.Control 
                                type='text'
                                name='description'
                                value={state.description || ''}
                                placeholder='Enter description'
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <div className='upload-section'>
                    <Dropzone 
                            onDrop={onDrop} 
                            onDragEnter={() => updateBorder('over')}
                            onDragLeave={() => updateBorder('leave')}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps({ className: 'drop-zone' })} ref={dropRef}>
                                <input {...getInputProps()} />
                                <p>Drag and drop a file or click to select a file from computer</p>
                                {file && (
                                    <div>
                                        <strong>Selected file: </strong> {file.name}
                                    </div>
                                )}
                            </div>
                        )}
                    </Dropzone>
                    {previewSrc ? (
                        isPreviewAvailable ? (
                            <div className='image-preview'>
                                <img className='preview-image' src={previewSrc} alt='preview' />
                            </div>
                        ) : (
                            <div className='preview-message'>
                                <p>No preview available...</p>
                            </div>
                        )
                    ) : (
                        <div className='preview-message'>
                            <p>Image preview is not available</p>
                        </div>
                    )}
                </div>
                <Button variant="primary" type="submit">{fileId ? 'Update' : 'Submit'}</Button>
            </Form>
        </React.Fragment>
    )
}

export default App;