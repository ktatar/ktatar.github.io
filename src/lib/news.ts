import { getCollection, render } from 'astro:content';

export type NewsEntry = {
  slug: string;
  data: {
    title: string;
    date: Date;
    link?: string;
  };
  hasBody: boolean;
  Content: any;
};

function sortNews(entries: NewsEntry[]) {
  return [...entries].sort((left, right) => {
    const delta = right.data.date.getTime() - left.data.date.getTime();
    if (delta !== 0) {
      return delta;
    }

    return left.data.title.localeCompare(right.data.title);
  });
}

export async function loadNews() {
  const entries = await getCollection('news');

  const hydrated = await Promise.all(
    entries.map(async (entry) => {
      const { Content } = await render(entry);

      return {
        slug: entry.id,
        data: {
          title: entry.data.title,
          date: entry.data.date,
          link: entry.data.link
        },
        hasBody: (entry.body ?? '').trim().length > 0,
        Content
      };
    })
  );

  return sortNews(hydrated);
}

export async function loadLatestNews(limit = 4) {
  return (await loadNews()).slice(0, limit);
}
