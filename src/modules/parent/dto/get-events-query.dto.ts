import { IsOptional, IsISO8601, IsNumber, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetEventsQueryDto {
  @ApiPropertyOptional({
    description: 'Date de début (ISO 8601 ou "today")',
    example: '2025-11-09',
  })
  @IsOptional()
  @IsString()
  dateFrom?: string = 'today';

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
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 20;
}

