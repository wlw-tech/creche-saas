import { IsString, IsOptional, IsISO8601 } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Titre de l\'événement',
    example: 'Réunion parents-enseignants',
  })
  @IsString()
  titre: string;

  @ApiPropertyOptional({
    description: 'Description de l\'événement',
    example: 'Salle bleue',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Date et heure de début (ISO 8601)',
    example: '2025-11-30T14:00:00Z',
  })
  @IsISO8601()
  startAt: string;

  @ApiProperty({
    description: 'Date et heure de fin (ISO 8601)',
    example: '2025-11-30T16:00:00Z',
  })
  @IsISO8601()
  endAt: string;

  @ApiProperty({
    description: 'ID de la classe',
    example: 'cls_1',
  })
  @IsString()
  classeId: string;
}

