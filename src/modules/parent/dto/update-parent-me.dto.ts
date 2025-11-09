import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateParentMeDto {
  @ApiPropertyOptional({
    description: 'Numéro de téléphone du tuteur',
    example: '06 12 34 56 78',
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({
    description: 'Adresse du tuteur',
    example: 'Rue Atlas, Marrakech',
  })
  @IsOptional()
  @IsString()
  adresse?: string;
}

