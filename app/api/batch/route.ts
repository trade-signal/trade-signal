import prisma from "@/prisma/db";

export const GET = async () => {
  const latestBatches = await prisma.batchUpdate.groupBy({
    by: ["type", "source"],
    _max: {
      batchTime: true
    },
    where: {
      status: "completed"
    }
  });

  const data = await Promise.all(
    latestBatches.map(async batch => {
      return await prisma.batchUpdate.findFirst({
        select: {
          id: true,
          type: true,
          source: true,
          batchTime: true,
          count: true,
          status: true,
          error: true
        },
        where: {
          type: batch.type,
          source: batch.source,
          batchTime: batch._max.batchTime as Date
        },
        orderBy: {
          batchTime: "desc"
        }
      });
    })
  );

  return Response.json({
    success: true,
    data
  });
};
