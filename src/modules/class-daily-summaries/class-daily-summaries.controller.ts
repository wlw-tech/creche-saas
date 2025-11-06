import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ClassDailySummariesService } from './class-daily-summaries.service';
import {
  CreateClassDailySummaryDto,
  UpdateClassDailySummaryDto,
  ClassDailySummaryResponseDto,
  GetClassDailySummariesQueryDto,
} from './dto';

@ApiTags('Class Daily Summaries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('class-daily-summaries')
export class ClassDailySummariesController {
  constructor(private service: ClassDailySummariesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un résumé collectif de la journée (ENSEIGNANT/ADMIN)' })
  @ApiResponse({ status: 201, description: 'Résumé créé avec succès' })
  async create(
    @Body() dto: CreateClassDailySummaryDto,
    @Req() req: any,
  ): Promise<ClassDailySummaryResponseDto> {
    return this.service.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer les résumés collectifs (RBAC)' })
  @ApiResponse({ status: 200, description: 'Liste des résumés' })
  async findAll(
    @Query() query: GetClassDailySummariesQueryDto,
    @Req() req: any,
  ) {
    return this.service.findAll(query, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un résumé par ID' })
  @ApiResponse({ status: 200, description: 'Résumé trouvé' })
  async findOne(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<ClassDailySummaryResponseDto> {
    return this.service.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un résumé (ENSEIGNANT/ADMIN)' })
  @ApiResponse({ status: 200, description: 'Résumé modifié' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClassDailySummaryDto,
    @Req() req: any,
  ): Promise<ClassDailySummaryResponseDto> {
    return this.service.update(id, dto, req.user);
  }

  @Post(':id/publish')
  @HttpCode(200)
  @ApiOperation({ summary: 'Publier un résumé (ENSEIGNANT/ADMIN)' })
  @ApiResponse({ status: 200, description: 'Résumé publié' })
  async publish(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<ClassDailySummaryResponseDto> {
    return this.service.publish(id, req.user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Supprimer un résumé (ENSEIGNANT/ADMIN)' })
  @ApiResponse({ status: 204, description: 'Résumé supprimé' })
  async delete(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<void> {
    return this.service.delete(id, req.user);
  }
}

