import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserSyndicationRequestManagementController();

export const GET = controller.Details_GET;
