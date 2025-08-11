import { Team } from "@/models/api/team.api.model";
import api from "@/util/axios";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState, useRef } from "react";

function useDebounce<T>(value: T, delay = 750): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

type Props = {
  value?: Team;
  onChange?: (value: Team | null) => void;
  required: boolean;
  label?: string;
  isDisabled?: boolean;
};

const SearchTeams = ({
  value,
  onChange,
  required,
  label,
  isDisabled,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const isSelection = useRef(false);

  const fetchTeams = async (search: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/v1/teams?name=${search}`);
      const transformed = (data?.data || []).map((user: Team) => ({
        ...user,
        key: user._id,
        label: user.name,
      }));
      setTeams(transformed);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (value) {
      setInputValue(value.name);
    } else {
      setInputValue("");
    }
  }, [value]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedQuery.trim().length > 0) {
      fetchTeams(debouncedQuery);
    } else {
      setTeams([]);
    }
  }, [debouncedQuery]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setSearchQuery(value);
  };

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      isDisabled={isDisabled}
      items={teams}
      selectedKey={value?._id}
      onSelectionChange={(key) => {
        const selected = teams.find((c) => c._id === key);
        if (selected) {
          isSelection.current = true;
          setInputValue(selected.name);
          if (onChange) onChange(selected);
          isSelection.current = false;
        } else {
          setInputValue("");
          if (onChange) onChange(null);
        }
      }}
      label={label || "Search for teams"}
      labelPlacement="outside"
      placeholder="Start typing to search for teams"
      isRequired={required}
    >
      {(item) => (
        <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default SearchTeams;
