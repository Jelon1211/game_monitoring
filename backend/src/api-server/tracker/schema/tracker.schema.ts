export const monitorPlayersSchema = {
  type: "object",
  properties: {
    platform: {
      type: "string",
      enum: ["WooCommerce", "PrestaShop", "Apilo", "BaseLinker"],
      minLength: 1,
    },
    integrationName: {
      type: "string",
      minLength: 1,
    },
    siteUrl: {
      type: ["string", "null"],
      minLength: 1,
    },
    xblToken: {
      type: ["string"],
      minLength: 1,
    },
  },
  additionalProperties: false,
  required: ["platform", "integrationName", "siteUrl"],
};
