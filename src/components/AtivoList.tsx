import { Ativo } from "../App";

interface FormListProps {
  loadingAtivos: boolean;
  filteredAtivo: Ativo[];
}

export default function FormList({
  loadingAtivos,
  filteredAtivo,
}: FormListProps) {
  return (
    <>
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
                <div className="text-2xl font-medium text-white text-left">
                  {ativo.nome}
                </div>
                <p className="text-gray-400 text-left pt-2 text-lg">
                  {ativo.valor.toFixed(2)} <span className="text-xs">BRL</span>
                </p>
                <p className="text-gray-400 text-left">{ativo.data}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
