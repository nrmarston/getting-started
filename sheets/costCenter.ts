import { Flatfile } from "@flatfile/api";
//@ts-nocheck
export const ccSheet: Flatfile.SheetConfig = {
  slug: "costcenters",
  name: "Cost Centers",
  fields: [
    {
      key: "code",
      type: "string",
      label: "code"
    },
    {
      key: "name",
      type: "string",
      label: "name",
      constraints: [{ "type": "required" }, { "type": "unique" }]
    }
  ]
};