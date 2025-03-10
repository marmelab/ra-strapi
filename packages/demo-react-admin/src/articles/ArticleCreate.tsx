import { Create } from "react-admin";
import { ArticleForm } from "./ArticleForm";


export const ArticleCreate = () => {
    return (
      <Create>
        <ArticleForm/>
      </Create>
    );
}