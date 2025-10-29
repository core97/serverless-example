import { Author } from '@/author/domain/entities/author.entity';
import { Book } from '@/book/domain/entities/book.entity';

export const mockAuthors: Author[] = [
  new Author({
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Gabriel García Márquez',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  }),
  new Author({
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Isabel Allende',
    createdAt: new Date('2024-01-16T10:00:00Z'),
    updatedAt: new Date('2024-01-16T10:00:00Z'),
  }),
  new Author({
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Jorge Luis Borges',
    createdAt: new Date('2024-01-17T10:00:00Z'),
    updatedAt: new Date('2024-01-17T10:00:00Z'),
  }),
];

export const mockBooks: Book[] = [
  new Book({
    id: '660e8400-e29b-41d4-a716-446655440001',
    authorId: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Cien años de soledad',
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z'),
  }),
  new Book({
    id: '660e8400-e29b-41d4-a716-446655440002',
    authorId: '550e8400-e29b-41d4-a716-446655440002',
    title: 'La casa de los espíritus',
    createdAt: new Date('2024-01-16T11:00:00Z'),
    updatedAt: new Date('2024-01-16T11:00:00Z'),
  }),
  new Book({
    id: '660e8400-e29b-41d4-a716-446655440003',
    authorId: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Ficciones',
    createdAt: new Date('2024-01-17T11:00:00Z'),
    updatedAt: new Date('2024-01-17T11:00:00Z'),
  }),
];
