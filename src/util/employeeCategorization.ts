// utils/employeeCategorization.ts
import { IEmployeeDashboardData } from "@/models/dto/insights/employee.dashboard.insights.dto";

export type EmployeeCategory =
  | "High Performer, Positive Sentiment"
  | "High Performer, Needs Support"
  | "Developing, Positive Attitude"
  | "Needs Improvement";

export interface CategorizedEmployees {
  [key: string]: IEmployeeDashboardData[];
}

export interface CategorizedEmployees {
  "High Performer, Positive Sentiment": IEmployeeDashboardData[];
  "High Performer, Needs Support": IEmployeeDashboardData[];
  "Developing, Positive Attitude": IEmployeeDashboardData[];
  "Needs Improvement": IEmployeeDashboardData[];
}

export const categorizeEmployees = (
  employees: IEmployeeDashboardData[]
): CategorizedEmployees => {
  const categorizedData: CategorizedEmployees = {
    "High Performer, Positive Sentiment": [],
    "High Performer, Needs Support": [],
    "Developing, Positive Attitude": [],
    "Needs Improvement": [],
  };

  employees.forEach((employee) => {
    const performance = employee.avgOverall || 0;
    const sentiment = employee.avgSentiment || 0;

    if (performance >= 7.5 && sentiment >= 7.5) {
      categorizedData["High Performer, Positive Sentiment"].push(employee);
    } else if (performance >= 7.5 && sentiment < 7.5) {
      categorizedData["High Performer, Needs Support"].push(employee);
    } else if (performance < 7.5 && sentiment >= 7.5) {
      categorizedData["Developing, Positive Attitude"].push(employee);
    } else {
      categorizedData["Needs Improvement"].push(employee);
    }
  });

  return categorizedData;
};
