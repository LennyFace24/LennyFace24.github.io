/**
 * leaderboard.js — 每日排行榜系统 (localStorage + Cookie)
 *
 * 机制:
 *   - 排行榜按日期存储: localStorage key = "eatkano_rank_YYYY-MM-DD"
 *   - 用户名称存 Cookie "eatkano_player" (30天)
 *   - 今日最佳成绩存 Cookie "eatkano_best_today" (1天)
 *   - 新的一天自动重置排行榜，用户需重新提交名称
 */

(function() {
'use strict';

const LEADERBOARD_PREFIX = 'eatkano_rank_';
const PLAYER_COOKIE = 'eatkano_player';
const BEST_COOKIE_PREFIX = 'eatkano_best_';

function getToday() {
    const d = new Date();
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
}

function getTodayKey() {
    return LEADERBOARD_PREFIX + getToday();
}

// === Cookie helpers ===
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 864e5);
    document.cookie = name + '=' + encodeURIComponent(value) +
        '; expires=' + d.toUTCString() + '; path=/';
}

function getCookie(name) {
    const match = document.cookie.match(
        new RegExp('(?:^|;)\\s*' + name.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1') + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
}

// === LocalStorage helpers ===
function getLeaderboard() {
    try {
        const data = localStorage.getItem(getTodayKey());
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveLeaderboard(entries) {
    localStorage.setItem(getTodayKey(), JSON.stringify(entries));
}

// === Public API ===

window.Leaderboard = {
    /**
     * Get the player's name from cookie
     */
    getPlayerName: function() {
        return getCookie(PLAYER_COOKIE);
    },

    /**
     * Set the player's name (30 days cookie)
     */
    setPlayerName: function(name) {
        const clean = name.trim().slice(0, 20).replace(/[<>"'&]/g, '');
        if (clean) {
            setCookie(PLAYER_COOKIE, clean, 30);
        }
        return clean;
    },

    /**
     * Get today's best score for the current player
     */
    getPlayerBestToday: function() {
        const name = this.getPlayerName();
        if (!name) return 0;
        const val = getCookie(BEST_COOKIE_PREFIX + getToday());
        if (val) {
            const data = JSON.parse(val);
            if (data.name === name) return data.score;
        }
        // fallback: scan leaderboard
        const entries = getLeaderboard();
        for (const e of entries) {
            if (e.name === name) return e.score;
        }
        return 0;
    },

    /**
     * Submit a score to the daily leaderboard.
     * Called automatically after game over.
     * If player has no name set, returns false — caller should show name input.
     */
    submitScore: function(score) {
        const name = this.getPlayerName();
        if (!name) return false;

        const today = getToday();
        const entries = getLeaderboard();

        // Find existing entry for this player today
        let existing = null;
        for (const e of entries) {
            if (e.name === name) {
                existing = e;
                break;
            }
        }

        if (existing) {
            if (score > existing.score) {
                existing.score = score;
                existing.attempts = (existing.attempts || 1) + 1;
                existing.updatedAt = Date.now();
            } else {
                existing.attempts = (existing.attempts || 1) + 1;
            }
        } else {
            entries.push({
                name: name,
                score: score,
                attempts: 1,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }

        // Sort by score descending
        entries.sort(function(a, b) { return b.score - a.score; });

        // Keep top 50
        if (entries.length > 50) {
            entries.length = 50;
        }

        saveLeaderboard(entries);

        // Update best cookie
        const bestVal = existing ? Math.max(existing.score, score) : score;
        setCookie(BEST_COOKIE_PREFIX + today, JSON.stringify({ name: name, score: bestVal }), 1);

        return true;
    },

    /**
     * Get all leaderboard entries for today, sorted by score descending
     */
    getEntries: function() {
        return getLeaderboard();
    },

    /**
     * Get the player's rank (1-based)
     */
    getPlayerRank: function() {
        const name = this.getPlayerName();
        if (!name) return -1;
        const entries = getLeaderboard();
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].name === name) return i + 1;
        }
        return -1;
    },

    /**
     * Check if today's leaderboard is empty
     */
    isEmpty: function() {
        return getLeaderboard().length === 0;
    },

    /**
     * Get today's date string
     */
    getToday: getToday,

    /**
     * Clear all leaderboard data (for testing)
     */
    _clear: function() {
        localStorage.removeItem(getTodayKey());
        deleteCookie(BEST_COOKIE_PREFIX + getToday());
    }
};

})();