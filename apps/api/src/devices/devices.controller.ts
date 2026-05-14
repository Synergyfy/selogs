import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { DevicesService } from './devices.service';
import {
  CreateDeviceDto,
  UpdateDeviceDto,
  DeviceResponseDto,
} from './dto/device.dto';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { GetCurrentUser } from '../auth/decorators';
import { Capability } from '../common/capabilities';

@ApiTags('devices')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @ApiOperation({ summary: 'Register a new handheld device (Admin only)' })
  @ApiResponse({ status: 201, type: DeviceResponseDto })
  @Capability('device:create')
  @Roles(Role.admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateDeviceDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.create(dto, organizationId);
  }

  @ApiOperation({ summary: 'List all devices' })
  @ApiResponse({ status: 200, type: [DeviceResponseDto] })
  @Roles(Role.admin, Role.supervisor)
  @Get()
  async findAll(
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<DeviceResponseDto[]> {
    return this.devicesService.findAll(organizationId);
  }

  @ApiOperation({ summary: 'Get device details' })
  @ApiParam({ name: 'id', example: 'd1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5s6' })
  @ApiResponse({ status: 200, type: DeviceResponseDto })
  @Roles(Role.admin, Role.supervisor)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.findOne(id, organizationId);
  }

  @ApiOperation({ summary: 'Update device assignment or name (Admin only)' })
  @ApiParam({ name: 'id', example: 'd1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5s6' })
  @ApiResponse({ status: 200, type: DeviceResponseDto })
  @Roles(Role.admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.update(id, dto, organizationId);
  }

  @ApiOperation({ summary: 'Unregister/Delete a device (Admin only)' })
  @ApiParam({ name: 'id', example: 'd1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5s6' })
  @ApiResponse({ status: 204 })
  @Roles(Role.admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<void> {
    return this.devicesService.remove(id, organizationId);
  }
}
