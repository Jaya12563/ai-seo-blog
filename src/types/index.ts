import { Blog, User, Category, Tag, Like, Bookmark } from "@prisma/client";

export type BlogWithAuthor = Blog & {
  author: Pick<User, "id" | "name" | "profileImage">;
  category: Category | null;
  tags: { tag: Tag }[];
  _count?: { likes: number; bookmarks: number };
  likes?: Like[];
  bookmarks?: Bookmark[];
};

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "USER" | "ADMIN";
};