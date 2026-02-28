import { PrismaClient } from '../../generated/prisma';

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type TestPrismaMock = {
    user: {
        findUnique: (...args: any[]) => Promise<any>;
        update: (...args: any[]) => Promise<any>;
    };
    version: {
        create: (...args: any[]) => Promise<any>;
        findUnique: (...args: any[]) => Promise<any>;
    };
    websiteProject: {
        deleteMany: (...args: any[]) => Promise<{ count: number }>;
        findMany: (...args: any[]) => Promise<any[]>;
        findUnique: (...args: any[]) => Promise<any>;
    };
};

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
    var prismaTestMock: undefined | TestPrismaMock;
}

const createTestPrismaMock = (): TestPrismaMock => ({
    user: {
        findUnique: async () => null,
        update: async () => null,
    },
    version: {
        create: async () => null,
        findUnique: async () => null,
    },
    websiteProject: {
        deleteMany: async () => ({ count: 0 }),
        findMany: async () => [],
        findUnique: async () => null,
    },
});

export const prisma: any = process.env.NODE_ENV === 'test'
    ? (globalThis.prismaTestMock ?? (globalThis.prismaTestMock = createTestPrismaMock()))
    : (globalThis.prisma ?? prismaClientSingleton());

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') globalThis.prisma = prisma;
