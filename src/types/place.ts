export interface Place {
  id: string
  name: string
  district: string
  address: string
  x: number
  y: number
  rating: number
  reviews: number
  verified: boolean
  photo: string
  distance: number
  phone: string
  website: string
}

export interface Shelter extends Place {
  about: string
  pets: number
  needs: string[]
  urgent: boolean
  bank: string
  since: number
}

export interface Clinic extends Place {
  services: string[]
  hours: string
  open: boolean
  emergency: boolean
}
