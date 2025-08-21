import React from "react";
import { Card, CardBody } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import SentimentMeter from "@/components/ui/sentiment-meter";

import { teamsData } from "@/data/teams"; // Adjust import path if needed

const managersData = teamsData.flatMap((t) => t.managers);

const TeamSummaryCard = ({ team }: { team: (typeof teamsData)[0] }) => {
  return (
    <Card className="bg-[#2a2a2a] hover:bg-[#333333] cursor-pointer h-full">
      <CardBody className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Top section */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold mb-1">{team.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{team.description}</p>

              <div className="flex flex-col gap-2">
                {team.managerIds.map((managerId) => {
                  const manager = managersData.find((m) => m.id === managerId);
                  return (
                    manager && (
                      <div key={manager.id} className="flex items-center gap-1">
                        <Avatar size="md" src={manager.avatar} />
                        <span className="text-xs text-gray-400">
                          {manager.name}
                        </span>
                      </div>
                    )
                  );
                })}
              </div>
            </div>

            <SentimentMeter value={team.performance} size="md" />
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center">
            <p className="text-xl font-bold">{team.performance.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{team.positiveSentiment}%</p>
            <p className="text-xs text-gray-500">Pos. Sentiment</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{team.reviewCount}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TeamSummaryCard;
