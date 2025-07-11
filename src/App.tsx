import { useEffect, useState } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";

interface Ativo {
  nome: string;
  valor: number;
  data: string;
}

function App() {
  // estado para armazenar a lista de ativos
  const [ativos, setAtivos] = useState<Ativo[]>([]);

  // termo de busca digitado pelo usuário, começa como string vazia
  const [searchTerm, setSearchTerm] = useState<string>("");

  // estado para controlar o carregamento da lista
  const [loadingAtivos, setLoadingAtivos] = useState<boolean>(false);

  // pegar os inputs e enviar o form para o back
  const [novoAtivo, setNovoAtivo] = useState<Ativo>({
    nome: "",
    valor: 0,
    data: "",
  });

  // filtra a lista de ativos com base no termo de busca
  const filteredAtivo = ativos.filter((ativo) =>
    ativo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // pegar lista de ativos
  const getAtivos = async () => {
    setLoadingAtivos(true);

    fetch(`http://localhost:3000/ativos`)
      .then((res) => res.json())
      .then((data) => {
        // atualiza o estado com a lista de ativos retornada
        setAtivos(data);

        setLoadingAtivos(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao carregar ativos.", {
          style: {
            background: "#b91010",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "16px",
          },
        });
        setLoadingAtivos(false);
      });
  };

  // useeffect que executa quando o componente é montado
  useEffect(() => {
    // tela começa aqui
    // inicia o carregamento da lista de ativos
    getAtivos();
  }, []);

  const validarFormulario = (): boolean => {
    if (!novoAtivo.nome || novoAtivo.nome.trim() === "") {
      toast.error("Nome do ativo não pode ser vazio.", {
        style: {
          background: "#b91010",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
      return false;
    }

    if (novoAtivo.nome.length !== 5) {
      toast.error("Nome deve ter exatamente 5 caracteres.", {
        style: {
          background: "#b91010",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
      return false;
    }

    for (let i = 0; i < 4; i++) {
      const letra = novoAtivo.nome.charAt(i);
      if (letra < "A" || letra > "Z") {
        toast.error(
          "Os 4 primeiros caracteres do nome devem ser caracteres com letras maiúsculas.",
          {
            style: {
              background: "#b91010",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "16px",
            },
          }
        );
        return false;
      }
    }

    const ultimoNumero = novoAtivo.nome.charAt(4);
    if (ultimoNumero < "0" || ultimoNumero > "9") {
      toast.error("O último caractere do nome deve ser um número.", {
        style: {
          background: "#b91010",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
      return false;
    }

    if (
      typeof novoAtivo.valor !== "number" ||
      isNaN(novoAtivo.valor) ||
      novoAtivo.valor <= 0
    ) {
      toast.error("Valor do ativo deve ser um número positivo.", {
        style: {
          background: "#b91010",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
      return false;
    }

    const dataConvertida = new Date(novoAtivo.data);
    if (isNaN(dataConvertida.getTime())) {
      toast.error("data inválida.", {
        style: {
          background: "#b91010",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
      return false;
    }
    return true;
  };

  // 'e' seria o evento de envio do form
  const adicionarAtivo = async (e: React.FormEvent) => {
    // não att a pag
    e.preventDefault();

    // se for falso, para
    if (validarFormulario() === false) {
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/ativos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoAtivo.nome.toUpperCase(),
          valor: novoAtivo.valor,
          data: novoAtivo.data,
        }),
      });

      if (res.ok) {
        // limpar dados do novoAtivo
        setNovoAtivo({
          nome: "",
          valor: 0,
          data: "",
        });

        // puxa os novos dados p tela
        getAtivos();

        toast.success("Ativo adicionado com sucesso!", {
          style: {
            background: "#10b981",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "16px",
          },
        });
      } else {
        throw new Error(await res.text());
      }
    } catch (error: any) {
      toast.error(error.message, {
        style: {
          background: "#b91010",
          color: "#ffffff",
          borderRadius: "8px",
          padding: "16px",
        },
      });
    }
  };

  // início do jsx
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <h1>Ativos financeiros</h1>

      <form onSubmit={adicionarAtivo}>
        <input
          type="text"
          placeholder="Nome (exemplo: PETR4)"
          // input é controlado, a atualização do estado reflete
          // imediatamente no input, mantendo a sincronia
          value={novoAtivo.nome}
          onChange={(e) =>
            // spread copia as propriedades existentes, os demais inputs,
            // para manter seus valores inalterados
            setNovoAtivo({
              ...novoAtivo,
              nome: e.target.value.toUpperCase(),
            })
          }
          className="w-full p-2 pl-8 border-2 border-blue-400 rounded-lg text-sm bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          type="number"
          placeholder="Valor"
          // tirar 0 automático

          // input é controlado, a atualização do estado reflete
          // imediatamente no input, mantendo a sincronia
          value={novoAtivo.valor === 0 ? "" : novoAtivo.valor}
          onChange={(e) =>
            // spread copia as propriedades existentes, os demais inputs,
            // para manter seus valores inalterados
            setNovoAtivo({ ...novoAtivo, valor: Number(e.target.value) })
          }
          className="w-full p-2 pl-8 border-2 border-blue-400 rounded-lg text-sm bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          type="date"
          // input é controlado, a atualização do estado reflete
          // imediatamente no input, mantendo a sincronia
          value={novoAtivo.data}
          onChange={(e) =>
            // spread copia as propriedades existentes, os demais inputs,
            // para manter seus valores inalterados
            setNovoAtivo({ ...novoAtivo, data: e.target.value })
          }
          className="w-full p-2 pl-8 border-2 border-blue-400 rounded-lg text-sm bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          type="submit"
          className="bg-red-600 text-white px-2 py-0.5 rounded text-xs hover:bg-red-900 transition-colors mt-1 cursor-pointer"
        >
          Adicionar
        </button>
      </form>

      {/* // campo de busca */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar ativo financeiro"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-8 border-2 border-blue-400 rounded-lg text-sm bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        {/* // ícone de lupa */}
        <div className="absolute left-2 top-2.5">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <h2>Lista de ativos</h2>

      {/* está carregando os ativos? */}
      {loadingAtivos === true ? (
        <div>Carregando...</div>
      ) : filteredAtivo.length === 0 ? (
        // a lista tem tamanho 0?
        <div>Nenhum ativo encontrado.</div>
      ) : (
        // listar ativos
        <div>
          <hr />
          {filteredAtivo.map((ativo, index) => (
            <div key={index}>
              <p>{ativo.nome}</p>
              <p>{ativo.valor}</p>
              <p>{ativo.data}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
