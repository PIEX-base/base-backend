import type { FamiliaDetalhes } from "~/interfaces/familias";

interface DetalhesFamiliaModalProps {
  familia: FamiliaDetalhes | null;
}

export const DetalhesFamiliaModal: React.FC<DetalhesFamiliaModalProps> = ({
  familia,
}) => {
  if (!familia) return null;

  return (
    <section className="grid lg:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4 p-4">
        <div>
          <p>
            <span className="font-bold"> Sobrenome: </span> {familia.nome}
          </p>
        </div>

        <div>
          <p>
            <span className="font-bold"> Número de Dependentes: </span>{" "}
            {familia.numero_dependentes}
          </p>
        </div>

        <div>
          <p>
            <span className="font-bold"> Responsável: </span>
            {familia.responsavel?.nome || "-"}
          </p>
        </div>

        <div>
          <p>
            <span className="font-bold"> Data de Cadastro: </span>{" "}
            {new Date(familia.data_cadastro).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p>
            <span className="font-bold"> Elegível para cesta básica? </span>{" "}
            {familia.elegivel_cesta_basica ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Sim
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                Não
              </span>
            )}
          </p>
        </div>

        <div>
          <span className="font-bold"> Observações: </span>
          <p>{familia.observacoes}</p>
        </div>
      </div>

      {/* SEGUNDA COLUNA */}

      <div className="flex flex-col gap-4 ">
        <h2 className="text-lg font-bold mb-2 border-t pt-4 lg:border-t-0 lg:pt-0">
          Responsável da Família
        </h2>

        <div>
          {familia.responsavel ? (
            <div>
              <div className="flex items-start gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <img
                  src={
                    familia.responsavel.foto_url ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(familia.responsavel.nome)
                  }
                  alt={familia.responsavel.nome}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {familia.responsavel.nome}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Nascimento:</span>{" "}
                    {new Date(
                      familia.responsavel.data_nascimento
                    ).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">RG:</span>{" "}
                    {familia.responsavel.rg || "-"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">CPF:</span>{" "}
                    {familia.responsavel.cpf || "-"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Telefone:</span>{" "}
                    {familia.responsavel.telefone || "-"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">E-mail:</span>{" "}
                    {familia.responsavel.email || "-"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Ocupação:</span>{" "}
                    {familia.responsavel.ocupacao || "-"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Endereço:</span>{" "}
                    {familia.responsavel.endereco || "-"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              Nenhum responsável cadastrado.
            </div>
          )}
        </div>

        <h2 className="text-lg font-bold mb-2">Membros da Família</h2>

        <div className="flex flex-col gap-2">
          {familia.pessoas && familia.pessoas.length > 0 ? (
            familia.pessoas.map((pessoa) => (
              <div
                key={pessoa.id_pessoa}
                className="flex items-start gap-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <img
                  src={
                    pessoa.foto_url ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(pessoa.nome)
                  }
                  alt={pessoa.nome}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {pessoa.nome}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Nascimento:</span>{" "}
                    {new Date(pessoa.data_nascimento).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">RG:</span> {pessoa.rg || "-"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">CPF:</span>{" "}
                    {pessoa.cpf || "-"}
                  </div>
                  {pessoa.observacoes && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="font-medium">Obs.:</span>
                      {pessoa.observacoes}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              Nenhuma pessoa cadastrada nesta família.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
