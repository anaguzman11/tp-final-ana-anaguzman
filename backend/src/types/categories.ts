// Interface que define la estructura de una categoría
//data transfer objects
export interface ICategory {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
