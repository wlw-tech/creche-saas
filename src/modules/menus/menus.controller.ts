import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { MenusService } from './menus.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  CreateMenuDto,
  UpdateMenuDto,
  MenuResponseDto,
  GetMenusQueryDto,
} from './dto';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  private readonly logger = new Logger(MenusController.name);

  constructor(private readonly menusService: MenusService) {}

  /**
   * Créer un nouveau menu (ADMIN uniquement)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Créer un nouveau menu',
    description: 'Crée un menu pour une date donnée (brouillon par défaut)',
  })
  @ApiResponse({
    status: 201,
    description: 'Menu créé avec succès',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Un menu existe déjà pour cette date',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé (ADMIN requis)',
  })
  async create(
    @Body() createMenuDto: CreateMenuDto,
    @Req() req: any,
  ) {
    const user = req.user;
    this.logger.log(
      `Création d'un menu pour ${createMenuDto.date} par ${user.email}`,
    );
    return this.menusService.create(createMenuDto, user.userId);
  }

  /**
   * Récupérer tous les menus avec filtres
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Récupérer les menus',
    description:
      'ADMIN: tous les menus | ENSEIGNANT/PARENT: menus publiés uniquement',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des menus',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Filtrer par date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dateMin',
    required: false,
    description: 'Date de début (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'dateMax',
    required: false,
    description: 'Date de fin (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'statut',
    required: false,
    enum: ['Brouillon', 'Publie'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
  })
  async findAll(
    @Query() query: GetMenusQueryDto,
    @Req() req: any,
  ) {
    const user = req.user;
    this.logger.log(
      `Récupération des menus - User: ${user.email} (${user.role}), Filters: ${JSON.stringify(query)}`,
    );
    return this.menusService.findAll(query, user.role);
  }

  /**
   * Récupérer le menu du jour
   */
  @Get('today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Récupérer le menu du jour',
    description: 'Retourne le menu publié du jour (ou null si aucun)',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu du jour',
    type: MenuResponseDto,
  })
  async getTodayMenu() {
    this.logger.log('Récupération du menu du jour');
    return this.menusService.getTodayMenu();
  }

  /**
   * Récupérer un menu par ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Récupérer un menu par ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu trouvé',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  async findOne(@Param('id') id: string) {
    this.logger.log(`Récupération du menu ${id}`);
    return this.menusService.findOne(id);
  }

  /**
   * Mettre à jour un menu (ADMIN uniquement)
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Mettre à jour un menu',
    description: 'Modifie un menu (brouillon ou publié)',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu mis à jour',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé (ADMIN requis)',
  })
  async update(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    this.logger.log(`Mise à jour du menu ${id}`);
    return this.menusService.update(id, updateMenuDto);
  }

  /**
   * Publier un menu (ADMIN uniquement)
   */
  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publier un menu',
    description: 'Change le statut du menu de Brouillon à Publié',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu publié',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Le menu est déjà publié',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé (ADMIN requis)',
  })
  async publish(@Param('id') id: string) {
    this.logger.log(`Publication du menu ${id}`);
    return this.menusService.publish(id);
  }

  /**
   * Supprimer un menu (ADMIN uniquement)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Supprimer un menu',
    description: 'Supprime un menu (brouillon uniquement)',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu supprimé',
  })
  @ApiResponse({
    status: 400,
    description: 'Impossible de supprimer un menu publié',
  })
  @ApiResponse({
    status: 404,
    description: 'Menu non trouvé',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé (ADMIN requis)',
  })
  async remove(@Param('id') id: string) {
    this.logger.log(`Suppression du menu ${id}`);
    return this.menusService.remove(id);
  }
}

