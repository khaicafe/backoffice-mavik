import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
  
  function UploadComponent() {
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const handleFileChange = (event) => {
      setFiles(event.target.files);
    };
  
    const fetchImages = () => {
      setLoading(true);
      fetch('http://localhost:8080/images')
        .then(response => response.json())
        .then(data => {
          setImages(data.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching images:', error);
          setLoading(false);
        });
    };
  
    const handleUpload = async () => {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
  
      try {
        const response = await fetch('http://localhost:8080/api/uploads', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        console.log('Upload result:', result);
  
        // Re-fetch the images after a successful upload
        fetchImages();
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    };
  
    useEffect(() => {
      fetchImages();
    }, []);
  
    if (loading) {
      return <CircularProgress />;
    }
  
    const handleImageSelect = (url) => {
      console.log('Selected URL:', url);
    };
  
    return (
      <div>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <TableContainer component={Paper} sx={{ marginTop: 5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell align="left">Image</TableCell>
                <TableCell align="left">URL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.ID}>
                  <TableCell component="th" scope="row">
                    {image.ID}
                  </TableCell>
                  <TableCell>{image.FileName}</TableCell>
                  <TableCell align="left">
                    <img src={image.URL} alt={image.FileName} style={{ width: 100 }} />
                  </TableCell>
                  <TableCell align="left">
                    <a href={image.URL} target="_blank" rel="noopener noreferrer">
                      {image.URL}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <ImagePicker onImageSelect={handleImageSelect} /> */}
      </div>
    );
  }
  
  export default UploadComponent;
  