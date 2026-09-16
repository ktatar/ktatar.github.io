import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import bibtexParse from 'bibtex-parse-js';

export type Publication = {
  key: string;
  group: string;
  type: string;
  title: string;
  authors: string[];
  year: number | null;
  venue: string;
  url: string;
  doi: string;
  note: string;
  highlight: boolean;
};

const groupLabels: Record<string, string> = {
  journal: 'Journal Publications',
  conference: 'Conference Publications',
  manuscript: 'Manuscript Publications',
  book: 'Book Chapters',
  thesis: 'Thesis',
  misc: 'Other Publications'
};

function stripBraces(value: string) {
  return value.replace(/[{}]/g, '').trim();
}

function firstDefined(values: Array<string | undefined>) {
  return values.find((value) => Boolean(value && value.trim()))?.trim() ?? '';
}

function parseAuthors(value: string) {
  if (!value) {
    return [];
  }

  return value
    .split(/\s+and\s+/i)
    .map((author) => stripBraces(author))
    .filter(Boolean);
}

function formatVenue(tags: Record<string, string>) {
  return stripBraces(firstDefined([tags.journal, tags.booktitle, tags.publisher, tags.school, tags.organization, tags.note]));
}

function normalizeGroup(tags: Record<string, string>, type: string) {
  const rawGroup = firstDefined([tags.group, tags.category, tags.section]).toLowerCase();
  if (rawGroup) {
    return rawGroup;
  }

  if (type === 'article') {
    return 'journal';
  }

  if (type === 'inproceedings' || type === 'conference') {
    return 'conference';
  }

  if (type === 'phdthesis' || type === 'mastersthesis') {
    return 'thesis';
  }

  return 'misc';
}

export function loadPublications() {
  const bibPath = join(process.cwd(), 'src', 'data', 'publications.bib');
  const source = readFileSync(bibPath, 'utf-8');
  const entries = bibtexParse.toJSON(source) as Array<{
    citationKey: string;
    entryType: string;
    entryTags: Record<string, string>;
  }>;

  const publications = entries.map((entry) => {
    const tags = Object.fromEntries(
      Object.entries(entry.entryTags).map(([key, value]) => [key.toLowerCase(), value])
    );
    const year = Number.parseInt(firstDefined([tags.year]), 10);

    return {
      key: entry.citationKey,
      group: normalizeGroup(tags, entry.entryType.toLowerCase()),
      type: entry.entryType.toLowerCase(),
      title: stripBraces(firstDefined([tags.title])),
      authors: parseAuthors(firstDefined([tags.author, tags.editor])),
      year: Number.isFinite(year) ? year : null,
      venue: formatVenue(tags),
      url: firstDefined([tags.url, tags.doi ? `https://doi.org/${stripBraces(tags.doi)}` : '']),
      doi: stripBraces(firstDefined([tags.doi])),
      note: stripBraces(firstDefined([tags.note])),
      highlight: stripBraces(firstDefined([tags.highlight])).toLowerCase() === 'true'
    } satisfies Publication;
  });

  return publications.sort((left, right) => {
    const leftYear = left.year ?? 0;
    const rightYear = right.year ?? 0;
    if (rightYear !== leftYear) {
      return rightYear - leftYear;
    }

    return left.title.localeCompare(right.title);
  });
}

export function groupPublications(publications: Publication[]) {
  const grouped = new Map<string, Publication[]>();

  for (const publication of publications) {
    const items = grouped.get(publication.group) ?? [];
    items.push(publication);
    grouped.set(publication.group, items);
  }

  return Array.from(grouped.entries())
    .map(([group, items]) => ({
      group,
      label: groupLabels[group] ?? `${group.charAt(0).toUpperCase()}${group.slice(1)} Publications`,
      items
    }))
    .sort((left, right) => {
      const order = ['journal', 'conference', 'manuscript', 'book', 'thesis', 'misc'];
      return order.indexOf(left.group) - order.indexOf(right.group);
    });
}

export function groupPublicationsByYear(publications: Publication[]) {
  const grouped = new Map<number | null, Publication[]>();

  for (const publication of publications) {
    const items = grouped.get(publication.year) ?? [];
    items.push(publication);
    grouped.set(publication.year, items);
  }

  return Array.from(grouped.entries())
    .map(([year, items]) => ({
      year,
      label: year ? `${year}` : 'Undated',
      items
    }))
    .sort((left, right) => (right.year ?? 0) - (left.year ?? 0));
}

function toInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}.`)
    .join(' ');
}

function formatAuthorAcm(author: string) {
  const cleanAuthor = stripBraces(author);
  if (!cleanAuthor) {
    return '';
  }

  if (cleanAuthor.includes(',')) {
    const [familyRaw, givenRaw] = cleanAuthor.split(',');
    const family = familyRaw.trim();
    const initials = toInitials((givenRaw ?? '').trim());
    return initials ? `${family}, ${initials}` : family;
  }

  const parts = cleanAuthor.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0];
  }

  const family = parts[parts.length - 1];
  const given = parts.slice(0, -1).join(' ');
  const initials = toInitials(given);
  return initials ? `${family}, ${initials}` : family;
}

function formatAuthorListAcm(authors: string[]) {
  const formattedAuthors = authors.map(formatAuthorAcm).filter(Boolean);

  if (formattedAuthors.length <= 1) {
    return formattedAuthors[0] ?? 'Unknown author';
  }

  if (formattedAuthors.length === 2) {
    return `${formattedAuthors[0]} and ${formattedAuthors[1]}`;
  }

  return `${formattedAuthors.slice(0, -1).join(', ')}, and ${formattedAuthors[formattedAuthors.length - 1]}`;
}

export function formatPublicationCitationAcm(publication: Publication) {
  const authorText = formatAuthorListAcm(publication.authors);
  const yearText = publication.year ? `${publication.year}.` : 'n.d.';
  const titleText = publication.title ? `${publication.title}.` : '';
  const venuePrefix = publication.type === 'inproceedings' ? 'In ' : '';
  const shouldHighlightVenue = publication.group === 'journal' || publication.group === 'conference';
  const venueLabel = shouldHighlightVenue && publication.venue ? `<b>${publication.venue}</b>` : publication.venue;
  const venueText = publication.venue ? `${venuePrefix}${venueLabel}.` : '';
  const noteText = publication.note ? `${stripBraces(publication.note)}.` : '';
  const doiText = publication.doi ? `DOI:${publication.doi}.` : '';

  return [authorText, yearText, titleText, venueText, noteText, doiText].join(' ').replace(/\s+/g, ' ').trim();
}
