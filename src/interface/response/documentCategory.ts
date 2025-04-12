export interface IDocumentCategory {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDocumentCategoryResponse {
  success: boolean;
  message: string;
  data: IDocumentCategory;
}

export interface IDocumentCategoriesListResponse {
  success: boolean;
  count: number;
  data: IDocumentCategory[];
}

export interface IDeleteDocumentCategoryResponse {
  success: boolean;
  message: string;
} 