import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new classe' })
  @ApiResponse({
    status: 201,
    description: 'Classe created successfully',
  })
  create(@Body() createClasseDto: CreateClasseDto) {
    return this.classesService.create(createClasseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({
    status: 200,
    description: 'List of all classes',
  })
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a classe by ID' })
  @ApiResponse({
    status: 200,
    description: 'Classe details',
  })
  @ApiResponse({
    status: 404,
    description: 'Classe not found',
  })
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get classe statistics' })
  @ApiResponse({
    status: 200,
    description: 'Classe statistics including occupancy',
  })
  getStats(@Param('id') id: string) {
    return this.classesService.getClasseStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a classe' })
  @ApiResponse({
    status: 200,
    description: 'Classe updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Classe not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateClasseDto: UpdateClasseDto,
  ) {
    return this.classesService.update(id, updateClasseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a classe' })
  @ApiResponse({
    status: 204,
    description: 'Classe deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Classe not found',
  })
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}

