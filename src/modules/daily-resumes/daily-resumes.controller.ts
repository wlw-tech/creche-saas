import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { DailyResumesService } from './daily-resumes.service';
import {
  CreateDailyResumeDto,
  UpdateDailyResumeDto,
  DailyResumeResponseDto,
  GetDailyResumesQueryDto,
  ClassSummaryDto,
  ExportStatisticsDto,
} from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Daily Resumes')
@Controller('daily-resumes')
@ApiBearerAuth()
export class DailyResumesController {
  private readonly logger = new Logger(DailyResumesController.name);

  constructor(private readonly dailyResumesService: DailyResumesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ENSEIGNANT', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un résumé quotidien' })
  @ApiResponse({
    status: 201,
    description: 'Résumé créé avec succès',
    type: DailyResumeResponseDto,
  })
  async create(
    @Body() createDto: CreateDailyResumeDto,
    @Req() req: any,
  ): Promise<DailyResumeResponseDto> {
    const user = req.user;
    this.logger.log(
      `Création d'un résumé - User: ${user.email}, Enfant: ${createDto.enfantId}, Date: ${createDto.date}`,
    );
    return this.dailyResumesService.create(createDto, user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer les résumés quotidiens' })
  @ApiResponse({
    status: 200,
    description: 'Liste des résumés',
  })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'dateMin', required: false })
  @ApiQuery({ name: 'dateMax', required: false })
  @ApiQuery({ name: 'enfantId', required: false })
  @ApiQuery({ name: 'classeId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async findAll(
    @Query() query: GetDailyResumesQueryDto,
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;
    this.logger.log(
      `Récupération des résumés - User: ${user.email} (${user.role}), Filters: ${JSON.stringify(query)}`,
    );
    return this.dailyResumesService.findAll(query, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer un résumé par ID' })
  @ApiResponse({
    status: 200,
    description: 'Résumé trouvé',
    type: DailyResumeResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<DailyResumeResponseDto> {
    const user = req.user;
    this.logger.log(
      `Récupération du résumé ${id} - User: ${user.email}`,
    );
    return this.dailyResumesService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ENSEIGNANT', 'ADMIN')
  @ApiOperation({ summary: 'Mettre à jour un résumé quotidien' })
  @ApiResponse({
    status: 200,
    description: 'Résumé mis à jour',
    type: DailyResumeResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDailyResumeDto,
    @Req() req: any,
  ): Promise<DailyResumeResponseDto> {
    const user = req.user;
    this.logger.log(
      `Mise à jour du résumé ${id} - User: ${user.email}`,
    );
    return this.dailyResumesService.update(id, updateDto, user);
  }

  @Get('class/:classeId/summary')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer le résumé de la classe du jour' })
  @ApiResponse({
    status: 200,
    description: 'Résumé de la classe',
    type: ClassSummaryDto,
  })
  @ApiQuery({ name: 'date', required: true })
  async getClassSummary(
    @Param('classeId') classeId: string,
    @Query('date') date: string,
    @Req() req: any,
  ): Promise<ClassSummaryDto> {
    const user = req.user;
    this.logger.log(
      `Récupération du résumé de classe ${classeId} - User: ${user.email}, Date: ${date}`,
    );
    return this.dailyResumesService.getClassSummary(classeId, date, user);
  }

  @Get('class/:classeId/export')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Exporter les statistiques de la classe' })
  @ApiResponse({
    status: 200,
    description: 'Statistiques exportées',
    type: [ExportStatisticsDto],
  })
  @ApiQuery({ name: 'dateMin', required: true })
  @ApiQuery({ name: 'dateMax', required: true })
  async exportStatistics(
    @Param('classeId') classeId: string,
    @Query('dateMin') dateMin: string,
    @Query('dateMax') dateMax: string,
    @Req() req: any,
  ): Promise<ExportStatisticsDto[]> {
    const user = req.user;
    this.logger.log(
      `Export statistiques classe ${classeId} - User: ${user.email}, Période: ${dateMin} à ${dateMax}`,
    );
    return this.dailyResumesService.exportStatistics(
      classeId,
      dateMin,
      dateMax,
      user,
    );
  }
}

