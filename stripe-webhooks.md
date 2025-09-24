# Stripe Webhooks Setup (Local Development)

This document describes how to set up a local development environment
for Stripe and listen to webhooks.

---

## 1. Install Stripe CLI

Stripe CLI is required to forward events from Stripe to your local
server.

-   [Installation guide](https://stripe.com/docs/stripe-cli#install)

Example for macOS (Homebrew):

```bash
brew install stripe/stripe-cli/stripe
```

For Linux/Windows, see the link above.

Check installation:

```bash
stripe version
```

---

## 2. Authenticate with Stripe CLI

```bash
stripe login
```

A browser window will open where you need to grant access. After this,
the CLI will be linked to your account.

---

## 3. Configure `.env`

In your `.env.local`, add the following keys:

```env
# Stripe API key
STRIPE_SECRET_KEY=sk_test_*************

# Webhook secret (will be filled after setting up CLI)
STRIPE_WEBHOOK_SECRET=whsec_*************
```

---

## 4. Run Local Server

Assume your Next.js/Express server listens for webhooks at:

    http://localhost:3000/api/webhooks/stripe

---

## 5. Forward Webhooks

In a separate terminal, run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Once started, CLI will show something like:

    Ready! Your webhook signing secret is whsec_1234567890

Copy `whsec_...` and paste it into `.env.local` as
`STRIPE_WEBHOOK_SECRET`.

---

## 6. Generate Test Events

You can manually send test events to verify your webhook handler.

Examples:

```bash
# Create a test checkout session.completed
stripe trigger checkout.session.completed

# Simulate subscription creation
stripe trigger customer.subscription.created

# Subscription update
stripe trigger customer.subscription.updated

# Subscription cancellation
stripe trigger customer.subscription.deleted
```

---

## 7. Debugging

-   Check CLI logs (`stripe listen`) to see incoming events.
-   On your server, handle only relevant events
    (`checkout.session.completed`, `customer.subscription.created`,
    `customer.subscription.updated`, `customer.subscription.deleted`).
-   Always verify event signatures using `STRIPE_WEBHOOK_SECRET`.

---

## 8. Useful Links

-   [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
-   [Testing Webhooks](https://stripe.com/docs/webhooks/test)
-   [Event Types](https://stripe.com/docs/api/events/types)
