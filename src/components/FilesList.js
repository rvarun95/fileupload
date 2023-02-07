import React, { useState, useEffect } from 'react';
import download from 'downloadjs';
import axios from 'axios';
import { API_URL } from '../utils/constants';
import Header from './Header';
import {createBrowserHistory as createHistory} from 'history';

const FilesList = (props) => {
  const [filesList, setFilesList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const getFilesList = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/getAllFiles`);
        setErrorMsg('');
        setFilesList(data);
      } catch (error) {
        error.response && setErrorMsg(error.response.data);
      }
    };

    getFilesList();
  }, []);

  const downloadFile = async (id, path, mimetype) => {
    try {
      const result = await axios.get(`${API_URL}/download/${id}`, {
        responseType: 'blob'
      });
      const split = path.split('/');
      const filename = split[split.length - 1];
      setErrorMsg('');
      return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading file. Try again later');
      }
    }
  };

  const updateFile = async (id) => {
    props.history.push(`/home/${id}`);
  };

  const deleteFile = async (id) => {
    try {
      // const result = await axios.get(`${API_URL}/delete/${id}`, {
      //   responseType: 'blob'
      // });
      // const split = path.split('/');
      // const filename = split[split.length - 1];
      
      const res = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
            'Content-Type': 'application/json'
        }
      });
      if(res.data.success){
        setErrorMsg(res.data.msg);
      }

      setTimeout(() => {
          setErrorMsg('');
          const history = createHistory();
          history.go(0);
      }, 2000);
      // return download(result.data, filename, mimetype);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMsg('Error while downloading file. Try again later');
      }
    }
  };

  return (
    <React.Fragment>
      <Header />
    <div className="files-container">
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <table className="files-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Download</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filesList.length > 0 ? (
            filesList.map(
              ({ _id, title, description, file_path, file_mimetype }) => (
                <tr key={_id}>
                  <td className="file-title">{title}</td>
                  <td className="file-description">{description}</td>
                  <td>
                    <a
                      href="#/"
                      onClick={() =>
                        updateFile(_id)
                      }
                    >
                      Edit
                    </a>
                  </td>
                  <td>
                    <a
                      href="#/"
                      onClick={() =>
                        downloadFile(_id, file_path, file_mimetype)
                      }
                    >
                      Download
                    </a>
                  </td>
                  <td>
                    <a
                      href="#/"
                      onClick={() =>
                        deleteFile(_id, file_path, file_mimetype)
                      }
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={3} style={{ fontWeight: '300' }}>
                No files found. Please add some.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </React.Fragment>
  );
};

export default FilesList;