<script lang="ts">
	import { onMount } from 'svelte';

	interface Stats {
		pageviews: number;
		visitors: number;
		bounceRate: number;
	}

	let stats: Stats | null = null;
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/umami-stats/');

			if (!response.ok) {
				throw new Error(`API Error: ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			stats = data;
		} catch (err) {
			error = 'Failed to load statistics';
			console.error('Stats API Error:', err);
		} finally {
			loading = false;
		}
	});
</script>

<div class="umami-stats mt-12 p-6 rounded-lg bg-opacity-50 dark:bg-opacity-50 border border-gray-200 dark:border-gray-700">
	<h3 class="text-xl font-bold mb-4 text-gray-600 dark:text-gray-400">📊 博客统计</h3>

	{#if loading}
		<div class="text-center py-4">
			<span class="text-gray-500 dark:text-gray-400">加载中...</span>
		</div>
	{:else if error}
		<div class="text-center py-4">
			<span class="text-red-500">{error}</span>
		</div>
	{:else if stats}
		<div class="grid grid-cols-3 gap-4">
			<div class="text-center">
				<div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.pageviews.toLocaleString()}</div>
				<div class="text-sm text-gray-600 dark:text-gray-400">总浏览量</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-green-600 dark:text-green-400">{stats.visitors.toLocaleString()}</div>
				<div class="text-sm text-gray-600 dark:text-gray-400">访问者</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.bounceRate.toFixed(1)}%</div>
				<div class="text-sm text-gray-600 dark:text-gray-400">跳出率</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.dark) .umami-stats {
		background-color: rgba(30, 30, 30, 0.5);
	}

	.umami-stats {
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>
