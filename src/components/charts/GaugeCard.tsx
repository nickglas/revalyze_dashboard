import { Card, CardBody, CircularProgress } from "@nextui-org/react";

interface GaugeCardProps {
  title: string;
  value: number;
  max: number;
  description: string;
  isPercentage: boolean;
}

const GaugeCard: React.FC<GaugeCardProps> = ({
  title,
  description,
  value,
  max,
  isPercentage,
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <Card className="bg-[#1e1e1e] shadow-sm">
      <CardBody className="p-4">
        <h3 className="text-foreground text-lg font-medium">{title}</h3>
        <div className="mt-4">
          <CircularProgress
            value={percentage}
            size="lg"
            showValueLabel
            valueLabel={isPercentage ? `${value}/10` : `${value}/${max}`}
          />
          <p className="text-gray-500 text-sm mt-2">{description}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default GaugeCard;
