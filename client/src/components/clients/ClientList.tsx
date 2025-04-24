import { useState } from "react";
import { useClient, Client } from "@/contexts/ClientContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, RefreshCw, Edit, Trash, Eye } from "lucide-react";
import { toast } from "sonner";

interface ClientListProps {
  onEdit: (client: Client) => void;
}

export default function ClientList({ onEdit }: ClientListProps) {
  const { clients, loading, fetchClients, deleteClient, getClientBySlug } =
    useClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSlug, setSearchSlug] = useState("");
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);
  const [slugLoading, setSlugLoading] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.city &&
        client.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = async () => {
    if (!searchSlug.trim()) {
      toast.error("Please enter a slug to search");
      return;
    }

    setSlugLoading(true);
    try {
      const client = await getClientBySlug(searchSlug.trim());
      if (client) {
        setDetailClient(client);
        toast.success("Client found in Redis cache");
      }
    } catch (error) {
      console.error("Error fetching client by slug", error);
      // Error is handled in context
    } finally {
      setSlugLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchClients();
    toast.success("Client list refreshed");
  };

  const handleDelete = async (id: number) => {
    const success = await deleteClient(id);
    if (success) {
      setClientToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client List</CardTitle>
        <CardDescription>Manage your clients</CardDescription>

        <div className="flex flex-col gap-4 mt-4 sm:flex-row">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Search by slug"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex w-full gap-2">
            <Input
              placeholder="Search by exact slug (Redis)..."
              value={searchSlug}
              onChange={(e) => setSearchSlug(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              variant="outline"
              disabled={slugLoading}
            >
              {slugLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Finding
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Find
                </>
              )}
            </Button>

            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex space-x-4 items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No clients found. Add a new client to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      {client.client_logo &&
                      client.client_logo !== "no-image.jpg" ? (
                        <img
                          src={client.client_logo}
                          alt={client.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show default
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src =
                              "https://placehold.co/40x40/gray/white?text=" +
                              client.client_prefix;
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          {client.client_prefix}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.slug}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.is_project === "1" ? "default" : "secondary"
                        }
                      >
                        {client.is_project === "1" ? "Project" : "Client"}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.city || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDetailClient(client)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setClientToDelete(client)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={clientToDelete !== null}
        onOpenChange={(open) => !open && setClientToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft delete the client "{clientToDelete?.name}". The
              data will be marked as deleted but not permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if (clientToDelete) {
                  handleDelete(clientToDelete.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Client Details Dialog */}
      <AlertDialog
        open={detailClient !== null}
        onOpenChange={(open) => !open && setDetailClient(null)}
      >
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Client Details</AlertDialogTitle>
            {detailClient && (
              <div className="mt-4 space-y-4">
                <div className="flex justify-center">
                  {detailClient.client_logo &&
                  detailClient.client_logo !== "no-image.jpg" ? (
                    <img
                      src={detailClient.client_logo}
                      alt={detailClient.name}
                      className="h-32 w-32 rounded-lg object-cover"
                      onError={(e) => {
                        // If image fails to load, show default
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "https://placehold.co/128x128/gray/white?text=" +
                          detailClient.client_prefix;
                      }}
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center text-2xl font-bold">
                      {detailClient.client_prefix}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-semibold">Name:</div>
                  <div>{detailClient.name}</div>

                  <div className="font-semibold">Slug:</div>
                  <div>{detailClient.slug}</div>

                  <div className="font-semibold">Prefix:</div>
                  <div>{detailClient.client_prefix}</div>

                  <div className="font-semibold">Type:</div>
                  <div>
                    {detailClient.is_project === "1" ? "Project" : "Client"}
                  </div>

                  <div className="font-semibold">Self Capture:</div>
                  <div>{detailClient.self_capture === "1" ? "Yes" : "No"}</div>

                  <div className="font-semibold">Address:</div>
                  <div>{detailClient.address || "-"}</div>

                  <div className="font-semibold">Phone:</div>
                  <div>{detailClient.phone_number || "-"}</div>

                  <div className="font-semibold">City:</div>
                  <div>{detailClient.city || "-"}</div>

                  <div className="font-semibold">Created:</div>
                  <div>
                    {detailClient.created_at
                      ? new Date(detailClient.created_at).toLocaleString()
                      : "-"}
                  </div>

                  <div className="font-semibold">Updated:</div>
                  <div>
                    {detailClient.updated_at
                      ? new Date(detailClient.updated_at).toLocaleString()
                      : "-"}
                  </div>
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <Button
              onClick={() => {
                if (detailClient) {
                  onEdit(detailClient);
                  setDetailClient(null);
                }
              }}
            >
              Edit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
