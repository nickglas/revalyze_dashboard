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
  value?: ExternalCompany;
  onChange?: (id: string, company: ExternalCompany | null) => void;
  label?: string;
  isRequired?: boolean;
};

const SearchExternalCompany = ({
  value,
  onChange,
  label,
  isRequired,
}: Props) => {
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

    if (debouncedQuery.trim().length > 0 && !isSelection.current) {
      fetchCompanies(debouncedQuery);
    } else {
      setCompanies([]);
    }

    isSelection.current = false;
  }, [debouncedQuery]);

  const handleInputChange = (value: string) => {
    setInputValue(value);

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
      isRequired={isRequired || false}
    >
      {(item) => (
        <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default SearchExternalCompany;
