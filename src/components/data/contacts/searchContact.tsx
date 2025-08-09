import { Contact } from "@/models/api/contact.api.model";
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
  value?: Contact;
  onChange?: (value: Contact | null) => void;
  required: boolean;
  label?: string;
};

const SearchContacts = ({ value, onChange, required, label }: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const isSelection = useRef(false);

  const fetchContacts = async (search: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/v1/contacts?name=${search}`);
      const transformed = (data?.data || []).map((user: User) => ({
        ...user,
        key: user._id,
        label: user.name,
      }));
      setContacts(transformed);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (value) {
      setInputValue(value.firstName);
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
      fetchContacts(debouncedQuery);
    } else {
      setContacts([]);
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
      items={contacts}
      selectedKey={value?._id}
      onSelectionChange={(key) => {
        const selected = contacts.find((c) => c._id === key);
        if (selected) {
          isSelection.current = true;
          setInputValue(selected.firstName);
          if (onChange) onChange(selected);
          isSelection.current = false;
        } else {
          setInputValue("");
          if (onChange) onChange(null);
        }
      }}
      label={label || "Search for contacts"}
      labelPlacement="outside"
      placeholder="Start typing to search for contacts"
      isRequired={required}
    >
      {(item) => (
        <AutocompleteItem key={item._id}>{item.firstName}</AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default SearchContacts;
