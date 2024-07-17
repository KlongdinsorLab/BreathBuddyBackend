export function getFirebaseId (authHeader : string) : string {
    const payload = authHeader.split('.')[1]
    const decodedPayload = atob(payload)
    const jsonPayload = JSON.parse(decodedPayload)
    const firebaseId = jsonPayload.user_id
    return firebaseId
}

export function getPhoneNumber (authHeader : string) : string {
    const payload = authHeader.split('.')[1]
    const decodedPayload = atob(payload)
    const jsonPayload = JSON.parse(decodedPayload)
    const firebaseId = jsonPayload.phone_number
    return firebaseId
}
