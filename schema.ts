// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  image,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  Admin: list({
    access: allowAll,
    ui: {
      isHidden: false
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
  Position: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      // tabel Position berhubungan dengan tabel teamMember melalui column position.
      // satu Position bisa punya banyak teamMember
      team: relationship({ 
        ref: 'TeamMember.position', 
        many: true,
        ui: {
          displayMode: 'cards',
          cardFields: ['fullname'],
          inlineEdit: { fields: ['fullname'] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),
    },
  }),
  TeamMember: list({
    access: allowAll,
    fields: {
      fullname: text({ validation: { isRequired: true } }),
      nickname: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true } }),
      // tabel teamMember berhubungan dengan tabel Position melalui column team.
      // satu teamMember punya satu Position
      position: relationship({ 
        ref: 'Position.team', 
        many: false,
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),
      profile: image({ storage: 'profile_storage' }),
    },
  }),
};
