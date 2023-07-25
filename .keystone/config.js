"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var lists = {
  Admin: (0, import_core.list)({
    access: import_access.allowAll,
    ui: {
      isHidden: false
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Position: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      // tabel Position berhubungan dengan tabel teamMember melalui column position.
      // satu Position bisa punya banyak teamMember
      team: (0, import_fields.relationship)({
        ref: "Team_Member.position",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["fullname"],
          inlineEdit: { fields: ["fullname"] },
          linkToItem: true,
          inlineConnect: true
        }
      })
    }
  }),
  Team_Member: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      fullname: (0, import_fields.text)({ validation: { isRequired: true } }),
      nickname: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ validation: { isRequired: true } }),
      // tabel teamMember berhubungan dengan tabel Position melalui column team.
      // satu teamMember punya satu Position
      position: (0, import_fields.relationship)({
        ref: "Position.team",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true
        }
      }),
      profile: (0, import_fields.image)({ storage: "profile_storage" })
    }
  }),
  Company_Information: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      address: (0, import_fields.text)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updatedAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "Admin",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// seeder.ts
var import_graphql_tag = require("graphql-tag");
var seedData = async (context) => {
  const mutation = import_graphql_tag.gql`
    mutation Company_Information($name: String!, $address: String!) {
        createCompany_Information(data: { name: $name, address: $address }) {
          id
          name
          address
        }
      }
  `;
  const companyData = {
    name: "Company ABC",
    address: "123 Main Street"
  };
  await context.graphql.raw({
    query: mutation,
    variables: companyData
  });
};

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "mysql",
      url: "mysql://root:yudha@localhost:3306/learnkeystone6",
      enableLogging: true,
      idField: { kind: "autoincrement" },
      onConnect: async (context) => {
        const isEmpty = await context.db.Company_Information.count();
        if (isEmpty === 0) {
          await seedData(context);
        }
      }
    },
    server: {
      cors: { origin: ["http://localhost:3000"], credentials: true },
      port: 5e3,
      maxFileSize: 200 * 1024 * 1024,
      healthCheck: {
        path: "/my-health-check",
        data: () => ({
          status: "healthy",
          timestamp: Date.now(),
          uptime: process.uptime()
        })
      }
    },
    storage: {
      profile_storage: {
        kind: "local",
        type: "image",
        generateUrl: (path) => `http://localhost:5000/images${path}`,
        serverRoute: {
          path: "/images"
        },
        storagePath: "public/images"
      }
    },
    lists,
    session
  })
);
