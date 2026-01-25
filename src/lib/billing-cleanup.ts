import prisma from "./prisma";

export async function cleanupOldPendingForUser(userId: number) {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

  // Delete payments that are still pending and older than cutoff
  await prisma.payment.deleteMany({
    where: {
      userId,
      status: "pending",
      createdAt: { lt: cutoff },
    },
  });

  // Delete invoices that are pending and older than cutoff
  await prisma.invoice.deleteMany({
    where: {
      userId,
      status: "pending",
      createdAt: { lt: cutoff },
    },
  });
}

export default cleanupOldPendingForUser;
