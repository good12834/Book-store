// Shared Types for the Bookstore Application

export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
  description: string;
  rating: number;
  featured: boolean;
  publishedYear: number;
  pages: number;
  isbn: string;
  publisher: string;
  reviewsCount: number;
  tags: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}
