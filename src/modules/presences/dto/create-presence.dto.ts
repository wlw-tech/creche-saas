import { IsString, IsEnum, IsOptional, Matches } from 'class-validator';
import { StatutPresence } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePresenceDto {
  @ApiProperty({
    description: 'ID de l\'enfant',
    example: 'enf_123',
  })
  @IsString()
  enfantId: string;

  @ApiProperty({
    description: 'Date de la présence (YYYY-MM-DD)',
    example: '2025-11-06',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Format de date invalide (YYYY-MM-DD)',
  })
  date: string;

  @ApiProperty({
    description: 'Statut de la présence',
    enum: ['Present', 'Absent', 'Justifie'],
    example: 'Present',
  })
  @IsEnum(StatutPresence)
  statut: StatutPresence;

  @ApiProperty({
    description: 'Heure d\'arrivée (HH:MM)',
    example: '08:30',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'Format d\'heure invalide (HH:MM)',
  })
  arriveeA?: string;

  @ApiProperty({
    description: 'Heure de départ (HH:MM)',
    example: '16:30',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'Format d\'heure invalide (HH:MM)',
  })
  departA?: string;
}

export class CreatePresenceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  statut: StatutPresence;

  @ApiProperty()
  enfant: {
    id: string;
    prenom: string;
    nom: string;
    classe?: {
      id: string;
      nom: string;
    };
  };

  @ApiProperty({ required: false })
  arriveeA?: string;

  @ApiProperty({ required: false })
  departA?: string;
}

