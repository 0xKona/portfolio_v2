import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { Stack, Tags, CfnOutput } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage
});

// Tag the root stack
const rootStack = backend.stack;
Tags.of(rootStack).add('Application', 'Portfolio');

function applyProjectTags(stack: Stack, component: string) {
  const environment = process.env.AWS_BRANCH || process.env.NODE_ENV || 'sandbox';
  const branch = process.env.AWS_BRANCH || 'sandbox';
  
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

/*========== NAMING RESOURCES ==========*/

// Customize Cognito User Pool name
const environment = process.env.AWS_BRANCH || 'sandbox';
// Use AWS account ID suffix (last 8 chars) - this ensures same name per AWS account + environment
// so resources persist across redeployments in the same environment/account
const accountIdSuffix = process.env.AWS_ACCOUNT_ID?.slice(-8) || 'developer'.slice(0, 8);
const { cfnUserPool } = backend.auth.resources.cfnResources;

cfnUserPool.userPoolName = `portfolio-v2-users-${environment}-${accountIdSuffix}`;
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true
}

// Customize User Pool Client name
const { cfnUserPoolClient } = backend.auth.resources.cfnResources;
cfnUserPoolClient.clientName = `portfolio-v2-client-${environment}-${accountIdSuffix}`;

// S3 Bucket
const { cfnBucket } = backend.storage.resources.cfnResources;
cfnBucket.bucketName = `portfolio-v2-images-${environment}-${accountIdSuffix}`.toLowerCase();

// DynamoDB Tables
const { cfnResources } = backend.data.resources;
const tables = cfnResources.cfnTables;

Object.entries(tables).forEach(([key, table]) => {
  const modelName = key.split('-')[0]; // Extract model name from generated key
  if (modelName === 'PortfolioSkillV2') {
    table.tableName = `portfolio-v2-skill-${environment}-${accountIdSuffix}`;
  } else if (modelName === 'PortfolioProjectV2') {
    table.tableName = `portfolio-v2-project-${environment}-${accountIdSuffix}`;
  }
});

// Apply tags to all stacks
applyProjectTags(authStack, 'Auth');
applyProjectTags(dataStack, 'Data');
applyProjectTags(storageStack, 'Storage');

// Output stack ARN for Application Manager association
new CfnOutput(rootStack, 'RootStackArn', {
  value: rootStack.stackId,
  description: 'Root stack ARN for AWS Application Manager',
  exportName: `${rootStack.stackName}-arn`
});