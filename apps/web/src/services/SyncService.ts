import { db } from './db';
import api from './api';

class SyncService {
  private isSyncing = false;

  constructor() {
    // Listen for online status to trigger sync
    window.addEventListener('online', () => this.syncAll());
  }

  /**
   * Sync all pending records from local Dexie to Cloud.
   */
  async syncAll() {
    if (this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;
    console.log('🔄 Sync started...');

    try {
      await this.syncEntries();
    } catch (err) {
      console.error('❌ Sync failed:', err);
    } finally {
      this.isSyncing = false;
      console.log('✅ Sync completed.');
    }
  }

  private async syncEntries() {
    const unsyncedEntries = await db.entries.where('synced').equals(0).toArray();

    if (unsyncedEntries.length === 0) return;

    for (const entry of unsyncedEntries) {
      try {
        if (entry.status === 'IN') {
          // POST new check-in to API
          await api.post('/entries/checkin', {
            plateNumber: entry.plateNumber,
            phoneNumber: entry.phoneNumber,
            notes: undefined,
            deviceId: entry.deviceId,
          });
        } else if (entry.status === 'OUT') {
          // PATCH check-out — entry.id here is the server-assigned entry ID
          // (If locally generated UUID, the server won't find it — handled below)
          await api.patch(`/entries/${entry.id}/checkout`, {
            deviceId: entry.deviceId,
          });
        }

        await db.entries.update(entry.id, { synced: true });
        console.log(`✅ Synced entry: ${entry.plateNumber}`);
      } catch (err: any) {
        // Log but do not mark as synced — will retry next cycle
        console.error(`❌ Failed to sync entry ${entry.id}:`, err?.response?.data || err);
      }
    }
  }

  /**
   * Triggered when a new record is added locally.
   */
  async notifyNewRecord() {
    if (navigator.onLine) {
      this.syncAll();
    }
  }
}

export const syncService = new SyncService();
