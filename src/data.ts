import { Book } from "./types";

export const MOCK_BOOKS: Book[] = [
  {
    _id: "book-1",
    title: "Cosmic Chronicles",
    author: "Dr. Evelyn Vance",
    price: 24.99,
    coverImage: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80",
    category: "Sci-Fi",
    description: "An awe-inspiring expedition into the mysteries of dark matter, quantum mechanics, and the ultimate destiny of our stellar neighborhood. Written for the curious mind, Vance simplifies complex cosmic theories into a lyrical storytelling prose.",
    rating: 4.9,
    featured: true,
    publishedYear: 2026,
    pages: 342,
    isbn: "978-3-16-148410-0",
    publisher: "Aetherial Publishing",
    reviewsCount: 142,
    tags: ["Astrophysics", "Space", "Cosmology", "Best Seller"]
  },
  {
    _id: "book-2",
    title: "The Golden Gateway",
    author: "Julian Thorne",
    price: 18.50,
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
    category: "Fiction",
    description: "A thrilling historical mystery set in the labyrinthine canals of 17th-century Venice. When an ancient manuscript containing coordinates to an uncharted realm goes missing, an alchemist's apprentice must race against secret tribunals to solve the riddle.",
    rating: 4.8,
    featured: true,
    publishedYear: 2025,
    pages: 418,
    isbn: "978-1-23-456789-7",
    publisher: "Venetian Scribe Press",
    reviewsCount: 98,
    tags: ["Historical Fiction", "Mystery", "Venice", "Adventure"]
  },
  {
    _id: "book-3",
    title: "Modern Minimalism",
    author: "Kenji Sato",
    price: 45.00,
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    category: "Design & Art",
    description: "A gorgeous, hardcover volume exploring the serene intersection of Japanese design, Scandinavian comfort, and modern architectural restraint. Featuring full-color architectural spreads and deep philosophical essays on living with less.",
    rating: 4.7,
    featured: true,
    publishedYear: 2026,
    pages: 280,
    isbn: "978-0-98-765432-1",
    publisher: "Zenith Design Press",
    reviewsCount: 61,
    tags: ["Interior Design", "Philosophy", "Art", "Minimalism"]
  },
  {
    _id: "book-4",
    title: "Creative Sparks",
    author: "Amara Cole",
    price: 16.99,
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    category: "Self-Help",
    description: "Unshackle your creative potential with 50 highly actionable, psychology-baked habits designed to shatter writer's block and fear of failure. Amara Cole guides you through standard creative workflows used by top global artists, programmers, and designers.",
    rating: 4.6,
    featured: true,
    publishedYear: 2024,
    pages: 224,
    isbn: "978-5-43-210987-6",
    publisher: "Vibrant Mind Co.",
    reviewsCount: 220,
    tags: ["Creativity", "Productivity", "Mental Wellness"]
  },
  {
    _id: "book-5",
    title: "Shadows of the Cosmos",
    author: "Aria Thorne",
    price: 21.00,
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
    category: "Sci-Fi",
    description: "A gripping space opera charting the political maneuvers and survival of humanity’s last stellar fleet as they navigate the radioactive remains of a dead galaxy. Perfect for fans of complex character dynamics and hard-science space exploration.",
    rating: 4.8,
    featured: false,
    publishedYear: 2025,
    pages: 450,
    isbn: "978-9-87-654321-0",
    publisher: "Polaris SciFi Group",
    reviewsCount: 112,
    tags: ["Space Opera", "Dystopian", "Adventure"]
  },
  {
    _id: "book-6",
    title: "The Creative Mindset",
    author: "Austin Kleon",
    price: 19.99,
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
    category: "Design & Art",
    description: "A visual masterclass exploring how ideas are recycled, combined, and cross-pollinated. Learn why copying details is theft, but copying structure is inspiration, and how maintaining multiple side projects can actually prevent professional burnout.",
    rating: 4.9,
    featured: false,
    publishedYear: 2024,
    pages: 195,
    isbn: "978-4-15-263748-0",
    publisher: "Workhorse Publishing",
    reviewsCount: 310,
    tags: ["Art Theory", "Inspiration", "Notebooks"]
  },
  {
    _id: "book-7",
    title: "Architect of Thought",
    author: "Marcus Aurelius Lin",
    price: 29.99,
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
    category: "Biography",
    description: "An intimate, authorized look into the life of Alistair Reyes, the enigmatic design maverick who rebuilt Tokyo's skyline and pioneered low-impact bio-domes. Lin weaves personal journal entries, private logs, and technical drawings into a stunning journey of resilience.",
    rating: 4.5,
    featured: false,
    publishedYear: 2025,
    pages: 512,
    isbn: "978-3-12-849502-1",
    publisher: "Capital Biographies",
    reviewsCount: 84,
    tags: ["Architecture", "Resilience", "Leader Biographies"]
  },
  {
    _id: "book-8",
    title: "Time of Reflection",
    author: "Elena Petrova",
    price: 15.99,
    coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
    category: "Fiction",
    description: "Set in a sun-drenched coastal town in Eastern Europe, this melancholic novel charts three generations of a family as they tend to an abandoned lighthouse, discovering hidden letters that re-write their understanding of the local war of 1944.",
    rating: 4.7,
    featured: false,
    publishedYear: 2023,
    pages: 310,
    isbn: "978-2-12-392847-5",
    publisher: "Danube Literary Society",
    reviewsCount: 52,
    tags: ["Literary Fiction", "Family Saga", "Europe"]
  },
  {
    _id: "book-9",
    title: "Tales of the Unknown",
    author: "Arthur Conan Doyle III",
    price: 22.00,
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    category: "Fiction",
    description: "A whimsical, fantastical treasury containing twelve short stories that defy logic. From clocks that repeat yesterday to travelers who escape their own shadows, this anthology is a pure tribute to magic realism and beautiful speculative imagery.",
    rating: 4.8,
    featured: false,
    publishedYear: 2026,
    pages: 260,
    isbn: "978-7-48-239485-1",
    publisher: "Oddities & Co.",
    reviewsCount: 75,
    tags: ["Magic Realist", "Short Stories", "Classic Spirit"]
  },
  {
    _id: "book-10",
    title: "Legacy of Empires",
    author: "Seraphina Vance",
    price: 32.50,
    coverImage: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80",
    category: "Biography",
    description: "An incredibly deep and sweeping historical biography of the Medici dynasty's unsung female patrons, whose dynamic financial acumen and private sponsorships directly gave rise to the grandest monuments of the Florentine Renaissance.",
    rating: 4.9,
    featured: false,
    publishedYear: 2024,
    pages: 580,
    isbn: "978-5-19-204958-3",
    publisher: "Florentine Academic Press",
    reviewsCount: 165,
    tags: ["History", "Renaissance", "Powerful Women", "Sponsorship"]
  },
  {
    _id: "book-11",
    title: "The Path to Abundance",
    author: "Melissa Greene",
    price: 17.00,
    coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80",
    category: "Self-Help",
    description: "A groundbreaking, non-toxic guide to personal finance and behavioral wealth. Greene breaks down the psychological hurdles that trigger impulsive spend-cycles and provides a solid, daily mental layout to construct true generational stability.",
    rating: 4.6,
    featured: false,
    publishedYear: 2025,
    pages: 245,
    isbn: "978-1-58-294029-4",
    publisher: "Abundance Press",
    reviewsCount: 198,
    tags: ["Wealth", "Finance Psych", "Personal Growth"]
  },
  {
    _id: "book-12",
    title: "The Poetic Dream",
    author: "Oliver Sterling",
    price: 14.99,
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    category: "Fiction",
    description: "A stunning anthology of modern free verse poetry pondering the relationship between concrete urban settings and fluid organic memories. Beautifully printed with luxury hand-scored bindings, this is an elegant addition to any collectors table.",
    rating: 4.9,
    featured: false,
    publishedYear: 2026,
    pages: 120,
    isbn: "978-8-29-394850-2",
    publisher: "Symphony Editorial",
    reviewsCount: 43,
    tags: ["Poetry", "Urban Design", "Memories", "Artisanal"]
  }
];

export const CATEGORIES = [
  "All",
  "Fiction",
  "Sci-Fi",
  "Biography",
  "Design & Art",
  "Self-Help"
];

export const WHY_CHOOSE_US = [
  {
    title: "Curated Selections",
    description: "We handpick every volume in our library to ensure we offer only the most enriching, thought-provoking, and beautifully designed editions.",
    iconName: "Sparkles"
  },
  {
    title: "Artisanal Packaging",
    description: "Every book is shipped in 100% biodegradable custom card wrapping, ensuring they arrive in pristine collector condition.",
    iconName: "Gift"
  },
  {
    title: "Community First",
    description: "A percentage of all bookstore sales is directly funnelled into local, independent paper Mills and community literacy projects.",
    iconName: "Heart"
  },
  {
    title: "Global Express Shipping",
    description: "Enjoy fully tracked carbon-offset air shipping, delivering literary treasures directly to your door anywhere in the world.",
    iconName: "Globe"
  }
];

export const TESTIMONIALS = [
  {
    quote: "Finding a bookstore that treats literature as visceral art is a rare joy. The packaging layout and rapid carbon-neutral delivery are truly exceptional.",
    author: "Sarah J. Harrington",
    role: "Visual Director, Scribe Guild",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "The curate selections here are phenomenal. I bought the physical 'Modern Minimalism' edition and was blown away by the tactile print stock and detailed binding.",
    author: "Liam K. Thorne",
    role: "Senior Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    quote: "Their Sci-Fi selection represents the absolute frontier of modern speculative writing. Simply a masterclass in independent print curation.",
    author: "Dr. Kenji Tanaka",
    role: "Quantum theorist & Author",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"
  }
];
