const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.plan.create({
    data: {
      slug: 'basic',
      name: 'Base plan name',
      description: 'Base plan description',
      active: true,
      stripeProductId: 'prod_T4ubje5FlD9bMS',
      prices: {
        create: {
          slug: 'price_base_monthly',
          interval: "month",
          amount: 1000,
          currency: "usd",
          stripePriceId: "price_1S8km6BlchQYQIaTCkFKmwdY",
        }
      }
    }
  })

  await prisma.plan.create({
    data: {
      slug: 'auction access',
      name: 'Pro plan name',
      description: 'Pro plan description',
      active: true,
      stripeProductId: 'prod_T4ucVTsoKW2Z9c',
      prices: {
        create: {
          slug: 'price_pro_monthly',
          interval: "month",
          amount: 10000,
          currency: "usd",
          stripePriceId: "price_1S8knBBlchQYQIaTozT7fDZO",
        }
      }
    }
  })

  console.log("✅ Seed выполнен:");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });