const parseDateStringToUtc = (date?: string) => {
    return date ? new Date(date).toUTCString() : 'n/a';
}

export { parseDateStringToUtc }