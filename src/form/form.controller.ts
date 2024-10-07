import { Controller, Post, Body } from '@nestjs/common';
import { createHash, randomBytes, createCipheriv, createDecipheriv, generateKeyPairSync, publicEncrypt, privateDecrypt } from 'crypto';

// Clave y vector de inicialización (IV) para el cifrado
const algorithm = 'aes-256-cbc';
const key = randomBytes(32); // Genera una clave aleatoria de 256 bits
const iv = randomBytes(16);   // Genera un vector de inicialización

// Genera un par de claves RSA (esto se debe hacer una vez y guardar las claves)
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

@Controller('nestjs-endpoint')
export class FormController {
    @Post()
    handleFormSubmission(@Body() body: any) {
        // Aplica AES al DNI
        const encryptedDNI = this.encrypt(body.dni);

        // Aplica MD5 a la contraseña
        const hashedPassword = createHash('md5').update(body.contrasena).digest('hex');

        // Aplica RSA a la tarjeta de crédito
        const encryptedCard = this.encryptCard(body.tarjeta);

        console.log(body); // Para verificar los datos recibidos
        return {
            message: 'Datos recibidos con éxito',
            data: {
                dni: encryptedDNI, // Muestra el DNI cifrado
                contrasena: hashedPassword, // Muestra la contraseña hasheada
                tarjeta: encryptedCard, // Muestra la tarjeta cifrada
            },
        };
    }

    encrypt(text: string): string {
        const cipher = createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`; // Devuelve el IV junto con el texto cifrado
    }

    encryptCard(card: string): string {
        const buffer = Buffer.from(card, 'utf8');
        const encrypted = publicEncrypt(publicKey, buffer);
        return encrypted.toString('base64'); // Devuelve la tarjeta cifrada en base64
    }

}

