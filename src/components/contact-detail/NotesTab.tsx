import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Pin, Trash2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotesTabProps {
  contactId: string;
}

const NotesTab = ({ contactId }: NotesTabProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [contactId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_notes")
        .select("*")
        .eq("contact_id", contactId)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      // Error silently handled
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("contact_notes").insert({
      contact_id: contactId,
      user_id: session.user.id,
      content: newNote.trim(),
    });

    if (!error) {
      toast({ title: "Note saved" });
      setNewNote("");
      fetchNotes();
    }
  };

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    const { error } = await supabase
      .from("contact_notes")
      .update({ is_pinned: !isPinned })
      .eq("id", noteId);

    if (!error) {
      toast({ title: isPinned ? "Note unpinned" : "Note pinned" });
      fetchNotes();
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const { error } = await supabase
      .from("contact_notes")
      .delete()
      .eq("id", noteId);

    if (!error) {
      toast({ title: "Note deleted" });
      fetchNotes();
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    const { error } = await supabase
      .from("contact_notes")
      .update({ content: editContent })
      .eq("id", noteId);

    if (!error) {
      toast({ title: "Note updated" });
      setEditingNoteId(null);
      fetchNotes();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Add New Note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[120px]"
          />
          <Button onClick={handleSaveNote} disabled={!newNote.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No notes yet. Add your first note above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg border bg-card space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {editingNoteId === note.id ? (
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    )}
                  </div>
                  {note.is_pinned && (
                    <Badge variant="secondary" className="flex-shrink-0">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {formatDistanceToNow(new Date(note.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                  <div className="flex gap-2">
                    {editingNoteId === note.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateNote(note.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingNoteId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingNoteId(note.id);
                            setEditContent(note.content);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTogglePin(note.id, note.is_pinned)}
                        >
                          <Pin className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesTab;
