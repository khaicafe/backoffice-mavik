import {
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { COLORS } from '../../theme/themeColor';

const BaseUrl = config.BaseUrl
  
  function UploadComponent() {
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: COLORS.BLUE,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '0px 5px',
      },
    }));
  
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
      // height: 20,
      
    }));

    const fetchImages = () => {
      setLoading(true);
      fetch(BaseUrl+ '/images')
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
  
    const handleFileChange = async (event) => {
      // setFiles(event.target.files);
      const selectedFiles = event.target.files;
      setFiles(selectedFiles);

      if (selectedFiles.length > 0) {
          await handleUpload(selectedFiles);
      }
    };

    const handleUpload = async (selectedFiles) => {
      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('files', selectedFiles[i]);
      }

      try {
          const response = await fetch(BaseUrl+'/api/uploads', {
              method: 'POST',
              body: formData,
          });
          const result = await response.json();
          console.log('Upload result:', result);

           // Gọi lại fetchImages để refresh danh sách hình ảnh
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
  
   
  
    return (
      <div>
        {/* <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button> */}

        <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }} // Ẩn input file
            id="file-upload"
        />
        <label htmlFor="file-upload">
            <Button
                variant="contained"
                component="span"
                // onClick={handleUpload}
                sx={{
                    backgroundColor: '#1e88e5', // Màu xanh giống trong hình
                    color: '#fff', // Màu chữ trắng
                    padding: '10px 20px',
                    textTransform: 'none', // Giữ nguyên chữ thường
                    borderRadius: '4px', // Độ bo góc
                    '&:hover': {
                        backgroundColor: '#1565c0', // Màu xanh đậm hơn khi hover
                    },
                }}
            >
                Upload Images
            </Button>
        </label>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>File Name</StyledTableCell>
                <StyledTableCell align="left">Image</StyledTableCell>
                <StyledTableCell align="left">URL</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {images.map((image) => (
                <StyledTableRow key={image.ID}>
                  <StyledTableCell component="th" scope="row">
                    {image.ID}
                  </StyledTableCell>
                  <StyledTableCell>{image.FileName}</StyledTableCell>
                  <StyledTableCell align="left">
                    <img src={BaseUrl + image.URL} alt={image.FileName} style={{ width: 100 }} />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <a href={image.URL} target="_blank" rel="noopener noreferrer">
                      {image.URL}
                    </a>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <ImagePicker onImageSelect={handleImageSelect} /> */}
      </div>
    );
  }
  
  export default UploadComponent;
  