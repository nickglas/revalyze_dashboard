import { TranscriptSummaryDto } from "@/models/dto/transcripts/transcript.summary.dto";
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
  value?: TranscriptSummaryDto;
  onChange?: (value: TranscriptSummaryDto | null) => void;
  required: boolean;
  label?: string;
  isDisabled?: boolean;
};

const SearchTranscripts = ({
  value,
  onChange,
  required,
  label,
  isDisabled,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const [transcripts, setTranscripts] = useState<TranscriptSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const isSelection = useRef(false);

  const fetchTranscripts = async (search: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/v1/transcripts?search=${search}`);
      const transformed = (data?.data || []).map(
        (transcripts: TranscriptSummaryDto) => ({
          ...transcripts,
          key: transcripts.id,
          label: transcripts.id,
        })
      );
      setTranscripts(transformed);
    } catch (err) {
      console.error("Failed to fetch transcript:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (value) {
      setInputValue(value.id);
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
      fetchTranscripts(debouncedQuery);
    } else {
      setTranscripts([]);
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
      items={transcripts}
      selectedKey={value?.id}
      onSelectionChange={(key) => {
        const selected = transcripts.find((c) => c.id === key);
        if (selected) {
          isSelection.current = true;
          setInputValue(selected.id);
          if (onChange) onChange(selected);
          isSelection.current = false;
        } else {
          setInputValue("");
          if (onChange) onChange(null);
        }
      }}
      label={label || "Search for transcripts"}
      labelPlacement="outside"
      placeholder="Start typing to search for transcripts"
      isRequired={required}
    >
      {(item) => <AutocompleteItem key={item.id}>{item.id}</AutocompleteItem>}
    </Autocomplete>
  );
};

export default SearchTranscripts;
