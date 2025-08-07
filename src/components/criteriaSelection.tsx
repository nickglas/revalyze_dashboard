import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import { FaTrashCan } from "react-icons/fa6";
import { CriterionSelectionDTO } from "@/models/dto/review.config.dto";

interface CriteriaSelectionProps {
  criteria: CriterionSelectionDTO[];
  onRemove: (criterionId: string) => void;
}

export const CriteriaSelection: React.FC<CriteriaSelectionProps> = ({
  criteria,
  onRemove,
}) => {
  return (
    <Table
      aria-label="Selected criteria table"
      removeWrapper
      className="bg-defaul-100"
    >
      <TableHeader>
        <TableColumn>TITLE</TableColumn>
        <TableColumn>DESCRIPTION</TableColumn>
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
