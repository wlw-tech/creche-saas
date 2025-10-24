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
import { FamillesService } from './familles.service';
import { CreateFamilleDto } from './dto/create-famille.dto';
import { UpdateFamilleDto } from './dto/update-famille.dto';

@ApiTags('Familles')
@Controller('familles')
export class FamillesController {
  constructor(private readonly famillesService: FamillesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new famille' })
  @ApiResponse({
    status: 201,
    description: 'Famille created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Email already used or invalid data',
  })
  create(@Body() createFamilleDto: CreateFamilleDto) {
    return this.famillesService.create(createFamilleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all familles' })
  @ApiResponse({
    status: 200,
    description: 'List of all familles',
  })
  findAll() {
    return this.famillesService.findAll();
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get famille statistics' })
  @ApiResponse({
    status: 200,
    description: 'Famille statistics including children and tutors',
  })
  getStats(@Param('id') id: string) {
    return this.famillesService.getFamilleStats(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a famille by ID' })
  @ApiResponse({
    status: 200,
    description: 'Famille details',
  })
  @ApiResponse({
    status: 404,
    description: 'Famille not found',
  })
  findOne(@Param('id') id: string) {
    return this.famillesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a famille' })
  @ApiResponse({
    status: 200,
    description: 'Famille updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Famille not found',
  })
  update(@Param('id') id: string, @Body() updateFamilleDto: UpdateFamilleDto) {
    return this.famillesService.update(id, updateFamilleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a famille' })
  @ApiResponse({
    status: 204,
    description: 'Famille deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Famille not found',
  })
  remove(@Param('id') id: string) {
    return this.famillesService.remove(id);
  }
}

