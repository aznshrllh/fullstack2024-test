import { useState } from "react";
import ClientList from "./components/clients/ClientList";
import ClientForm from "./components/clients/ClientForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientProvider, Client } from "./contexts/ClientContext";
import { Toaster } from "sonner";

function App() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("clients");

  const handleCompleteForm = () => {
    setSelectedClient(null);
    setActiveTab("clients");
  };

  return (
    <ClientProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Client Management System
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">Client List</TabsTrigger>
            <TabsTrigger value="form">
              {selectedClient ? "Edit Client" : "Create Client"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientList
              onEdit={(client) => {
                setSelectedClient(client);
                setActiveTab("form");
              }}
            />
          </TabsContent>

          <TabsContent value="form">
            <ClientForm
              client={selectedClient}
              onComplete={handleCompleteForm}
            />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster richColors position="top-right" />
    </ClientProvider>
  );
}

export default App;
