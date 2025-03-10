import { Create } from "react-admin";
import { CategoryForm } from "./CategoryForm";

export const CategoryCreate = () => {
  return (
    <Create>
      <CategoryForm />
    </Create>
  );
};
