import { KeystoneContext } from '@keystone-6/core/types';
import { gql } from 'graphql-tag';

export const seedData = async (context: KeystoneContext) => {
  const mutation = gql`
    mutation Company_Information($name: String!, $address: String!) {
        createCompany_Information(data: { name: $name, address: $address }) {
          id
          name
          address
        }
      }
  `;

  const companyData = {
    name: 'Company ABC',
    address: '123 Main Street',
  };

  await context.graphql.raw({
    query: mutation,
    variables: companyData,
  });
};