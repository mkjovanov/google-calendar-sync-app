import { prisma } from "../prisma";

const getSyncWindow = () => {
    const timeMin = new Date();
    timeMin.setMonth(timeMin.getMonth() - 6);

    const timeMax = new Date();
    timeMax.setMonth(timeMax.getMonth() + 6);

    return { timeMin, timeMax };
}

async function softCleanupOldLocalEvents(userId: string) {
    const { timeMin, timeMax } = getSyncWindow();

    await prisma.localEvent.updateMany({
    where: {
        userId,
        googleEventId: null,
        OR: [
        { start: { lt: timeMin } },
        { end:   { gt: timeMax } }
        ]
    },
    data: {
        deleted: true
    }
    });
}

async function hardCleanupOldLocalEvents(userId: string) {
    const { timeMin, timeMax } = getSyncWindow();

    await prisma.localEvent.deleteMany({
    where: {
        userId,
        googleEventId: null,   // only delete events not tied to Google
        OR: [
        { start: { lt: timeMin } },
        { end:   { gt: timeMax } }
        ]
    }
    });
}

export { getSyncWindow, softCleanupOldLocalEvents, hardCleanupOldLocalEvents }