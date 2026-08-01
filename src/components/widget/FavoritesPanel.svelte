<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

interface BookmarkSite {
	name: string;
	url: string;
	description?: string;
}

interface BookmarkCategory {
	name: string;
	icon?: string;
	sites: BookmarkSite[];
}

let categories: BookmarkCategory[] = [];
let activeCategory = "全部";
let keyword = "";
let loaded = false;
let loadFailed = false;

const DATA_URL = "/data/bookmarks.json";

const loadBookmarks = async (): Promise<void> => {
	try {
		const response = await fetch(DATA_URL);
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const data = await response.json();
		categories = Array.isArray(data.categories) ? data.categories : [];
		loaded = true;
	} catch (error) {
		console.error("Failed to load bookmarks:", error);
		loadFailed = true;
		loaded = true;
	}
};

onMount(() => {
	loadBookmarks();
});

$: categoryNames = ["全部", ...categories.map((c) => c.name)];

$: currentSites =
	activeCategory === "全部"
		? categories.flatMap((c) => c.sites)
		: (categories.find((c) => c.name === activeCategory)?.sites ?? []);

$: filteredSites = keyword.trim()
	? currentSites.filter((s) =>
			s.name.toLowerCase().includes(keyword.trim().toLowerCase()),
		)
	: currentSites;

const handleImageError = (event: Event): void => {
	(event.target as HTMLImageElement).style.display = "none";
};
</script>

<div id="favorites-panel"
     class="float-panel float-panel-closed absolute transition-all w-80 md:w-[26rem] right-4 px-4 py-4 favorites-panel"
>
    <div class="flex items-center gap-2 mb-3">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            收藏
            <span class="text-xs font-normal text-black/40 dark:text-white/40 ml-2">存放个人收藏的网页</span>
        </div>
    </div>

    <!-- search bar -->
    <div class="flex relative transition-all items-center h-9 mb-3 rounded-lg
        bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06]
        dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10"
    >
        <Icon icon="material-symbols:search" class="absolute text-[1.125rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30"></Icon>
        <input placeholder="搜索收藏..." bind:value={keyword}
               class="transition-all pl-9 text-sm bg-transparent outline-0 w-full pr-3 text-black/60 dark:text-white/60"
        >
    </div>

    <!-- category tabs -->
    <div class="flex flex-wrap gap-1.5 mb-3 px-1">
        {#each categoryNames as name}
            <button
                class:active-cat={name === activeCategory}
                on:click={() => { activeCategory = name; }}
                class="transition text-sm font-medium px-3 py-1 rounded-full border text-black/75 dark:text-white/75
                    border-black/10 dark:border-white/10
                    hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
            >
                {name}
            </button>
        {/each}
    </div>

    <!-- bookmark list -->
    <div class="flex flex-col gap-1 overflow-y-auto favorites-list px-1">
        {#if !loaded}
            <div class="text-sm text-black/40 dark:text-white/40 py-6 text-center">加载中...</div>
        {:else if loadFailed}
            <div class="text-sm text-black/40 dark:text-white/40 py-6 text-center">收藏数据加载失败</div>
        {:else if filteredSites.length === 0}
            <div class="text-sm text-black/40 dark:text-white/40 py-6 text-center">没有匹配的收藏</div>
        {:else}
            {#each filteredSites as site (site.url)}
                <a href={site.url} target="_blank" rel="noopener noreferrer"
                   class="group flex items-center gap-3 py-2 pl-2 pr-3 rounded-lg
                        hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition"
                >
                    <img src="https://icons.duckduckgo.com/ip3/{new URL(site.url).hostname}.ico"
                         alt="" width="24" height="24"
                         class="w-6 h-6 rounded shrink-0"
                         on:error={handleImageError}
                    >
                    <div class="flex-1 min-w-0">
                        <div class="transition text-sm font-bold text-black/75 dark:text-white/75 truncate
                            group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                            {site.name}
                        </div>
                        {#if site.description}
                            <div class="text-xs text-black/40 dark:text-white/40 truncate">{site.description}</div>
                        {/if}
                    </div>
                    <Icon icon="fa6-solid:arrow-up-right-from-square"
                          class="transition text-[0.75rem] text-black/25 dark:text-white/25 shrink-0"
                    ></Icon>
                </a>
            {/each}
        {/if}
    </div>
</div>

<style>
    .active-cat {
        background: var(--primary);
        color: white;
        border-color: transparent;
    }

    .favorites-panel {
        max-height: calc(100vh - 100px);
    }

    .favorites-list {
        max-height: min(24rem, calc(100vh - 230px));
    }
</style>
