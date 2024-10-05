import { useState } from 'react';
import './audiorecorder.css';

const URLWEB = import.meta.env.VITE_REACT_APP_MODE === 'DEV'
  ? import.meta.env.VITE_REACT_APP_LOCAL_URL
  : import.meta.env.VITE_REACT_APP_WEB_URL;



const AudioRecorder = () => {
  const [transcription, setTranscription] = useState('');
  const [coincidencia, setCoincidencia] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [mostrarPoema, setMostrarPoema] = useState(''); // Texto mostrado progresivamente
  const [mostrarContenedor, setMostrarContenedor] = useState(false); // Estado para controlar la visibilidad del contenedor
  const [messageError, setMessageError] = useState()
  const lineasPoema = [
    "A veces, cuando me miras,",
    "siento que el mundo se detiene.",
    "Hay algo en tus ojos que me atrapa,",
    "una luz que solo tú enciendes.",
    "",
    "Tus palabras, esos pequeños halagos,",
    "me hacen sentir especial y querido.",
    "Es raro ponerlo en palabras,",
    "pero me haces sentir muy afortunado.",
    "",
    "Me encanta que me veas así,",
    "como alguien lindo y valioso.",
    "Cada beso tuyo me llena de alegría,",
    "y me hace querer más de este hermoso camino.",
    "",
    "Quiero compartir contigo todos mis sueños,",
    "crear un futuro a tu lado,",
    "ser la única persona en tu vida,",
    "hasta el día en que ya no esté a tu lado.",
    "",
    "Así que aquí estoy, prometiendo,",
    "ser tu compañero en cada aventura.",
    "Contigo, cada día es un regalo,",
    "y te amo más de lo que puedo decir."
  ].join(' '); // Concatenamos todas las líneas

  let recognition;
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (speechRecognition) {
    recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US"; // Asegúrate de que sea igual en ambos dispositivos
    recognition.interimResults = false;
  } else {
    alert('La API de SpeechRecognition no está disponible en este navegador.');
  }

  const startRecording = async () => {
    if (isRecording) return;
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
    recognition.stop();
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


    // Reiniciar el mensaje de error antes de enviar
    setMessageError(null);


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

      if (result.coincidencia) {
        setMostrarContenedor(true); // Hacemos visible el contenedor
        mostrarPoemaProgresivamente(lineasPoema); // Mostramos el poema progresivamente
      } else if (result.coincidencia == false) {
        setMessageError('Vuelve a intentarlo, no adivinaste')
      }
    } catch (error) {
      console.error('Error al enviar la transcripción:', error);
      setMessageError('Hubo un error al procesar la transcripción.');
    }
  };

  const mostrarPoemaProgresivamente = (poema) => {
    let i = 0;
    const intervalo = setInterval(() => {
      setMostrarPoema((prev) => prev + poema[i]);
      i++;
      if (i >= poema.length) {
        clearInterval(intervalo);
      }
    }, 100); // Ajustar velocidad de aparición de las letras
  };

  return (
    <div className='audio-recorder'>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      <button onClick={sendVoice} disabled={!transcription}>ENVIAR AUDIO</button>
      {transcription && (
        <div>
          <h3>Transcripción:</h3>
          <p>{transcription}</p>
          {coincidencia ? (
            <div className={`poema-container ${mostrarContenedor ? 'visible' : ''}`}>
              <p>Adivinaste! Ahora podrás ver mi poema oculto:</p>
              <p>{mostrarPoema}</p>
            </div>
          ) : <div>{messageError}</div>}
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
