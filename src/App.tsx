import { useEffect, useState } from "react";
import "./App.css";
import toast, { Toaster } from "react-hot-toast";
import AtivoForm from "./components/AtivoForm";
import FormList from "./components/AtivoList";

export interface Ativo {
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
              <AtivoForm getAtivos={getAtivos} />
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

              <FormList
                loadingAtivos={loadingAtivos}
                filteredAtivo={filteredAtivo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
