const serverless = require('serverless-http');
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto'); // Para cifrado y hashing

const app = express();
const PORT = 3000;

// Configurar CORS
app.use(cors({
    origin: 'https://trinidadfrancisco01.github.io', // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Configurar body-parser para manejar solicitudes JSON y URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Claves y configuración para cifrado AES y RSA
const AES_SECRET_KEY = Buffer.from('12345678901234567890123456789012'); // 32 bytes para AES-256
const AES_IV = Buffer.from('1234567890123456'); // 16 bytes para AES

const { generateKeyPairSync } = require('crypto');
// Generar claves pública y privada
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // Longitud del módulo en bits
});
// Función de cifrado
function encryptRSA(data) {
    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(data)
    );
    return encryptedData.toString('base64'); // Retornar como base64
}

// Función de descifrado
function decryptRSA(encryptedData) {
    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(encryptedData, 'base64') // Convertir de base64 a Buffer
    );
    return decryptedData.toString('utf8');
}


// Función para cifrar usando AES
function encryptAES(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', AES_SECRET_KEY, AES_IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Función para descifrar usando AES
function decryptAES(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', AES_SECRET_KEY, AES_IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Función para hashear usando MD5
function hashPassword(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}




// Endpoint para manejar el formulario de Express (Cifrado)
app.post('/express-endpoint', async (req, res) => {
    const { nombre, email, telefono, direccion, fecha_nacimiento, dni, contrasena, tarjeta_credito } = req.body;

    // Log de los datos recibidos
    console.log('Datos recibidos:', req.body);

    // Validación básica
    if (!nombre || !email || !dni || !contrasena) {
        console.log('Solicitud inválida: Faltan campos requeridos.');
        return res.status(400).json({ mensaje: 'Faltan campos requeridos.' });
    }

    try {
        // Cifrar DNI usando AES
        const dniCifrado = encryptAES(dni);
        console.log('DNI Cifrado (AES):', dniCifrado);

        // Hashear Contraseña usando MD5
        const contrasenaHasheada = hashPassword(contrasena);
        console.log('Contraseña Hasheada (MD5):', contrasenaHasheada);


         // Cifrar Tarjeta de Crédito usando RSA
         const tarjetaCreditoCifrada = encryptRSA(tarjeta_credito);
         console.log('Tarjeta de Crédito Cifrada (RSA):', tarjetaCreditoCifrada);



        // Respuesta con datos procesados
        res.json({
            datos: [
                { campo: 'Nombre', valor: nombre },
                { campo: 'Email', valor: email },
                { campo: 'Teléfono', valor: telefono },
                { campo: 'Dirección', valor: direccion },
                { campo: 'Fecha de Nacimiento', valor: fecha_nacimiento },
                { campo: 'DNI Cifrado', valor: dniCifrado },
                { campo: 'Contraseña Hasheada', valor: contrasenaHasheada },
                { campo: 'Tarjeta de Crédito Cifrada', valor: tarjetaCreditoCifrada }
            ]
        });
    } catch (error) {
        console.error('Error en /express-endpoint:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
});

// Endpoint para manejar el descifrado
app.post('/decrypt-endpoint', async (req, res) => {
    const { dni1, password1, creditCard1, email } = req.body;

    // Log de los datos recibidos
    console.log('Datos de descifrado recibidos:', req.body);

    // Validación básica
    if (!dni1 || !password1 || !creditCard1 || !email) {
        console.log('Solicitud inválida: Faltan campos requeridos.');
        return res.status(400).json({ mensaje: 'Faltan campos requeridos.' });
    }

    try {
        
        const dniDescifrado = decryptAES(dni1);
        console.log('DNI Descifrado (AES):', dniDescifrado);

    
         

        // Respuesta con datos descifrados y validación de contraseña
        res.json({
            datos: [
                { campo: 'DNI Descifrado', valor: dniDescifrado },
                { campo: 'Contraseña', valor: `${password1} (no es posible descifrar un MD5)` }, // Reemplaza con el hash almacenado
                { campo: 'Número de Tarjeta de Crédito Descifrado', valor: creditCard1 }
            ]
        });
    } catch (error) {
        const tarjetaCreditoDescifrada = decryptRSA(creditCard1);
        console.log('Tarjeta de Crédito Descifrada (RSA):', tarjetaCreditoDescifrada);
        console.error('Error durante el descifrado:', error);
        res.status(500).json({ mensaje: 'Error al descifrar los datos.' });
    }
    
});

// Endpoint de prueba
app.get('/api', (req, res) => {
    res.send('Servidor Express está funcionando correctamente.');
});

// Manejar rutas desconocidas redirigiendo al frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
