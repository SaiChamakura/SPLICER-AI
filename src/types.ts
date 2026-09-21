export type SourceType = 'gmail' | 'teams' | 'telegram' | 'calendar' | 'document';

export type ConnectorStatus = 'CONNECTED' | 'NOT_CONNECTED' | 'SYNCING' | 'DEMO_MODE' | 'ERROR';

export interface SourceItem {
  id: string;
  source: SourceType;
  sourceMessageId: string;
  timestamp: string;
  relativeTime?: string;
  sender: {
    name: string;
    emailOrHandle: string;
    avatar?: string;
  };
  recipients?: string[];
  title: string;
  content: string;
  attachments?: {
    name: string;
    size?: string;
    type?: string;
  }[];
  conversationId?: string;
  metadata?: Record<string, unknown>;
}

export type ProjectState = 'ON_TRACK' | 'NEEDS_ATTENTION' | 'AT_RISK' | 'BLOCKED' | 'WAITING' | 'COMPLETED';

export interface Person {
  id: string;
  name: string;
  role: string;
  emailOrHandle: string;
  isCurrentUser?: boolean;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  deadline?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  sourceItemId: string;
}

export interface Decision {
  id: string;
  projectId: string;
  title: string;
  detail?: string;
  decider: string;
  timestamp: string;
  sourceItemId: string;
  sourceType: SourceType;
}

export interface Commitment {
  id: string;
  projectId: string;
  person: string;
  promise: string;
  deadline?: string;
  status: 'PENDING' | 'DELIVERED';
  sourceItemId: string;
  sourceType: SourceType;
}

export interface Deadline {
  id: string;
  projectId: string;
  title: string;
  timestamp: string;
  sourceItemId: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  time: string;
  participants: string[];
  sourceItemId: string;
}

export interface Evidence {
  id: string;
  claim: string;
  sourceItemId: string;
  sourceType: SourceType;
  sourceTitle: string;
  senderName: string;
  timestamp: string;
  snippet: string;
  confidence: number;
  reasoning: string;
}

export interface Project {
  id: string;
  title: string;
  status: ProjectState;
  statusHeadline: string;
  statusDetail: string;
  stateExplanation: {
    rule: string;
    evidenceIds: string[];
  };
  decision: Decision;
  userTask: Task;
  deadline: string;
  waitingOn: {
    person: string;
    item: string;
    sourceItemId: string;
  };
  upcomingMeeting?: Meeting;
  aiNextAction: {
    action: string;
    recommendedType: 'CREATE_TASK' | 'SET_REMINDER' | 'DRAFT_FOLLOWUP' | 'SCHEDULE_FOCUS';
    contextReason: string;
  };
  people: Person[];
  timeline: {
    timeLabel: string;
    event: string;
    sourceType: SourceType;
    sourceItemId: string;
  }[];
  sourceItemIds: string[];
  evidenceGraphNodes: {
    id: string;
    label: string;
    type: 'conclusion' | 'fact' | 'source';
    status?: ProjectState;
    connectedTo: string[]; // target node IDs
    sourceType?: SourceType;
    sourceSnippet?: string;
  }[];
}

export interface WorkContext {
  projects: Project[];
  sourceItems: SourceItem[];
  statsSinceLastChecked: {
    decisions: number;
    commitments: number;
    deadlineChanges: number;
    needingAttention: number;
  };
  vaultStatus: {
    isEncrypted: boolean;
    encryptionAlgorithm: string;
    keystoreAlias: string;
    localPayloadSizeKB: number;
    lastNormalizedTime: string;
  };
}

export interface ConnectorInfo {
  id: SourceType;
  name: string;
  iconName: string;
  status: ConnectorStatus;
  lastSync: string;
  itemCount: number;
  permissionScope: string;
  isRealOAuthSupported: boolean;
  notes: string;
}

export interface AnswerWithEvidence {
  id: string;
  question: string;
  title: string;
  answer: string;
  evidenceItems: {
    sourceType: SourceType;
    sourceName: string;
    snippet: string;
    sender: string;
    timestamp: string;
    sourceItemId: string;
  }[];
  localAiEngine: string;
  latencyMs: number;
  confidence: number;
}

export interface AIEngine {
  name: string;
  isLocal: boolean;
  isAvailable(): Promise<boolean>;
  analyzeWorkContext(items: SourceItem[]): Promise<WorkContext>;
  askQuestion(question: string, context: WorkContext): Promise<AnswerWithEvidence>;
}

export type NavTab = 'pulse' | 'context' | 'ask' | 'sources' | 'privacy';
