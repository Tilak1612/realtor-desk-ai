import { useState } from "react";
import { Contact } from "@/pages/Contacts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Phone, Mail, Eye, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LeadScoreBadge from "./LeadScoreBadge";

interface ContactsTableProps {
  contacts: Contact[];
  loading: boolean;
  selectedContacts: string[];
  onSelectionChange: (selected: string[]) => void;
  onRefresh: () => void;
}

type SortField = "name" | "ai_score" | "last_contact_date" | "created_at";
type SortDirection = "asc" | "desc";

const ContactsTable = ({
  contacts,
  loading,
  selectedContacts,
  onSelectionChange,
  onRefresh,
}: ContactsTableProps) => {
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [perPage] = useState(25);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    let aVal: unknown, bVal: unknown;

    switch (sortField) {
      case "name":
        aVal = `${a.first_name || ""} ${a.last_name || ""}`.toLowerCase();
        bVal = `${b.first_name || ""} ${b.last_name || ""}`.toLowerCase();
        break;
      case "ai_score":
        aVal = a.ai_score || 0;
        bVal = b.ai_score || 0;
        break;
      case "last_contact_date":
        aVal = a.last_contact_date ? new Date(a.last_contact_date).getTime() : 0;
        bVal = b.last_contact_date ? new Date(b.last_contact_date).getTime() : 0;
        break;
      case "created_at":
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
        break;
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const paginatedContacts = sortedContacts.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(sortedContacts.length / perPage);

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(contacts.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedContacts.includes(id)) {
      onSelectionChange(selectedContacts.filter((cid) => cid !== id));
    } else {
      onSelectionChange([...selectedContacts, id]);
    }
  };

  const getScoreBadge = (score: number | null) => {
    return <LeadScoreBadge score={score} />;
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (!error) {
      toast({ title: "Contact deleted successfully" });
      onRefresh();
    } else {
      toast({ title: "Error deleting contact", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg bg-card">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 flex gap-4 items-center border-b last:border-0">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32 ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="border rounded-lg bg-card p-12 text-center">
        <p className="text-muted-foreground mb-4">No contacts found</p>
        <Button onClick={onRefresh}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedContacts.length === contacts.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="hover:bg-muted"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("ai_score")}
                  className="hover:bg-muted"
                >
                  Score
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Source</TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("last_contact_date")}
                  className="hover:bg-muted"
                >
                  Last Contact
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onCheckedChange={() => toggleSelect(contact.id)}
                  />
                </TableCell>
                <TableCell>
                  {(() => {
                    const fullName = `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();
                    const emailPrefix = contact.email?.split("@")[0] ?? "";
                    const displayName = fullName || emailPrefix || "Unknown";
                    const initial = (contact.first_name?.[0] ?? emailPrefix[0] ?? "?").toUpperCase();
                    return (
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {initial}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className="font-medium cursor-pointer hover:text-primary transition-colors"
                          onClick={() => window.location.href = `/contacts/${contact.id}`}
                        >
                          {displayName}
                        </span>
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{contact.email || "-"}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{contact.phone || "-"}</TableCell>
                <TableCell>{getScoreBadge(contact.ai_score)}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  {contact.source && <Badge variant="outline">{contact.source}</Badge>}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {contact.last_contact_date
                    ? formatDistanceToNow(new Date(contact.last_contact_date), { addSuffix: true })
                    : "-"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.location.href = `/contacts/${contact.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`tel:${contact.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`mailto:${contact.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(contact.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, sortedContacts.length)}{" "}
            of {sortedContacts.length} contacts
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsTable;
