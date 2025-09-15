import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    return {
        id: session.user.id,
        email: session.user.email,
    };
}
