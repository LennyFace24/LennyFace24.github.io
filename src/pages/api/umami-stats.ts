import type { APIRoute } from "astro";

const API_KEY = import.meta.env.UMAMI_API_KEY || "";
const WEBSITE_ID = import.meta.env.UMAMI_WEBSITE_ID || "";
const UMAMI_API_URL = "https://api.umami.is/v1";

export const GET: APIRoute = async () => {
	try {
		if (!API_KEY || !WEBSITE_ID) {
			throw new Error("Missing UMAMI_API_KEY or UMAMI_WEBSITE_ID environment variables");
		}

		const now = new Date();
		const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		const response = await fetch(
			`${UMAMI_API_URL}/websites/${WEBSITE_ID}/stats?startAt=${startDate.getTime()}&endAt=${now.getTime()}`,
			{
				headers: {
					"x-umami-api-key": API_KEY,
					"Accept": "application/json",
				},
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Umami API Error: ${response.status} - ${errorText}`);
		}

		const data = await response.json();

		return new Response(
			JSON.stringify({
				pageviews: data.pageviews || 0,
				visitors: data.visitors || 0,
				bounceRate: data.bounceRate || 0,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		console.error("Full Error Details:", errorMsg);
		return new Response(
			JSON.stringify({
				error: "Failed to fetch statistics",
				details: errorMsg,
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
};
