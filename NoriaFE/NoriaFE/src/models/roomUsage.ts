export class RoomUsage {
  id: number = 0
  roomId: number = 0
  waterUsage: number = 0
  electricityUsage: number = 0
  waterPrice: number = 0
  electricityPrice: number = 0
  startTime: string = ''
  endTime: string = ''
  totalAmountToPay: number = 0
  totalAmountPaid: number = 0
  isPaid: boolean = false
  createdOn: string = ''
  updatedOn: string = ''
  paidOn: string = ''
}