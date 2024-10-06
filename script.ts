import fetchData from "./fetch.ts";

async function handleData() {
    const request = fetchData('https://api.origamid.dev/json/transacoes.json');
    return request
}

handleData();