import prisma from "@/prisma/db";

export const GET = async () => {
  const latestBatches = await prisma.syncTask.groupBy({
    by: ["taskType", "dataSource"],
    _max: {
      batchDate: true
    },
    where: {
      status: "completed"
    }
  });

  const data = await Promise.all(
    latestBatches.map(async batch => {
      return await prisma.syncTask.findFirst({
        select: {
          id: true,
          taskType: true,
          dataSource: true,
          batchDate: true,
          totalCount: true,
          errorCount: true,
          status: true,
          errorMsg: true
        },
        where: {
          taskType: batch.taskType,
          dataSource: batch.dataSource,
          batchDate: batch._max.batchDate as Date
        },

        orderBy: {
          batchDate: "desc"
        }
      });
    })
  );

  return Response.json({
    success: true,
    data
  });
};
