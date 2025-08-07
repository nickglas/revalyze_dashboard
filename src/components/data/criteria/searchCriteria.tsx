import api from "@/util/axios";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState, useRef } from "react";
import { CriterionSelectionDTO } from "@/models/dto/review.config.dto";

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
  onChange?: (value: CriterionSelectionDTO | null) => void;
};

const SearchCriteria = ({ onChange }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [criteria, setCriteria] = useState<CriterionSelectionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  const fetchCriteria = async (search: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/v1/criteria?title=${search}`);
      setCriteria(data.data || []);
    } catch (err) {
      console.error("Failed to fetch criteria:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debouncedQuery.trim().length > 0) {
      fetchCriteria(debouncedQuery);
    } else {
      setCriteria([]);
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
      items={criteria}
      onSelectionChange={(key) => {
        const selected = criteria.find((c) => c._id === key);
        if (selected && onChange) {
          setInputValue("");
          onChange(selected);
        }
      }}
      label="Search for criteria"
      labelPlacement="outside"
      placeholder="Start typing to search for criteria"
    >
      {(item) => (
        <AutocompleteItem key={item._id}>
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-gray-500 line-clamp-1">
              {item.description}
            </p>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default SearchCriteria;
