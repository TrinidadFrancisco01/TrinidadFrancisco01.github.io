import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class FormDto {
    @IsNotEmpty()
    @IsString()
    dni: string;

    @IsNotEmpty()
    @IsString()
    contrasena: string;

    @IsNotEmpty()
    @IsNumber()
    tarjeta: number;
}
