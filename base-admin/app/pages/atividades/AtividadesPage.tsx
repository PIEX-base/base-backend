import { CardNavTabs } from "~/components/ui/CardNavTabs";
import { AtividadesComponent } from "./atividadesComponent/AtividadesComponent";
import { MatriculasComponent } from "./matriculas/MatriculasComponent";

export const AtividadesPage: React.FC = () => {
  const tabs = [
    {
      key: "atividades",
      label: "Atividades",
      content: <AtividadesComponent />,
    },
    {
      key: "matriculas",
      label: "Matrículas",
      content: <MatriculasComponent />,
    },
  ];
  return (
    <div>
      <CardNavTabs tabs={tabs} />
    </div>
  );
};
