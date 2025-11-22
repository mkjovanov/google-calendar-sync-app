const safelyParseDateTime = (date?: string, dateTime?: string) => {
    let retVal = new Date();

    if (dateTime) {
        retVal = new Date(dateTime);
    } else if (date) {
        retVal = new Date(date);
    }

    return date || dateTime ? retVal.toUTCString() : 'n/a';
}

export {safelyParseDateTime}