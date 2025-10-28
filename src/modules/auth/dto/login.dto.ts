import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la connexion admin en DEV
 * En PROD, utiliser Supabase Auth
 */
export class LoginDto {
  @ApiProperty({
    example: 'admin@wlw.ma',
    description: 'Email de l\'administrateur',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: 'change_me',
    description: 'Mot de passe',
  })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}

/**
 * Réponse de connexion
 */
export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'usr_123',
    description: 'ID utilisateur',
  })
  userId: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Rôle utilisateur',
  })
  role: string;

  @ApiProperty({
    example: 'admin@wlw.ma',
    description: 'Email utilisateur',
  })
  email: string;
}

