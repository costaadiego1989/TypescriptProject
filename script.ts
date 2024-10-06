export default async function fetchData<T>(url: string): Promise<T | null> {
    try {
        const request = await fetch(`${url}`);
        if(!request.ok) throw new Error("Erro " + request.status);
        const data = await request.json();
        return data;
    } catch (error) {
        if(error instanceof Error) console.error("Error: " + error.message);
        return null;
    }
}

type TransacaoPagamento = "Boleto" | "Cartão de Crédito";
type TransacaoStatus = "Paga" | "Recusada pela operadora do cartão" | "Aguardando pagamento" | "Estornada"

interface ITransacaoAPI {
    Nome: string,
    ID: string,
    Data: string,
    Status: TransacaoStatus,
    Email: string,
    ["Valor (R$)"]: string,
    ["Forma de Pagamento"]: TransacaoPagamento,
    ["Cliente Novo"]: number
}

interface ITransacaoNormalized {
    nome: string,
    id: string,
    data: Date,
    status: TransacaoStatus,
    email: string,
    moeda: string,
    valor: number | null,
    formaPagamento: TransacaoPagamento,
    clienteNovo: boolean
}

interface ListaContagem {
    [key: string]: number    
}

function normalizeData(transacao: ITransacaoAPI): ITransacaoNormalized {
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
    }
}

function moedaParaNumero(moeda: string): number | null {
    const numero = Number(moeda.replaceAll(".", "").replace(",", "."));
    return isNaN(numero) ? null : numero;
}

function textoParaData(texto: string) {
    const [data, tempo] = texto.split(" ");
    const [dia, mes, ano] = data.split("/").map(Number);
    const [hora, minuto] = tempo.split(":").map(Number);

    return new Date(dia, mes - 1, ano, hora, minuto);
}

async function handleData() {
    const data = await fetchData<ITransacaoAPI[]>('https://api.origamid.dev/json/transacoes.json');
    if (!data) return;
    const transacoes = data.map(normalizeData);
    preencherTabela(transacoes); 
    preencherEstatisticas(transacoes); 
}

type TransacaoValor = ITransacaoNormalized & { valor: number };

function filtrarValor(transacao: ITransacaoNormalized): transacao is TransacaoValor {
    return transacao.valor !== null;
}

function pegarPagamentosEEstatus(lista: ListaContagem, containerId: string): void {
    const containerElement = document.querySelector<HTMLElement>(containerId);

    if (!containerElement) return;

    Object.keys(lista).forEach((key) => {
        containerElement.innerHTML += `<p>${key}: ${lista[key]}</>`;
    })
}

function preencherEstatisticas(transacoes: ITransacaoNormalized[]): void {
    const estatisticas = new Estatisticas(transacoes);
    const campoEstatisticaTotal = document.querySelector<HTMLElement>("#total");

    if (!campoEstatisticaTotal) return;

    campoEstatisticaTotal.innerText = `${estatisticas.total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
    })}`;

    pegarPagamentosEEstatus(estatisticas.pagamentos, "#pagamento");
    pegarPagamentosEEstatus(estatisticas.status, "#status");
}

class Estatisticas {
    private transacoes;
    total;
    pagamentos;
    status;
    constructor(transacoes: ITransacaoNormalized[]) {
        this.transacoes = transacoes;
        this.total = this.pegarValor();
        this.pagamentos = this.setPagamentos();
        this.status = this.setStatus();
    }

    private pegarValor() {       
        return this.transacoes.filter(filtrarValor).reduce((acc, atual) => {            
            return acc + atual.valor;
        }, 0)        
    }

    private setPagamentos(): ListaContagem {
        return this.transacoes.reduce((acc: ListaContagem, { formaPagamento }) => {
            if (acc[formaPagamento]) {
                acc[formaPagamento]++;
            } else {
                acc[formaPagamento] = 1;
            }            
            return acc;
        }, {});
    }

    private setStatus() {
        return this.transacoes.reduce((acc: ListaContagem, { status }) => {
            if (acc[status]) {
                acc[status]++;
            } else {
                acc[status] = 1;
            }
            console.log(acc);
            
            return acc;
        }, {});
    }
}

function preencherTabela(transacoes: ITransacaoNormalized[]): void {
    if(!transacoes) return;
    const tabela = document.querySelector("#transacoes tbody");
    if(!tabela) return;
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
    })
}

handleData();