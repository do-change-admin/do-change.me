import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().UserIdentityController();

export const POST = controller.POST;
