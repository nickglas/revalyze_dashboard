import { ExternalCompany } from "@/models/api/external.company.model";
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
  value?: ExternalCompany; // Selected company object
  onChange?: (value: string, company: ExternalCompany | null) => void;
  label?: string;
};

const SearchExternalCompany = ({ value, onChange, label }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [companies, setCompanies] = useState<ExternalCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const isSelection = useRef(false);

  const fetchCompanies = async (search: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/api/v1/external-companies?name=${search}`
      );
      const transformed = (data?.data || []).map(
        (company: ExternalCompany) => ({
          ...company,
          key: company._id,
          label: company.name,
        })
      );
      setCompanies(transformed);
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
      fetchCompanies(debouncedQuery);
    } else {
      setCompanies([]);
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
      items={companies}
      selectedKey={value?._id}
      onSelectionChange={(key) => {
        console.warn(key);
        const selected = companies.find((c) => c._id === key);
        if (selected) {
          console.warn(selected);
          // Set selection flag to prevent unnecessary search
          isSelection.current = true;
          setInputValue(selected.name);
          if (onChange) onChange(key as string, selected);
        } else {
          setInputValue("");
          if (onChange) onChange("", null);
        }
      }}
      label={label || "Contact belongs to"}
      labelPlacement="outside"
      placeholder="Start typing to search companies"
      isRequired
    >
      {(item) => (
        <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default SearchExternalCompany;
