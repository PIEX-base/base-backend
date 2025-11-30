import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import { useState } from "react";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";

export function Main() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (key: string) => {
    console.log("Sort by:", key);
    // Implementar lógica de ordenação
  };

  return (
    <main className="flex flex-col items-center justify-center pt-16 pb-4"></main>
  );
}
