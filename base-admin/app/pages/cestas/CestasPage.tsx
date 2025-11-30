import { CardNavTabs } from "~/components/ui/CardNavTabs";
import { ProdutosComponent } from "./produtos/ProdutosComponent";
import { CestasComponent } from "./cestas-basicas/CestasComponent";

export const CestasPage = () => {
  const tabs = [
    {
      key: "produtos",
      label: "Produtos",
      content: <ProdutosComponent />,
    },
    {
      key: "cestas",
      label: "Cestas Básicas",
      content: <CestasComponent />,
    },
  ];

  return (
    <div>
      <CardNavTabs tabs={tabs} />
    </div>
  );
};
