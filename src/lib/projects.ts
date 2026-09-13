import { getCollection } from 'astro:content';

export type ProjectEntry = {
  slug: string;
  data: {
    title: string;
    description: string;
    date: Date;
    status: 'current' | 'archive' | 'highlights';
    tags: string[];
    thumbnail?: string;
  };
};

export async function loadProjects() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    slug: project.id,
    data: {
      title: project.data.title,
      description: project.data.description,
      date: project.data.date,
      status: project.data.status,
      tags: project.data.tags,
      thumbnail: project.data.thumbnail
    }
  })) satisfies ProjectEntry[];
}

export function sortProjects(entries: ProjectEntry[]) {
  return [...entries].sort((left, right) => {
    const timeDifference = right.data.date.getTime() - left.data.date.getTime();
    if (timeDifference !== 0) {
      return timeDifference;
    }

    return left.data.title.localeCompare(right.data.title);
  });
}

export function splitProjects(entries: ProjectEntry[]) {
  return {
    current: sortProjects(entries.filter((entry) => entry.data.status === 'current')),
    highlights: sortProjects(entries.filter((entry) => entry.data.status === 'highlights')),
    archive: sortProjects(entries.filter((entry) => entry.data.status === 'archive'))
  };
}

export function collectProjectTags(entries: ProjectEntry[]) {
  return Array.from(new Set(entries.flatMap((entry) => entry.data.tags))).sort((left, right) =>
    left.localeCompare(right)
  );
}

export function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
