export type UserType = {
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type ProductType = {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export type CategoryType = {
    name: string;
};

export type OrderType = {
    userId: string;
    products: { productId: string; quantity: number }[];
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
};
