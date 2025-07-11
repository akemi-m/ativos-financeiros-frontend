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
    <div className="flex h-screen">
      <div className="bg-gray-900 text-white w-44 space-y-6 py-7 px-2 fixed h-full left-0 top-0">
        <div className="flex justify-center items-center h-26">
          <img src="dolarame.png" alt="Logo Dolarame" className="w-16" />
        </div>
      </div>

      <div className="flex-1 ml-64">
        <div className="max-w-[1200px] mx-auto p-4">
          <Toaster position="top-right" reverseOrder={false} />
          <h1 className="text-3xl font-bold mb-10 text-white text-left">
            Bem-vindo, Samuel
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <form
                onSubmit={adicionarAtivo}
                className="space-y-4 bg-[#4a5d3a] p-6 rounded-lg shadow-lg lg:h-140 sm:h-90"
              >
                <h2 className="text-2xl font-semibold text-white lg:mb-12 lg:mt-13 sm:mb-6 sm:mt-3">
                  Cadastro
                </h2>
                <input
                  type="text"
                  placeholder="Nome"
                  value={novoAtivo.nome}
                  onChange={(e) =>
                    setNovoAtivo({
                      ...novoAtivo,
                      nome: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full p-2 pl-8 border-2 border-[#6e8f58] rounded-lg text-sm bg-gray-900 text-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-[#6e8f58]"
                />

                <input
                  type="number"
                  placeholder="Valor"
                  value={novoAtivo.valor === 0 ? "" : novoAtivo.valor}
                  onChange={(e) =>
                    setNovoAtivo({
                      ...novoAtivo,
                      valor: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 pl-8 border-2 border-[#6e8f58] rounded-lg text-sm bg-gray-900 text-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-[#6e8f58]"
                />

                <input
                  type="date"
                  value={novoAtivo.data}
                  onChange={(e) =>
                    setNovoAtivo({ ...novoAtivo, data: e.target.value })
                  }
                  className="w-full p-2 pl-8 border-2 border-[#6e8f58] rounded-lg text-sm bg-gray-900 text-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-[#6e8f58]"
                />

                <button
                  type="submit"
                  className="w-full bg-[#6e8f58] text-white px-2 py-2 rounded-lg text-sm hover:bg-[#5a7547] transition-colors mt-2 cursor-pointer"
                >
                  Adicionar
                </button>
              </form>
            </div>
            <div className="w-full lg:w-2/3 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 border-2 border-[#6e8f58] rounded-lg text-sm bg-gray-900 text-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-[#6e8f58]"
                />
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

              {loadingAtivos === true ? (
                <div className="text-2xl font-medium text-white text-center">
                  Carregando...
                </div>
              ) : filteredAtivo.length === 0 ? (
                <div className="text-2xl font-medium text-white text-center">
                  Nenhum ativo encontrado.
                </div>
              ) : (
                <div className="space-y-4 max-h-126 overflow-y-auto custom-scrollbar pr-3">
                  {filteredAtivo.map((ativo, index) => (
                    <div
                      key={index}
                      className="flex max-w items-center gap-x-4 rounded-xl bg-gray-900 p-6 shadow-lg border-2 border-[#6e8f58] dark:shadow-none"
                    >
                      <div>
                        <p className="text-gray-400 text-left text-xs pb-1">
                          Último registro
                        </p>
                        <div className="text-2xl font-medium text-white text-left">
                          {ativo.nome}
                        </div>
                        <p className="text-gray-400 text-left pt-2 text-lg">
                          {ativo.valor} <span className="text-xs">BRL</span>
                        </p>
                        <p className="text-gray-400 text-left">{ativo.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
