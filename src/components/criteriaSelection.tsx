import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
} from "@heroui/react";
import { FaTrashCan } from "react-icons/fa6";
import { CriterionSelectionDTO } from "@/models/dto/review.config.dto";

interface CriteriaSelectionProps {
  criteria: CriterionSelectionDTO[];
  onRemove: (criterionId: string) => void;
  onWeightChange: (criterionId: string, weight: number) => void;
}

export const CriteriaSelection: React.FC<CriteriaSelectionProps> = ({
  criteria,
  onRemove,
  onWeightChange,
}) => {
  return (
    <Table aria-label="Selected criteria table" removeWrapper>
      <TableHeader>
        <TableColumn>TITLE</TableColumn>
        <TableColumn>DESCRIPTION</TableColumn>
        <TableColumn width={120}>WEIGHT</TableColumn>
        <TableColumn width={80}>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No criteria selected yet">
        {criteria.map((criterion) => (
          <TableRow key={criterion._id}>
            <TableCell>
              <p className="font-medium">{criterion.title}</p>
            </TableCell>
            <TableCell>
              <p className="text-sm text-gray-600 line-clamp-2">
                {criterion.description}
              </p>
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={criterion.weight.toString()}
                onChange={(e) =>
                  onWeightChange(criterion._id, parseFloat(e.target.value) || 0)
                }
                className="w-20"
              />
            </TableCell>
            <TableCell>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                className="min-w-unit-6 w-6 h-6"
                onPress={() => onRemove(criterion._id)}
              >
                <FaTrashCan className="w-3 h-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
