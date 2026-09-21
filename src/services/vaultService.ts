import { INITIAL_CONNECTORS, INITIAL_DEMO_SOURCE_ITEMS, INITIAL_WORK_CONTEXT } from '../data/demoData';
import { ConnectorInfo, Project, SourceItem, WorkContext } from '../types';

const VAULT_STORAGE_KEY = 'splicer_local_encrypted_vault_v1';
const CONNECTORS_STORAGE_KEY = 'splicer_connectors_config_v1';

export class LocalWorkVault {
  private static cachedContext: WorkContext | null = null;
  private static cachedConnectors: ConnectorInfo[] | null = null;

  static getWorkContext(): WorkContext {
    if (this.cachedContext) {
      return this.cachedContext;
    }
    try {
      const stored = localStorage.getItem(VAULT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cachedContext = parsed;
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read vault from localStorage, using initial context:', e);
    }
    this.cachedContext = JSON.parse(JSON.stringify(INITIAL_WORK_CONTEXT));
    this.saveWorkContext(this.cachedContext!);
    return this.cachedContext!;
  }

  static saveWorkContext(context: WorkContext): void {
    this.cachedContext = context;
    try {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(context));
    } catch (e) {
      console.warn('Could not save vault to localStorage:', e);
    }
  }

  static getConnectors(): ConnectorInfo[] {
    if (this.cachedConnectors) {
      return this.cachedConnectors;
    }
    try {
      const stored = localStorage.getItem(CONNECTORS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cachedConnectors = parsed;
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read connectors, using initial:', e);
    }
    this.cachedConnectors = JSON.parse(JSON.stringify(INITIAL_CONNECTORS));
    this.saveConnectors(this.cachedConnectors!);
    return this.cachedConnectors!;
  }

  static saveConnectors(connectors: ConnectorInfo[]): void {
    this.cachedConnectors = connectors;
    try {
      localStorage.setItem(CONNECTORS_STORAGE_KEY, JSON.stringify(connectors));
    } catch (e) {
      console.warn('Could not save connectors:', e);
    }
  }

  static resetToDemoWorkspace(): WorkContext {
    this.cachedContext = JSON.parse(JSON.stringify(INITIAL_WORK_CONTEXT));
    this.cachedConnectors = JSON.parse(JSON.stringify(INITIAL_CONNECTORS));
    this.saveWorkContext(this.cachedContext!);
    this.saveConnectors(this.cachedConnectors!);
    return this.cachedContext!;
  }

  static purgeVault(): WorkContext {
    const emptyContext: WorkContext = {
      projects: [],
      sourceItems: [],
      statsSinceLastChecked: {
        decisions: 0,
        commitments: 0,
        deadlineChanges: 0,
        needingAttention: 0,
      },
      vaultStatus: {
        isEncrypted: true,
        encryptionAlgorithm: 'AES-256-GCM (Hardware Keystore)',
        keystoreAlias: 'splicer_work_vault_key_alias',
        localPayloadSizeKB: 0,
        lastNormalizedTime: 'Purged',
      },
    };
    this.saveWorkContext(emptyContext);
    return emptyContext;
  }

  static async simulateSourceSync(
    connectorId?: string,
    onProgress?: (step: string) => void
  ): Promise<{ context: WorkContext; syncedCount: number }> {
    if (onProgress) onProgress('Connecting authorized connector...');
    await new Promise((r) => setTimeout(r, 220));

    if (onProgress) onProgress('Normalizing source payloads to SourceItem schema...');
    await new Promise((r) => setTimeout(r, 260));

    if (onProgress) onProgress('Storing into encrypted local vault (AES-GCM)...');
    await new Promise((r) => setTimeout(r, 200));

    if (onProgress) onProgress('Running on-device AI relationship extraction...');
    await new Promise((r) => setTimeout(r, 280));

    // Refresh timestamps on connectors
    const connectors = this.getConnectors().map((c) => {
      if (!connectorId || c.id === connectorId) {
        return {
          ...c,
          lastSync: 'Just now',
        };
      }
      return c;
    });
    this.saveConnectors(connectors);

    // Refresh context
    const current = this.getWorkContext();
    current.vaultStatus.lastNormalizedTime = 'Just now';
    this.saveWorkContext(current);

    return { context: current, syncedCount: current.sourceItems.length };
  }
}
