import Stripe from 'stripe';
import {z} from 'zod';
import type {Context} from '@/shared/configuration';
import type {Tool} from '@/shared/tools';

export const createAccountPrompt = (_context: Context = {}) => `
This tool will create a V2 account in Stripe.

It takes the following arguments:
- display_name (str, optional): The display name for the account.
- contact_email (str, optional): The contact email address for the account.
`;

export const createAccountParameters = (
  _context: Context = {}
): z.AnyZodObject =>
  z.object({
    display_name: z
      .string()
      .optional()
      .describe('The display name for the account'),
    contact_email: z
      .string()
      .email()
      .optional()
      .describe('The contact email address for the account'),
  });

export const createAccountAnnotations = () => ({
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
  readOnlyHint: false,
  title: 'Create V2 account',
});

export const createAccount = async (
  stripe: Stripe,
  context: Context,
  params: z.infer<ReturnType<typeof createAccountParameters>>
) => {
  try {
    const account = await stripe.v2.core.accounts.create(
      params,
      context.account ? {stripeAccount: context.account} : undefined
    );

    return {id: account.id};
  } catch (error) {
    return 'Failed to create account';
  }
};

const tool = (context: Context): Tool => ({
  method: 'create_account',
  name: 'Create Account',
  description: createAccountPrompt(context),
  parameters: createAccountParameters(context),
  annotations: createAccountAnnotations(),
  actions: {
    accounts: {
      create: true,
    },
  },
  execute: createAccount,
});

export default tool;
