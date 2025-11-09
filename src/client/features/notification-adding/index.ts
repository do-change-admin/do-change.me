'use client'

import { injectViews } from "@/client/utils/views.utils";
import { NotificationAddingContainer } from "./notification-adding.feature.container";
import { FormLayout } from "./views";

export const NotificationAdding = injectViews(NotificationAddingContainer, { FormLayout })