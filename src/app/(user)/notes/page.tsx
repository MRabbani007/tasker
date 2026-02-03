import FormCreateNote from "@/features/notes/FormCreateNote";
import { NoteCard } from "@/features/notes/NoteCard";
import NotesList from "@/features/notes/NotesList";
import { getNotes } from "@/lib/actions/user/notes";

export default async function NotesPage() {
  const { data: notes } = await getNotes({});

  const openNotes = notes.filter((n) => n.openedAt !== null);
  const closedNotes = notes.filter((n) => n.openedAt === null);

  return (
    <main className="flex-1 flex flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Thoughts, ideas, and everything in between
          </p>
        </div>

        <FormCreateNote />
      </header>

      <div className="flex items-stretch gap-6">
        {/* All notes */}
        <NotesList notes={closedNotes} />

        {/* Open notes */}
        {openNotes.length > 0 && (
          <section>
            <h2 className="mb-3 font-semibold">Open notes</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {openNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
