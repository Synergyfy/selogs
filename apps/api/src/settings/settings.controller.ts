import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { SettingsService } from './settings.service';
import { UpdateBrandingDto } from './dto/branding.dto';
import { UpdateProfileDto } from './dto/profile.dto';
import { UpdateSystemSettingsDto } from './dto/system.dto';
import { Roles, GetCurrentUser } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';

@ApiTags('settings')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Get organization branding' })
  @ApiResponse({ status: 200, description: 'Branding settings retrieved successfully.' })
  @Get('branding')
  async getBranding(@GetCurrentUser('organizationId') organizationId: string) {
    return this.settingsService.getBranding(organizationId);
  }

  @ApiOperation({ summary: 'Update organization branding' })
  @Roles(Role.admin)
  @ApiResponse({ status: 200, description: 'Branding settings updated successfully.' })
  @Patch('branding')
  async updateBranding(
    @GetCurrentUser('organizationId') organizationId: string,
    @Body() dto: UpdateBrandingDto,
  ) {
    return this.settingsService.updateBranding(organizationId, dto);
  }

  @ApiOperation({ summary: 'Get organization profile' })
  @ApiResponse({ status: 200, description: 'Profile settings retrieved successfully.' })
  @Get('profile')
  async getProfile(@GetCurrentUser('organizationId') organizationId: string) {
    return this.settingsService.getProfile(organizationId);
  }

  @ApiOperation({ summary: 'Update organization profile' })
  @Roles(Role.admin)
  @ApiResponse({ status: 200, description: 'Profile settings updated successfully.' })
  @Patch('profile')
  async updateProfile(
    @GetCurrentUser('organizationId') organizationId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.settingsService.updateProfile(organizationId, dto);
  }

  @ApiOperation({ summary: 'Get organization system settings' })
  @ApiResponse({ status: 200, description: 'System settings retrieved successfully.' })
  @Get('system')
  async getSystemSettings(@GetCurrentUser('organizationId') organizationId: string) {
    return this.settingsService.getSystemSettings(organizationId);
  }

  @ApiOperation({ summary: 'Update organization system settings' })
  @Roles(Role.admin)
  @ApiResponse({ status: 200, description: 'System settings updated successfully.' })
  @Patch('system')
  async updateSystemSettings(
    @GetCurrentUser('organizationId') organizationId: string,
    @Body() dto: UpdateSystemSettingsDto,
  ) {
    return this.settingsService.updateSystemSettings(organizationId, dto);
  }
}
