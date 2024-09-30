import 'dotenv/config'; // Cargar las variables del archivo .env
import express from 'express';
import multer from 'multer';
import { SpeechClient } from '@google-cloud/speech';
import fs from 'fs';
import cors from 'cors'
import 'dotenv/config'
// Configurar CORS para permitir solo la dirección específica
const corsOptions = {
    origin: process.env.LOCAL_URL, // Especifica el origen permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Si necesitas habilitar credenciales
};

// Usar cors con la configuración especificada
app.use(cors(corsOptions));

const app = express();
const upload = multer({ dest: 'uploads/' }); // Almacena los archivos temporalmente en 'uploads'
const client = new SpeechClient(); // Este cliente usará la credencial

app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
    const audioFilePath = req.file.path;

    console.log("audiofile", audioFilePath)

    // Leer el archivo de audio
    const audioBuffer = fs.readFileSync(audioFilePath);

    console.log("audiobuffer", audioBuffer)

    // Llamar a la función de Google Cloud Speech para transcribir
    const transcription = await recognizeSpeech(audioBuffer);

    console.log("transcripcion", transcription)

    // Comparar la transcripción con el texto almacenado
    const juramentoTexto = 'prueba de juramento'; // Cambia esto por el texto real del juramento
    const coincidencia = transcription.trim() === juramentoTexto.trim();

    console.log("coincidencia", coincidencia)

    // Responder al frontend con la transcripción y la coincidencia
    res.json({ transcription, coincidencia });

    // Eliminar el archivo de audio temporal después de procesar
    fs.unlinkSync(audioFilePath);
});

// Función para transcribir el audio
const recognizeSpeech = async (audioBuffer) => {
    const audio = {
        content: audioBuffer.toString('base64'),
    };
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'es-ES', // Ajusta según el idioma
    };
    const request = { audio, config };

    const [response] = await client.recognize(request);
    return response.results.map(result => result.alternatives[0].transcript).join('\n');
};

app.listen(5000, () => {
    console.log('Servidor escuchando en puerto 5000');
});
