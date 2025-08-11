
export async function getShortLink(fullUrl) {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullUrl }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to shorten URL');
    }

    const data = await response.json();
    return data.shortUrl;
}
