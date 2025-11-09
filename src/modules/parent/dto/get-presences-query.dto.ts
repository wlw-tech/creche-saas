import { IsOptional, IsISO8601, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetPresencesQueryDto {
  @ApiPropertyOptional({
    description: 'Date minimale (ISO 8601)',
    example: '2025-11-01',
  })
  @IsOptional()
  @IsISO8601()
  dateMin?: string;

  @ApiPropertyOptional({
    description: 'Date maximale (ISO 8601)',
    example: '2025-11-09',
  })
  @IsOptional()
  @IsISO8601()
  dateMax?: string;

  @ApiPropertyOptional({
    description: 'Numéro de page (1-indexed)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Nombre d\'éléments par page',
    example: 30,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 30;
}

