const getDateInFuture = (numberOfDays: number) => {
    const now = new Date();
    const nextNumberOfDays = new Date();
    nextNumberOfDays.setDate(now.getDate() + numberOfDays);

    return nextNumberOfDays;
}

const safelyParseDateTime = (date?: string | null, dateTime?: string | null) => {
    let retVal = new Date();

    if (dateTime) {
        retVal = new Date(dateTime);
    } else if (date) {
        retVal = new Date(date);
    }

    return date || dateTime ? retVal : null;
}

export { safelyParseDateTime, getDateInFuture }