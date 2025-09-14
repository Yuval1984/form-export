export interface IForm {
    fullName: string;
    email: string;
    phone: string;
    invoiceNumber: string;
    amount: number;
    invoiceDate: string;
    signature: string;
}

export interface IMockBody extends IForm {
    id: number,
    success: boolean,
    timestamp: string,
};
