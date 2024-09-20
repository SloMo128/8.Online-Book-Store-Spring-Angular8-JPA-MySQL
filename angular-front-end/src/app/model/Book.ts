export class Book {
    id: number;
    name: string;
    author: string;
    price: number;
    picByte: string;
    retrievedImage: string;
    isAdded: boolean;
    quantity: number;
    discount: string;
    startDate: Date;
    endDate: Date;
    finalPrice: number;

    // Metodo per calcolare il prezzo scontato
    getDiscountedPrice(): number {
        if (this.discount) {
            const discountValue = parseFloat(this.discount);
            return this.price - (this.price * (discountValue / 100));
        }
        return this.price;
    }
}