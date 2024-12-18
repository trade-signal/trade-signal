import prisma from "@/prisma/db";

interface Tag {
  id: string;
  name: string;
}

export const GET = async () => {
  const data = await prisma.news.findMany({
    select: { tags: true }
  });

  const keys = new Set<string>();

  const tags = data.reduce((acc, curr) => {
    if (!curr.tags) return acc;

    try {
      const values = JSON.parse(curr.tags) as Tag[];

      values.forEach(value => {
        if (keys.has(value.id)) return;

        keys.add(value.id);
        acc.add(value);
      });
    } catch (error) {}

    return acc;
  }, new Set<Tag>());

  const sortedTags = Array.from(tags).sort(
    (a, b) => Number(a.id) - Number(b.id)
  );

  return Response.json({
    success: true,
    data: {
      tags: sortedTags.map(tag => tag.name)
    }
  });
};
