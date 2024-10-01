import { useState, useEffect } from 'react';
import './audiorecorder.css';

const URLWEB = import.meta.env.VITE_REACT_APP_MODE === 'DEV'
  ? import.meta.env.VITE_REACT_APP_LOCAL_URL
  : import.meta.env.VITE_REACT_APP_WEB_URL;


const AudioRecorder = () => {
  const [transcription, setTranscription] = useState('');
  const [coincidencia, setCoincidencia] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [mostrarPoema, setMostrarPoema] = useState('')


  let recognition;
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (speechRecognition) {
    recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
  } else {
    alert('La API de SpeechRecognition no está disponible en este navegador.');
  }

  const startRecording = async () => {
    if (isRecording) return; // Evitar múltiples grabaciones simultáneas
    setIsRecording(true);

    try {
      recognition.start();
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
      alert('No se pudo acceder al micrófono. Verifica los permisos.');
      setIsRecording(false);

    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    recognition.stop(); // Usar stop en lugar de abort para finalizar correctamente
    setIsRecording(false);
  };

  recognition.onresult = (event) => {
    let newTranscript = '';
    for (let i = 0; i < event.results.length; i++) {
      newTranscript += event.results[i][0].transcript;
    }
    setTranscription(newTranscript.trim());
  };

  const sendVoice = async () => {
    if (!transcription) {
      console.error('No hay transcripción para enviar');
      return;
    }


    try {
      const response = await fetch(`${URLWEB}/api/check-transcription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transcription }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la transcripción');
      }

      const result = await response.json();
      setCoincidencia(result.coincidencia);
    } catch (error) {
      console.error('Error al enviar la transcripción:', error);
    }
  };


  useEffect(() => {
    if (coincidencia) {
      const poema = " A veces, cuando me miras, siento que el mundo se detiene, hay algo en tus ojos que me atrapa; tus palabras, esos pequeños halagos, me hacen sentir especial y querido, es raro ponerlo en palabras, pero me haces sentir muy afortunado; me encanta que me veas así, como alguien lindo y valioso, cada beso tuyo me llena de alegría y me hace querer más de este hermoso camino; quiero compartir contigo todos mis sueños, crear un futuro a tu lado, ser la única persona en tu vida, hasta el día en que ya no esté a tu lado, así que aquí estoy, prometiendo ser tu compañero en cada aventura, contigo, cada día es un regalo, y te amo más de lo que puedo decir."; // Cambia esto por el poema real
      let index = 0;
      const intervalId = setInterval(() => {
        setMostrarPoema((prev) => prev + poema.charAt(index));
        index++;
        if (index === poema.length) {
          clearInterval(intervalId);
        }
      }, 100); // Cambia el 100 por el tiempo que desees entre letras
      return () => clearInterval(intervalId);
    }
  }, [coincidencia]);


  return (
    <div className='audio-recorder'>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      <button onClick={sendVoice} disabled={!transcription}>ENVIAR AUDIO</button>
      {transcription && (
        <div>
          <h3>Transcripción:</h3>
          <p>{transcription}</p>
          {
            coincidencia &&
            <div>
              <p>Adivinaste! Ahora podras ver mi poema oculto:</p>
              <p className="typing-effect">{mostrarPoema}</p>
            </div> 
          }
          {
            !coincidencia && <p>No adivinaste, piensa mejor.</p>
          }
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;























// import { useState } from 'react';
// import './audiorecorder.css';

// const URLWEB = import.meta.env.VITE_REACT_APP_MODE === 'DEV'
//     ? import.meta.env.VITE_REACT_APP_LOCAL_URL
//     : import.meta.env.VITE_REACT_APP_WEB_URL;

// const AudioRecorder = () => {
//     const [audioURL, setAudioURL] = useState('');
//     const [recorder, setRecorder] = useState(null);
//     const [blob, setBlob] = useState(null);
//     const [transcription, setTranscription] = useState('');
//     const [coincidencia, setCoincidencia] = useState(false);

//     const startRecording = async () => {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const newRecorder = new MediaRecorder(stream);
//         const audioChunks = [];

//         newRecorder.ondataavailable = (event) => {
//             audioChunks.push(event.data);
//         };

//         newRecorder.onstop = () => {
//             const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//             const audioUrl = URL.createObjectURL(audioBlob);
//             setAudioURL(audioUrl);
//             setBlob(audioBlob); // Guardar el blob para enviar al backend
//         };

//         newRecorder.start();
//         setRecorder(newRecorder);
//     };

//     const stopRecording = () => {
//         recorder.stop();
//     };

//     const sendVoice = async () => {
//         if (!blob) {
//             console.error('No hay audio para enviar');
//             return;
//         }

//         const formData = new FormData();
//         formData.append('audio', blob, 'recording.webm'); // Nombre del archivo opcional

//         try {
//             const response = await fetch(`${URLWEB}/api/upload-audio`, {
//                 method: 'POST',
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error('Error al subir el audio');
//             }

//             const result = await response.json();
//             console.log('Transcripción:', result.transcription);
//             setTranscription(result.transcription);
//             setCoincidencia(result.coincidencia);
//         } catch (error) {
//             console.error('Error al enviar el audio:', error);
//         }
//     };

//     return (
//         <div className='audio-recorder'>
//             <button onClick={startRecording}>Start Recording</button>
//             <button onClick={stopRecording}>Stop Recording</button>
//             <audio src={audioURL} controls />
//             <button onClick={sendVoice}>ENVIAR AUDIO</button>
//             {transcription && (
//                 <div>
//                     <h3>Transcripción:</h3>
//                     <p>{transcription}</p>
//                     <p>Coincidencia: {coincidencia ? 'Sí' : 'No'}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AudioRecorder;
