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
function normalizeData(transacao) {
    return {
        nome: transacao.Nome,
        id: transacao.ID,
        data: transacao.Data,
        status: transacao.Status,
        email: transacao.Email,
        moeda: transacao["Valor (R$)"],
        valor: 0,
        formaPagamento: transacao["Forma de Pagamento"],
        clienteNovo: Boolean(transacao["Cliente Novo"])
    };
}
async function handleData() {
    const request = await fetchData('https://api.origamid.dev/json/transacoes.json');
    console.log(request);
    return request;
}
handleData();
