import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserSyndicationRequestDraftsController();

export const GET = controller.Filters_GET;
