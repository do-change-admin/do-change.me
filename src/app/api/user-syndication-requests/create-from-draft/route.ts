import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserSyndicationRequestsController();

export const POST = controller.FromDraft_POST;
