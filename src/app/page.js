import { supabase } from "../../lib/supabase"

export default async function Home() {

  // Fetch people from Supabase
  const { data: people, error } = await supabase
    .from("people")
    .select("*")

console.log(people)

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Error: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">
        Trekgeest Genealogy
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-3xl">
        {people.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No people found. Add some in Supabase!
          </p>
        ) : (
          people.map((person) => (
            <div
              key={person.peopleID}
              className="p-4 rounded-md bg-white dark:bg-zinc-800 shadow-sm"
            >
              <p className="font-medium text-lg text-black dark:text-zinc-50">
                {person.peopleName} {person.peopleSurname}
              </p>
              {person.peopleBirthDate && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  Born: {person.peopleBirthDate}
                </p>
              )}
              {person.peopleMarriageDate && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  Married: {person.peopleMarriageDate}
                </p>
              )}
              {person.peopleDeathDate && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  Died: {person.peopleDeathDate}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}