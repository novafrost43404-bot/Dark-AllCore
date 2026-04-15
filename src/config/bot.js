import { logger } from '../utils/logger.js';


export const botConfig = {
  // =========================
  // BOT PREFIX
  // =========================
  prefix: "?",

  presence: {
    status: "online",
    activities: [
      {
        name: "Dark AllCore | Moderation & Utilities",
        type: 3,
      },
    ],
  },

  commands: {
    owners: process.env.OWNER_IDS?.split(",") || [],
    defaultCooldown: 3,
    deleteCommands: false,
    testGuildId: process.env.TEST_GUILD_ID,
  },

  applications: {
    defaultQuestions: [
      { question: "What is your Rec Room and Discord username?", required: true },
      { question: "How old are you?", required: true },
      { question: "What timezone are you in?", required: true },
      { question: "Do you have any previous staff experience? If yes, explain.", required: true },
      { question: "Why do you want to become a staff member?", required: true },
      { question: "What makes you different from other applicants?", required: true },
      { question: "How would you handle a rule-breaker in the server?", required: true },
      { question: "What would you do if two members were arguing in chat?", required: true },
      { question: "Are you active enough to support the server daily?", required: true },
      { question: "Anything else you want us to know about you?", required: false }
    ],

    statusColors: {
      pending: "#FFA500",
      approved: "#00FF00",
      denied: "#FF0000",
    },

    applicationCooldown: 24,
    deleteDeniedAfter: 7,
    deleteApprovedAfter: 30,
    managerRoles: [],
  },

  embeds: {
    colors: {
      primary: "#000000",
      secondary: "#FFFFFF",

      success: "#00C853",
      error: "#DC2626",
      warning: "#F39C12",
      info: "#2980B9",

      light: "#FFFFFF",
      dark: "#202225",
      gray: "#99AAB5",

      blurple: "#5865F2",
      green: "#57F287",
      yellow: "#FEE75C",
      fuchsia: "#EB459E",
      red: "#ED4245",
      black: "#000000",

      giveaway: {
        active: "#57F287",
        ended: "#ED4245",
      },

      ticket: {
        open: "#57F287",
        claimed: "#FAA61A",
        closed: "#ED4245",
        pending: "#99AAB5",
      },

      economy: "#F1C40F",
      birthday: "#E91E63",
      moderation: "#9B59B6",

      priority: {
        none: "#95A5A6",
        low: "#3498db",
        medium: "#2ecc71",
        high: "#f1c40f",
        urgent: "#e74c3c",
      },
    },

    footer: {
      text: "Dark AllCore",
      icon: null,
    },

    thumbnail: null,
    author: {
      name: null,
      icon: null,
      url: null,
    },
  },

  economy: {
    currency: {
      name: "coins",
      namePlural: "coins",
      symbol: "$",
    },

    startingBalance: 0,
    baseBankCapacity: 100000,
    dailyAmount: 100,
    workMin: 10,
    workMax: 100,
    begMin: 5,
    begMax: 50,
    robSuccessRate: 0.4,
    robFailJailTime: 3600000,
  },

  shop: {},

  tickets: {
    defaultCategory: null,
    supportRoles: [],

    priorities: {
      none: { emoji: "⚪", color: "#95A5A6", label: "None" },
      low: { emoji: "🟢", color: "#2ECC71", label: "Low" },
      medium: { emoji: "🟡", color: "#F1C40F", label: "Medium" },
      high: { emoji: "🔴", color: "#E74C3C", label: "High" },
      urgent: { emoji: "🚨", color: "#E91E63", label: "Urgent" },
    },

    defaultPriority: "none",
    archiveCategory: null,
    logChannel: null,
  },

  giveaways: {
    defaultDuration: 86400000,
    minimumWinners: 1,
    maximumWinners: 10,
    minimumDuration: 300000,
    maximumDuration: 2592000000,
    allowedRoles: [],
    bypassRoles: [],
  },

  birthday: {
    defaultRole: null,
    announcementChannel: null,
    timezone: "UTC",
  },

  verification: {
    defaultMessage: "Click verify to continue!",
    defaultButtonText: "Verify",

    autoVerify: {
      defaultCriteria: "none",
      defaultAccountAgeDays: 7,
      serverSizeThreshold: 1000,
      minAccountAge: 1,
      maxAccountAge: 365,
      sendDMNotification: true,

      criteria: {
        account_age: "Account must be older than specified days",
        server_size: "Auto verify small servers",
        none: "All users immediately"
      }
    },

    verificationCooldown: 5000,
    maxVerificationAttempts: 3,
    attemptWindow: 60000,
    logAllVerifications: true,
    keepAuditTrail: true,
  },

  welcome: {
    defaultWelcomeMessage:
      "Welcome {user} to {server}! We now have {memberCount} members!",
    defaultGoodbyeMessage:
      "{user} left the server.",
    defaultWelcomeChannel: null,
    defaultGoodbyeChannel: null,
  },

  counters: {
    defaults: {
      name: "{name} Counter",
      description: "Server counter",
      type: "voice",
      channelName: "{name}-{count}",
    },

    permissions: {
      deny: ["VIEW_CHANNEL"],
      allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK"],
    },

    messages: {
      created: "Created {name}",
      deleted: "Deleted {name}",
      updated: "Updated {name}",
    },

    types: {
      members: {
        name: "Members",
        getCount: (guild) => guild.memberCount.toString(),
      },
      bots: {
        name: "Bots",
        getCount: (guild) =>
          guild.members.cache.filter((m) => m.user.bot).size.toString(),
      },
      humans: {
        name: "Humans",
        getCount: (guild) =>
          guild.members.cache.filter((m) => !m.user.bot).size.toString(),
      },
    },
  },

  messages: {
    noPermission: "No permission.",
    cooldownActive: "Wait {time}",
    errorOccurred: "Error occurred.",
    missingPermissions: "Missing permissions.",
    commandDisabled: "Disabled.",
    maintenanceMode: "Maintenance mode.",
  },

  features: {
    economy: true,
    leveling: true,
    moderation: true,
    logging: true,
    welcome: true,
    tickets: true,
    giveaways: true,
    birthday: true,
    counter: true,
    verification: true,
    reactionRoles: true,
    joinToCreate: true,
    voice: true,
    search: true,
    tools: true,
    utility: true,
    community: true,
    fun: true,
  },

  // =========================
  // 🔥 ADDED SYSTEMS (YOU REQUESTED)
  // =========================

  database: {
    provider: "mongodb",
    collections: {
      users: "users",
      guilds: "guilds",
      analytics: "analytics",
      payments: "payments",
    },
  },

  premium: {
    enabled: true,

    roles: {
      premiumRoleId: null,
    },

    subscription: {
      enabled: true,
      provider: "stripe",
      currency: "usd",
      price: 5.0,
    },

    expiry: {
      enabled: true,
      checkInterval: 3600000,
      defaultDays: 30,
    },
  },

  api: {
    enabled: true,
    keyLength: 32,
    allowUserKeys: true,
    rateLimit: 60,
  },

  analytics: {
    enabled: true,
    tracking: {
      messages: true,
      commands: true,
      aiRequests: true,
      imageGenerations: true,
    },
    dashboard: {
      enabled: true,
      realtime: true,
    },
  },

  ai: {
    text: {
      enabled: true,
      model: "gpt-4o-mini",
    },

    images: {
      enabled: true,
      model: "gpt-image-1",
      variations: 4,
      size: "1024x1024",
    },
  },

  voice: {
    enabled: true,
    tts: true,
    voiceModel: "alloy",
    joinToSpeak: false,
  },

  dashboard: {
    enabled: true,

    features: {
      login: true,
      discordOAuth: true,
      stripePayments: true,

      controls: {
        toggleAI: true,
        toggleModeration: true,
        toggleImages: true,
        toggleVoice: true,
      },
    },
  },

  production: {
    enabled: true,
    port: 3000,
    usePM2: true,
    autoRestart: true,
  },
};


export function validateConfig(config) {
  const errors = [];

  if (!process.env.DISCORD_TOKEN && !process.env.TOKEN) {
    errors.push("Bot token is required");
  }

  if (!process.env.CLIENT_ID) {
    errors.push("Client ID is required");
  }

  return errors;
}

export const BotConfig = botConfig;

export function getColor(path, fallback = "#99AAB5") {
  const result = path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== undefined ? obj[key] : fallback),
      botConfig.embeds.colors,
    );

  if (typeof result === "string" && result.startsWith("#")) {
    return parseInt(result.replace("#", ""), 16);
  }

  return result;
}

export function getRandomColor() {
  const colors = Object.values(botConfig.embeds.colors).flatMap((color) =>
    typeof color === "string" ? color : Object.values(color),
  );
  return colors[Math.floor(Math.random() * colors.length)];
}

export default botConfig;



