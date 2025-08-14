// components/data/TranscriptContentDisplay.tsx
import { Textarea } from "@heroui/react";

interface TranscriptContentDisplayProps {
  content?: string;
}

export default function TranscriptContentDisplay({
  content,
}: TranscriptContentDisplayProps) {
  return (
    <div>
      <h3 className="text-sm mb-1">Transcript Content Preview</h3>
      <Textarea
        isReadOnly
        value={content || "Data not available"}
        minRows={8}
        className="overflow-auto"
        isDisabled
      />
    </div>
  );
}
