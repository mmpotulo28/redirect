import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRedirects() {
	const { data, error, isLoading, mutate } = useSWR("/api/redirects", fetcher);

	return {
		redirects: data,
		isLoading,
		isError: error,
		mutate,
	};
}

export function useRedirect(id: string) {
	const { data, error, isLoading, mutate } = useSWR(id ? `/api/redirects/${id}` : null, fetcher);

	return {
		redirect: data,
		isLoading,
		isError: error,
		mutate,
	};
}

export function useRedirectAnalytics(id: string) {
	const { data, error, isLoading, mutate } = useSWR(
		id ? `/api/redirects/${id}/analytics` : null,
		fetcher,
	);

	return {
		clicks: data,
		isLoading,
		isError: error,
		mutate,
	};
}

export async function createRedirect(data: {
	targetUrl?: string;
	shortCode?: string;
	description?: string;
}) {
	const res = await fetch("/api/redirects", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error("Failed to create redirect");
	}

	return res.json();
}

export async function updateRedirect(
	id: string,
	data: {
		targetUrl?: string | null;
		shortCode?: string;
		description?: string;
		active?: boolean;
		startsAt?: string | null;
		expiresAt?: string | null;
		ogTitle?: string;
		ogDescription?: string;
		ogImage?: string;
		password?: string;
	},
) {
	const res = await fetch(`/api/redirects/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error("Failed to update redirect");
	}

	return res.json();
}

export async function deleteRedirect(id: string) {
	const res = await fetch(`/api/redirects/${id}`, {
		method: "DELETE",
	});

	if (!res.ok) {
		throw new Error("Failed to delete redirect");
	}
}
