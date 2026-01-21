import { compare } from 'bcryptjs';
import { inject, injectable } from 'inversify';
import { DIProviders, DIStores } from '@/backend/di-containers/tokens.di-container';
import { verificationEmail } from '@/backend/infrastructure/email/templates/verification-email';
import { prismaClient } from '@/backend/infrastructure/prisma/client';
import type { MailerProvider } from '@/backend/providers/mailer/mailer.provider';
import type { EmailVerificationTokenStore } from '@/backend/stores/email-verification-token';
import type { UserStore } from '@/backend/stores/user';
import { ZodService } from '@/backend/utils/zod-service.utils';
import { User } from '@/entities/user';
import { generatePasswordHash } from '@/lib-deprecated/password';
import { EMailAddress } from '@/utils/entities/email-address';
import { Token } from '@/utils/entities/token';
import { CommonErrorCodes } from '@/utils/error-codes';
import { EmailMessage } from '@/value-objects/email-message.value-object';
import { userIdentityServiceMetadata } from './user-identity.service.metadata';

@injectable()
export class UserIdentityService extends ZodService(userIdentityServiceMetadata) {
    public constructor(
        @inject(DIStores.users) private readonly userStore: UserStore,
        @inject(DIStores.emailVerificationToken)
        private readonly emailVerificationTokenStore: EmailVerificationTokenStore,
        @inject(DIProviders.mailer) private readonly emailProvider: MailerProvider
    ) {
        super();
    }

    register = this.method('register', async (payload, { methodError }) => {
        const { email: rawEmail, firstName, lastName, password } = payload;

        const email = EMailAddress.create(rawEmail);

        const existing = await this.userStore.details({ email: email.model });

        if (existing) {
            throw methodError(CommonErrorCodes.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await generatePasswordHash(password);

        const { id: userId } = await this.userStore.create({
            email: email.model,
            password: hashedPassword,
            firstName,
            lastName
        });

        const userModel = await this.userStore.details({ id: userId });
        const user = User.create(userModel!);

        const token = Token.withTimeToLive(Number(process.env.TOKEN_TTL_MS));

        await this.emailVerificationTokenStore.create({
            expiresAt: token.model.expiresAt,
            hash: token.model.hash,
            userId: userId
        });

        const emailMessage = EmailMessage.create(verificationEmail(user, token.model.raw));

        this.emailProvider.send(emailMessage);

        return { id: userId };
    });

    authorize = this.method('authorize', async (payload, { methodError }) => {
        const { email: rawEmail, password } = payload;

        const email = EMailAddress.create(rawEmail);
        const user = await this.userStore.details({ email: email.model });

        if (!user || !user.password) {
            throw methodError(CommonErrorCodes.INVALID_CREDENTIALS);
        }

        if (!user.emailVerifiedAt) {
            throw methodError(CommonErrorCodes.EMAIL_NOT_VERIFIED);
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
            throw methodError(CommonErrorCodes.INVALID_CREDENTIALS);
        }

        return { id: user.id, email: user.email };
    });

    oAuthSignIn = this.method('oAuthSignIn', async (payload, {}) => {
        const { email: rawEmail, name, image, provider, providerAccountId } = payload;

        const email = EMailAddress.create(rawEmail);
        let user = await this.userStore.details({ email: email.model });

        if (!user) {
            const [firstName, ...rest] = name?.split(' ') ?? [];
            // TODO: после create хочется полный объект получать а не только id
            const { id } = await this.userStore.create({
                email: email.model,
                firstName,
                lastName: rest.join(' '),
                image,
                emailVerifiedAt: new Date()
            });
            // TODO: из-за этого приходится делать вот так
            user = await this.userStore.details({ id });
        }

        await prismaClient.account.upsert({
            where: {
                provider_providerAccountId: { provider, providerAccountId }
            },
            update: {},
            create: {
                userId: user!.id,
                provider,
                providerAccountId
            }
        });

        // TODO: из-за этого приходится делать вот так
        return { id: user!.id, email: user!.email };
    });
}
