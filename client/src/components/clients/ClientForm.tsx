import { useState, useEffect } from "react";
import { useClient, Client } from "@/contexts/ClientContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Upload,
  Building2,
  UserSquare,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ClientFormProps {
  client: Client | null;
  onComplete: () => void;
}

export default function ClientForm({ client, onComplete }: ClientFormProps) {
  const { createClient, updateClient, loading } = useClient();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    is_project: "0",
    self_capture: "1",
    client_prefix: "",
    address: "",
    phone_number: "",
    city: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState(false);

  // Initialize form when client changes
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        slug: client.slug || "",
        is_project: client.is_project || "0",
        self_capture: client.self_capture || "1",
        client_prefix: client.client_prefix || "",
        address: client.address || "",
        phone_number: client.phone_number || "",
        city: client.city || "",
      });

      // Set logo preview if available
      if (client.client_logo && client.client_logo !== "no-image.jpg") {
        setLogoPreview(client.client_logo);
      } else {
        setLogoPreview(null);
      }
    } else {
      // Reset form for new client
      setFormData({
        name: "",
        slug: "",
        is_project: "0",
        self_capture: "1",
        client_prefix: "",
        address: "",
        phone_number: "",
        city: "",
      });
      setLogoPreview(null);
      setLogoFile(null);
    }
    setFormTouched(false);
  }, [client]);

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormTouched(true);
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-"),
    });
  };

  // Auto-generate client prefix from name
  const handleNameBlur = () => {
    if (!formData.client_prefix && formData.name) {
      // Generate prefix from the first characters of each word (up to 4 chars)
      const words = formData.name.split(/\s+/);
      let prefix = words.map((word) => word.charAt(0).toUpperCase()).join("");
      prefix = prefix.substring(0, 4); // Ensure it's max 4 chars

      setFormData({
        ...formData,
        client_prefix: prefix,
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTouched(true);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.match("image.*")) {
      toast.error("Invalid file", {
        description: "Please select an image file",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image must be smaller than 5MB",
      });
      return;
    }

    setLogoFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormTouched(true);
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleClearLogo = () => {
    setFormTouched(true);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.slug || !formData.client_prefix) {
      toast.error("Validation error", {
        description: "Name, slug and client prefix are required",
      });
      return;
    }

    // Ensure client prefix is max 4 chars
    if (formData.client_prefix.length > 4) {
      toast.error("Validation error", {
        description: "Client prefix must be maximum 4 characters",
      });
      return;
    }

    // Create a FormData object for the request
    const submitData = new FormData();

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submitData.append(key, value);
      }
    });

    // Add logo file if selected
    if (logoFile) {
      submitData.append("client_logo", logoFile);
    }

    let success = false;
    if (client) {
      // Update existing client
      const result = await updateClient(client.id, submitData);
      success = !!result;
    } else {
      // Create new client
      const result = await createClient(submitData);
      success = !!result;
    }

    if (success) {
      // Reset form and notify parent
      setFormData({
        name: "",
        slug: "",
        is_project: "0",
        self_capture: "1",
        client_prefix: "",
        address: "",
        phone_number: "",
        city: "",
      });
      setLogoFile(null);
      setLogoPreview(null);
      setFormTouched(false);
      onComplete();
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-6">
        <div className="flex items-center space-x-2">
          <div>
            <CardTitle className="text-2xl mb-1">
              {client ? "Edit Client" : "Create New Client"}
            </CardTitle>
            <CardDescription>
              {client
                ? "Update the client information"
                : "Fill in the details to create a new client"}
            </CardDescription>
          </div>
          {client && (
            <Badge
              variant={client.is_project === "1" ? "default" : "outline"}
              className="ml-auto"
            >
              {client.is_project === "1" ? "Project" : "Client"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Client Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={handleNameBlur}
                      placeholder="Enter client name"
                      className="focus-visible:ring-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="client_prefix"
                      className="text-sm font-medium"
                    >
                      Prefix <span className="text-red-500">*</span>{" "}
                      <span className="text-xs text-muted-foreground">
                        (Max 4 chars)
                      </span>
                    </Label>
                    <Input
                      id="client_prefix"
                      value={formData.client_prefix}
                      onChange={(e) =>
                        handleInputChange(
                          "client_prefix",
                          e.target.value.substring(0, 4)
                        )
                      }
                      placeholder="CLNT"
                      className="focus-visible:ring-primary"
                      maxLength={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-sm font-medium">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      placeholder="client-name-slug"
                      className="focus-visible:ring-primary"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for URL and identification. Auto-generated from name.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="is_project" className="text-sm font-medium">
                      Type
                    </Label>
                    <Select
                      value={formData.is_project}
                      onValueChange={(value) =>
                        handleInputChange("is_project", value)
                      }
                    >
                      <SelectTrigger
                        id="is_project"
                        className="focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Client</SelectItem>
                        <SelectItem value="1">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="self_capture"
                      className="text-sm font-medium"
                    >
                      Self Capture
                    </Label>
                    <Select
                      value={formData.self_capture}
                      onValueChange={(value) =>
                        handleInputChange("self_capture", value)
                      }
                    >
                      <SelectTrigger
                        id="self_capture"
                        className="focus-visible:ring-primary"
                      >
                        <SelectValue placeholder="Self capture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <UserSquare className="h-5 w-5 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Enter address"
                      rows={3}
                      className="resize-none focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="city" className="text-sm font-medium">
                        City
                      </Label>
                    </div>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Enter city"
                      className="focus-visible:ring-primary"
                    />

                    <div className="flex items-center gap-2 mt-4 mb-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Label
                        htmlFor="phone_number"
                        className="text-sm font-medium"
                      >
                        Phone Number
                      </Label>
                    </div>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className="focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Client Logo
                </h3>
                <div className="flex flex-col gap-4 items-center text-center">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 w-full aspect-square flex flex-col items-center justify-center transition-colors ${
                      logoPreview
                        ? "border-transparent bg-background"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {logoPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="h-full w-full object-contain rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-8 w-8"
                          onClick={handleClearLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SVG, PNG or JPG (max. 5MB)
                        </p>
                      </>
                    )}
                    <Input
                      id="client_logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className={`absolute inset-0 opacity-0 cursor-pointer ${
                        logoPreview ? "hidden" : ""
                      }`}
                    />
                  </div>
                  {!logoPreview && client?.client_prefix && (
                    <div className="border rounded-md p-3 w-full">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10 text-primary font-bold text-lg mx-auto">
                        {client.client_prefix}
                      </div>
                      <p className="text-xs text-center mt-2 text-muted-foreground">
                        Generated from prefix
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <span className="text-red-500">*</span> Required fields
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (formTouched) {
                    // Confirm discard changes
                    if (
                      confirm("Are you sure? Any unsaved changes will be lost.")
                    ) {
                      onComplete();
                    }
                  } else {
                    onComplete();
                  }
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {client ? "Update" : "Create"} Client
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
