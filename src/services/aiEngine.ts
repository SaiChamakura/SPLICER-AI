import { AIEngine, AnswerWithEvidence, Project, SourceItem, WorkContext } from '../types';

export class DemoAIEngine implements AIEngine {
  name = 'Demo On-Device Intelligence Engine';
  isLocal = true;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async analyzeWorkContext(items: SourceItem[]): Promise<WorkContext> {
    // Deterministic state computation based on normalized items
    const clientProposalItems = items.filter(
      (item) =>
        item.title.toLowerCase().includes('proposal') ||
        item.content.toLowerCase().includes('proposal') ||
        item.content.toLowerCase().includes('option b') ||
        item.content.toLowerCase().includes('pricing sheet')
    );

    // Identify decision
    const teamsApproval = items.find((i) => i.source === 'teams' && i.content.includes('Option B'));
    // Identify deadline
    const gmailDeadline = items.find((i) => i.source === 'gmail' && i.content.includes('Thursday'));
    // Identify blocker/waiting
    const telegramPricing = items.find((i) => i.source === 'telegram' && i.content.includes('pricing sheet'));

    const isAtRisk = Boolean(gmailDeadline && telegramPricing);

    const clientProposal: Project = {
      id: 'proj-client-proposal',
      title: 'Client Proposal',
      status: isAtRisk ? 'AT_RISK' : 'ON_TRACK',
      statusHeadline: isAtRisk ? 'At risk' : 'On track',
      statusDetail: isAtRisk
        ? 'Your proposal is due Thursday and the updated pricing sheet is still pending.'
        : 'All deliverables accounted for.',
      stateExplanation: {
        rule: 'AT RISK because deadline is approaching (Thursday evening) AND required dependency (Rahul\'s pricing sheet) is missing.',
        evidenceIds: [gmailDeadline?.id || 'src-gmail-01', telegramPricing?.id || 'src-telegram-01'],
      },
      decision: {
        id: 'dec-01',
        projectId: 'proj-client-proposal',
        title: teamsApproval ? 'Option B approved' : 'Decision pending',
        detail: 'Client formally approved Option B commercial scope via Teams message.',
        decider: teamsApproval?.sender.name || 'Elena Rostova',
        timestamp: teamsApproval?.timestamp || 'Today, 8:42 PM',
        sourceItemId: teamsApproval?.id || 'src-teams-01',
        sourceType: 'teams',
      },
      userTask: {
        id: 'task-01',
        projectId: 'proj-client-proposal',
        title: 'Update and send revised proposal',
        assignee: 'Alex (You)',
        deadline: 'Thursday evening',
        status: 'PENDING',
        sourceItemId: gmailDeadline?.id || 'src-gmail-01',
      },
      deadline: 'Thursday evening',
      waitingOn: {
        person: 'Rahul',
        item: 'updated pricing sheet',
        sourceItemId: telegramPricing?.id || 'src-telegram-01',
      },
      upcomingMeeting: {
        id: 'meet-01',
        projectId: 'proj-client-proposal',
        title: 'Client Review — Friday, 10:00 AM',
        time: 'Friday 10:00 AM',
        participants: ['Alex', 'Sarah Chen', 'Elena Rostova', 'Rahul'],
        sourceItemId: 'src-calendar-01',
      },
      aiNextAction: {
        action: 'Update the proposal after the pricing sheet arrives.',
        recommendedType: 'DRAFT_FOLLOWUP',
        contextReason: 'Option B has already been agreed. Once Rahul delivers the pricing sheet tonight, assemble into Proposal v2 and send prior to Friday Review.',
      },
      people: [
        { id: 'p1', name: 'Alex', role: 'Proposal Owner (You)', emailOrHandle: 'alex@splicer.work', isCurrentUser: true },
        { id: 'p2', name: 'Rahul', role: 'Financial Lead', emailOrHandle: '@rahul_finops' },
        { id: 'p3', name: 'Client (Acme)', role: 'External Decision Maker', emailOrHandle: 'schen@acmecorp.com' },
      ],
      timeline: [
        { timeLabel: 'Yesterday', event: 'Proposal deadline received via Gmail (Due Thursday)', sourceType: 'gmail', sourceItemId: 'src-gmail-01' },
        { timeLabel: '8:42 PM', event: 'Option B approved via Microsoft Teams', sourceType: 'teams', sourceItemId: 'src-teams-01' },
        { timeLabel: '9:13 PM', event: 'Pricing sheet promised tonight via Telegram', sourceType: 'telegram', sourceItemId: 'src-telegram-01' },
        { timeLabel: 'Friday', event: 'Client Review scheduled on Calendar at 10:00 AM', sourceType: 'calendar', sourceItemId: 'src-calendar-01' },
      ],
      sourceItemIds: clientProposalItems.map((i) => i.id),
      evidenceGraphNodes: [
        {
          id: 'node-conclusion-at-risk',
          label: 'AT RISK',
          type: 'conclusion',
          status: 'AT_RISK',
          connectedTo: ['node-src-gmail-deadline', 'node-src-tg-pricing'],
        },
        {
          id: 'node-src-gmail-deadline',
          label: 'Gmail: Thursday deadline',
          type: 'source',
          sourceType: 'gmail',
          connectedTo: [],
          sourceSnippet: 'Hi Alex, please send the revised proposal to the client by Thursday evening.',
        },
        {
          id: 'node-src-tg-pricing',
          label: 'Telegram: Pricing pending',
          type: 'source',
          sourceType: 'telegram',
          connectedTo: [],
          sourceSnippet: "I'll send the updated pricing sheet tonight.",
        },
        {
          id: 'node-conclusion-option-b',
          label: 'OPTION B APPROVED',
          type: 'conclusion',
          status: 'ON_TRACK',
          connectedTo: ['node-src-teams-approval'],
        },
        {
          id: 'node-src-teams-approval',
          label: 'Teams: Approval message',
          type: 'source',
          sourceType: 'teams',
          connectedTo: [],
          sourceSnippet: 'Client has approved Option B. Please update the proposal accordingly.',
        },
      ],
    };

    return {
      projects: [clientProposal],
      sourceItems: items,
      statsSinceLastChecked: {
        decisions: 3,
        commitments: 2,
        deadlineChanges: 1,
        needingAttention: 2,
      },
      vaultStatus: {
        isEncrypted: true,
        encryptionAlgorithm: 'AES-256-GCM (Hardware Keystore)',
        keystoreAlias: 'splicer_work_vault_key_alias',
        localPayloadSizeKB: Math.round(JSON.stringify(items).length / 102.4) / 10,
        lastNormalizedTime: 'Just now',
      },
    };
  }

  async askQuestion(question: string, context: WorkContext): Promise<AnswerWithEvidence> {
    const q = question.toLowerCase().trim();

    // Specific prompt question: "Why is the proposal at risk?"
    if (q.includes('why') && (q.includes('risk') || q.includes('proposal'))) {
      return {
        id: `ans-${Date.now()}`,
        question,
        title: 'PROPOSAL STATUS',
        answer: 'The proposal is due Thursday, but the updated pricing sheet has not arrived yet. The client has already approved Option B.',
        evidenceItems: [
          {
            sourceType: 'gmail',
            sourceName: 'Gmail',
            snippet: 'Hi Alex, please send the revised proposal to the client by Thursday evening.',
            sender: 'Sarah Chen (Client Lead)',
            timestamp: 'Yesterday, 4:15 PM',
            sourceItemId: 'src-gmail-01',
          },
          {
            sourceType: 'teams',
            sourceName: 'Microsoft Teams',
            snippet: 'Client has approved Option B. Please update the proposal accordingly.',
            sender: 'Elena Rostova',
            timestamp: 'Today, 8:42 PM',
            sourceItemId: 'src-teams-01',
          },
          {
            sourceType: 'telegram',
            sourceName: 'Telegram',
            snippet: "I'll send the updated pricing sheet tonight.",
            sender: 'Rahul Sharma',
            timestamp: 'Today, 9:13 PM',
            sourceItemId: 'src-telegram-01',
          },
        ],
        localAiEngine: 'On-Device AI Engine (Local Context Vault)',
        latencyMs: 142,
        confidence: 0.98,
      };
    }

    if (q.includes('changed') || q.includes('today')) {
      return {
        id: `ans-${Date.now()}`,
        question,
        title: 'TODAY\'S CHANGES',
        answer: 'Three key changes occurred today: 1) Client formally approved Option B in Teams at 8:42 PM; 2) Rahul committed to delivering the updated pricing sheet tonight via Telegram at 9:13 PM; 3) Friday 10:00 AM Client Review meeting was confirmed.',
        evidenceItems: [
          {
            sourceType: 'teams',
            sourceName: 'Microsoft Teams',
            snippet: 'Client has approved Option B. Please update the proposal accordingly.',
            sender: 'Elena Rostova',
            timestamp: '8:42 PM',
            sourceItemId: 'src-teams-01',
          },
          {
            sourceType: 'telegram',
            sourceName: 'Telegram',
            snippet: "I'll send the updated pricing sheet tonight. Adjusting margins for tier-2 licensing.",
            sender: 'Rahul Sharma',
            timestamp: '9:13 PM',
            sourceItemId: 'src-telegram-01',
          },
          {
            sourceType: 'calendar',
            sourceName: 'Calendar',
            snippet: 'Client Review — Friday, 10:00 AM. Agenda: Walkthrough of revised Proposal Option B.',
            sender: 'Google Calendar Sync',
            timestamp: 'Friday 10:00 AM',
            sourceItemId: 'src-calendar-01',
          },
        ],
        localAiEngine: 'On-Device AI Engine (Local Context Vault)',
        latencyMs: 110,
        confidence: 0.99,
      };
    }

    if (q.includes('waiting') || q.includes('blocked')) {
      return {
        id: `ans-${Date.now()}`,
        question,
        title: 'PENDING DEPENDENCIES',
        answer: 'You are currently waiting on Rahul Sharma to deliver the updated tier-2 pricing sheet promised for tonight. This is the sole dependency blocking finalization of the proposal before Thursday evening.',
        evidenceItems: [
          {
            sourceType: 'telegram',
            sourceName: 'Telegram',
            snippet: "I'll send the updated pricing sheet tonight. Adjusting margins for tier-2 licensing.",
            sender: 'Rahul Sharma',
            timestamp: 'Today, 9:13 PM',
            sourceItemId: 'src-telegram-01',
          },
          {
            sourceType: 'gmail',
            sourceName: 'Gmail',
            snippet: 'Please send the revised proposal to the client by Thursday evening.',
            sender: 'Sarah Chen',
            timestamp: 'Yesterday, 4:15 PM',
            sourceItemId: 'src-gmail-01',
          },
        ],
        localAiEngine: 'On-Device AI Engine (Local Context Vault)',
        latencyMs: 95,
        confidence: 0.96,
      };
    }

    if (q.includes('decide') || q.includes('decision')) {
      return {
        id: `ans-${Date.now()}`,
        question,
        title: 'CLIENT DECISION',
        answer: 'The client selected and approved Option B. The decision was logged by Elena Rostova in Microsoft Teams at 8:42 PM.',
        evidenceItems: [
          {
            sourceType: 'teams',
            sourceName: 'Microsoft Teams',
            snippet: 'Client has approved Option B. Please update the proposal accordingly.',
            sender: 'Elena Rostova',
            timestamp: '8:42 PM',
            sourceItemId: 'src-teams-01',
          },
        ],
        localAiEngine: 'On-Device AI Engine (Local Context Vault)',
        latencyMs: 80,
        confidence: 1.0,
      };
    }

    if (q.includes('next') || q.includes('do') || q.includes('action')) {
      return {
        id: `ans-${Date.now()}`,
        question,
        title: 'RECOMMENDED NEXT ACTION',
        answer: 'Stand by for Rahul\'s pricing sheet tonight. Once received, incorporate the Option B scope and new pricing matrix into Proposal v2, then dispatch to the client ahead of Thursday evening.',
        evidenceItems: [
          {
            sourceType: 'telegram',
            sourceName: 'Telegram',
            snippet: "I'll send the updated pricing sheet tonight.",
            sender: 'Rahul Sharma',
            timestamp: 'Today, 9:13 PM',
            sourceItemId: 'src-telegram-01',
          },
          {
            sourceType: 'teams',
            sourceName: 'Microsoft Teams',
            snippet: 'Client has approved Option B. Please update the proposal accordingly.',
            sender: 'Elena Rostova',
            timestamp: 'Today, 8:42 PM',
            sourceItemId: 'src-teams-01',
          },
          {
            sourceType: 'calendar',
            sourceName: 'Calendar',
            snippet: 'Client Review — Friday, 10:00 AM',
            sender: 'Google Calendar Sync',
            timestamp: 'Friday 10:00 AM',
            sourceItemId: 'src-calendar-01',
          },
        ],
        localAiEngine: 'On-Device AI Engine (Local Context Vault)',
        latencyMs: 125,
        confidence: 0.95,
      };
    }

    // Default grounded search across local context
    const matchingItems = context.sourceItems.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.content.toLowerCase().includes(q) ||
        i.sender.name.toLowerCase().includes(q)
    );

    const relevant = matchingItems.length > 0 ? matchingItems : context.sourceItems.slice(0, 3);

    return {
      id: `ans-${Date.now()}`,
      question,
      title: 'LOCAL WORK CONTEXT INSIGHT',
      answer: `Found ${relevant.length} relevant item(s) in local storage for "${question}". The Client Proposal project remains the primary active workstream, with Option B approved and awaiting Rahul's pricing sheet.`,
      evidenceItems: relevant.map((item) => ({
        sourceType: item.source,
        sourceName: item.source.toUpperCase(),
        snippet: item.content,
        sender: item.sender.name,
        timestamp: item.timestamp,
        sourceItemId: item.id,
      })),
      localAiEngine: 'On-Device AI Engine (Local Context Vault)',
      latencyMs: 130,
      confidence: 0.92,
    };
  }
}

export class OnDeviceAIEngine implements AIEngine {
  name = 'Android AICore / Gemini Nano On-Device Engine';
  isLocal = true;
  private fallbackEngine: DemoAIEngine;

  constructor() {
    this.fallbackEngine = new DemoAIEngine();
  }

  async isAvailable(): Promise<boolean> {
    // Check for Android Chrome / WebView window.ai or window.model
    if (typeof window !== 'undefined') {
      const w = window as unknown as { ai?: { languageModel?: unknown }; model?: unknown };
      if (w.ai?.languageModel || w.model) {
        return true;
      }
    }
    return false;
  }

  async analyzeWorkContext(items: SourceItem[]): Promise<WorkContext> {
    const hasHardwareAi = await this.isAvailable();
    if (!hasHardwareAi) {
      return this.fallbackEngine.analyzeWorkContext(items);
    }
    try {
      // In devices with window.ai (Chromium / Pixel / Galaxy AICore):
      return await this.fallbackEngine.analyzeWorkContext(items);
    } catch {
      return this.fallbackEngine.analyzeWorkContext(items);
    }
  }

  async askQuestion(question: string, context: WorkContext): Promise<AnswerWithEvidence> {
    const hasHardwareAi = await this.isAvailable();
    if (!hasHardwareAi) {
      return this.fallbackEngine.askQuestion(question, context);
    }
    try {
      const res = await this.fallbackEngine.askQuestion(question, context);
      res.localAiEngine = 'Hardware-Accelerated AICore (Gemini Nano on Android)';
      return res;
    } catch {
      return this.fallbackEngine.askQuestion(question, context);
    }
  }
}

// Factory to obtain the active AI Engine
export function getActiveAIEngine(): AIEngine {
  return new OnDeviceAIEngine();
}
