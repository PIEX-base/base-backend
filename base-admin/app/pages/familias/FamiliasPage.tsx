import { CardNavTabs } from "~/components/ui/CardNavTabs";
import { FamiliasComponent } from "./familias-detalhes/FamiliasComponent";
import { PessoasComponent } from "./pessoas/PessoasComponent";
import { ResponsaveisComponent } from "./responsavel/ResponsaveisComponent";
import { CriancasComponent } from "./criancas/CriancasComponent";

export const FamiliasPage: React.FC = () => {
  const tabs = [
    {
      key: "familias",
      label: "Famílias",
      content: <FamiliasComponent />,
    },
    {
      key: "pessoas",
      label: "Pessoas",
      content: <PessoasComponent />,
    },
    {
      key: "responsaveis",
      label: "Responsáveis",
      content: <ResponsaveisComponent />,
    },
    {
      key: "criancas",
      label: "Crianças",
      content: <CriancasComponent />,
    },
  ];

  return (
    <div>
      <CardNavTabs tabs={tabs} />
    </div>
  );
};
