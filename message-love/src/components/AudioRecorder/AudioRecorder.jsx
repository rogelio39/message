import { useState } from 'react';
import './audiorecorder.css'


const URL = import.meta.env.VITE_REACT_APP_MODE === 'DEV' ? import.meta.env.VITE_REACT_APP_LOCAL_URL : import.meta.env.VITE_REACT_APP_WEB_URL;
const AudioRecorder = () => {
  const [audioURL, setAudioURL] = useState('');
  const [recorder, setRecorder] = useState(null);
  const [blob, setBlob] = useState(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    newRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    newRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      // Aquí puedes enviar el audioBlob al backend para procesar

      // Aquí enviamos el audio al backend
      setBlob(audioBlob)

    };

    newRecorder.start();
    setRecorder(newRecorder);
  };

  const stopRecording = () => {
    recorder.stop();
  };



  const sendVoice = async () => {

    const formData = new FormData();
    formData.append('audio', blob);
    try {
      const response = await fetch(`${import.meta.VITE_REACT_APP_WEB_URL}api/upload-audio`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Transcripción:', result.transcription); // Transcripción recibida del backend
    } catch (error) {
      console.error('Error al enviar el audio:', error);
    }
  };

  return (
    <div className='audio-recorder'>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <audio src={audioURL} controls />
      <button onClick={sendVoice}>ENVIAR AUDIO</button>
    </div>
  );
};

export default AudioRecorder;
