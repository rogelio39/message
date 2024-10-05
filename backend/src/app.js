import 'dotenv/config';
import express from 'express';

import cors from 'cors';




// Configurar CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

const app = express();


app.use(express.json());

// Usar CORS
app.use(cors(corsOptions));

// Endpoint de prueba
app.get('/prueba', (req, res) => res.json({ ok: "ok" }));

app.post('/api/check-transcription', (req, res) => {
    const { transcription } = req.body;

    console.log("transcriptin back", transcription)
    if (!transcription) {
        return res.status(400).json({ message: 'Transcripción faltante' });
    }

    // Aquí puedes comparar la transcripción con el juramento almacenado
    const juramentoAlmacenado = "Always.";
    const coincidencia = transcription.trim().toLowerCase() === juramentoAlmacenado.trim().toLowerCase();

    res.json({ coincidencia });
});



// Inicializar el servidor
app.listen(5000, () => console.log('Servidor escuchando en puerto 5000'));


















// import 'dotenv/config';
// import express from 'express';
// import multer from 'multer';
// import { SpeechClient } from '@google-cloud/speech';
// import fs from 'fs/promises'; // Cambia a fs/promises
// import cors from 'cors';
// import { GoogleAuth } from 'google-auth-library';
// import { exec } from 'child_process';
// import path from 'path';
// import ffmpegPath from 'ffmpeg-static';

// // Configurar CORS
// const corsOptions = {
//     origin: process.env.LOCAL_URL,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
// };

// const app = express();
// const upload = multer({
//     dest: 'uploads/',
//     fileFilter: (req, file, cb) => {
//         const filetypes = /wav|mp3|ogg|flac|aac|webm/;
//         const isValid = filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase());
//         cb(isValid ? null : new Error('Error: Tipo de archivo no permitido'));
//     }
// });

// const auth = new GoogleAuth({
//     credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
//     scopes: 'https://www.googleapis.com/auth/cloud-platform',
// });

// const client = new SpeechClient({ auth });

// // Usar CORS
// app.use(cors(corsOptions));

// // Endpoint de prueba
// app.get('/prueba', (req, res) => res.json({ ok: "ok" }));

// // Endpoint para subir el audio
// app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
//     const audioFilePath = req.file.path;

//     try {
//         const wavFilePath = await convertToWav(audioFilePath);
//         const audioBuffer = await fs.readFile(wavFilePath);
//         const transcription = await recognizeSpeech(audioBuffer);

//         const juramentoTexto = 'prueba de juramento';
//         const coincidencia = transcription.trim() === juramentoTexto.trim();

//         res.json({ transcription, coincidencia });
//     } catch (error) {
//         console.error("Error procesando el audio:", error);
//         res.status(500).json({ error: "Error al procesar el audio" });
//     } finally {
//         try {
//             await fs.unlink(audioFilePath);
//             await fs.unlink(wavFilePath);
//         } catch (err) {
//             console.error("Error al eliminar archivos temporales:", err);
//         }
//     }
// });

// // Función para convertir el archivo a WAV
// const convertToWav = (inputFilePath) => {
//     return new Promise((resolve, reject) => {
//         const outputFilePath = path.join(path.dirname(inputFilePath), `${path.basename(inputFilePath, path.extname(inputFilePath))}.wav`);
//         const command = `"${ffmpegPath}" -i "${inputFilePath}" -acodec pcm_s16le -ar 16000 "${outputFilePath}"`;

//         exec(command, (error, stdout, stderr) => {
//             if (error) return reject(`Error durante la conversión: ${error.message}`);
//             if (stderr) console.error(`FFmpeg stderr: ${stderr}`);
//             console.log(`Conversión exitosa: ${outputFilePath}`);
//             resolve(outputFilePath);
//         });
//     });
// };

// // Función para transcribir el audio
// const recognizeSpeech = async (audioBuffer) => {
//     const audio = { content: audioBuffer.toString('base64') };
//     const config = { encoding: 'LINEAR16', sampleRateHertz: 16000, languageCode: 'es-ES' };
//     const request = { audio, config };

//     try {
//         const [response] = await client.recognize(request);
//         return response.results.map(result => result.alternatives[0].transcript).join('\n');
//     } catch (error) {
//         console.error("Error en la transcripción:", error);
//         throw error;
//     }
// };

// // Inicializar el servidor
// app.listen(5000, () => console.log('Servidor escuchando en puerto 5000'));
