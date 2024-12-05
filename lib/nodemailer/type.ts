/** @format */

export type PriceHistoryItem = {
  price: Price;
};

export type User = {
  email: string;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  category: string[];
  currentPrice: Price;
  originalPrice: Price;
  priceHistory: PriceHistoryItem[] | [];
  discountRate: string;
  description: string;
  reviewsCount: number;
  rateCount: number;
  reviewScores: number[];
  productQuantityValue: number;
  stars: number;
  isOutOfStock: Boolean;
  productBrand: { type: String };
  sellerShopName: { type: String };
  sellerShopURL: { type: String };
  positiveSellerRating: { type: String };
  default: [];
  lowestPrice: Price;
  highestPrice: Price;
  averagePrice: Price;
  users?: User[];
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};

export type Price = {
  text: string;
  value: number;
};
