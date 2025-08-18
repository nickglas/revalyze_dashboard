import { useUserStore } from "@/store/userStore";
import { Select, SelectItem } from "@heroui/react";
import { useEffect } from "react";

type Props = {
  value?: string;
  onChange: (teamId?: string) => void;
  required: boolean;
  label?: string;
  isDisabled?: boolean;
  placeholder?: string;
};

const UserTeamSelection = ({
  value,
  onChange,
  required,
  label,
  isDisabled,
  placeholder,
}: Props) => {
  const { selectedUserTeams, fetchTeams } = useUserStore();

  useEffect(() => {
    if (value) {
      fetchTeams(value);
    }
  }, [value]);

  return (
    <Select
      label={label || "Select team"}
      isRequired={required}
      isDisabled={!value || !selectedUserTeams}
      labelPlacement="outside"
      placeholder={placeholder || "Select a team"}
      onSelectionChange={(key) => onChange(key.anchorKey)}
    >
      {selectedUserTeams &&
        selectedUserTeams.map((team) => (
          <SelectItem key={team._id}>{team.name}</SelectItem>
        ))}
    </Select>
  );
};

export default UserTeamSelection;
