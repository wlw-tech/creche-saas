import { IsString, IsOptional, IsISO8601 } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Titre de l\'événement',
    example: 'Réunion parents-enseignants',
  })
  @IsOptional()
  @IsString()
  titre?: string;

  @ApiPropertyOptional({
    description: 'Description de l\'événement',
    example: 'Salle bleue',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Date et heure de début (ISO 8601)',
    example: '2025-11-30T14:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  startAt?: string;

  @ApiPropertyOptional({
    description: 'Date et heure de fin (ISO 8601)',
    example: '2025-11-30T16:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  endAt?: string;
}

