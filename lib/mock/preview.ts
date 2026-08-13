export type CellTone = "default" | "error" | "tertiary";

export type PreviewCell = {
  value: string;
  typeLabel: string;
  tone?: CellTone;
  note?: string;
};

export type PreviewColumn = {
  key: string;
  label: string;
};

export type PreviewRow = {
  id: string;
  cells: PreviewCell[];
};

export type PreviewPane = {
  id: "preload" | "postload";
  tabLabel: string;
  title: string;
  subtitle: string;
  badge: {
    label: string;
    tone: "muted" | "mapped";
  };
  columns: PreviewColumn[];
  rows: PreviewRow[];
  accentRail?: boolean;
};

export const previewCopy = {
  pageTitle: "Data Preview",
  backLabel: "Back to Staging",
  searchPlaceholder: "Search fields...",
  filterLabel: "Filter by Status",
  sortLabel: "Sort by Field",
  showingLabel: "Showing 4 of 245,091 records",
} as const;

export const previewPanes: PreviewPane[] = [
  {
    id: "preload",
    tabLabel: "Preload Files",
    title: "Preload Files",
    subtitle: "(Legacy Source)",
    badge: { label: "245,091 ROWS", tone: "muted" },
    columns: [
      { key: "cust_id", label: "CUST_ID_LEGACY" },
      { key: "f_name", label: "F_NAME" },
      { key: "phone", label: "PHONE_NUM_1" },
      { key: "last_purchase", label: "LAST_PURCHASE_DT" },
    ],
    rows: [
      {
        id: "preload-1",
        cells: [
          { value: "100984-A", typeLabel: "VARCHAR(10)" },
          { value: "Jonathan", typeLabel: "VARCHAR(50)" },
          {
            value: "555-019-NA",
            typeLabel: "VARCHAR(15)",
            tone: "error",
          },
          { value: "2023-11-04 14:30:00", typeLabel: "DATETIME" },
        ],
      },
    ],
  },
  {
    id: "postload",
    tabLabel: "Postload Files",
    title: "Postload Files",
    subtitle: "(Target Schema)",
    badge: { label: "MAPPED", tone: "mapped" },
    accentRail: true,
    columns: [
      { key: "customer_id", label: "CustomerID" },
      { key: "first_name", label: "FirstName" },
      { key: "telephone", label: "Telephone1" },
      { key: "last_order", label: "LastOrderDate" },
    ],
    rows: [
      {
        id: "postload-1",
        cells: [
          { value: "100984A", typeLabel: "NVARCHAR(20)" },
          { value: "Jonathan", typeLabel: "NVARCHAR(100)" },
          {
            value: "NULL",
            typeLabel: "NVARCHAR(30)",
            tone: "tertiary",
            note: "(CLEANSED)",
          },
          { value: "2023-11-04T14:30:00Z", typeLabel: "TIMESTAMP" },
        ],
      },
    ],
  },
];
