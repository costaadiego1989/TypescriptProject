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
function pegarPagamentosEEstatus(lista, containerId) {
    const containerElement = document.querySelector(containerId);
    if (!containerElement)
        return;
    Object.keys(lista).forEach((key) => {
        containerElement.innerHTML += `<p>${key}: ${lista[key]}</>`;
    });
}
function preencherEstatisticas(transacoes) {
    const estatisticas = new Estatisticas(transacoes);
    const campoEstatisticaTotal = document.querySelector("#total");
    if (!campoEstatisticaTotal)
        return;
    campoEstatisticaTotal.innerText = `${estatisticas.total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}`;
    pegarPagamentosEEstatus(estatisticas.pagamentos, "#pagamento");
    pegarPagamentosEEstatus(estatisticas.status, "#status");
}
class Estatisticas {
    transacoes;
    total;
    pagamentos;
    status;
    constructor(transacoes) {
        this.transacoes = transacoes;
        this.total = this.pegarValor();
        this.pagamentos = this.setPagamentos();
        this.status = this.setStatus();
    }
    pegarValor() {
        return this.transacoes.filter(filtrarValor).reduce((acc, atual) => {
            return acc + atual.valor;
        }, 0);
    }
    setPagamentos() {
        return this.transacoes.reduce((acc, { formaPagamento }) => {
            if (acc[formaPagamento]) {
                acc[formaPagamento]++;
            }
            else {
                acc[formaPagamento] = 1;
            }
            return acc;
        }, {});
    }
    setStatus() {
        return this.transacoes.reduce((acc, { status }) => {
            if (acc[status]) {
                acc[status]++;
            }
            else {
                acc[status] = 1;
            }
            console.log(acc);
            return acc;
        }, {});
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
