import { DashboardRepository } from "../repositories/dashboard.repository.js";

const dashboardRepository = new DashboardRepository();

export class DashboardService {
  async getOverview() {
    return dashboardRepository.getOverview();
  }

  async getFleetHealth() {
    return dashboardRepository.getFleetHealth();
  }

  async getLiveMap() {
    return dashboardRepository.getLiveMap();
  }
}

export const dashboardService = new DashboardService();
