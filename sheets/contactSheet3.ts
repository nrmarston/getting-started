import { Flatfile } from "@flatfile/api";

// @ts-nocheck

export const contactSheet3: Flatfile.SheetConfig = {
  slug: "contacts3",
  name: "Contacts 3",
  fields: [
    {
      key: "firstName",
      type: "string",
      label: "First Name",
    },
    {
      key: "lastName",
      type: "string",
      label: "Last Name",
    },
    {
      key: "email",
      type: "string",
      label: "Email",
    },
    {
      key: "ccNameRef",
      label: "Cost Center",
      description: "Cost center name pulled from reference file",
      type: "reference",
      config: {
        ref: "costcenters",
        key: "name",
        relationship: "has-one"
      }
    },
    {
      key: "ccId",
      label: "Cost Center ID",
      readonly: true,
      description: "Cost center code that matches related record in cost center sheet.",
      type: "string",
    },
  ]
};

