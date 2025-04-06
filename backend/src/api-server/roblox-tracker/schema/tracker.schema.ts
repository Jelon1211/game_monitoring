const baseSchema = {
  type: "object",
  properties: {
    server_id: {type: "string", minLength: 1},
    event_type: {type: "string"},
    data: {type: "array", items: {}},
  },
  additionalProperties: false,
  required: ["server_id", "event_type", "data"],
};

const userProperties = {
  userid: {type: "number", minimum: 1},
  name: {type: "string", minLength: 1},
};

const positionProperties = {
  type: "object",
  properties: {
    x: {type: "number"},
    y: {type: "number"},
    z: {type: "number"},
  },
  additionalProperties: false,
  nullable: true,
};

const playerLeaveProperties = {
  ...userProperties,
  session_duration: {type: "number", minimum: 1},
};

const playerDeathProperties = {
  ...userProperties,
  death_cause: {type: "string", minLength: 1},
  position: positionProperties,
};

export const serverRestartSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    event_type: {type: "string", enum: ["server_restart"]},
    data: {
      type: "object",
      properties: {
        uptime: {type: "number", minimum: 0},
        reason: {type: "string", minLength: 1},
      },
      additionalProperties: false,
      required: ["uptime", "reason"],
    },
  },
} as const;

export const serverStatusSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    event_type: {type: "string", enum: ["server_status"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          max_players: {type: "number", minimum: 1},
          uptime: {type: "number", minimum: 0},
          online_count: {type: "number", minimum: 0},
          server_load: {type: "number", minimum: 0, maximum: 1000},
          map_name: {type: "number"},
        },
        additionalProperties: false,
        required: [
          "max_players",
          "uptime",
          "online_count",
          "server_load",
          "map_name",
        ],
      },
    },
  },
} as const;

export const activeUsersSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    event_type: {type: "string", enum: ["active_users"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...userProperties,
          // session_duration: {type: "number", minimum: 0},
          // join_time: {type: "number"},
          position: positionProperties,
          timestamp: {type: "number"},
        },
        additionalProperties: false,
        required: ["name", "userid"],
      },
    },
  },
} as const;

export const playerJoinSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    event_type: {type: "string", enum: ["player_join"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ...userProperties,
          join_time: {type: "number", minimum: 1},
          device_type: {
            type: "string",
            enum: ["Mobile", "PC", "Console", "Unknown"],
          },
        },
        additionalProperties: false,
        required: ["userid", "name", "join_time"],
      },
    },
  },
} as const;

export const playerLeaveSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    event_type: {type: "string", enum: ["player_leave"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: playerLeaveProperties,
        additionalProperties: false,
        required: ["userid", "name", "session_duration"],
      },
    },
  },
} as const;

export const gamepassPurchaseSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    event_type: {type: "string", enum: ["gamepass_purchase"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          player: {type: "string", minLength: 1},
          pass_id: {type: "number", minimum: 1},
        },
        additionalProperties: false,
        required: ["player", "pass_id"],
      },
    },
  },
} as const;

export const playerDeathSchema = {
  ...baseSchema,
  properties: {
    ...baseSchema.properties,
    event_type: {type: "string", enum: ["player_death"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: playerDeathProperties,
        additionalProperties: false,
        required: ["userid", "name", "death_cause"],
      },
    },
  },
} as const;
