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

function normalizeData(transacao: ITransacaoAPI) {
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
    }
}

async function handleData() {
    const data = await fetchData<ITransacaoAPI[]>('https://api.origamid.dev/json/transacoes.json');
    if (!data) return;
    const x = data.map(normalizeData);
    console.log(x);
    
}

handleData();