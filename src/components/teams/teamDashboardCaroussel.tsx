import React from "react";
import { useKeenSlider } from "keen-slider/react";
import { Avatar, Skeleton } from "@heroui/react";

interface Manager {
  id: string;
  name: string;
  avatar: string;
}

interface TeamCardProps {
  selectedTeam: {
    name: string;
    description: string;
    managerIds: string[];
  };
  managersData: Manager[];
  isLoading: boolean;
}

const TeamCarousel: React.FC<TeamCardProps> = ({
  selectedTeam,
  managersData,
  isLoading,
}) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4, spacing: 20 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 5, spacing: 24 },
      },
    },
  });

  return (
    <div className="w-full">
      <div ref={sliderRef} className="keen-slider">
        {[selectedTeam].map((team, idx) => (
          <div
            key={idx}
            className="keen-slider__slide bg-gray-900 rounded-xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div className="flex-1 text-center md:text-left">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-64 mb-2 rounded-lg" />
                  <Skeleton className="h-6 w-48 mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-32 rounded-lg" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{team.name}</h2>
                  <p className="text-lg text-gray-400 mb-2">
                    {team.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-gray-500">Managers: </span>
                    {team.managerIds.map((managerId) => {
                      const manager = managersData.find(
                        (m) => m.id === managerId
                      );
                      return (
                        manager && (
                          <div
                            key={manager.id}
                            className="flex items-center gap-2"
                          >
                            <Avatar size="sm" src={manager.avatar} />
                            <span>{manager.name}</span>
                          </div>
                        )
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCarousel;
