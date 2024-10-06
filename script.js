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
        moeda: moedaParaNumero(transacao["Valor (R$)"]),
        valor: 0,
        formaPagamento: transacao["Forma de Pagamento"],
        clienteNovo: Boolean(transacao["Cliente Novo"])
    };
}
function moedaParaNumero(moeda) {
    const numero = Number(moeda.replaceAll(".", "").replace(",", "."));
    return isNaN(numero) ? null : numero;
}
async function handleData() {
    const data = await fetchData('https://api.origamid.dev/json/transacoes.json');
    if (!data)
        return;
    const x = data.map(normalizeData);
    console.log(x);
}
handleData();
