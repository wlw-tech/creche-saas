import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour changer le mot de passe
 * Regex: Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
 */
export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Ancien mot de passe',
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  oldPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Nouveau mot de passe (min 8 chars, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial)',
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial (@$!%*?&)',
    },
  )
  newPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Confirmation du nouveau mot de passe',
  })
  @IsString()
  confirmPassword: string;
}

/**
 * Réponse de changement de mot de passe
 */
export class ChangePasswordResponseDto {
  @ApiProperty({
    example: true,
    description: 'Succès du changement',
  })
  success: boolean;

  @ApiProperty({
    example: 'Mot de passe changé avec succès',
    description: 'Message de confirmation',
  })
  message: string;
}

