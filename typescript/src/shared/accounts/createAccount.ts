/* eslint-disable max-depth */
/* eslint-disable complexity */
import Stripe from 'stripe';
import {z} from 'zod';
import type {Context} from '@/shared/configuration';
import type {Tool} from '@/shared/tools';

export const createAccountPrompt = (_context: Context = {}) => `
This tool will create a V2 account in Stripe.

It takes the following arguments:
- display_name (str, optional): The display name for the account.
- contact_email (str, optional): The contact email address for the account.
- dashboard (str, optional): The Stripe dashboard access level. Either 'express', 'full', or 'none'.
- defaults_currency (str, optional): Three-letter ISO currency code for the account's default currency.
- defaults_locales (array, optional): Array of preferred locales (languages) ordered by preference. Examples: ['en-US'], ['en-US', 'es-ES'].
- defaults_responsibilities_fees_collector (str, optional): Who collects fees from this account. Either 'application' or 'stripe'.
- defaults_responsibilities_losses_collector (str, optional): Who is responsible for losses when this account can't pay back negative balances. Either 'application' or 'stripe'.
- include (array, optional): Additional fields to include in the response. Examples: ['configuration.customer'], ['identity', 'defaults'].
- metadata (object, optional): Set of key-value pairs for storing additional information about the account. Example: {'order_id': '12345', 'customer_type': 'premium'}.
- identity_country (str, optional): Two-letter country code (ISO 3166-1 alpha-2) where the account holder resides or business is established.
- identity_entity_type (str, optional): The entity type. Either 'company', 'government_entity', 'individual', or 'non_profit'.
- identity_business_details_registered_name (str, optional): The business legal name.
- identity_business_details_doing_business_as (str, optional): The name which is used by the business (DBA name).
- identity_business_details_structure (str, optional): The legal structure of the business. Examples: 'llc', 'corporation', 'partnership', etc.
- identity_business_details_phone (str, optional): The phone number of the business entity (e.g. +1 647 111 1111).
- identity_business_details_url (str, optional): The business's publicly available website.
- identity_business_details_product_description (str, optional): Internal-only description of the product sold or service provided by the business.
- identity_business_details_estimated_worker_count (int, optional): An estimated upper bound of employees, contractors, vendors, etc. currently working for the business.
- identity_business_details_annual_revenue_amount (int, optional): The annual revenue amount in the smallest currency unit (e.g., cents for USD).
- identity_business_details_monthly_estimated_revenue_amount (int, optional): The monthly estimated revenue amount in the smallest currency unit.
- identity_business_details_address_street_address (str, optional): Street address (including apartment, suite, unit, building, floor, etc.).
- identity_business_details_address_city (str, optional): City, district, suburb, town, or village.
- identity_business_details_address_state (str, optional): State, county, province, or region.
- identity_business_details_address_postal_code (str, optional): ZIP or postal code.
- identity_business_details_address_country (str, optional): Two-letter country code (ISO 3166-1 alpha-2).
- identity_business_details_id_number_type (str, optional): The type of identification number. Examples: 'tax_id', 'vat_id', 'registration_number', etc.
- identity_business_details_id_number_value (str, optional): The identification number value.
- identity_individual_given_name (str, optional): The individual's given name (first name).
- identity_individual_surname (str, optional): The individual's surname (last name or family name).
- identity_individual_email (str, optional): The individual's email address.
- identity_individual_phone (str, optional): The individual's phone number (e.g. +1 647 111 1111).
- identity_individual_date_of_birth (str, optional): The individual's date of birth in YYYY-MM-DD format.
- identity_individual_address_street_address (str, optional): Individual's street address (including apartment, suite, etc.).
- identity_individual_address_city (str, optional): Individual's city, district, suburb, town, or village.
- identity_individual_address_state (str, optional): Individual's state, county, province, or region.
- identity_individual_address_postal_code (str, optional): Individual's ZIP or postal code.
- identity_individual_address_country (str, optional): Individual's two-letter country code (ISO 3166-1 alpha-2).
- identity_individual_nationalities (str, optional): Comma-separated list of two-letter country codes for the individual's nationalities. Example: 'US,CA'.
- configuration_merchant_branding_primary_color (str, optional): Primary brand color as a hex code (e.g., #1A73E8).
- configuration_merchant_branding_secondary_color (str, optional): Secondary brand color as a hex code (e.g., #34A853).
- configuration_merchant_bacs_debit_payments_display_name (str, optional): Display name for BACS debit payments.
- configuration_merchant_card_payments_decline_on_avs_failure (bool, optional): Whether to decline charges that fail AVS checks.
- configuration_merchant_card_payments_decline_on_cvc_failure (bool, optional): Whether to decline charges that fail CVC checks.
- configuration_merchant_mcc (str, optional): 4-digit Merchant Category Code (MCC).
- configuration_merchant_statement_descriptor (str, optional): Statement descriptor (max 22 characters).
- configuration_merchant_statement_descriptor_prefix (str, optional): Statement descriptor prefix (max 10 characters).
- configuration_merchant_support_email (str, optional): Support email address for customer inquiries.
- configuration_merchant_support_phone (str, optional): Support phone number for customer inquiries (e.g. +1 647 111 1111).
- configuration_merchant_support_url (str, optional): Support URL for customer inquiries.
- configuration_merchant_support_address_street_address (str, optional): Support address street address (including apartment, suite, etc.).
- configuration_merchant_support_address_city (str, optional): Support address city, district, suburb, town, or village.
- configuration_merchant_support_address_state (str, optional): Support address state, county, province, or region.
- configuration_merchant_support_address_postal_code (str, optional): Support address ZIP or postal code.
- configuration_merchant_support_address_country (str, optional): Support address two-letter country code (ISO 3166-1 alpha-2).
- configuration_merchant_card_payment_capability_requested (bool, optional): Whether card payment capability is requested for this merchant.
- configuration_customer_automatic_indirect_tax_exempt (str, optional): Tax exemption status for automatic indirect tax. Either 'none', 'exempt', or 'reverse'.
- configuration_customer_automatic_indirect_tax_ip_address (str, optional): IP address to use for automatic indirect tax location determination.
- configuration_customer_automatic_indirect_tax_location_source (str, optional): Source for automatic indirect tax location. Either 'identity_address', 'ip_address', or 'shipping_address'.
- configuration_customer_billing_invoice_footer (str, optional): Default footer to be displayed on invoices for this customer.
- configuration_customer_billing_invoice_next_sequence (int, optional): The sequence to be used on the customer's next invoice. Defaults to 1.
- configuration_customer_billing_invoice_prefix (str, optional): The prefix for the customer used to generate unique invoice numbers. Must be 3–12 uppercase letters or numbers.
- configuration_customer_shipping_name (str, optional): Customer name for shipping information. Appears on invoices emailed to this customer.
- configuration_customer_shipping_phone (str, optional): Customer phone number for shipping (including extension).
- configuration_customer_shipping_address_line1 (str, optional): Shipping address line 1 (e.g., street, PO Box, or company name).
- configuration_customer_shipping_address_line2 (str, optional): Shipping address line 2 (e.g., apartment, suite, unit, or building).
- configuration_customer_shipping_address_city (str, optional): Shipping address city, district, suburb, town, or village.
- configuration_customer_shipping_address_state (str, optional): Shipping address state, county, province, or region.
- configuration_customer_shipping_address_postal_code (str, optional): Shipping address ZIP or postal code.
- configuration_customer_shipping_address_country (str, optional): Shipping address two-letter country code (ISO 3166-1 alpha-2).
- configuration_customer_capability_automatic_indirect_tax_requested (bool, optional): Whether to request automatic indirect tax capability for this customer. Generates requirements for enabling automatic indirect tax calculation on invoices or subscriptions.
- configuration_recipient_capability_bank_accounts_local_requested (bool, optional): Whether to request local bank account capability for this recipient. Enables OutboundPayments to linked bank accounts over local networks.
- configuration_recipient_capability_bank_accounts_wire_requested (bool, optional): Whether to request wire bank account capability for this recipient. Enables OutboundPayments to linked bank accounts over wire.
- configuration_recipient_capability_cards_requested (bool, optional): Whether to request cards capability for this recipient. Enables OutboundPayments to a card linked to this Account.
- configuration_recipient_capability_stripe_balance_stripe_transfers_requested (bool, optional): Whether to request stripe transfers capability for this recipient. Allows the account to receive /v1/transfers into their Stripe Balance.
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
    dashboard: z
      .enum(['express', 'full', 'none'])
      .optional()
      .describe('The Stripe dashboard access level'),
    defaults_currency: z
      .string()
      .length(3)
      .optional()
      .describe('Three-letter ISO currency code for the default currency'),
    defaults_locales: z
      .array(
        z.enum([
          'ar-SA',
          'bg',
          'bg-BG',
          'cs',
          'cs-CZ',
          'da',
          'da-DK',
          'de',
          'de-DE',
          'el',
          'el-GR',
          'en',
          'en-AU',
          'en-CA',
          'en-GB',
          'en-IE',
          'en-IN',
          'en-NZ',
          'en-SG',
          'en-US',
          'es',
          'es-419',
          'es-ES',
          'et',
          'et-EE',
          'fi',
          'fil',
          'fil-PH',
          'fi-FI',
          'fr',
          'fr-CA',
          'fr-FR',
          'he-IL',
          'hr',
          'hr-HR',
          'hu',
          'hu-HU',
          'id',
          'id-ID',
          'it',
          'it-IT',
          'ja',
          'ja-JP',
          'ko',
          'ko-KR',
          'lt',
          'lt-LT',
          'lv',
          'lv-LV',
          'ms',
          'ms-MY',
          'mt',
          'mt-MT',
          'nb',
          'nb-NO',
          'nl',
          'nl-NL',
          'pl',
          'pl-PL',
          'pt',
          'pt-BR',
          'pt-PT',
          'ro',
          'ro-RO',
          'ru',
          'ru-RU',
          'sk',
          'sk-SK',
          'sl',
          'sl-SI',
          'sv',
          'sv-SE',
          'th',
          'th-TH',
          'tr',
          'tr-TR',
          'vi',
          'vi-VN',
          'zh',
          'zh-Hans',
          'zh-Hant-HK',
          'zh-Hant-TW',
          'zh-HK',
          'zh-TW',
        ])
      )
      .optional()
      .describe('Array of preferred locales ordered by preference'),
    defaults_responsibilities_fees_collector: z
      .enum(['application', 'stripe'])
      .optional()
      .describe('Who collects fees from this account'),
    defaults_responsibilities_losses_collector: z
      .enum(['application', 'stripe'])
      .optional()
      .describe('Who is responsible for losses from this account'),
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
    metadata: z
      .record(z.string())
      .optional()
      .describe('Key-value pairs for storing additional information'),
    identity_country: z
      .string()
      .length(2)
      .optional()
      .describe('Two-letter ISO 3166-1 alpha-2 country code'),
    identity_entity_type: z
      .enum(['company', 'government_entity', 'individual', 'non_profit'])
      .optional()
      .describe('The entity type'),
    identity_business_details_registered_name: z
      .string()
      .optional()
      .describe('The business legal name'),
    identity_business_details_doing_business_as: z
      .string()
      .optional()
      .describe('The name used by the business (DBA name)'),
    identity_business_details_structure: z
      .enum([
        'cooperative',
        'free_zone_establishment',
        'free_zone_llc',
        'governmental_unit',
        'government_instrumentality',
        'incorporated_association',
        'incorporated_non_profit',
        'incorporated_partnership',
        'limited_liability_partnership',
        'llc',
        'multi_member_llc',
        'private_company',
        'private_corporation',
        'private_partnership',
        'public_company',
        'public_corporation',
        'public_listed_corporation',
        'public_partnership',
        'registered_charity',
        'single_member_llc',
        'sole_establishment',
        'sole_proprietorship',
        'tax_exempt_government_instrumentality',
        'trust',
        'unincorporated_association',
        'unincorporated_non_profit',
        'unincorporated_partnership',
      ])
      .optional()
      .describe('The legal structure of the business'),
    identity_business_details_phone: z
      .string()
      .optional()
      .describe('The phone number of the business entity'),
    identity_business_details_url: z
      .string()
      .url()
      .optional()
      .describe('The business publicly available website'),
    identity_business_details_product_description: z
      .string()
      .optional()
      .describe(
        'Internal-only description of the product sold or service provided'
      ),
    identity_business_details_estimated_worker_count: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Estimated upper bound of workers for the business'),
    identity_business_details_annual_revenue_amount: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe('Annual revenue amount in smallest currency unit'),
    identity_business_details_monthly_estimated_revenue_amount: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe('Monthly estimated revenue amount in smallest currency unit'),
    identity_business_details_address_street_address: z
      .string()
      .optional()
      .describe('Street address including apartment, suite, unit, etc.'),
    identity_business_details_address_city: z
      .string()
      .optional()
      .describe('City, district, suburb, town, or village'),
    identity_business_details_address_state: z
      .string()
      .optional()
      .describe('State, county, province, or region'),
    identity_business_details_address_postal_code: z
      .string()
      .optional()
      .describe('ZIP or postal code'),
    identity_business_details_address_country: z
      .string()
      .length(2)
      .optional()
      .describe('Two-letter country code (ISO 3166-1 alpha-2)'),
    identity_business_details_id_number_type: z
      .enum([
        'tax_id',
        'vat_id',
        'registration_number',
        'company_number',
        'business_number',
        'employer_identification_number',
        'gst_hst_number',
        'pst_number',
        'qst_number',
        'business_registration_number',
        'incorporation_number',
        'charity_number',
        'non_profit_number',
        'tax_file_number',
        'australian_business_number',
        'australian_company_number',
        'nz_company_number',
        'br_cnpj',
        'br_cpf',
        'mx_rfc',
        'cl_rut',
        'co_nit',
        'ec_ruc',
        'pe_ruc',
        'uy_ruc',
        've_rif',
      ])
      .optional()
      .describe('The type of identification number'),
    identity_business_details_id_number_value: z
      .string()
      .optional()
      .describe('The identification number value'),
    identity_individual_given_name: z
      .string()
      .optional()
      .describe('The individual given name (first name)'),
    identity_individual_surname: z
      .string()
      .optional()
      .describe('The individual surname (last name or family name)'),
    identity_individual_email: z
      .string()
      .email()
      .optional()
      .describe('The individual email address'),
    identity_individual_phone: z
      .string()
      .optional()
      .describe('The individual phone number'),
    identity_individual_date_of_birth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe('The individual date of birth in YYYY-MM-DD format'),
    identity_individual_address_street_address: z
      .string()
      .optional()
      .describe('Individual street address including apartment, suite, etc.'),
    identity_individual_address_city: z
      .string()
      .optional()
      .describe('Individual city, district, suburb, town, or village'),
    identity_individual_address_state: z
      .string()
      .optional()
      .describe('Individual state, county, province, or region'),
    identity_individual_address_postal_code: z
      .string()
      .optional()
      .describe('Individual ZIP or postal code'),
    identity_individual_address_country: z
      .string()
      .length(2)
      .optional()
      .describe('Individual two-letter country code (ISO 3166-1 alpha-2)'),
    identity_individual_nationalities: z
      .string()
      .regex(/^[A-Z]{2}(,[A-Z]{2})*$/)
      .optional()
      .describe(
        'Comma-separated list of two-letter country codes for nationalities'
      ),
    configuration_merchant_branding_primary_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional()
      .describe('Primary brand color as a hex code (e.g., #1A73E8)'),
    configuration_merchant_branding_secondary_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional()
      .describe('Secondary brand color as a hex code (e.g., #34A853)'),
    configuration_merchant_bacs_debit_payments_display_name: z
      .string()
      .optional()
      .describe('Display name for BACS debit payments'),
    configuration_merchant_card_payments_decline_on_avs_failure: z
      .boolean()
      .optional()
      .describe('Whether to decline charges that fail AVS checks'),
    configuration_merchant_card_payments_decline_on_cvc_failure: z
      .boolean()
      .optional()
      .describe('Whether to decline charges that fail CVC checks'),
    configuration_merchant_mcc: z
      .string()
      .length(4)
      .regex(/^\d{4}$/)
      .optional()
      .describe('4-digit Merchant Category Code (MCC)'),
    configuration_merchant_statement_descriptor: z
      .string()
      .max(22)
      .optional()
      .describe('Statement descriptor (max 22 characters)'),
    configuration_merchant_statement_descriptor_prefix: z
      .string()
      .max(10)
      .optional()
      .describe('Statement descriptor prefix (max 10 characters)'),
    configuration_merchant_support_email: z
      .string()
      .email()
      .optional()
      .describe('Support email address for customer inquiries'),
    configuration_merchant_support_phone: z
      .string()
      .optional()
      .describe('Support phone number for customer inquiries'),
    configuration_merchant_support_url: z
      .string()
      .url()
      .optional()
      .describe('Support URL for customer inquiries'),
    configuration_merchant_support_address_street_address: z
      .string()
      .optional()
      .describe(
        'Support address street address (including apartment, suite, etc.)'
      ),
    configuration_merchant_support_address_city: z
      .string()
      .optional()
      .describe('Support address city, district, suburb, town, or village'),
    configuration_merchant_support_address_state: z
      .string()
      .optional()
      .describe('Support address state, county, province, or region'),
    configuration_merchant_support_address_postal_code: z
      .string()
      .optional()
      .describe('Support address ZIP or postal code'),
    configuration_merchant_support_address_country: z
      .string()
      .length(2)
      .optional()
      .describe('Support address two-letter country code (ISO 3166-1 alpha-2)'),
    configuration_merchant_card_payment_capability_requested: z
      .boolean()
      .optional()
      .describe(
        'Whether card payment capability is requested for this merchant'
      ),
    configuration_customer_automatic_indirect_tax_exempt: z
      .enum(['none', 'exempt', 'reverse'])
      .optional()
      .describe(
        'Tax exemption status for automatic indirect tax. Either none, exempt, or reverse'
      ),
    configuration_customer_automatic_indirect_tax_ip_address: z
      .string()
      .optional()
      .describe(
        'IP address to use for automatic indirect tax location determination'
      ),
    configuration_customer_automatic_indirect_tax_location_source: z
      .enum(['identity_address', 'ip_address', 'shipping_address'])
      .optional()
      .describe('Source for automatic indirect tax location determination'),
    configuration_customer_billing_invoice_footer: z
      .string()
      .optional()
      .describe('Default footer to be displayed on invoices for this customer'),
    configuration_customer_billing_invoice_next_sequence: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("The sequence to be used on the customer's next invoice"),
    configuration_customer_billing_invoice_prefix: z
      .string()
      .min(3)
      .max(12)
      .regex(/^[A-Z0-9]+$/)
      .optional()
      .describe(
        'The prefix for the customer used to generate unique invoice numbers'
      ),
    configuration_customer_shipping_name: z
      .string()
      .optional()
      .describe('Customer name for shipping information'),
    configuration_customer_shipping_phone: z
      .string()
      .optional()
      .describe('Customer phone number for shipping (including extension)'),
    configuration_customer_shipping_address_line1: z
      .string()
      .optional()
      .describe(
        'Shipping address line 1 (e.g., street, PO Box, or company name)'
      ),
    configuration_customer_shipping_address_line2: z
      .string()
      .optional()
      .describe(
        'Shipping address line 2 (e.g., apartment, suite, unit, or building)'
      ),
    configuration_customer_shipping_address_city: z
      .string()
      .optional()
      .describe('Shipping address city, district, suburb, town, or village'),
    configuration_customer_shipping_address_state: z
      .string()
      .optional()
      .describe('Shipping address state, county, province, or region'),
    configuration_customer_shipping_address_postal_code: z
      .string()
      .optional()
      .describe('Shipping address ZIP or postal code'),
    configuration_customer_shipping_address_country: z
      .string()
      .length(2)
      .optional()
      .describe(
        'Shipping address two-letter country code (ISO 3166-1 alpha-2)'
      ),
    configuration_customer_capability_automatic_indirect_tax_requested: z
      .boolean()
      .optional()
      .describe(
        'Whether to request automatic indirect tax capability for this customer'
      ),
    configuration_recipient_capability_bank_accounts_local_requested: z
      .boolean()
      .optional()
      .describe(
        'Whether to request local bank account capability for this recipient'
      ),
    configuration_recipient_capability_bank_accounts_wire_requested: z
      .boolean()
      .optional()
      .describe(
        'Whether to request wire bank account capability for this recipient'
      ),
    configuration_recipient_capability_cards_requested: z
      .boolean()
      .optional()
      .describe('Whether to request cards capability for this recipient'),
    configuration_recipient_capability_stripe_balance_stripe_transfers_requested:
      z
        .boolean()
        .optional()
        .describe(
          'Whether to request stripe transfers capability for this recipient'
        ),
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
    const {
      defaults_currency: defaultsCurrency,
      defaults_locales: defaultsLocales,
      defaults_responsibilities_fees_collector: feesCollector,
      defaults_responsibilities_losses_collector: lossesCollector,
      identity_country: identityCountry,
      identity_entity_type: identityEntityType,
      identity_business_details_registered_name: businessRegisteredName,
      identity_business_details_doing_business_as: businessDoingBusinessAs,
      identity_business_details_structure: businessStructure,
      identity_business_details_phone: businessPhone,
      identity_business_details_url: businessUrl,
      identity_business_details_product_description: businessProductDescription,
      identity_business_details_estimated_worker_count:
        businessEstimatedWorkerCount,
      identity_business_details_annual_revenue_amount: annualRevenueAmount,
      identity_business_details_monthly_estimated_revenue_amount:
        monthlyRevenueAmount,
      identity_business_details_address_street_address: addressStreetAddress,
      identity_business_details_address_city: addressCity,
      identity_business_details_address_state: addressState,
      identity_business_details_address_postal_code: addressPostalCode,
      identity_business_details_address_country: addressCountry,
      identity_business_details_id_number_type: idNumberType,
      identity_business_details_id_number_value: idNumberValue,
      identity_individual_given_name: individualGivenName,
      identity_individual_surname: individualSurname,
      identity_individual_email: individualEmail,
      identity_individual_phone: individualPhone,
      identity_individual_date_of_birth: individualDateOfBirth,
      identity_individual_address_street_address:
        individualAddressStreetAddress,
      identity_individual_address_city: individualAddressCity,
      identity_individual_address_state: individualAddressState,
      identity_individual_address_postal_code: individualAddressPostalCode,
      identity_individual_address_country: individualAddressCountry,
      identity_individual_nationalities: individualNationalities,
      configuration_merchant_branding_primary_color:
        configurationMerchantBrandingPrimaryColor,
      configuration_merchant_branding_secondary_color:
        configurationMerchantBrandingSecondaryColor,
      configuration_merchant_bacs_debit_payments_display_name:
        configurationMerchantBacsDebitPaymentsDisplayName,
      configuration_merchant_card_payments_decline_on_avs_failure:
        configurationMerchantCardPaymentsDeclineOnAvsFailure,
      configuration_merchant_card_payments_decline_on_cvc_failure:
        configurationMerchantCardPaymentsDeclineOnCvcFailure,
      configuration_merchant_mcc: configurationMerchantMcc,
      configuration_merchant_statement_descriptor:
        configurationMerchantStatementDescriptor,
      configuration_merchant_statement_descriptor_prefix:
        configurationMerchantStatementDescriptorPrefix,
      configuration_merchant_support_email: configurationMerchantSupportEmail,
      configuration_merchant_support_phone: configurationMerchantSupportPhone,
      configuration_merchant_support_url: configurationMerchantSupportUrl,
      configuration_merchant_support_address_street_address:
        configurationMerchantSupportAddressStreetAddress,
      configuration_merchant_support_address_city:
        configurationMerchantSupportAddressCity,
      configuration_merchant_support_address_state:
        configurationMerchantSupportAddressState,
      configuration_merchant_support_address_postal_code:
        configurationMerchantSupportAddressPostalCode,
      configuration_merchant_support_address_country:
        configurationMerchantSupportAddressCountry,
      configuration_merchant_card_payment_capability_requested:
        configurationMerchantCardPaymentCapabilityRequested,
      configuration_customer_automatic_indirect_tax_exempt:
        configurationCustomerAutomaticIndirectTaxExempt,
      configuration_customer_automatic_indirect_tax_ip_address:
        configurationCustomerAutomaticIndirectTaxIpAddress,
      configuration_customer_automatic_indirect_tax_location_source:
        configurationCustomerAutomaticIndirectTaxLocationSource,
      configuration_customer_billing_invoice_footer:
        configurationCustomerBillingInvoiceFooter,
      configuration_customer_billing_invoice_next_sequence:
        configurationCustomerBillingInvoiceNextSequence,
      configuration_customer_billing_invoice_prefix:
        configurationCustomerBillingInvoicePrefix,
      configuration_customer_shipping_name: configurationCustomerShippingName,
      configuration_customer_shipping_phone: configurationCustomerShippingPhone,
      configuration_customer_shipping_address_line1:
        configurationCustomerShippingAddressLine1,
      configuration_customer_shipping_address_line2:
        configurationCustomerShippingAddressLine2,
      configuration_customer_shipping_address_city:
        configurationCustomerShippingAddressCity,
      configuration_customer_shipping_address_state:
        configurationCustomerShippingAddressState,
      configuration_customer_shipping_address_postal_code:
        configurationCustomerShippingAddressPostalCode,
      configuration_customer_shipping_address_country:
        configurationCustomerShippingAddressCountry,
      configuration_customer_capability_automatic_indirect_tax_requested:
        configurationCustomerCapabilityAutomaticIndirectTaxRequested,
      configuration_recipient_capability_bank_accounts_local_requested:
        configurationRecipientCapabilityBankAccountsLocalRequested,
      configuration_recipient_capability_bank_accounts_wire_requested:
        configurationRecipientCapabilityBankAccountsWireRequested,
      configuration_recipient_capability_cards_requested:
        configurationRecipientCapabilityCardsRequested,
      configuration_recipient_capability_stripe_balance_stripe_transfers_requested:
        configurationRecipientCapabilityStripeBalanceStripeTransfersRequested,
      ...otherParams
    } = params;

    const accountData: Stripe.V2.Core.AccountCreateParams = {
      ...otherParams,
    };

    if (
      defaultsCurrency ||
      defaultsLocales ||
      feesCollector ||
      lossesCollector
    ) {
      accountData.defaults = {} as Stripe.V2.Core.AccountCreateParams.Defaults;

      if (defaultsCurrency) {
        accountData.defaults.currency = defaultsCurrency;
      }

      if (defaultsLocales) {
        accountData.defaults.locales = defaultsLocales;
      }

      if (feesCollector || lossesCollector) {
        accountData.defaults.responsibilities = {
          fees_collector: feesCollector || null,
          losses_collector: lossesCollector || null,
        };
      }
    }

    if (
      identityCountry ||
      identityEntityType ||
      individualGivenName ||
      individualSurname ||
      individualEmail ||
      individualPhone ||
      individualDateOfBirth ||
      individualAddressStreetAddress ||
      individualAddressCity ||
      individualAddressState ||
      individualAddressPostalCode ||
      individualAddressCountry ||
      individualNationalities ||
      businessRegisteredName ||
      businessDoingBusinessAs ||
      businessStructure ||
      businessPhone ||
      businessUrl ||
      businessProductDescription ||
      businessEstimatedWorkerCount ||
      annualRevenueAmount ||
      monthlyRevenueAmount ||
      addressStreetAddress ||
      addressCity ||
      addressState ||
      addressPostalCode ||
      addressCountry ||
      idNumberType ||
      idNumberValue
    ) {
      accountData.identity = {} as Stripe.V2.Core.AccountCreateParams.Identity;

      if (identityCountry) {
        accountData.identity.country = identityCountry;
      }

      if (identityEntityType) {
        accountData.identity.entity_type = identityEntityType;
      }

      if (
        individualGivenName ||
        individualSurname ||
        individualEmail ||
        individualPhone ||
        individualDateOfBirth ||
        individualAddressStreetAddress ||
        individualAddressCity ||
        individualAddressState ||
        individualAddressPostalCode ||
        individualAddressCountry ||
        individualNationalities
      ) {
        accountData.identity.individual =
          {} as Stripe.V2.Core.AccountCreateParams.Identity.Individual;

        if (individualGivenName) {
          accountData.identity.individual.given_name = individualGivenName;
        }

        if (individualSurname) {
          accountData.identity.individual.surname = individualSurname;
        }

        if (individualEmail) {
          accountData.identity.individual.email = individualEmail;
        }

        if (individualPhone) {
          accountData.identity.individual.phone = individualPhone;
        }

        if (individualDateOfBirth) {
          accountData.identity.individual.date_of_birth = individualDateOfBirth;
        }

        if (
          individualAddressStreetAddress ||
          individualAddressCity ||
          individualAddressState ||
          individualAddressPostalCode ||
          individualAddressCountry
        ) {
          accountData.identity.individual.address =
            {} as Stripe.V2.Core.AccountCreateParams.Identity.Individual.Address;

          if (individualAddressStreetAddress) {
            accountData.identity.individual.address.line1 =
              individualAddressStreetAddress;
          }

          if (individualAddressCity) {
            accountData.identity.individual.address.city =
              individualAddressCity;
          }

          if (individualAddressState) {
            accountData.identity.individual.address.state =
              individualAddressState;
          }

          if (individualAddressPostalCode) {
            accountData.identity.individual.address.postal_code =
              individualAddressPostalCode;
          }

          if (individualAddressCountry) {
            accountData.identity.individual.address.country =
              individualAddressCountry;
          }
        }

        if (individualNationalities) {
          accountData.identity.individual.nationalities =
            individualNationalities.split(',');
        }
      }

      if (
        businessRegisteredName ||
        businessDoingBusinessAs ||
        businessStructure ||
        businessPhone ||
        businessUrl ||
        businessProductDescription ||
        businessEstimatedWorkerCount ||
        annualRevenueAmount ||
        monthlyRevenueAmount ||
        addressStreetAddress ||
        addressCity ||
        addressState ||
        addressPostalCode ||
        addressCountry ||
        idNumberType ||
        idNumberValue
      ) {
        accountData.identity.business_details =
          {} as Stripe.V2.Core.AccountCreateParams.Identity.BusinessDetails;

        if (businessRegisteredName) {
          accountData.identity.business_details.registered_name =
            businessRegisteredName;
        }

        if (businessDoingBusinessAs) {
          accountData.identity.business_details.doing_business_as =
            businessDoingBusinessAs;
        }

        if (businessStructure) {
          accountData.identity.business_details.structure = businessStructure;
        }

        if (businessPhone) {
          accountData.identity.business_details.phone = businessPhone;
        }

        if (businessUrl) {
          accountData.identity.business_details.url = businessUrl;
        }

        if (businessProductDescription) {
          accountData.identity.business_details.product_description =
            businessProductDescription;
        }

        if (businessEstimatedWorkerCount) {
          accountData.identity.business_details.estimated_worker_count =
            businessEstimatedWorkerCount;
        }

        if (annualRevenueAmount) {
          accountData.identity.business_details.annual_revenue = {
            amount: annualRevenueAmount,
          };
        }

        if (monthlyRevenueAmount) {
          accountData.identity.business_details.monthly_estimated_revenue = {
            amount: monthlyRevenueAmount,
          };
        }

        if (
          addressStreetAddress ||
          addressCity ||
          addressState ||
          addressPostalCode ||
          addressCountry
        ) {
          accountData.identity.business_details.address =
            {} as Stripe.V2.Core.AccountCreateParams.Identity.BusinessDetails.Address;
          if (addressStreetAddress) {
            accountData.identity.business_details.address.line1 =
              addressStreetAddress;
          }
          if (addressCity) {
            accountData.identity.business_details.address.city = addressCity;
          }
          if (addressState) {
            accountData.identity.business_details.address.state = addressState;
          }
          if (addressPostalCode) {
            accountData.identity.business_details.address.postal_code =
              addressPostalCode;
          }
          if (addressCountry) {
            accountData.identity.business_details.address.country =
              addressCountry;
          }
        }

        if (idNumberType || idNumberValue) {
          accountData.identity.business_details.id_numbers =
            [] as Stripe.V2.Core.AccountCreateParams.Identity.BusinessDetails.IdNumber[];
          const idNumber =
            {} as Stripe.V2.Core.AccountCreateParams.Identity.BusinessDetails.IdNumber;

          if (idNumberType) {
            idNumber.type = idNumberType;
          }
          if (idNumberValue) {
            idNumber.value = idNumberValue;
          }

          if (Object.keys(idNumber).length > 0) {
            accountData.identity.business_details.id_numbers.push(idNumber);
          }
        }
      }
    }

    if (
      configurationMerchantBrandingPrimaryColor !== undefined ||
      configurationMerchantBrandingSecondaryColor !== undefined ||
      configurationMerchantBacsDebitPaymentsDisplayName !== undefined ||
      configurationMerchantCardPaymentsDeclineOnAvsFailure !== undefined ||
      configurationMerchantCardPaymentsDeclineOnCvcFailure !== undefined ||
      configurationMerchantMcc !== undefined ||
      configurationMerchantStatementDescriptor !== undefined ||
      configurationMerchantStatementDescriptorPrefix !== undefined ||
      configurationMerchantSupportEmail !== undefined ||
      configurationMerchantSupportPhone !== undefined ||
      configurationMerchantSupportUrl !== undefined ||
      configurationMerchantSupportAddressStreetAddress !== undefined ||
      configurationMerchantSupportAddressCity !== undefined ||
      configurationMerchantSupportAddressState !== undefined ||
      configurationMerchantSupportAddressPostalCode !== undefined ||
      configurationMerchantSupportAddressCountry !== undefined ||
      configurationMerchantCardPaymentCapabilityRequested !== undefined ||
      configurationCustomerAutomaticIndirectTaxExempt !== undefined ||
      configurationCustomerAutomaticIndirectTaxIpAddress !== undefined ||
      configurationCustomerAutomaticIndirectTaxLocationSource !== undefined ||
      configurationCustomerBillingInvoiceFooter !== undefined ||
      configurationCustomerBillingInvoiceNextSequence !== undefined ||
      configurationCustomerBillingInvoicePrefix !== undefined ||
      configurationCustomerShippingName !== undefined ||
      configurationCustomerShippingPhone !== undefined ||
      configurationCustomerShippingAddressLine1 !== undefined ||
      configurationCustomerShippingAddressLine2 !== undefined ||
      configurationCustomerShippingAddressCity !== undefined ||
      configurationCustomerShippingAddressState !== undefined ||
      configurationCustomerShippingAddressPostalCode !== undefined ||
      configurationCustomerShippingAddressCountry !== undefined ||
      configurationCustomerCapabilityAutomaticIndirectTaxRequested !==
        undefined ||
      configurationRecipientCapabilityBankAccountsLocalRequested !==
        undefined ||
      configurationRecipientCapabilityBankAccountsWireRequested !== undefined ||
      configurationRecipientCapabilityCardsRequested !== undefined ||
      configurationRecipientCapabilityStripeBalanceStripeTransfersRequested !==
        undefined
    ) {
      accountData.configuration =
        {} as Stripe.V2.Core.AccountCreateParams.Configuration;

      if (
        configurationMerchantBrandingPrimaryColor !== undefined ||
        configurationMerchantBrandingSecondaryColor !== undefined ||
        configurationMerchantBacsDebitPaymentsDisplayName !== undefined ||
        configurationMerchantCardPaymentsDeclineOnAvsFailure !== undefined ||
        configurationMerchantCardPaymentsDeclineOnCvcFailure !== undefined ||
        configurationMerchantMcc !== undefined ||
        configurationMerchantStatementDescriptor !== undefined ||
        configurationMerchantStatementDescriptorPrefix !== undefined ||
        configurationMerchantSupportEmail !== undefined ||
        configurationMerchantSupportPhone !== undefined ||
        configurationMerchantSupportUrl !== undefined ||
        configurationMerchantSupportAddressStreetAddress !== undefined ||
        configurationMerchantSupportAddressCity !== undefined ||
        configurationMerchantSupportAddressState !== undefined ||
        configurationMerchantSupportAddressPostalCode !== undefined ||
        configurationMerchantSupportAddressCountry !== undefined ||
        configurationMerchantCardPaymentCapabilityRequested !== undefined
      ) {
        accountData.configuration.merchant =
          {} as Stripe.V2.Core.AccountCreateParams.Configuration.Merchant;

        if (
          configurationMerchantBrandingPrimaryColor !== undefined ||
          configurationMerchantBrandingSecondaryColor !== undefined
        ) {
          accountData.configuration.merchant.branding =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Merchant.Branding;

          if (configurationMerchantBrandingPrimaryColor !== undefined) {
            accountData.configuration.merchant.branding.primary_color =
              configurationMerchantBrandingPrimaryColor;
          }

          if (configurationMerchantBrandingSecondaryColor !== undefined) {
            accountData.configuration.merchant.branding.secondary_color =
              configurationMerchantBrandingSecondaryColor;
          }
        }

        if (configurationMerchantBacsDebitPaymentsDisplayName !== undefined) {
          accountData.configuration.merchant.bacs_debit_payments = {
            display_name: configurationMerchantBacsDebitPaymentsDisplayName,
          } as any;
        }

        if (
          configurationMerchantCardPaymentsDeclineOnAvsFailure !== undefined ||
          configurationMerchantCardPaymentsDeclineOnCvcFailure !== undefined
        ) {
          accountData.configuration.merchant.card_payments =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Merchant.CardPayments;

          if (
            configurationMerchantCardPaymentsDeclineOnAvsFailure !== undefined
          ) {
            accountData.configuration.merchant.card_payments.decline_on = {
              ...accountData.configuration.merchant.card_payments.decline_on,
              avs_failure: configurationMerchantCardPaymentsDeclineOnAvsFailure,
            };
          }

          if (
            configurationMerchantCardPaymentsDeclineOnCvcFailure !== undefined
          ) {
            accountData.configuration.merchant.card_payments.decline_on = {
              ...accountData.configuration.merchant.card_payments.decline_on,
              cvc_failure: configurationMerchantCardPaymentsDeclineOnCvcFailure,
            };
          }
        }

        if (configurationMerchantMcc !== undefined) {
          accountData.configuration.merchant.mcc = configurationMerchantMcc;
        }

        if (
          configurationMerchantStatementDescriptor !== undefined ||
          configurationMerchantStatementDescriptorPrefix !== undefined
        ) {
          accountData.configuration.merchant.statement_descriptor =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Merchant.StatementDescriptor;

          accountData.configuration.merchant.statement_descriptor.descriptor =
            configurationMerchantStatementDescriptor;

          accountData.configuration.merchant.statement_descriptor.prefix =
            configurationMerchantStatementDescriptorPrefix;
        }

        if (
          configurationMerchantSupportEmail !== undefined ||
          configurationMerchantSupportPhone !== undefined ||
          configurationMerchantSupportUrl !== undefined ||
          configurationMerchantSupportAddressStreetAddress !== undefined ||
          configurationMerchantSupportAddressCity !== undefined ||
          configurationMerchantSupportAddressState !== undefined ||
          configurationMerchantSupportAddressPostalCode !== undefined ||
          configurationMerchantSupportAddressCountry !== undefined
        ) {
          accountData.configuration.merchant.support =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Merchant.Support;

          if (configurationMerchantSupportEmail !== undefined) {
            accountData.configuration.merchant.support.email =
              configurationMerchantSupportEmail;
          }

          if (configurationMerchantSupportPhone !== undefined) {
            accountData.configuration.merchant.support.phone =
              configurationMerchantSupportPhone;
          }

          if (configurationMerchantSupportUrl !== undefined) {
            accountData.configuration.merchant.support.url =
              configurationMerchantSupportUrl;
          }

          if (
            configurationMerchantSupportAddressStreetAddress !== undefined ||
            configurationMerchantSupportAddressCity !== undefined ||
            configurationMerchantSupportAddressState !== undefined ||
            configurationMerchantSupportAddressPostalCode !== undefined ||
            configurationMerchantSupportAddressCountry !== undefined
          ) {
            accountData.configuration.merchant.support.address =
              {} as Stripe.V2.Core.AccountCreateParams.Configuration.Merchant.Support.Address;

            if (
              configurationMerchantSupportAddressStreetAddress !== undefined
            ) {
              accountData.configuration.merchant.support.address.line1 =
                configurationMerchantSupportAddressStreetAddress;
            }

            if (configurationMerchantSupportAddressCity !== undefined) {
              accountData.configuration.merchant.support.address.city =
                configurationMerchantSupportAddressCity;
            }

            if (configurationMerchantSupportAddressState !== undefined) {
              accountData.configuration.merchant.support.address.state =
                configurationMerchantSupportAddressState;
            }

            if (configurationMerchantSupportAddressPostalCode !== undefined) {
              accountData.configuration.merchant.support.address.postal_code =
                configurationMerchantSupportAddressPostalCode;
            }

            if (configurationMerchantSupportAddressCountry !== undefined) {
              accountData.configuration.merchant.support.address.country =
                configurationMerchantSupportAddressCountry;
            }
          }
        }

        if (configurationMerchantCardPaymentCapabilityRequested !== undefined) {
          accountData.configuration.merchant.capabilities =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Merchant.Capabilities;

          accountData.configuration.merchant.capabilities.card_payments = {
            requested: configurationMerchantCardPaymentCapabilityRequested,
          };
        }
      }

      if (
        configurationCustomerAutomaticIndirectTaxExempt !== undefined ||
        configurationCustomerAutomaticIndirectTaxIpAddress !== undefined ||
        configurationCustomerAutomaticIndirectTaxLocationSource !== undefined ||
        configurationCustomerBillingInvoiceFooter !== undefined ||
        configurationCustomerBillingInvoiceNextSequence !== undefined ||
        configurationCustomerBillingInvoicePrefix !== undefined ||
        configurationCustomerShippingName !== undefined ||
        configurationCustomerShippingPhone !== undefined ||
        configurationCustomerShippingAddressLine1 !== undefined ||
        configurationCustomerShippingAddressLine2 !== undefined ||
        configurationCustomerShippingAddressCity !== undefined ||
        configurationCustomerShippingAddressState !== undefined ||
        configurationCustomerShippingAddressPostalCode !== undefined ||
        configurationCustomerShippingAddressCountry !== undefined ||
        configurationCustomerCapabilityAutomaticIndirectTaxRequested !==
          undefined
      ) {
        accountData.configuration.customer =
          {} as Stripe.V2.Core.AccountCreateParams.Configuration.Customer;

        if (
          configurationCustomerAutomaticIndirectTaxExempt !== undefined ||
          configurationCustomerAutomaticIndirectTaxIpAddress !== undefined ||
          configurationCustomerAutomaticIndirectTaxLocationSource !== undefined
        ) {
          accountData.configuration.customer.automatic_indirect_tax =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Customer.AutomaticIndirectTax;

          if (configurationCustomerAutomaticIndirectTaxExempt !== undefined) {
            accountData.configuration.customer.automatic_indirect_tax.exempt =
              configurationCustomerAutomaticIndirectTaxExempt;
          }

          if (
            configurationCustomerAutomaticIndirectTaxIpAddress !== undefined
          ) {
            accountData.configuration.customer.automatic_indirect_tax.ip_address =
              configurationCustomerAutomaticIndirectTaxIpAddress;
          }

          if (
            configurationCustomerAutomaticIndirectTaxLocationSource !==
            undefined
          ) {
            accountData.configuration.customer.automatic_indirect_tax.location_source =
              configurationCustomerAutomaticIndirectTaxLocationSource;
          }
        }

        if (
          configurationCustomerBillingInvoiceFooter !== undefined ||
          configurationCustomerBillingInvoiceNextSequence !== undefined ||
          configurationCustomerBillingInvoicePrefix !== undefined
        ) {
          accountData.configuration.customer.billing =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Customer.Billing;

          accountData.configuration.customer.billing.invoice =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Customer.Billing.Invoice;

          if (configurationCustomerBillingInvoiceFooter !== undefined) {
            accountData.configuration.customer.billing.invoice.footer =
              configurationCustomerBillingInvoiceFooter;
          }

          if (configurationCustomerBillingInvoiceNextSequence !== undefined) {
            accountData.configuration.customer.billing.invoice.next_sequence =
              configurationCustomerBillingInvoiceNextSequence;
          }

          if (configurationCustomerBillingInvoicePrefix !== undefined) {
            accountData.configuration.customer.billing.invoice.prefix =
              configurationCustomerBillingInvoicePrefix;
          }
        }

        if (
          configurationCustomerShippingName !== undefined ||
          configurationCustomerShippingPhone !== undefined ||
          configurationCustomerShippingAddressLine1 !== undefined ||
          configurationCustomerShippingAddressLine2 !== undefined ||
          configurationCustomerShippingAddressCity !== undefined ||
          configurationCustomerShippingAddressState !== undefined ||
          configurationCustomerShippingAddressPostalCode !== undefined ||
          configurationCustomerShippingAddressCountry !== undefined
        ) {
          accountData.configuration.customer.shipping =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Customer.Shipping;

          if (configurationCustomerShippingName !== undefined) {
            accountData.configuration.customer.shipping.name =
              configurationCustomerShippingName;
          }

          if (configurationCustomerShippingPhone !== undefined) {
            accountData.configuration.customer.shipping.phone =
              configurationCustomerShippingPhone;
          }

          if (
            configurationCustomerShippingAddressLine1 !== undefined ||
            configurationCustomerShippingAddressLine2 !== undefined ||
            configurationCustomerShippingAddressCity !== undefined ||
            configurationCustomerShippingAddressState !== undefined ||
            configurationCustomerShippingAddressPostalCode !== undefined ||
            configurationCustomerShippingAddressCountry !== undefined
          ) {
            accountData.configuration.customer.shipping.address =
              {} as Stripe.AddressParam;

            if (configurationCustomerShippingAddressLine1 !== undefined) {
              accountData.configuration.customer.shipping.address.line1 =
                configurationCustomerShippingAddressLine1;
            }

            if (configurationCustomerShippingAddressLine2 !== undefined) {
              accountData.configuration.customer.shipping.address.line2 =
                configurationCustomerShippingAddressLine2;
            }

            if (configurationCustomerShippingAddressCity !== undefined) {
              accountData.configuration.customer.shipping.address.city =
                configurationCustomerShippingAddressCity;
            }

            if (configurationCustomerShippingAddressState !== undefined) {
              accountData.configuration.customer.shipping.address.state =
                configurationCustomerShippingAddressState;
            }

            if (configurationCustomerShippingAddressPostalCode !== undefined) {
              accountData.configuration.customer.shipping.address.postal_code =
                configurationCustomerShippingAddressPostalCode;
            }

            if (configurationCustomerShippingAddressCountry !== undefined) {
              accountData.configuration.customer.shipping.address.country =
                configurationCustomerShippingAddressCountry;
            }
          }
        }

        if (
          configurationCustomerCapabilityAutomaticIndirectTaxRequested !==
          undefined
        ) {
          accountData.configuration.customer.capabilities =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Customer.Capabilities;

          accountData.configuration.customer.capabilities.automatic_indirect_tax =
            {
              requested:
                configurationCustomerCapabilityAutomaticIndirectTaxRequested,
            };
        }
      }

      if (
        configurationRecipientCapabilityBankAccountsLocalRequested !==
          undefined ||
        configurationRecipientCapabilityBankAccountsWireRequested !==
          undefined ||
        configurationRecipientCapabilityCardsRequested !== undefined ||
        configurationRecipientCapabilityStripeBalanceStripeTransfersRequested !==
          undefined
      ) {
        accountData.configuration.recipient =
          {} as Stripe.V2.Core.AccountCreateParams.Configuration.Recipient;

        accountData.configuration.recipient.capabilities =
          {} as Stripe.V2.Core.AccountCreateParams.Configuration.Recipient.Capabilities;

        if (
          configurationRecipientCapabilityBankAccountsLocalRequested !==
            undefined ||
          configurationRecipientCapabilityBankAccountsWireRequested !==
            undefined
        ) {
          accountData.configuration.recipient.capabilities.bank_accounts =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Recipient.Capabilities.BankAccounts;

          if (
            configurationRecipientCapabilityBankAccountsLocalRequested !==
            undefined
          ) {
            accountData.configuration.recipient.capabilities.bank_accounts.local =
              {
                requested:
                  configurationRecipientCapabilityBankAccountsLocalRequested,
              };
          }

          if (
            configurationRecipientCapabilityBankAccountsWireRequested !==
            undefined
          ) {
            accountData.configuration.recipient.capabilities.bank_accounts.wire =
              {
                requested:
                  configurationRecipientCapabilityBankAccountsWireRequested,
              };
          }
        }

        if (configurationRecipientCapabilityCardsRequested !== undefined) {
          accountData.configuration.recipient.capabilities.cards = {
            requested: configurationRecipientCapabilityCardsRequested,
          };
        }

        if (
          configurationRecipientCapabilityStripeBalanceStripeTransfersRequested !==
          undefined
        ) {
          accountData.configuration.recipient.capabilities.stripe_balance =
            {} as Stripe.V2.Core.AccountCreateParams.Configuration.Recipient.Capabilities.StripeBalance;

          accountData.configuration.recipient.capabilities.stripe_balance.stripe_transfers =
            {
              requested:
                configurationRecipientCapabilityStripeBalanceStripeTransfersRequested,
            };
        }
      }
    }

    console.log('CREATE ACCOUNT REQUEST:');
    console.log(JSON.stringify(accountData, null, 2));

    const account = await stripe.v2.core.accounts.create(
      accountData,
      context.account ? {stripeAccount: context.account} : undefined
    );

    return account;
  } catch (error) {
    console.log('ERROR:\n', error);
    return error;
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
