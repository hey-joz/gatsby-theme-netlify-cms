import type { CmsCollectionField } from "@hey_joz/gatsby-source-netlify-cms";

export const idField: CmsCollectionField = {
  name: "id",
  widget: "uuid",
  label: "ID",
  required: true,
  index_file: "",
  meta: false,
};

export const pathField: CmsCollectionField = {
  name: "path",
  widget: "path",
  label: "Chemin",
  required: true,
  index_file: "",
  meta: false,
  default: "",
};
