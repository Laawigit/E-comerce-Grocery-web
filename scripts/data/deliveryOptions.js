// import { findMatchingProduct } from "./cart"

export const deliveryOptions = [
    {
        id: '1',
        deliveryHours: 5,
        price: 0
    },
    {
        id: '2',
        deliveryHours: 3,
        price: 499,
    },
    {
        id: '3',
        deliveryHours: 1,
        price: 987,
    },
    {
        id: '4',
        pickup: undefined
    }
]


export function getDeliveryPrice ( deliveryOptionId ) {
    let deliveryPrice;
    deliveryOptions.forEach( (deliveryOption) => {
        if ( deliveryOptionId === deliveryOption.id ) {
            deliveryPrice = deliveryOption.price
        }
    } )

    // console.log(deliveryPrice)
    
    return deliveryPrice ? deliveryPrice : 0
}