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
        data: textoParaData(transacao.Data),
        status: transacao.Status,
        email: transacao.Email,
        moeda: transacao["Valor (R$)"],
        valor: moedaParaNumero(transacao["Valor (R$)"]),
        formaPagamento: transacao["Forma de Pagamento"],
        clienteNovo: Boolean(transacao["Cliente Novo"])
    };
}
function moedaParaNumero(moeda) {
    const numero = Number(moeda.replaceAll(".", "").replace(",", "."));
    return isNaN(numero) ? null : numero;
}
function textoParaData(texto) {
    const [data, tempo] = texto.split(" ");
    const [dia, mes, ano] = data.split("/").map(Number);
    const [hora, minuto] = tempo.split(":").map(Number);
    return new Date(dia, mes - 1, ano, hora, minuto);
}
async function handleData() {
    const data = await fetchData('https://api.origamid.dev/json/transacoes.json');
    if (!data)
        return;
    const transacoes = data.map(normalizeData);
    preencherTabela(transacoes);
    preencherEstatisticas(transacoes);
}
function filtrarValor(transacao) {
    return transacao.valor !== null;
}
function preencherEstatisticas(transacoes) {
    const estatisticas = new Estatisticas(transacoes);
    const campoEstatisticaTotal = document.querySelector("#total");
    if (!campoEstatisticaTotal)
        return;
    campoEstatisticaTotal.innerText = `R$ ${estatisticas.total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}`;
}
class Estatisticas {
    transacoes;
    total;
    constructor(transacoes) {
        this.transacoes = transacoes;
        this.total = this.pegarValor();
    }
    pegarValor() {
        return this.transacoes.filter(filtrarValor).reduce((acc, atual) => {
            return acc + atual.valor;
        }, 0);
    }
}
function preencherTabela(transacoes) {
    if (!transacoes)
        return;
    const tabela = document.querySelector("#transacoes tbody");
    if (!tabela)
        return;
    transacoes.forEach(transacao => {
        tabela.innerHTML += `
            <tr>
                <td>
                    ${transacao.nome}
                </td>
                                <td>
                    ${transacao.email}
                </td>
                                <td>
                    ${transacao.moeda}
                </td>
                                <td>
                    ${transacao.formaPagamento}
                </td>
                                <td>
                    ${transacao.status}
                </td>
            </tr>
        `;
    });
}
handleData();
