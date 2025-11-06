import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum StatutPresenceFilter {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  JUSTIFIE = 'Justifie',
}

/**
 * DTO pour filtrer les présences
 * Timezone: Africa/Casablanca (MENA)
 */
export class GetPresencesQueryDto {
  @ApiProperty({
    example: '2025-11-06',
    description: 'Date spécifique (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    example: '2025-11-01',
    description: 'Date minimum (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateMin?: string;

  @ApiProperty({
    example: '2025-11-30',
    description: 'Date maximum (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateMax?: string;

  @ApiProperty({
    example: 'cls_123',
    description: 'ID de la classe',
    required: false,
  })
  @IsOptional()
  @IsString()
  classeId?: string;

  @ApiProperty({
    example: 'enf_456',
    description: 'ID de l\'enfant',
    required: false,
  })
  @IsOptional()
  @IsString()
  enfantId?: string;

  @ApiProperty({
    example: 'Present',
    description: 'Statut de présence',
    enum: StatutPresenceFilter,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatutPresenceFilter)
  statut?: StatutPresenceFilter;

  @ApiProperty({
    example: 'Lina',
    description: 'Recherche sur nom/prénom de l\'enfant',
    required: false,
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    example: 1,
    description: 'Numéro de page (défaut: 1)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 25,
    description: 'Nombre d\'éléments par page (défaut: 25, max: 200)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number = 25;
}

