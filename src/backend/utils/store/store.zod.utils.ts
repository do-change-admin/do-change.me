import type z from 'zod';
import type { ZodArray, ZodObject } from 'zod';
import type { ActionsPayload, CRUDStore, Models, SearchPayload } from './store.shared-models.utils';

type ZodSchema = ZodObject | ZodArray;

export type ZodStoreSchemas = {
    models: {
        list: ZodSchema;
        details: ZodSchema;
    };
    searchPayload: {
        list: ZodSchema;
        specific: ZodSchema;
    };
    actionsPayload: {
        create: ZodSchema;
        update: ZodSchema;
    };
    customOperations?: Record<string, { payload: ZodSchema; response: ZodSchema }>;
};

export type ZodCRUDStore<
    Schemas extends {
        models: {
            list: unknown;
            details: unknown;
        };
        searchPayload: {
            list: unknown;
            specific: unknown;
        };
        actionsPayload: {
            create: unknown;
            update: unknown;
        };
        customOperations?: Record<string, { payload: unknown; response: unknown }>;
    }
> = CRUDStore<
    Models<z.infer<Schemas['models']['list']>, z.infer<Schemas['models']['details']>>,
    SearchPayload<z.infer<Schemas['searchPayload']['list']>, z.infer<Schemas['searchPayload']['specific']>>,
    ActionsPayload<z.infer<Schemas['actionsPayload']['create']>, z.infer<Schemas['actionsPayload']['update']>>
> &
    (Schemas['customOperations'] extends Record<string, { payload: ZodSchema; response: ZodSchema }>
        ? {
              [operation in keyof Schemas['customOperations']]: (
                  payload: z.infer<Schemas['customOperations'][operation]['payload']>
              ) => Promise<z.infer<Schemas['customOperations'][operation]['response']>>;
          }
        : {});
