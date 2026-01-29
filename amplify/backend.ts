import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { Stack, Tags } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage
});

function applyProjectTags(stack: Stack, component: string) {
  const environment = process.env.AWS_BRANCH || process.env.NODE_ENV || 'local';
  const branch = process.env.AWS_BRANCH || 'local';
  
  Tags.of(stack).add('Application', 'Portfolio');
  Tags.of(stack).add('Component', component);
  Tags.of(stack).add('Environment', environment);
  Tags.of(stack).add('Branch', branch);
  Tags.of(stack).add('ManagedBy', 'Amplify-Gen2');
}

// Get the underlying CDK stacks
const authStack = Stack.of(backend.auth.resources.userPool);
const dataStack = Stack.of(backend.data);
const storageStack = Stack.of(backend.storage.resources.bucket);

// Apply tags to auth stack
applyProjectTags(authStack, 'Auth');
applyProjectTags(dataStack, 'Data');
applyProjectTags(storageStack, 'Storage');

/*========== NAMING RESOURCES ==========*/

// Customize Cognito User Pool name
const environment = process.env.AWS_BRANCH || 'local';
const { cfnUserPool } = backend.auth.resources.cfnResources;

cfnUserPool.userPoolName = `portfolio-v2-${environment}-users`;
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true
}

// Customize User Pool Client name
const { cfnUserPoolClient } = backend.auth.resources.cfnResources;
cfnUserPoolClient.clientName = `portfolio-v2-${environment}-client`;

// S3 Bucket
const { cfnBucket } = backend.storage.resources.cfnResources;
cfnBucket.bucketName = `portfolio-v2-${environment}-images`;

// DynamoDB Tables
const { cfnResources } = backend.data.resources;
cfnResources.cfnTables['Skill'].tableName = `portfolio-v2-${environment}-Skill`;
cfnResources.cfnTables['Project'].tableName = `portfolio-v2-${environment}-Project`;