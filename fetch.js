export default async function fetchData(url) {
    try {
        const request = await fetch(`${url}`);
        if (!request.ok)
            throw new Error("Erro " + request.status);
        const data = await request.json();
        return data;
    }
    catch (error) {
        if (error instanceof Error)
            console.error("Error: " + error.message);
        return null;
    }
}
