import Stripe from 'stripe';
import {z} from 'zod';
import type {Context} from '@/shared/configuration';
import type {Tool} from '@/shared/tools';

export const retrieveAccountPrompt = (_context: Context = {}) => `
This tool will retrieve a V2 account from Stripe.

It takes the following arguments:
- account_id (str, required): The ID of the account to retrieve.
- include (array, optional): Additional fields to include in the response. Examples: ['configuration.customer'], ['identity', 'defaults'], ['requirements'].
`;

export const retrieveAccountParameters = (
  _context: Context = {}
): z.AnyZodObject =>
  z.object({
    account_id: z.string().describe('The ID of the account to retrieve'),
    include: z
      .array(
        z.enum([
          'configuration.customer',
          'configuration.merchant',
          'configuration.recipient',
          'configuration.storer',
          'defaults',
          'identity',
          'requirements',
        ])
      )
      .optional()
      .describe('Additional fields to include in the response'),
  });

export const retrieveAccountAnnotations = () => ({
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
  readOnlyHint: true,
  title: 'Retrieve V2 account',
});

export const retrieveAccount = async (
  stripe: Stripe,
  context: Context,
  params: z.infer<ReturnType<typeof retrieveAccountParameters>>
) => {
  try {
    const {account_id: accountId, include} = params;

    const requestOptions: Stripe.V2.Core.AccountRetrieveParams = {};

    if (include) {
      requestOptions.include = include;
    }

    const account = await stripe.v2.core.accounts.retrieve(
      accountId,
      requestOptions,
      context.account ? {stripeAccount: context.account} : undefined
    );

    return account;
  } catch (error) {
    // console.log('ERROR:\n', (error as any).userMessage);
    return (error as any).raw;
  }
};

const tool = (context: Context): Tool => ({
  method: 'retrieve_account',
  name: 'Retrieve Account',
  description: retrieveAccountPrompt(context),
  parameters: retrieveAccountParameters(context),
  annotations: retrieveAccountAnnotations(),
  actions: {
    accounts: {
      read: true,
    },
  },
  execute: retrieveAccount,
});

export default tool;
