import api from "@/util/axios";
import { PaginatedResponse } from "@/models/others/PaginatedResponse";
import { Team } from "@/models/api/team.api.model";
import { CreateTranscriptDTO } from "@/models/dto/create.transcript.dto";
import { TranscriptSummaryDto } from "@/models/dto/transcripts/transcript.summary.dto";

export const getTranscripts = async (
  page = 1,
  limit = 5,
  filters: any = {}
): Promise<PaginatedResponse<TranscriptSummaryDto>> => {
  const params = {
    page,
    limit,
    ...filters,
  };

  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );

  const res = await api.get(`/api/v1/transcripts`, { params });
  return res.data;
};

export const createTranscript = async (
  input: CreateTranscriptDTO
): Promise<Team> => {
  const res = await api.post("/api/v1/transcripts", input);
  return res.data;
};

// export const updateTranscript = async (
//   id: string,
//   updates: UpdateTeamDTO
// ): Promise<Team> => {
//   const res = await api.patch(`/api/v1/transcripts/${id}`, updates);
//   return res.data;
// };
