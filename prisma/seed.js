/* eslint-disable no-console */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const prisma = new PrismaClient();

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function randId(prefix = "seed") {
  return `${prefix}:${Date.now().toString(36)}:${crypto.randomBytes(6).toString("hex")}`;
}

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

async function seedUser(userDef) {
  const passwordHash = bcrypt.hashSync("password123", 10);

  const user = await prisma.user.create({
    data: {
      email: userDef.email,
      name: userDef.name,
      role: userDef.role,
      password: passwordHash,
      image: null,
    },
    select: { id: true, email: true, role: true },
  });

  await prisma.userSettings.create({
    data: {
      userId: user.id,
      twoFaEnabled: false,
      notificationsEnabled: true,
      language: "id",
      timezone: "Asia/Jakarta",
    },
  });

  await prisma.tokenWallet.create({
    data: {
      userId: user.id,
      balance: userDef.walletBalance,
    },
  });

  // NextAuth account (optional, helpful for dev)
  await prisma.account.create({
    data: {
      userId: user.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: user.email,
      access_token: null,
      refresh_token: null,
      scope: null,
      token_type: null,
      id_token: null,
      session_state: null,
      expires_at: null,
    },
  });

  // Payment methods
  const card = await prisma.paymentMethod.create({
    data: {
      userId: user.id,
      label: `${userDef.name} Visa **** 4242`,
      type: "card",
      last4: "4242",
      isPrimary: true,
      provider: "card",
      providerMethodId: randId("pm"),
      status: "active",
    },
    select: { id: true },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: user.id,
      label: `${userDef.name} PayPal`,
      type: "paypal",
      last4: null,
      isPrimary: false,
      provider: "paypal",
      providerMethodId: randId("pm"),
      status: "active",
    },
  });

  // Invoices + payments
  const paidInvoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      number: `INV-SEED-${user.id}-${crypto.randomBytes(3).toString("hex")}`,
      status: "paid",
      amountCents: 2500,
      currency: "USD",
      issuedAt: daysAgo(10),
      paidAt: daysAgo(9),
      pdfUrl: null,
    },
    select: { id: true },
  });

  await prisma.payment.create({
    data: {
      userId: user.id,
      invoiceId: paidInvoice.id,
      methodId: card.id,
      provider: "card",
      providerRef: randId("pay"),
      status: "succeeded",
      amountCents: 2500,
      currency: "USD",
      createdAt: daysAgo(10),
      updatedAt: daysAgo(9),
    },
  });

  const pendingInvoice = await prisma.invoice.create({
    data: {
      userId: user.id,
      number: `INV-SEED-PENDING-${user.id}-${crypto.randomBytes(3).toString("hex")}`,
      status: "pending",
      amountCents: 500,
      currency: "USD",
      issuedAt: daysAgo(1),
      pdfUrl: null,
    },
    select: { id: true },
  });

  await prisma.payment.create({
    data: {
      userId: user.id,
      invoiceId: pendingInvoice.id,
      methodId: card.id,
      provider: "card",
      providerRef: randId("pay"),
      status: "pending",
      amountCents: 500,
      currency: "USD",
      createdAt: daysAgo(1),
    },
  });

  // Token transactions (topup + usage)
  await prisma.tokenTransaction.createMany({
    data: [
      {
        userId: user.id,
        type: "topup",
        amount: 3000,
        note: "Seed topup",
        metadata: { source: "seed" },
        createdAt: daysAgo(10),
      },
      {
        userId: user.id,
        type: "usage",
        amount: -10,
        note: "Seed chat usage",
        metadata: { kind: "chat" },
        createdAt: daysAgo(0),
      },
      {
        userId: user.id,
        type: "usage",
        amount: -40,
        note: "Seed image usage",
        metadata: { kind: "image" },
        createdAt: daysAgo(0),
      },
    ],
  });

  // Usage events (7 days)
  const usageEvents = [];
  for (let d = 0; d < 7; d += 1) {
    usageEvents.push({
      userId: user.id,
      kind: "chat",
      action: "message",
      tokens: userDef.role === "user" ? 0 : 10,
      createdAt: daysAgo(d),
      metadata: { source: "seed", dayOffset: d },
    });
  }
  usageEvents.push({
    userId: user.id,
    kind: "image",
    action: "generate",
    tokens: userDef.role === "user" ? 0 : 40,
    createdAt: daysAgo(0),
    metadata: { source: "seed", prompt: "spongebob" },
  });

  await prisma.usageEvent.createMany({ data: usageEvents });

  // API keys
  for (const name of ["Default", "CI"].map((n) => `${n} (${userDef.role})`)) {
    const secret = `sk_seed_${crypto.randomBytes(18).toString("hex")}`;
    const last4 = secret.slice(-4);
    const prefix = `sk-...${last4}`;
    await prisma.apiKey.create({
      data: {
        userId: user.id,
        name,
        prefix,
        keyHash: sha256Hex(secret),
        lastUsedAt: null,
        revokedAt: null,
      },
    });
  }

  // Chat threads + messages
  const thread = await prisma.chatThread.create({
    data: {
      userId: user.id,
      title: "Seed thread",
    },
    select: { id: true },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        threadId: thread.id,
        role: "user",
        content: "Halo, ini pesan seed.",
        createdAt: daysAgo(0),
        tokens: userDef.role === "user" ? 0 : 10,
      },
      {
        threadId: thread.id,
        role: "assistant",
        content: "Halo! Ini balasan seed.",
        createdAt: daysAgo(0),
        tokens: 0,
      },
    ],
  });

  // Image generations
  await prisma.imageGeneration.create({
    data: {
      userId: user.id,
      prompt: "spongebob",
      imageUrl: "https://image.pollinations.ai/prompt/spongebob",
      tokens: userDef.role === "user" ? 0 : 40,
      metadata: { source: "seed" },
      createdAt: daysAgo(0),
    },
  });

  return user;
}

async function main() {
  const seedUsers = [
    {
      email: "admin@seed.pixabot.local",
      name: "Seed Admin",
      role: "admin",
      walletBalance: 999999,
    },
    {
      email: "pro@seed.pixabot.local",
      name: "Seed Pro",
      role: "pro",
      walletBalance: 2500,
    },
    {
      email: "free@seed.pixabot.local",
      name: "Seed Free",
      role: "user",
      walletBalance: 0,
    },
  ];

  // Clean only our seed users; cascades will clear dependent tables for those users.
  await prisma.user.deleteMany({
    where: { email: { in: seedUsers.map((u) => u.email) } },
  });

  for (const u of seedUsers) {
    const created = await seedUser(u);
    console.log(`Seeded user ${created.email} (role=${created.role})`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
