import { useState } from "react";
import { Ativo } from "../App";
import toast from "react-hot-toast";

interface AtivoFormProps {
  getAtivos: () => void;
}

export default function AtivoForm({ getAtivos }: AtivoFormProps) {
  // pegar os inputs e enviar o form para o back
  const [novoAtivo, setNovoAtivo] = useState<Ativo>({
    nome: "",
    valor: 0,
    data: "",
  });

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

  return (
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
        onChange={(e) => setNovoAtivo({ ...novoAtivo, data: e.target.value })}
        className="w-full p-2 pl-8 border-2 border-[#6e8f58] rounded-lg text-sm bg-gray-900 text-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-[#6e8f58]"
      />

      <button
        type="submit"
        className="w-full bg-[#6e8f58] text-white px-2 py-2 rounded-lg text-sm hover:bg-[#5a7547] transition-colors mt-2 cursor-pointer"
      >
        Adicionar
      </button>
    </form>
  );
}
