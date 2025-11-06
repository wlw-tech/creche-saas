import { IsString, IsEnum, IsOptional, Matches, IsArray, ValidateNested } from 'class-validator';
import { StatutPresence } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PresenceRecordItemDto {
  @ApiProperty({
    description: 'ID de l\'enfant',
    example: 'enf_123',
  })
  @IsString()
  enfantId: string;

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

export class RecordClassPresencesDto {
  @ApiProperty({
    description: 'ID de la classe',
    example: 'cls_123',
  })
  @IsString()
  classeId: string;

  @ApiProperty({
    description: 'Date des présences (YYYY-MM-DD)',
    example: '2025-11-06',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Format de date invalide (YYYY-MM-DD)',
  })
  date: string;

  @ApiProperty({
    description: 'Liste des présences à enregistrer',
    type: [PresenceRecordItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PresenceRecordItemDto)
  presences: PresenceRecordItemDto[];
}

export class RecordClassPresencesResponseDto {
  @ApiProperty({
    description: 'Nombre de présences enregistrées',
    example: 15,
  })
  count: number;

  @ApiProperty({
    description: 'Date des présences',
    example: '2025-11-06',
  })
  date: string;

  @ApiProperty({
    description: 'ID de la classe',
    example: 'cls_123',
  })
  classeId: string;

  @ApiProperty({
    description: 'Message de confirmation',
    example: '15 présences enregistrées avec succès',
  })
  message: string;
}

