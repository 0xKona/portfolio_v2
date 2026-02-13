import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// Database schema
const schema = a.schema({
  // Custom Type for a image
  PortfolioProjectImageV2: a.customType({
    url: a.string().required(),
    alt: a.string().required(),
    caption: a.string(),
  }),

  // Custom enum
  PortfolioProjectStatusV2: a.enum([
    'published',
    'draft',
  ]),

  // Project Model
  PortfolioProjectV2: a.model({
    name: a.string().required(),
    desc: a.string(),
    images: a.ref('PortfolioProjectImageV2').array(),
    video: a.string(),
    // store skill identifiers or names as strings instead of referencing the model
    skills: a.string().array(),
    githubUrl: a.string(),
    demoUrl: a.string(),
    isFeatured: a.boolean().required(),
    status: a.ref('PortfolioProjectStatusV2').required(),
  }).authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read", "create", "update", "delete"])
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
  name: 'portfolio_v2_data',
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
