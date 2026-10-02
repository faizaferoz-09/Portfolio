/**
 * Storage utility helpers for LocalStorage and SessionStorage
 * Conforms to SRS:
 * - LocalStorage: Bookmarks, Visitor Counter, Cart State
 * - SessionStorage: Personal Notes on bookmarked items
 */

const STORAGE_KEYS = {
  BOOKMARKS: 'fandomverse_bookmarks_v1',
  VISITOR_COUNT: 'fandomverse_visitor_count_v1',
  CART: 'fandomverse_cart_v1',
  USER_SESSION: 'fandomverse_dummy_user_v1',
  REGISTERED_USERS: 'fandomverse_registered_users_v1',
  SESSION_NOTES_PREFIX: 'fandomverse_note_'
};

/* ================= LocalStorage: Bookmarks ================= */

export function getBookmarks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read bookmarks from localStorage:', err);
    return [];
  }
}

export function saveBookmark(item) {
  try {
    const current = getBookmarks();
    if (current.some(b => b.id === item.id)) {
      return current; // already bookmarked
    }
    const updated = [
      {
        ...item,
        bookmarkedAt: new Date().toISOString()
      },
      ...current
    ];
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save bookmark:', err);
    return getBookmarks();
  }
}

export function removeBookmark(itemId) {
  try {
    const current = getBookmarks();
    const updated = current.filter(b => b.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    // Also remove session note if any
    removeSessionNote(itemId);
    return updated;
  } catch (err) {
    console.error('Failed to remove bookmark:', err);
    return getBookmarks();
  }
}

export function isBookmarked(itemId) {
  const list = getBookmarks();
  return list.some(b => b.id === itemId);
}

export function toggleBookmark(item) {
  if (isBookmarked(item.id)) {
    const updated = removeBookmark(item.id);
    return { bookmarked: false, list: updated };
  } else {
    const updated = saveBookmark(item);
    return { bookmarked: true, list: updated };
  }
}

/* ================= SessionStorage: Notes ================= */

export function getSessionNote(itemId) {
  try {
    return sessionStorage.getItem(`${STORAGE_KEYS.SESSION_NOTES_PREFIX}${itemId}`) || '';
  } catch (err) {
    console.error('Failed to read note from sessionStorage:', err);
    return '';
  }
}

export function saveSessionNote(itemId, noteText) {
  try {
    const key = `${STORAGE_KEYS.SESSION_NOTES_PREFIX}${itemId}`;
    if (!noteText || noteText.trim() === '') {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, noteText.trim());
    }
    return noteText.trim();
  } catch (err) {
    console.error('Failed to save session note:', err);
    return '';
  }
}

export function removeSessionNote(itemId) {
  try {
    sessionStorage.removeItem(`${STORAGE_KEYS.SESSION_NOTES_PREFIX}${itemId}`);
  } catch (err) {
    console.error('Failed to remove session note:', err);
  }
}

export function getAllSessionNotes() {
  const notes = {};
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(STORAGE_KEYS.SESSION_NOTES_PREFIX)) {
        const id = key.replace(STORAGE_KEYS.SESSION_NOTES_PREFIX, '');
        notes[id] = sessionStorage.getItem(key);
      }
    }
  } catch (err) {
    console.error('Failed to enumerate session notes:', err);
  }
  return notes;
}

/* ================= LocalStorage: Visitor Counter ================= */

export function getVisitorCount() {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.VISITOR_COUNT);
    if (!val) {
      const initial = 142850 + Math.floor(Math.random() * 100);
      localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, String(initial));
      return initial;
    }
    return parseInt(val, 10) || 142850;
  } catch (err) {
    return 142850;
  }
}

export function incrementVisitorCount() {
  try {
    const current = getVisitorCount();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEYS.VISITOR_COUNT, String(next));
    return next;
  } catch (err) {
    return getVisitorCount();
  }
}

/* ================= LocalStorage: Cart ================= */

export function getCartFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save cart to storage:', err);
  }
}

/* ================= LocalStorage: Dummy User ================= */

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user) {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save user session:', err);
  }
}

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRegisteredUser(newUser) {
  try {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(
      u => u.username.toLowerCase() === newUser.username.toLowerCase()
    );
    if (existingIndex >= 0) {
      users[existingIndex] = newUser;
    } else {
      users.push(newUser);
    }
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    return true;
  } catch (err) {
    console.error('Failed to save registered user:', err);
    return false;
  }
}

/* ================= Export Bookmarks Utility ================= */

export function exportBookmarksToFile(format = 'markdown') {
  const bookmarks = getBookmarks();
  const notes = getAllSessionNotes();

  if (bookmarks.length === 0) {
    return { success: false, message: 'No bookmarks to export!' };
  }

  let content = '';
  let filename = `fandomverse_bookmarks_${new Date().toISOString().slice(0, 10)}`;
  let mimeType = 'text/plain';

  if (format === 'json') {
    const fullData = bookmarks.map(b => ({
      ...b,
      sessionNote: notes[b.id] || null
    }));
    content = JSON.stringify(fullData, null, 2);
    filename += '.json';
    mimeType = 'application/json';
  } else if (format === 'csv') {
    filename += '.csv';
    mimeType = 'text/csv';
    content = 'ID,Title,Category,Type,Session Note,Bookmarked At\n' +
      bookmarks.map(b => {
        const note = (notes[b.id] || '').replace(/"/g, '""');
        const title = (b.title || b.name || '').replace(/"/g, '""');
        return `"${b.id}","${title}","${b.category}","${b.type || 'Item'}","${note}","${b.bookmarkedAt || ''}"`;
      }).join('\n');
  } else {
    // Default Markdown format
    filename += '.md';
    mimeType = 'text/markdown';
    content = `# 🌌 FandomVerse - Exported Bookmarks Collection\n` +
      `*Generated on: ${new Date().toLocaleString()}*\n` +
      `*Total Saved Items: ${bookmarks.length}*\n\n` +
      `---\n\n`;

    bookmarks.forEach((item, index) => {
      const note = notes[item.id];
      content += `### ${index + 1}. ${item.title || item.name} [${(item.category || 'General').toUpperCase()}]\n`;
      content += `- **Type:** ${item.type || 'General Content'}\n`;
      if (item.author) content += `- **Author / Series:** ${item.author || item.series}\n`;
      if (item.description || item.bio || item.excerpt) {
        content += `- **Summary:** ${item.description || item.bio || item.excerpt}\n`;
      }
      if (note) {
        content += `- **Personal Session Note:** 📝 *${note}*\n`;
      }
      content += `- **Bookmarked Date:** ${new Date(item.bookmarkedAt || Date.now()).toLocaleString()}\n\n`;
    });
  }

  // Create downloadable blob
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { success: true, count: bookmarks.length, filename };
}
