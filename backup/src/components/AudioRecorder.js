import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React, { useRef, useState } from 'react';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      setError("No audio input device found.");
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      <div>
        {isRecording ? (
          <Button onClick={handleStopRecording}>Stop Recording</Button>
        ) : (
          <Button onClick={handleStartRecording}>Start Recording</Button>
        )}
      </div>
      {audioURL && (
        <div>
          <h2>Recorded Audio:</h2>
          <audio controls src={audioURL} />
        </div>
      )}
    </div>
  );
};

const InsertMediaPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [fileType, setFileType] = useState('');

  const handleOpenDialog = () => {
    if (fileType) {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFileType('');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Insert Media
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="select-insert-method-label">Select Insert Method</InputLabel>
        <Select
          label="Select Insert Method"
          labelId="select-insert-method-label"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
        >
          <MenuItem value="image">Insert image</MenuItem>
          <MenuItem value="video">Insert QuickTime or video</MenuItem>
          <MenuItem value="audio">Insert sound or voice file</MenuItem>
          <MenuItem value="file">Insert File</MenuItem>
          <MenuItem value="recorder">Audio Recorder</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        disabled={!fileType}
      >
        Insert
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Insert {fileType}</DialogTitle>
        <DialogContent>
          {fileType === 'recorder' ? (
            <AudioRecorder />
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label={`Choose a ${fileType} file`}
              type="file"
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                accept:
                  fileType === 'image'
                    ? 'image/*'
                    : fileType === 'video'
                    ? 'video/*'
                    : fileType === 'audio'
                    ? 'audio/*'
                    : '*/*'
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseDialog} color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InsertMediaPage;
