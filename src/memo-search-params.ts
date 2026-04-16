/**
 * Keep Zod shapes in sync with `server/src/services/memo-hybrid-search.ts` (Zod segment).
 * This package cannot import server sources; duplicate intentionally.
 */
import moment from 'moment-timezone';
import { z } from 'zod';

function isValidTimeRangeBoundary(s: string): boolean {
  const t = s.trim();
  if (!t) {
    return false;
  }
  if (moment(t, moment.ISO_8601, true).isValid()) {
    return true;
  }
  if (moment(t, 'YYYY-MM-DD', true).isValid()) {
    return true;
  }
  return false;
}

const timeRangeBoundarySchema = z
  .string()
  .trim()
  .min(1)
  .refine(isValidTimeRangeBoundary, {
    message: 'Expected ISO 8601 datetime or YYYY-MM-DD date string',
  });

const searchFiltersSchema = z.object({
  hasAttachments: z
    .boolean()
    .optional()
    .describe('When true, only memos that have at least one attachment'),
  pinned: z
    .boolean()
    .optional()
    .describe('true = only pinned memos, false = only unpinned'),
  reviewStatus: z
    .object({
      hasNeverReviewed: z
        .boolean()
        .optional()
        .describe('When true, only memos with zero reviews (review_count = 0)'),
      maxCount: z
        .number()
        .optional()
        .describe('Maximum memo.review_count (inclusive)'),
      minCount: z
        .number()
        .optional()
        .describe('Minimum memo.review_count (inclusive)'),
    })
    .optional()
    .describe('Filter by spaced repetition review counts'),
  state: z
    .enum(['Normal', 'InRecycleBin'])
    .optional()
    .describe('Memo lifecycle state (default in search is Normal)'),
  tags: z
    .array(z.string())
    .optional()
    .describe(
      'Tag names to match; use hierarchical names like parent/child when applicable',
    ),
  timeRange: z
    .object({
      end: timeRangeBoundarySchema.describe(
        'End boundary; inclusive end-of-day in the user timezone (ISO 8601 or YYYY-MM-DD)',
      ),
      field: z
        .enum(['gcreate_time', 'glast_mod_time', 'last_review_time'])
        .optional()
        .describe(
          'Which memo timestamp field timeRange applies to (default gcreate_time)',
        ),
      start: timeRangeBoundarySchema.describe(
        'Start boundary; inclusive start-of-day in the user timezone (ISO 8601 or YYYY-MM-DD)',
      ),
    })
    .optional()
    .describe(
      'Restrict by memo time field, using the account timezone for day bounds',
    ),
});

/** Mirrors server `memoHybridSearchMcpToolSchema` (MCP `search_notes` only; no tuning). */
export const memoSearchNotesParametersSchema = z.object({
  filters: searchFiltersSchema
    .optional()
    .describe(
      'Optional filters: time range, tags, pinned, hasAttachments, memo state, review status',
    ),
  limit: z
    .number()
    .min(1)
    .max(50)
    .optional()
    .describe('Max number of results (default depends on mode)'),
  mode: z
    .enum(['qa', 'retrieval'])
    .optional()
    .describe('qa = precise answers, retrieval = broad topic match (default)'),
  query: z.string().min(1).describe('The search query'),
});

export type MemoSearchFilters = z.infer<typeof searchFiltersSchema>;
