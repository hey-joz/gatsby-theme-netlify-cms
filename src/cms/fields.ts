import { CmsField } from "../..";

export const idField: CmsField = {
  name: "id",
  widget: "uuid",
  label: "ID",
  required: true,
  index_file: "",
  meta: false,
};

export const pathField: CmsField = {
  name: "path",
  widget: "path",
  label: "Chemin",
  required: true,
  index_file: "",
  meta: false,
  default: "",
};
