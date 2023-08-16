import { Flatfile } from "@flatfile/api";

// @ts-nocheck

export const contactSheet2: Flatfile.SheetConfig = {
  slug: "contacts2",
  name: "Contacts 2",
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
    // No data hooks
    // Useful if label and value of enum are the same
    {
      key: "ccName",
      label: "Cost Center",
      description: "Cost center pulled from reference file",
      type: "reference",
      config: {
        ref: "costcenters",
        key: "name",
        relationship: "has-one"
      }
    }
  ]
};

