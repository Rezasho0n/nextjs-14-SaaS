import { Amplify } from 'aws-amplify';
import awsmobile from '@/aws-exports';  
import { generateClient } from '@aws-amplify/api';

Amplify.configure(awsmobile);

export const client = generateClient({
  authMode: 'apiKey',
  authToken: awsmobile.aws_appsync_apiKey,
});