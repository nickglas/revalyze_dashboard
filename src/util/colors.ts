// utils/teamColors.ts
export const generateTeamColors = (teams: any[]): Record<string, string> => {
  // Predefined color palette that works well for charts
  const colorPalette = [
    "#008FFB", // Blue
    "#00E396", // Green
    "#FEB019", // Yellow
    "#FF4560", // Red
    "#775DD0", // Purple
    "#3F51B5", // Indigo
    "#546E7A", // Blue Grey
    "#D4526E", // Pink
    "#8D5B4C", // Brown
    "#F86624", // Orange
  ];

  const teamColors: Record<string, string> = {};

  teams.forEach((team, index) => {
    teamColors[team.teamId] = colorPalette[index % colorPalette.length];
  });

  return teamColors;
};

export const getTeamColor = (teamId: string, teams: any[]): string => {
  const colors = generateTeamColors(teams);
  return colors[teamId] || "#FF4560"; // Fallback color
};
