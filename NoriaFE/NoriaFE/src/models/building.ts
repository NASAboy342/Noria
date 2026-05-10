export interface AddBuildingPayload {
    name: string
    address: string
    img: string
    rooms: number
    occupiedRooms: number
    paidRooms: number
    floors: number
    electricityPricePerUnit: number
    waterPricePerUnit: number
}

export class Building {
    id: number = 0
    name: string = ''
    address: string = ''
    img: string = ''
    rooms: number = 0
    occupiedRooms: number = 0
    paidRooms: number = 0
    floors: number = 0
    electricityPricePerUnit: number = 0
    waterPricePerUnit: number = 0

    toAddBuildingPayload(): AddBuildingPayload {
        return {
            name: this.name,
            address: this.address,
            img: this.img,
            rooms: this.rooms,
            occupiedRooms: this.occupiedRooms,
            paidRooms: this.paidRooms,
            floors: this.floors,
            electricityPricePerUnit: this.electricityPricePerUnit,
            waterPricePerUnit: this.waterPricePerUnit,
        }
    }
}