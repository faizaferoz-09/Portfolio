/**
 * Utility helper to extract or generate clean, title-relevant hashtags for cards
 */
export function getCardHashtags(item) {
  if (!item) return [];

  // 1. If explicit hashtags are defined
  if (Array.isArray(item.hashtags) && item.hashtags.length > 0) {
    return item.hashtags;
  }

  // 2. If item has tags array
  if (Array.isArray(item.tags) && item.tags.length > 0) {
    return item.tags.slice(0, 3).map(t => {
      const clean = String(t).trim().replace(/[^a-zA-Z0-9]/g, '');
      return `#${clean}`;
    });
  }

  // 3. If item has traits array (e.g. Characters)
  if (Array.isArray(item.traits) && item.traits.length > 0) {
    return item.traits.slice(0, 3).map(t => {
      const clean = String(t).trim().replace(/[^a-zA-Z0-9]/g, '');
      return `#${clean}`;
    });
  }

  // 4. Fallback: Generate smart hashtags from Title / Heading
  const title = item.title || item.name || '';
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'from', 'this', 'that', 'into', 'how', 'why',
    'what', 'over', 'under', 'between', 'official', 'trailer', 'video'
  ]);

  const words = title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()));

  const categoryTag = item.category ? `#${item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', '')}` : null;
  const wordTags = words.slice(0, 2).map(w => `#${w}`);

  const results = categoryTag ? [categoryTag, ...wordTags] : wordTags;
  return results.slice(0, 3);
}
