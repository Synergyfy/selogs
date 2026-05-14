import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBrandingDto } from './dto/branding.dto';
import { UpdateProfileDto } from './dto/profile.dto';
import { UpdateSystemSettingsDto } from './dto/system.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get organization branding settings.
   */
  async getBranding(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        logo: true,
        primaryColor: true,
        secondaryColor: true,
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  /**
   * Update organization branding settings.
   */
  async updateBranding(organizationId: string, dto: UpdateBrandingDto) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        logo: dto.logo,
        primaryColor: dto.primaryColor,
        secondaryColor: dto.secondaryColor,
      },
      select: {
        logo: true,
        primaryColor: true,
        secondaryColor: true,
      },
    });
  }

  /**
   * Get organization profile settings.
   */
  async getProfile(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        name: true,
        industry: true,
        code: true,
        createdAt: true,
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  /**
   * Update organization profile settings.
   */
  async updateProfile(organizationId: string, dto: UpdateProfileDto) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        name: dto.name,
        industry: dto.industry,
      },
      select: {
        name: true,
        industry: true,
        code: true,
      },
    });
  }

  /**
   * Get organization system settings.
   */
  async getSystemSettings(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        enableNotes: true,
        enablePhoneNumber: true,
        ocrEnabled: true,
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  /**
   * Update organization system settings.
   */
  async updateSystemSettings(organizationId: string, dto: UpdateSystemSettingsDto) {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        enableNotes: dto.enableNotes,
        enablePhoneNumber: dto.enablePhoneNumber,
        ocrEnabled: dto.ocrEnabled,
      },
      select: {
        enableNotes: true,
        enablePhoneNumber: true,
        ocrEnabled: true,
      },
    });
  }

  /**
   * Get global platform settings.
   */
  async getGlobalSettings() {
    let settings = await this.prisma.globalSettings.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await this.prisma.globalSettings.create({
        data: { id: 'global' },
      });
    }

    return settings;
  }

  /**
   * Update global platform settings.
   */
  async updateGlobalSettings(dto: any) {
    return this.prisma.globalSettings.update({
      where: { id: 'global' },
      data: dto,
    });
  }
}
