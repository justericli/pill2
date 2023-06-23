// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Listings, UntitledJSON } = initSchema(schema);

export {
  Listings,
  UntitledJSON
};