import type { Chapter, SearchResult } from './types';
import { chapter01 } from './chapters/chapter01';
import { chapter02 } from './chapters/chapter02';
import { chapter03 } from './chapters/chapter03';
import { chapter04 } from './chapters/chapter04';
import { chapter05 } from './chapters/chapter05';
import { chapter06 } from './chapters/chapter06';
import { chapter07 } from './chapters/chapter07';
import { chapter08 } from './chapters/chapter08';
import { chapter09 } from './chapters/chapter09';
import { chapter10 } from './chapters/chapter10';
import { chapter011 } from './chapters/chapter11';
import { chapter12 } from './chapters/chapter12';
import { chapter13 } from './chapters/chapter13';
import { chapter14 } from './chapters/chapter14';

export * from './types';
export * from './masterRevision';

export const ALL_CHAPTERS: Chapter[] = [
  chapter01,
  chapter02,
  chapter03,
  chapter04,
  chapter05,
  chapter06,
  chapter07,
  chapter08,
  chapter09,
  chapter10,
  chapter011,
  chapter12,
  chapter13,
  chapter14,
];

export const CHAPTERS_MAP: Record<string, Chapter> = ALL_CHAPTERS.reduce(
  (acc, ch) => {
    acc[ch.id] = ch;
    return acc;
  },
  {} as Record<string, Chapter>
);

export function searchNotes(rawQuery: string): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query || query.length < 2) return [];

  const results: SearchResult[] = [];

  for (const ch of ALL_CHAPTERS) {
    // 1. Chapter Title match
    if (ch.title.toLowerCase().includes(query) || `chapter ${ch.number}`.includes(query)) {
      results.push({
        chapterId: ch.id,
        chapterNumber: ch.number,
        chapterTitle: ch.title,
        matchType: 'chapter',
        snippet: ch.summary,
      });
    }

    // 2. Topics & Definitions match
    for (const topic of ch.topics) {
      if (topic.title.toLowerCase().includes(query)) {
        results.push({
          chapterId: ch.id,
          chapterNumber: ch.number,
          chapterTitle: ch.title,
          topicId: topic.id,
          topicTitle: topic.title,
          matchType: 'topic',
          snippet: topic.content[0] || topic.title,
        });
        continue;
      }

      // Check definitions
      if (topic.definitions) {
        for (const def of topic.definitions) {
          if (def.term.toLowerCase().includes(query) || def.definition.toLowerCase().includes(query)) {
            results.push({
              chapterId: ch.id,
              chapterNumber: ch.number,
              chapterTitle: ch.title,
              topicId: topic.id,
              topicTitle: topic.title,
              matchType: 'definition',
              snippet: `${def.term}: ${def.definition}`,
            });
            break;
          }
        }
      }

      // Check content paragraphs
      for (const p of topic.content) {
        if (p.toLowerCase().includes(query)) {
          results.push({
            chapterId: ch.id,
            chapterNumber: ch.number,
            chapterTitle: ch.title,
            topicId: topic.id,
            topicTitle: topic.title,
            matchType: 'content',
            snippet: p.length > 140 ? p.slice(0, 140) + '...' : p,
          });
          break;
        }
      }
    }
  }

  return results.slice(0, 15);
}

