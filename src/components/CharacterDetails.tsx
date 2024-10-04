import { Dispatch, SetStateAction, useState } from "react";
import { CharacterDetailsType, CharacterType } from "../types/types";
import ModalWrapper from "./ui/ModalWrapper";
import { MdExpandMore } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

const CharacterDetails = ({
  selectedCharacter,
  setSelectedCharacter,
}: {
  selectedCharacter: CharacterType;
  setSelectedCharacter: Dispatch<SetStateAction<CharacterType | null>>;
}) => {
  const [details, setDetails] = useState<CharacterDetailsType | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (selectedCharacter) {
      try {
        const filmPromises = selectedCharacter?.films.map((filmUrl) =>
          fetch(filmUrl).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch film data: ${res.statusText}`);
            }
            return res.json();
          })
        );
        const vehiclesPromises = selectedCharacter?.vehicles.map((vehicleUrl) =>
          fetch(vehicleUrl).then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to fetch vehicle data: ${res.statusText}`
              );
            }
            return res.json();
          })
        );
        const speciesPromises = selectedCharacter?.species.map((speciesUrl) =>
          fetch(speciesUrl).then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to fetch species data: ${res.statusText}`
              );
            }
            return res.json();
          })
        );
        const starshipPromises = selectedCharacter?.starships.map(
          (starshipUrl) =>
            fetch(starshipUrl).then((res) => {
              if (!res.ok) {
                throw new Error(
                  `Failed to fetch starship data: ${res.statusText}`
                );
              }
              return res.json();
            })
        );

        setIsLoading(true);

        const [filmData, vehiclesData, speciesData, starshipData] =
          await Promise.all([
            Promise.all(filmPromises),
            Promise.all(vehiclesPromises),
            Promise.all(speciesPromises),
            Promise.all(starshipPromises),
          ]);

        setDetails({
          films: filmData,
          vehicles: vehiclesData,
          species: speciesData,
          starships: starshipData,
        });
      } catch (error: any) {
        console.error(error);

        setError(
          error.message || "Something went wrong with details fetching!"
        );

        setDetails({
          films: [],
          vehicles: [],
          species: [],
          starships: [],
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ModalWrapper
      closeModal={() => {
        setSelectedCharacter(null);
        setDetails(null);
      }}
    >
      <h1 className="font-medium text-center text-xl mb-2">
        Character Details
      </h1>
      <div className="details-row">
        <p>Name:</p>
        <p>{selectedCharacter?.name}</p>
      </div>
      <div className="details-row rounded bg-neutral-600">
        <p>Height:</p>
        <p>{selectedCharacter?.height}</p>
      </div>
      <div className="details-row">
        <p>Mass:</p>
        <p>{selectedCharacter?.mass}</p>
      </div>
      <div className="details-row rounded bg-neutral-600">
        <p>Hair Color:</p>
        <p>{selectedCharacter?.hair_color}</p>
      </div>
      <div className="details-row">
        <p>Skin Color:</p>
        <p>{selectedCharacter?.skin_color}</p>
      </div>
      <div className="flex justify-between gap-3  py-2 px-2 rounded bg-neutral-600">
        <p>Eye Color:</p>
        <p>{selectedCharacter?.eye_color}</p>
      </div>
      <div className="details-row">
        <p>Birth Year:</p>
        <p>{selectedCharacter?.birth_year}</p>
      </div>
      <div className="details-row rounded bg-neutral-600">
        <p>Gender:</p>
        <p>{selectedCharacter?.gender}</p>
      </div>
      {error && <p className="text-red-600">{error}</p>}

      {details && (
        <>
          <div className="flex justify-between gap-3 py-2 px-2">
            <p>Films: </p>
            <div className="flex gap-2 flex-wrap justify-end">
              {details?.films.length ? (
                details?.films?.map((film, index) => (
                  <p className="shrink-0" key={index}>
                    {film?.title};
                  </p>
                ))
              ) : (
                <p>No films</p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-3 py-2 px-2 rounded bg-neutral-600">
            <p>Vehicles: </p>
            <div className="flex gap-2 flex-wrap  justify-end">
              {details?.vehicles.length ? (
                details?.vehicles?.map((vehicle, index) => (
                  <p className="shrink-0" key={index}>
                    {vehicle?.name};
                  </p>
                ))
              ) : (
                <p>No vehicles</p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-3 py-2 px-2 rounded">
            <p>Species: </p>
            <div className="flex gap-2 flex-wrap  justify-end">
              {details?.species.length ? (
                details?.species?.map((specie, index) => (
                  <p className="shrink-0" key={index}>
                    {specie?.name};
                  </p>
                ))
              ) : (
                <p>No species</p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-3 py-2 px-2 rounded bg-neutral-600">
            <p>Starships: </p>
            <div className="flex gap-2 flex-wrap  justify-end">
              {details?.starships.length ? (
                details?.starships?.map((starship, index) => (
                  <p className="shrink-0" key={index}>
                    {starship?.name};
                  </p>
                ))
              ) : (
                <p>No starships</p>
              )}
            </div>
          </div>
        </>
      )}

      {!details && (
        <button
          onClick={() => fetchDetails()}
          className="mt-8 bg-blue-600  px-4 py-2 mx-auto flex items-center justify-center gap-2 rounded min-w-[200px] min-h-[40px]"
        >
          {isLoading ? (
            <CgSpinner className="animate-spin text-xl" />
          ) : (
            <>
              Show More Details <MdExpandMore className="text-xl" />
            </>
          )}
        </button>
      )}
    </ModalWrapper>
  );
};

export default CharacterDetails;
