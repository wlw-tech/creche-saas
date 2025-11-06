import {
  IsString,
  IsDateString,
  IsEnum,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import {
  NiveauAppetit,
  NiveauHumeur,
  NiveauSieste,
  NiveauParticipation,
} from '@prisma/client';

export class CreateDailyResumeDto {
  @IsString()
  @IsNotEmpty()
  enfantId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsEnum(NiveauAppetit)
  appetit?: NiveauAppetit;

  @IsOptional()
  @IsEnum(NiveauHumeur)
  humeur?: NiveauHumeur;

  @IsOptional()
  @IsEnum(NiveauSieste)
  sieste?: NiveauSieste;

  @IsOptional()
  @IsEnum(NiveauParticipation)
  participation?: NiveauParticipation;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  observations?: string[];
}

export class UpdateDailyResumeDto {
  @IsOptional()
  @IsEnum(NiveauAppetit)
  appetit?: NiveauAppetit;

  @IsOptional()
  @IsEnum(NiveauHumeur)
  humeur?: NiveauHumeur;

  @IsOptional()
  @IsEnum(NiveauSieste)
  sieste?: NiveauSieste;

  @IsOptional()
  @IsEnum(NiveauParticipation)
  participation?: NiveauParticipation;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  observations?: string[];
}

export class DailyResumeResponseDto {
  id: string;
  enfantId: string;
  enfantPrenom: string;
  enfantNom: string;
  date: string;
  appetit?: NiveauAppetit;
  humeur?: NiveauHumeur;
  sieste?: NiveauSieste;
  participation?: NiveauParticipation;
  observations: string[];
  creePar?: string;
  creeLe: string;
  modifieLe: string;
}

export class GetDailyResumesQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  dateMin?: string;

  @IsOptional()
  @IsDateString()
  dateMax?: string;

  @IsOptional()
  @IsString()
  enfantId?: string;

  @IsOptional()
  @IsString()
  classeId?: string;

  @IsOptional()
  page?: number = 1;

  @IsOptional()
  pageSize?: number = 25;
}

export class ClassSummaryDto {
  date: string;
  classeId: string;
  classeNom: string;
  totalEnfants: number;
  presentsCount: number;
  absentsCount: number;
  justifiesCount: number;
  resumesCount: number;
  observations: {
    enfantPrenom: string;
    enfantNom: string;
    observation: string;
  }[];
}

export class ExportStatisticsDto {
  date: string;
  classeId: string;
  classeNom: string;
  totalEnfants: number;
  resumesCount: number;
  appetitStats: {
    Excellent: number;
    Bon: number;
    Moyen: number;
    Faible: number;
    Refus: number;
  };
  humeurStats: {
    Excellent: number;
    Bon: number;
    Moyen: number;
    Difficile: number;
    Tres_difficile: number;
  };
  siesteStats: {
    Excellent: number;
    Bon: number;
    Moyen: number;
    Difficile: number;
    Pas_de_sieste: number;
  };
  participationStats: {
    Excellent: number;
    Bon: number;
    Moyen: number;
    Faible: number;
    Absent: number;
  };
}

