export const monitorPlayersSchema = {
  type: "object",
  properties: {
    event: {type: "string"},
    server_id: {type: "string", minLength: 0},
    data: {
      type: "array",
      properties: {
        players_online: {
          type: "object",
          properties: {
            active_users: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {type: "string", minLength: 1},
                  userid: {type: "number"},
                  join_time: {type: "number"},
                  session_duration: {type: "number"},
                  position: {
                    type: ["object", "null"],
                    properties: {
                      x: {type: "number"},
                      y: {type: "number"},
                      z: {type: "number"},
                    },
                    required: ["x", "y", "z"],
                  },
                  device_type: {type: "string", enum: ["PC", "Mobile"]},
                },
                required: [
                  "name",
                  "userid",
                  "join_time",
                  "session_duration",
                  "device_type",
                ],
              },
            },
            server_stats: {
              type: "object",
              properties: {
                online_count: {type: "number"},
                max_players: {type: "number"},
                uptime: {type: "string"},
                server_load: {type: "number"},
                map_name: {type: "number"},
              },
              required: [
                "online_count",
                "max_players",
                "uptime",
                "server_load",
                "map_name",
              ],
            },
          },
        },
        player_join: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userid: {type: "number"},
              name: {type: "string", minLength: 1},
              join_time: {type: "number"},
            },
            required: ["userid", "name", "join_time"],
          },
        },
        player_leave: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userid: {type: "number"},
              name: {type: "string", minLength: 1},
              session_duration: {type: "number"},
            },
            required: ["userid", "name", "session_duration"],
          },
        },
        gamepass_purchase: {
          type: "array",
          items: {
            type: "object",
            properties: {
              player: {type: "string", minLength: 1},
              pass_id: {type: "number"},
            },
            required: ["player", "pass_id"],
          },
        },
        player_death: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userid: {type: "number"},
              name: {type: "string", minLength: 1},
              death_cause: {type: "string", minLength: 1},
              position: {
                type: ["object", "null"],
                properties: {
                  x: {type: "number"},
                  y: {type: "number"},
                  z: {type: "number"},
                },
                required: ["x", "y", "z"],
              },
            },
            required: ["userid", "name", "death_cause"],
          },
        },
        server_restart: {
          type: "object",
          properties: {
            uptime: {type: "string", minLength: 1},
            reason: {type: "string", minLength: 1},
          },
          required: ["uptime", "reason"],
        },
      },
      additionalProperties: false,
    },
  },
  required: ["event", "server_id", "data"],
  additionalProperties: false,
};

export const serverRestartSchema = {
  type: "object",
  properties: {
    server_id: {type: "string", minLength: 1},
    event_type: {type: "string", enum: ["server_restart"]},
    data: {
      type: "array",
      properties: {
        uptime: {type: "number", minimum: 0},
        reason: {type: "string", minLength: 1},
      },
      additionalProperties: false,
      required: ["uptime", "reason"],
    },
  },
  additionalProperties: false,
  required: ["server_id", "data"],
} as const;

export const serverStatusSchema = {
  type: "object",
  properties: {
    server_id: {type: "string", minLength: 1},
    event_type: {type: "string", enum: ["server_stats"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          max_players: {type: "number", minimum: 1},
          uptime: {type: "number", minLength: 1},
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
  additionalProperties: false,
  required: ["server_id", "event_type", "data"],
} as const;

export const activeUsersSchema = {
  type: "object",
  properties: {
    server_id: {type: "string", minLength: 1},
    event_type: {type: "string", enum: ["active_users"]},
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {type: "string", minLength: 1},
          session_duration: {type: "number", minimum: 0},
          userid: {type: "number"},
          join_time: {type: "number"},
          position: {
            type: "object",
            properties: {
              x: {type: "number"},
              y: {type: "number"},
              z: {type: "number"},
            },
            additionalProperties: false,
            nullable: true,
          },
          device_type: {type: "string", enum: ["Mobile", "PC", "Console"]},
        },
        additionalProperties: false,
        required: [
          "name",
          "session_duration",
          "userid",
          "join_time",
          "device_type",
        ],
      },
    },
  },
  additionalProperties: false,
  required: ["server_id", "event_type", "data"],
} as const;
