import { DIContainer } from '@/backend/di-containers';

const controller = DIContainer().RemotePicturesController();

export const POST = controller.WithoutBackground_POST;
