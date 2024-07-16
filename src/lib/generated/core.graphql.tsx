import { GraphQLResolveInfo } from 'graphql';
import { LanguageEntity, PublishingHouseEntity, PageTypeEntity, BookTypeEntity, CoverTypeEntity, BookSeriesEntity, BookEntity, AuthorEntity } from '../data/types';
import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Author = {
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type AuthorCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type AuthorInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Book = {
  author?: Maybe<Author>;
  authorId?: Maybe<Scalars['ID']['output']>;
  bookSeries?: Maybe<BookSeries>;
  bookSeriesId?: Maybe<Scalars['ID']['output']>;
  bookType?: Maybe<BookType>;
  bookTypeId: Scalars['ID']['output'];
  coverType?: Maybe<CoverType>;
  coverTypeId: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isbn?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Language>;
  languageId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  numberInStock?: Maybe<Scalars['Int']['output']>;
  numberOfPages?: Maybe<Scalars['Int']['output']>;
  pageType?: Maybe<PageType>;
  pageTypeId: Scalars['ID']['output'];
  price?: Maybe<Scalars['Float']['output']>;
};

export type BookCreateInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  bookSeriesId: Scalars['ID']['input'];
  bookTypeId: Scalars['ID']['input'];
  coverTypeId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  numberInStock?: InputMaybe<Scalars['Int']['input']>;
  numberOfPages: Scalars['Int']['input'];
  pageTypeId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
};

export type BookInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  bookSeriesId: Scalars['ID']['input'];
  bookTypeId: Scalars['ID']['input'];
  coverTypeId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  format?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isbn?: InputMaybe<Scalars['String']['input']>;
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  numberInStock?: InputMaybe<Scalars['Int']['input']>;
  numberOfPages: Scalars['Int']['input'];
  pageTypeId: Scalars['ID']['input'];
  price?: InputMaybe<Scalars['Float']['input']>;
};

export type BookSearchInput = {
  authorId?: InputMaybe<Scalars['ID']['input']>;
  bookSeriesId?: InputMaybe<Scalars['ID']['input']>;
  bookTypeId?: InputMaybe<Scalars['ID']['input']>;
  coverTypeId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  isbn?: InputMaybe<Scalars['String']['input']>;
  languageId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  pageTypeId?: InputMaybe<Scalars['ID']['input']>;
  publishingHouseId?: InputMaybe<Scalars['ID']['input']>;
};

export type BookSeries = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  publishingHouse?: Maybe<PublishingHouse>;
  publishingHouseId: Scalars['ID']['output'];
};

export type BookSeriesCreateInput = {
  name: Scalars['String']['input'];
  publishingHouseId: Scalars['ID']['input'];
};

export type BookSeriesInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  publishingHouseId: Scalars['ID']['input'];
};

export type BookSeriesSearchInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  publishingHouseId: Scalars['ID']['input'];
};

export type BookSubList = {
  items: Array<Book>;
  totalCount: Scalars['Int']['output'];
};

export type BookType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type BookTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type BookTypeInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type CoverType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type CoverTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type CoverTypeInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Language = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type LanguageCreateInput = {
  name: Scalars['String']['input'];
};

export type LanguageInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type Mutation = {
  createAuthor?: Maybe<Author>;
  createBook?: Maybe<Book>;
  createBookSeries?: Maybe<BookSeries>;
  createBookType?: Maybe<BookType>;
  createCoverType?: Maybe<CoverType>;
  createLanguage?: Maybe<Language>;
  createPageType?: Maybe<PageType>;
  createPublishingHouse?: Maybe<PublishingHouse>;
  deleteAuthor?: Maybe<Author>;
  deleteBook?: Maybe<Book>;
  deleteBookSeries?: Maybe<BookSeries>;
  deleteBookType?: Maybe<BookType>;
  deleteCoverType?: Maybe<CoverType>;
  deleteLanguage?: Maybe<Language>;
  deletePageType?: Maybe<PageType>;
  deletePublishingHouse?: Maybe<PublishingHouse>;
  updateAuthor?: Maybe<Author>;
  updateBook?: Maybe<Book>;
  updateBookSeries?: Maybe<BookSeries>;
  updateBookType?: Maybe<BookType>;
  updateCoverType?: Maybe<CoverType>;
  updateLanguage?: Maybe<Language>;
  updatePageType?: Maybe<PageType>;
  updatePublishingHouse?: Maybe<PublishingHouse>;
};


export type MutationCreateAuthorArgs = {
  input: AuthorCreateInput;
};


export type MutationCreateBookArgs = {
  input: BookCreateInput;
};


export type MutationCreateBookSeriesArgs = {
  input: BookSeriesCreateInput;
};


export type MutationCreateBookTypeArgs = {
  input: BookTypeCreateInput;
};


export type MutationCreateCoverTypeArgs = {
  input: CoverTypeCreateInput;
};


export type MutationCreateLanguageArgs = {
  input: LanguageCreateInput;
};


export type MutationCreatePageTypeArgs = {
  input: PageTypeCreateInput;
};


export type MutationCreatePublishingHouseArgs = {
  input: PublishingHouseCreateInput;
};


export type MutationDeleteAuthorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookSeriesArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBookTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCoverTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLanguageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePageTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePublishingHouseArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateAuthorArgs = {
  input: AuthorInput;
};


export type MutationUpdateBookArgs = {
  input: BookInput;
};


export type MutationUpdateBookSeriesArgs = {
  input: BookSeriesInput;
};


export type MutationUpdateBookTypeArgs = {
  input: BookTypeInput;
};


export type MutationUpdateCoverTypeArgs = {
  input: CoverTypeInput;
};


export type MutationUpdateLanguageArgs = {
  input: LanguageInput;
};


export type MutationUpdatePageTypeArgs = {
  input: PageTypeInput;
};


export type MutationUpdatePublishingHouseArgs = {
  input: PublishingHouseInput;
};

export type PageType = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
};

export type PageTypeCreateInput = {
  name: Scalars['String']['input'];
};

export type PageTypeInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type PageableInput = {
  order?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  rowsPerPage?: InputMaybe<Scalars['Int']['input']>;
};

export type PublishingHouse = {
  id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  tags?: Maybe<Scalars['String']['output']>;
};

export type PublishingHouseCreateInput = {
  name: Scalars['String']['input'];
  tags?: InputMaybe<Scalars['String']['input']>;
};

export type PublishingHouseInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  tags?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  authors?: Maybe<Array<Author>>;
  bookSeries?: Maybe<Array<BookSeries>>;
  bookTypes?: Maybe<Array<BookType>>;
  books?: Maybe<BookSubList>;
  coverTypes?: Maybe<Array<CoverType>>;
  languages?: Maybe<Array<Language>>;
  pageTypes?: Maybe<Array<PageType>>;
  publishingHouses?: Maybe<Array<PublishingHouse>>;
};


export type QueryAuthorsArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBookSeriesArgs = {
  filters?: InputMaybe<BookSeriesSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBookTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryBooksArgs = {
  filters?: InputMaybe<BookSearchInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryCoverTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryLanguagesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryPageTypesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};


export type QueryPublishingHousesArgs = {
  filters?: InputMaybe<SearchByNameInput>;
  pageSettings?: InputMaybe<PageableInput>;
};

export type SearchByNameInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Author: ResolverTypeWrapper<AuthorEntity>;
  AuthorCreateInput: AuthorCreateInput;
  AuthorInput: AuthorInput;
  Book: ResolverTypeWrapper<BookEntity>;
  BookCreateInput: BookCreateInput;
  BookInput: BookInput;
  BookSearchInput: BookSearchInput;
  BookSeries: ResolverTypeWrapper<BookSeriesEntity>;
  BookSeriesCreateInput: BookSeriesCreateInput;
  BookSeriesInput: BookSeriesInput;
  BookSeriesSearchInput: BookSeriesSearchInput;
  BookSubList: ResolverTypeWrapper<Omit<BookSubList, 'items'> & { items: Array<ResolversTypes['Book']> }>;
  BookType: ResolverTypeWrapper<BookTypeEntity>;
  BookTypeCreateInput: BookTypeCreateInput;
  BookTypeInput: BookTypeInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CoverType: ResolverTypeWrapper<CoverTypeEntity>;
  CoverTypeCreateInput: CoverTypeCreateInput;
  CoverTypeInput: CoverTypeInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Language: ResolverTypeWrapper<LanguageEntity>;
  LanguageCreateInput: LanguageCreateInput;
  LanguageInput: LanguageInput;
  Mutation: ResolverTypeWrapper<{}>;
  PageType: ResolverTypeWrapper<PageTypeEntity>;
  PageTypeCreateInput: PageTypeCreateInput;
  PageTypeInput: PageTypeInput;
  PageableInput: PageableInput;
  PublishingHouse: ResolverTypeWrapper<PublishingHouseEntity>;
  PublishingHouseCreateInput: PublishingHouseCreateInput;
  PublishingHouseInput: PublishingHouseInput;
  Query: ResolverTypeWrapper<{}>;
  SearchByNameInput: SearchByNameInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Author: AuthorEntity;
  AuthorCreateInput: AuthorCreateInput;
  AuthorInput: AuthorInput;
  Book: BookEntity;
  BookCreateInput: BookCreateInput;
  BookInput: BookInput;
  BookSearchInput: BookSearchInput;
  BookSeries: BookSeriesEntity;
  BookSeriesCreateInput: BookSeriesCreateInput;
  BookSeriesInput: BookSeriesInput;
  BookSeriesSearchInput: BookSeriesSearchInput;
  BookSubList: Omit<BookSubList, 'items'> & { items: Array<ResolversParentTypes['Book']> };
  BookType: BookTypeEntity;
  BookTypeCreateInput: BookTypeCreateInput;
  BookTypeInput: BookTypeInput;
  Boolean: Scalars['Boolean']['output'];
  CoverType: CoverTypeEntity;
  CoverTypeCreateInput: CoverTypeCreateInput;
  CoverTypeInput: CoverTypeInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Language: LanguageEntity;
  LanguageCreateInput: LanguageCreateInput;
  LanguageInput: LanguageInput;
  Mutation: {};
  PageType: PageTypeEntity;
  PageTypeCreateInput: PageTypeCreateInput;
  PageTypeInput: PageTypeInput;
  PageableInput: PageableInput;
  PublishingHouse: PublishingHouseEntity;
  PublishingHouseCreateInput: PublishingHouseCreateInput;
  PublishingHouseInput: PublishingHouseInput;
  Query: {};
  SearchByNameInput: SearchByNameInput;
  String: Scalars['String']['output'];
};

export type AuthorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  author?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType>;
  authorId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  bookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType>;
  bookSeriesId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  bookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType>;
  bookTypeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  coverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType>;
  coverTypeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  isbn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  language?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType>;
  languageId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  numberInStock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  numberOfPages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType>;
  pageTypeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSeriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSeries'] = ResolversParentTypes['BookSeries']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType>;
  publishingHouseId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookSubListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookSubList'] = ResolversParentTypes['BookSubList']> = {
  items?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BookType'] = ResolversParentTypes['BookType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CoverTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CoverType'] = ResolversParentTypes['CoverType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationCreateAuthorArgs, 'input'>>;
  createBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationCreateBookArgs, 'input'>>;
  createBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationCreateBookSeriesArgs, 'input'>>;
  createBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationCreateBookTypeArgs, 'input'>>;
  createCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationCreateCoverTypeArgs, 'input'>>;
  createLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationCreateLanguageArgs, 'input'>>;
  createPageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationCreatePageTypeArgs, 'input'>>;
  createPublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationCreatePublishingHouseArgs, 'input'>>;
  deleteAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationDeleteAuthorArgs, 'id'>>;
  deleteBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationDeleteBookArgs, 'id'>>;
  deleteBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationDeleteBookSeriesArgs, 'id'>>;
  deleteBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationDeleteBookTypeArgs, 'id'>>;
  deleteCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationDeleteCoverTypeArgs, 'id'>>;
  deleteLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationDeleteLanguageArgs, 'id'>>;
  deletePageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationDeletePageTypeArgs, 'id'>>;
  deletePublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationDeletePublishingHouseArgs, 'id'>>;
  updateAuthor?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType, RequireFields<MutationUpdateAuthorArgs, 'input'>>;
  updateBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationUpdateBookArgs, 'input'>>;
  updateBookSeries?: Resolver<Maybe<ResolversTypes['BookSeries']>, ParentType, ContextType, RequireFields<MutationUpdateBookSeriesArgs, 'input'>>;
  updateBookType?: Resolver<Maybe<ResolversTypes['BookType']>, ParentType, ContextType, RequireFields<MutationUpdateBookTypeArgs, 'input'>>;
  updateCoverType?: Resolver<Maybe<ResolversTypes['CoverType']>, ParentType, ContextType, RequireFields<MutationUpdateCoverTypeArgs, 'input'>>;
  updateLanguage?: Resolver<Maybe<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<MutationUpdateLanguageArgs, 'input'>>;
  updatePageType?: Resolver<Maybe<ResolversTypes['PageType']>, ParentType, ContextType, RequireFields<MutationUpdatePageTypeArgs, 'input'>>;
  updatePublishingHouse?: Resolver<Maybe<ResolversTypes['PublishingHouse']>, ParentType, ContextType, RequireFields<MutationUpdatePublishingHouseArgs, 'input'>>;
};

export type PageTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageType'] = ResolversParentTypes['PageType']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublishingHouseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublishingHouse'] = ResolversParentTypes['PublishingHouse']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authors?: Resolver<Maybe<Array<ResolversTypes['Author']>>, ParentType, ContextType, Partial<QueryAuthorsArgs>>;
  bookSeries?: Resolver<Maybe<Array<ResolversTypes['BookSeries']>>, ParentType, ContextType, Partial<QueryBookSeriesArgs>>;
  bookTypes?: Resolver<Maybe<Array<ResolversTypes['BookType']>>, ParentType, ContextType, Partial<QueryBookTypesArgs>>;
  books?: Resolver<Maybe<ResolversTypes['BookSubList']>, ParentType, ContextType, Partial<QueryBooksArgs>>;
  coverTypes?: Resolver<Maybe<Array<ResolversTypes['CoverType']>>, ParentType, ContextType, Partial<QueryCoverTypesArgs>>;
  languages?: Resolver<Maybe<Array<ResolversTypes['Language']>>, ParentType, ContextType, Partial<QueryLanguagesArgs>>;
  pageTypes?: Resolver<Maybe<Array<ResolversTypes['PageType']>>, ParentType, ContextType, Partial<QueryPageTypesArgs>>;
  publishingHouses?: Resolver<Maybe<Array<ResolversTypes['PublishingHouse']>>, ParentType, ContextType, Partial<QueryPublishingHousesArgs>>;
};

export type Resolvers<ContextType = any> = {
  Author?: AuthorResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  BookSeries?: BookSeriesResolvers<ContextType>;
  BookSubList?: BookSubListResolvers<ContextType>;
  BookType?: BookTypeResolvers<ContextType>;
  CoverType?: CoverTypeResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageType?: PageTypeResolvers<ContextType>;
  PublishingHouse?: PublishingHouseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

