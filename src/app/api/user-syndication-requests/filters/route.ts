import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserSyndicationRequestsController();

export const GET = controller.Filters_GET;
