import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import config from '../../config';
const BaseUrl = config.BaseUrl

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ImagePicker({ onImageSelect, defaultImage}) {
  const defaultImages = 'https://via.placeholder.com/150'; // Default image when none is selected

  const [selectedImage, setSelectedImage] = useState(defaultImages);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetch(BaseUrl + '/images')
      .then(response => response.json())
      .then(data => {
       
          setImages(data.data);
         
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (defaultImage){
      setSelectedImage(defaultImage);
      
    }
    console.log('images loaded', defaultImage);
  }, [defaultImage]);

  const handleImageSelect = (image) => {
    console.log('Select image', image)
    setSelectedImage(image.URL);
    handleClose();
    onImageSelect(image.URL); // Pass the URL to the parent component
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <img 
        src={selectedImage} 
        alt="Selected" 
        style={{ width: 150, cursor: 'pointer' }} 
        onClick={handleOpen} 
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Select an Image
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell align="left">Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {images.map((image) => (
                  <TableRow 
                    key={image.ID} 
                    onClick={() => handleImageSelect(image)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell component="th" scope="row">
                     
                    <img src={BaseUrl+ image.URL} alt={image.FileName} style={{ width: 50 }} />
                    
                    </TableCell>
                    <TableCell align="left">{image.FileName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button onClick={handleClose} style={{ marginTop: '16px' }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ImagePicker;
