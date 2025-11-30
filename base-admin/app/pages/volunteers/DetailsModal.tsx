import type { Voluntario } from "~/interfaces/volunteers";

interface DetailsModalProps {
  selectedVolunteer: Voluntario | null;
}

export const DetailsModal = ({ selectedVolunteer }: DetailsModalProps) => {
  if (!selectedVolunteer) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum voluntário selecionado.
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-white flex items-center gap-2">
        <span>👤</span> Detalhes do Voluntário
      </h2>
      <div className="space-y-3">
        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Nome:
          </span>
          <span className="mt-1 block">{selectedVolunteer.nome}</span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Email:
          </span>
          <span className="mt-1 block">{selectedVolunteer.email}</span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Telefone:
          </span>
          <span className="mt-1 block">{selectedVolunteer.telefone}</span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            CPF:
          </span>
          <span className="mt-1 block">{selectedVolunteer.cpf}</span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            RG:
          </span>
          <span className="mt-1 block">{selectedVolunteer.rg}</span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Endereço:
          </span>
          <span className="mt-1 block">{selectedVolunteer.endereco}</span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Disponibilidade:
          </span>
          <span className="mt-1 block">
            {selectedVolunteer.disponibilidade}
          </span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Área de atuação:
          </span>
          <span className="mt-1 block">{selectedVolunteer.area_atuacao}</span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Antecedentes criminais:
          </span>
          <span
            className={`mt-1 font-bold ${
              selectedVolunteer.tem_antecedentes
                ? "text-red-600"
                : "text-green-600"
            }`}>
            {selectedVolunteer.tem_antecedentes ? "Sim" : "Não"}
          </span>
          {selectedVolunteer.url_comprovante && (
            <a
              href={selectedVolunteer.url_comprovante}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:underline">
              Ver comprovante
            </a>
          )}
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="font-bold text-gray-700 dark:text-gray-200">
            Respondeu questionário:
          </span>
          <span className="ml-2">
            {selectedVolunteer.respondeu_questionario ? "Sim" : "Não"}
          </span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="font-bold text-gray-700 dark:text-gray-200">
            Aceitou termos:
          </span>
          <span className="ml-2">
            {selectedVolunteer.aceitou_termos ? "✅ Sim" : "❌ Não"}
          </span>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <span className="block font-bold text-gray-700 dark:text-gray-200">
            Data de Cadastro:
          </span>
          <span className="mt-1 block">
            {selectedVolunteer.data_cadastro
              ? new Date(selectedVolunteer.data_cadastro).toLocaleDateString(
                  "pt-BR"
                )
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};
