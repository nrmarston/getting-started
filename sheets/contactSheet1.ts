import { Flatfile } from "@flatfile/api";

// @ts-nocheck

export const contactSheet1: Flatfile.SheetConfig = {
  slug: "contacts1",
  name: "Contacts 1",
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
      key: "costCenter",
      type: "enum",
      label: "Cost Center",
      config: {
        options: [
          { value: "2680", label: "Strategic Planning" },
          { value: "2289", label: "Market Analysis" },
          { value: "5173", label: "Product Development" },
          { value: "3594", label: "Sales Forecasting" },
          { value: "2009", label: "Team Collaboration" },
          { value: "3578", label: "Financial Management" },
          { value: "2653", label: "Risk Assessment" }
        ]
      }
    }
  ]
};

