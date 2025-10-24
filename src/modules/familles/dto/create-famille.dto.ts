import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Langue, LienTuteur } from '@prisma/client';

export class CreateTuteurDto {
  @IsEnum(LienTuteur)
  lien: LienTuteur;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateFamilleDto {
  @IsEmail()
  emailPrincipal: string;

  @IsOptional()
  @IsEnum(['fr', 'ar', 'en'])
  languePreferee?: Langue;

  @IsOptional()
  @IsString()
  adresseFacturation?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTuteurDto)
  @ArrayMinSize(1)
  tuteurs?: CreateTuteurDto[];
}

