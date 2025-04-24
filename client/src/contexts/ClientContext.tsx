import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "@/configs/axiosInstance";
import { toast } from "sonner";

export interface Client {
  id: number;
  name: string;
  slug: string;
  is_project: string;
  self_capture: string;
  client_prefix: string;
  client_logo: string;
  address: string | null;
  phone_number: string | null;
  city: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

interface ClientContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  getClientById: (id: number) => Promise<Client | null>;
  getClientBySlug: (slug: string) => Promise<Client | null>;
  createClient: (formData: FormData) => Promise<Client | null>;
  updateClient: (id: number, formData: FormData) => Promise<Client | null>;
  deleteClient: (id: number) => Promise<boolean>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/clients");
      setClients(response.data);
      return response.data;
    } catch (err: unknown) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch clients";
      setError(errorMsg);
      toast.error("Failed to fetch clients", {
        description: errorMsg,
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getClientById = async (id: number): Promise<Client | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/clients/${id}`);
      return response.data;
    } catch (err: unknown) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch client";
      setError(errorMsg);
      toast.error("Failed to fetch client", {
        description: errorMsg,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getClientBySlug = async (slug: string): Promise<Client | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/clients/slug/${slug}`);
      return response.data;
    } catch (err: unknown) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch client by slug";
      setError(errorMsg);
      toast.error("Failed to fetch client by slug", {
        description: errorMsg,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (formData: FormData): Promise<Client | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/clients", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setClients((prev) => [...prev, response.data]);

      toast.success("Client created successfully", {
        description: `${response.data.name} has been added to your clients`,
      });

      return response.data;
    } catch (err: unknown) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to create client";
      setError(errorMsg);
      toast.error("Failed to create client", {
        description: errorMsg,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (
    id: number,
    formData: FormData
  ): Promise<Client | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.put(`/clients/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setClients((prev) =>
        prev.map((client) => (client.id === id ? response.data : client))
      );

      toast.success("Client updated successfully", {
        description: `${response.data.name} has been updated`,
      });

      return response.data;
    } catch (err: unknown) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update client";
      setError(errorMsg);
      toast.error("Failed to update client", {
        description: errorMsg,
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/clients/${id}`);

      setClients((prev) => prev.filter((client) => client.id !== id));

      toast.success("Client deleted successfully", {
        description: "The client has been soft deleted",
      });

      return true;
    } catch (err: unknown) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete client";
      setError(errorMsg);
      toast.error("Failed to delete client", {
        description: errorMsg,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        error,
        fetchClients,
        getClientById,
        getClientBySlug,
        createClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);

  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }

  return context;
};
