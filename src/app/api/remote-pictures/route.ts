import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().RemotePicturesController();

export const POST = controller.POST;
