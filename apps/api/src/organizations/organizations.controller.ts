import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { OrganizationsService } from './organizations.service';
import { OrganizationResponseDto, UpdateOrganizationDto } from './dto/organization.dto';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';

@ApiTags('organizations')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'List all organizations (Super Admin only)' })
  @Roles(Role.super_admin)
  @ApiResponse({ status: 200, type: [OrganizationResponseDto] })
  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @ApiOperation({ summary: 'Get organization details (Super Admin only)' })
  @Roles(Role.super_admin)
  @ApiResponse({ status: 200 })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update organization (Super Admin only)' })
  @Roles(Role.super_admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete organization (Super Admin only)' })
  @Roles(Role.super_admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}
