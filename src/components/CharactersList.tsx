import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CharacterType } from "../types/types";
import CharacterDetails from "./CharacterDetails";
import { CgSpinner } from "react-icons/cg";

const CharactersList = () => {
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterType | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchString, setSearchString] = useState(
    searchParams.get("search") || ""
  );

  const searchParam = searchParams.get("search") || "";
  const pageParam = searchParams.get("page") || 1;

  useEffect(() => {
    const getCharacters = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://swapi.dev/api/people/?page=${pageParam}&search=${searchParam}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch characters: ${res.statusText}`);
        }

        const data = await res.json();
        setCharacters(data.results);
        setHasNextPage(data.next);
      } catch (error: any) {
        setCharacters([]);
        setHasNextPage(null);
        setError(
          error?.message || "Something went wrong with the characters fetching"
        );
      } finally {
        setIsLoading(false);
      }
    };

    getCharacters();
  }, [pageParam, searchParam]);

  return (
    <div>
      {selectedCharacter && (
        <CharacterDetails
          selectedCharacter={selectedCharacter}
          setSelectedCharacter={setSelectedCharacter}
        />
      )}

      <h1 className="text-3xl mb-10 text-center">Characters List</h1>

      <div className="mb-10 flex gap-3">
        <input
          defaultValue={searchParam}
          onChange={(e) => setSearchString(e.target.value)}
          type="text"
          className=" border-neutral-400 bg-transparent border px-2 py-2 max-w-[22rem] w-full rounded"
          placeholder="Search by name..."
        />
        <button
          onClick={() =>
            setSearchParams({
              search: searchString,
              page: "1",
            })
          }
          className="bg-blue-500 px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {characters.length === 0 && !error && !isLoading && (
        <p className="">No characters found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10 min-h-[21rem] relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black  bg-opacity-30 rounded flex justify-center items-center">
            <CgSpinner className="animate-spin text-3xl text-blue-500" />
          </div>
        )}
        {characters.map((character, index) => (
          <div
            onClick={() => setSelectedCharacter(character)}
            key={index}
            className="rounded border border-neutral-400 p-4 min-w-[12.5rem] h-[6.25rem] cursor-pointer bg-neutral-700 hover:bg-neutral-800 flex justify-between gap-4 text-lg flex-wrap"
          >
            <p className="font-bold">Name:</p>
            <p>{character?.name}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-10">
        <button
          disabled={+pageParam === 1 || isLoading}
          className="border border-neutral-400 px-4 py-1 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:border-neutral-500 rounded hover:bg-blue-500"
          onClick={() => {
            setSearchParams({
              search: searchParam,
              page: (+pageParam - 1).toString(),
            });
          }}
        >
          Prev
        </button>
        <div className="flex justify-center items-center border border-neutral-400 px-4 py-1 rounded ">
          {pageParam}
        </div>
        <button
          disabled={!hasNextPage || isLoading}
          onClick={() => {
            setSearchParams({
              search: searchParam,
              page: (+pageParam + 1).toString(),
            });
          }}
          className="border border-neutral-400 px-4 py-1 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:border-neutral-500 rounded hover:bg-blue-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CharactersList;
