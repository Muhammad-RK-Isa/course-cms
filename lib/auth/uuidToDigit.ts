export const uuidTo6DigitNumber = (uuid: string) => {
    if (!uuid || typeof uuid !== 'string') {
        return null
    }

    const cleanedToken = uuid.replace(/-/g, '').substring(0, 6)

    const parsedNumber = parseInt(cleanedToken, 16)
    
    if (!isNaN(parsedNumber)) {
        const sixDigitNumber = parsedNumber.toString().padStart(6, "0").substring(0, 6)
        return sixDigitNumber
    } else {
        return null
    }
}