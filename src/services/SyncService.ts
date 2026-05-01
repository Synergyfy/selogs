import { db } from './db';

class SyncService {
  private isSyncing = false;

  constructor() {
    // Listen for online status to trigger sync
    window.addEventListener('online', () => this.syncAll());
  }

  /**
   * Sync all pending records from local Dexie to Cloud
   */
  async syncAll() {
    if (this.isSyncing || !navigator.onLine) return;
    
    this.isSyncing = true;
    console.log('🔄 Sync started...');

    try {
      await this.syncEntries();
      // Add other sync tasks here (branches, staff etc.)
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
        // Placeholder for real API call
        // const response = await fetch('/api/entries', { 
        //   method: 'POST', 
        //   body: JSON.stringify(entry) 
        // });
        
        // Mock success
        await new Promise(resolve => setTimeout(resolve, 200)); 
        
        await db.entries.update(entry.id, { synced: true });
        console.log(`Synced entry: ${entry.plateNumber}`);
      } catch (err) {
        console.error(`Failed to sync entry ${entry.id}:`, err);
      }
    }
  }

  /**
   * Triggered when a new record is added locally
   */
  async notifyNewRecord() {
    if (navigator.onLine) {
      this.syncAll();
    }
  }
}

export const syncService = new SyncService();
