import { Contact } from "@/models/api/contact.api.model";
import { ReviewConfig } from "@/models/api/review.config.api.model";
import { User } from "@/models/api/user.model";
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
  value?: ReviewConfig;
  onChange?: (value: ReviewConfig | null) => void;
  required: boolean;
  label?: string;
  isDisabled?: boolean;
  size?: "sm" | "md" | "lg";
};

const SearchConfigs = ({
  value,
  onChange,
  required,
  label,
  isDisabled,
  size,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [configs, setConfigs] = useState<ReviewConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const isSelection = useRef(false);

  const fetchConfigs = async (search: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/v1/review-configs?name=${search}`);
      const transformed = (data?.data || []).map((user: User) => ({
        ...user,
        key: user._id,
        label: user.name,
      }));
      setConfigs(transformed);
    } catch (err) {
      console.error("Failed to fetch review-configs:", err);
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
      fetchConfigs(debouncedQuery);
    } else {
      setConfigs([]);
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
      items={configs}
      size={size || "md"}
      selectedKey={value?._id}
      onSelectionChange={(key) => {
        const selected = configs.find((c) => c._id === key);
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
      label={label || "Search for configs"}
      labelPlacement="outside"
      placeholder="Start typing to search for configs"
      isRequired={required}
    >
      {(item) => (
        <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default SearchConfigs;
