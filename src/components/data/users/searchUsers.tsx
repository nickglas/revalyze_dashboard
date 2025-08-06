import { ExternalCompany } from "@/models/api/external.company.model";
import { User } from "@/models/api/user.model";
import api from "@/util/axios";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState, useRef } from "react";

// Debounce hook to limit API calls
function useDebounce<T>(value: T, delay = 750): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

type Props = {
  value?: User; // Selected company object
  onChange?: (value: User | null) => void;
  required: boolean;
};

const SearchUsers = ({ value, onChange, required }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const isSelection = useRef(false);

  const fetchUser = async (search: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/v1/users?name=${search}`);
      const transformed = (data?.data || []).map((user: User) => ({
        ...user,
        key: user._id,
        label: user.name,
      }));
      setUsers(transformed);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Set initial input value when value changes
  useEffect(() => {
    if (value) {
      setInputValue(value.name);
    } else {
      setInputValue("");
    }
  }, [value]);

  // Handle search trigger
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedQuery.trim().length > 0 && !isSelection.current) {
      fetchUser(debouncedQuery);
    } else {
      setUsers([]);
    }

    // Reset selection flag after search
    isSelection.current = false;
  }, [debouncedQuery]);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    // Only set search query if we're not in "selection mode"
    if (!isSelection.current) {
      setSearchQuery(value);
    }
  };

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={handleInputChange}
      isLoading={isLoading}
      items={users}
      selectedKey={value?._id}
      onSelectionChange={(key) => {
        console.warn(key);
        const selected = users.find((c) => c._id === key);
        if (selected) {
          console.warn(selected);
          isSelection.current = true;
          setInputValue(selected.name);
          if (onChange) onChange(selected);
        } else {
          setInputValue("");
          if (onChange) onChange(null);
        }
      }}
      label="Search for users"
      labelPlacement="outside"
      placeholder="Start typing to search for users"
      isRequired={required}
    >
      {(item) => (
        <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default SearchUsers;
