// components/review/CriteriaWeightsEditor.tsx
import {
  Table,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  TableBody,
  NumberInput,
  Tooltip,
  Button,
} from "@heroui/react";
import { FaTrashCan } from "react-icons/fa6";
import { ReviewConfig } from "@/models/api/review.config.api.model";

interface CriteriaWeightsEditorProps {
  selectedConfig: ReviewConfig | undefined;
  editedWeights: Record<string, number>;
  onWeightChange: (criterionId: string, weight: number) => void;
  onRemoveCriterion: (criterionId: string) => void;
}

export default function CriteriaWeightsEditor({
  selectedConfig,
  editedWeights,
  onWeightChange,
  onRemoveCriterion,
}: CriteriaWeightsEditorProps) {
  if (!selectedConfig) return null;

  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <h3 className="text-xs">Criteria Weight Distribution</h3>
      </div>

      {selectedConfig.criteria.length > 0 ? (
        <Table
          aria-label="Review criteria weights"
          removeWrapper
          className="h-64 overflow-auto"
        >
          <TableHeader>
            <TableColumn>Criteria</TableColumn>
            <TableColumn>Weight</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {selectedConfig.criteria
              .filter((criterion) => editedWeights[criterion._id] !== undefined)
              .map((criterion) => (
                <TableRow key={criterion._id}>
                  <TableCell>
                    <div className="text-xs">{criterion.title}</div>
                    <div className="text-tiny text-default-500">
                      {criterion.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      value={editedWeights[criterion._id]}
                      aria-label={`Weight for ${criterion.title}`}
                      onChange={(value) => {
                        const numericValue =
                          typeof value === "number"
                            ? value
                            : Number(value.target.value);
                        onWeightChange(criterion._id, numericValue);
                      }}
                      step={0.01}
                      minValue={0.01}
                      maxValue={1}
                      size="sm"
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip content="Remove criterion">
                      <Button
                        isIconOnly
                        aria-label={`Remove ${criterion.title} criterion`}
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => onRemoveCriterion(criterion._id)}
                      >
                        <FaTrashCan size={14} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-default-500 text-sm py-2">
          No criteria configured for this review config
        </p>
      )}
    </div>
  );
}
