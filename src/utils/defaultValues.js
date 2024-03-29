export const defaultRegular = {
    id: 0,
    firstName: "",
    lastName: "",
    birthDate: null,
    country: "",
    gender: "",
    phone: "",
    passportId: null,
}

export const defaultPassport = {
    id: 0,
    passportId: "",
    creationDate: null,
    expirationDate: null,
    expired: false,
    country: "",
}

export const defaultHotel = {
    id: 0,
    name: "",
    stars: "",
    location: {
        id: 0,
        latitude: "",
        longitude: "",
        address: "",
        city: "",
        country: ""
    }
}

export const defaultFacility = {
    id: 0,
    name: "",
    paid: false,
    price: "",
    currency: ""
}

export const defaultBed = {
    id: 0,
    name: "",
    people: "",
    price: "",
    currency: ""
}

export const defaultType = {
    id: 0,
    name: "",
    price: 0,
    currency: "",
    beds: []
}

export const defaultRoom = {
    id: 0,
    name: "",
    types: [],
}

export const defaultWorker = {
    id: 0,
    fullName: "",
    email: "",
    phone: "",
    workerType: ""
}
