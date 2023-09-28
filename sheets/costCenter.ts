
import { Flatfile } from "@flatfile/api";

export const ccSheet: Flatfile.SheetConfig = {
  slug: "costcenters",
  name: "Cost Centers",
  fields: [
    {
      key: "code",
      type: "string",
      label: "code",
      constraints: [{ "type": "required" }, { "type": "unique" }]
    },
    {
      key: "name",
      type: "string",
      label: "CC Name"
    }
  ]
};

