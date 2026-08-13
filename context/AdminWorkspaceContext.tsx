"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAdminWorkspace,
  fetchAdminWorkspace,
  registerSourceSchema,
  updateAdminWorkspaceSelection,
} from "@/lib/api/adminWorkspace";
import {
  fetchRulesBusinessObjects,
  generateValidationRules,
  type RulesDraft,
} from "@/lib/api/rules";
import {
  generateSchemaMapping,
  type SchemaFieldMapping,
} from "@/lib/api/schemaMapping";
import {
  businessObjectOptions as fallbackBusinessObjectOptions,
  type BusinessObjectOption,
} from "@/lib/mock/admin";
import {
  buildWorkspaceSourceKey,
  clearAdminWorkspaceSession,
  getAdminWorkspacePointer,
  storeAdminWorkspacePointer,
} from "@/lib/session/adminWorkspace";

export type AdminFileMeta = {
  name: string;
  size: number;
  lastModified: number;
  fileHash: string;
};

type AdminWorkspaceContextValue = {
  sourceFile: File | null;
  sourceSchemaId: string | null;
  fileMeta: AdminFileMeta | null;
  selectedBusinessObject: string;
  businessObjectOptions: BusinessObjectOption[];
  loadingBusinessObjects: boolean;
  rulesDraft: RulesDraft | null;
  rulesStatus: string | null;
  rulesError: string | null;
  rulesSourceKey: string | null;
  schemaMappings: SchemaFieldMapping[];
  mappingStatus: string | null;
  mappingError: string | null;
  mappingSourceKey: string | null;
  uploadingSchema: boolean;
  generatingRules: boolean;
  generatingMappings: boolean;
  hydrating: boolean;
  registerFile: (file: File | null) => Promise<void>;
  setSelectedBusinessObject: (businessObject: string) => void;
  generateRules: (options?: { force?: boolean }) => Promise<void>;
  generateMappings: (options?: { force?: boolean }) => Promise<void>;
  setRulesStatus: (status: string | null) => void;
  setRulesError: (error: string | null) => void;
};

const AdminWorkspaceContext = createContext<AdminWorkspaceContextValue | null>(
  null,
);

function defaultBusinessObject(options: BusinessObjectOption[]) {
  return options[0]?.id ?? "MM";
}

function toBusinessObjectOptions(ids: string[]): BusinessObjectOption[] {
  const labels: Record<string, string> = {
    MM: "Material Master (MM)",
    PO: "Purchase Order (PO)",
    "GL Account": "GL Account",
    BP: "Business Partner (BP)",
  };
  return ids.map((id) => ({ id, label: labels[id] ?? id }));
}

function applyWorkspaceHydration(
  data: Awaited<ReturnType<typeof fetchAdminWorkspace>>,
  businessObjectOptions: BusinessObjectOption[],
  setters: {
    setSourceSchemaId: (id: string | null) => void;
    setFileMeta: (meta: AdminFileMeta | null) => void;
    setSelectedBusinessObject: (bo: string) => void;
    setRulesDraft: (draft: RulesDraft | null) => void;
    setRulesStatus: (status: string | null) => void;
    setSchemaMappings: (mappings: SchemaFieldMapping[]) => void;
    setMappingStatus: (status: string | null) => void;
    setRulesSourceKey: (key: string | null) => void;
    setMappingSourceKey: (key: string | null) => void;
  },
) {
  const schema = data.sourceSchema;
  const bo =
    data.selectedBusinessObject || defaultBusinessObject(businessObjectOptions);

  if (schema) {
    setters.setSourceSchemaId(schema.id);
    setters.setFileMeta({
      name: schema.originalFilename,
      size: 0,
      lastModified: 0,
      fileHash: schema.fileHash,
    });
    storeAdminWorkspacePointer({
      sourceSchemaId: schema.id,
      selectedBusinessObject: bo,
    });
  }

  setters.setSelectedBusinessObject(bo);

  if (data.rulesDraft?.rules) {
    setters.setRulesDraft(data.rulesDraft.rules);
    setters.setRulesStatus("Restored cached rules draft from your session.");
    setters.setRulesSourceKey(
      buildWorkspaceSourceKey(schema?.fileHash, data.rulesDraft.businessObject),
    );
  }

  if (data.schemaMapping?.mappings?.length) {
    setters.setSchemaMappings(data.schemaMapping.mappings);
    setters.setMappingStatus("Restored cached schema mapping from your session.");
    setters.setMappingSourceKey(
      buildWorkspaceSourceKey(schema?.fileHash, data.schemaMapping.businessObject),
    );
  }
}

export function AdminWorkspaceProvider({ children }: { children: ReactNode }) {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceSchemaId, setSourceSchemaId] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<AdminFileMeta | null>(null);
  const [selectedBusinessObject, setSelectedBusinessObjectState] = useState("MM");
  const [businessObjectOptions, setBusinessObjectOptions] = useState<
    BusinessObjectOption[]
  >(fallbackBusinessObjectOptions);
  const [loadingBusinessObjects, setLoadingBusinessObjects] = useState(true);

  const [rulesDraft, setRulesDraft] = useState<RulesDraft | null>(null);
  const [rulesStatus, setRulesStatus] = useState<string | null>(null);
  const [rulesError, setRulesError] = useState<string | null>(null);
  const [rulesSourceKey, setRulesSourceKey] = useState<string | null>(null);

  const [schemaMappings, setSchemaMappings] = useState<SchemaFieldMapping[]>([]);
  const [mappingStatus, setMappingStatus] = useState<string | null>(null);
  const [mappingError, setMappingError] = useState<string | null>(null);
  const [mappingSourceKey, setMappingSourceKey] = useState<string | null>(null);

  const [uploadingSchema, setUploadingSchema] = useState(false);
  const [generatingRules, setGeneratingRules] = useState(false);
  const [generatingMappings, setGeneratingMappings] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadBusinessObjects() {
      setLoadingBusinessObjects(true);
      try {
        const ids = await fetchRulesBusinessObjects();
        if (cancelled) return;
        const options = toBusinessObjectOptions(ids);
        setBusinessObjectOptions(options);
        setSelectedBusinessObjectState((current) =>
          options.some((option) => option.id === current)
            ? current
            : defaultBusinessObject(options),
        );
      } catch {
        if (!cancelled) {
          setBusinessObjectOptions(fallbackBusinessObjectOptions);
        }
      } finally {
        if (!cancelled) setLoadingBusinessObjects(false);
      }
    }

    void loadBusinessObjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const hydrate = useCallback(async () => {
    setHydrating(true);
    try {
      const data = await fetchAdminWorkspace();
      applyWorkspaceHydration(data, businessObjectOptions, {
        setSourceSchemaId,
        setFileMeta,
        setSelectedBusinessObject: setSelectedBusinessObjectState,
        setRulesDraft,
        setRulesStatus,
        setSchemaMappings,
        setMappingStatus,
        setRulesSourceKey,
        setMappingSourceKey,
      });
    } catch {
      const pointer = getAdminWorkspacePointer();
      if (pointer?.selectedBusinessObject) {
        setSelectedBusinessObjectState(pointer.selectedBusinessObject);
      }
      if (pointer?.sourceSchemaId) {
        setSourceSchemaId(pointer.sourceSchemaId);
      }
    } finally {
      setHydrating(false);
    }
  }, [businessObjectOptions]);

  useEffect(() => {
    if (!loadingBusinessObjects) {
      void hydrate();
    }
  }, [hydrate, loadingBusinessObjects]);

  const clearGeneratedOutputs = useCallback(() => {
    setRulesDraft(null);
    setRulesStatus(null);
    setRulesError(null);
    setRulesSourceKey(null);
    setSchemaMappings([]);
    setMappingStatus(null);
    setMappingError(null);
    setMappingSourceKey(null);
  }, []);

  const registerFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        setSourceFile(null);
        setSourceSchemaId(null);
        setFileMeta(null);
        clearGeneratedOutputs();
        clearAdminWorkspaceSession();
        return;
      }

      setUploadingSchema(true);
      setRulesError(null);
      setMappingError(null);

      try {
        const result = await registerSourceSchema(file, selectedBusinessObject);
        setSourceFile(file);
        setSourceSchemaId(result.id);
        setFileMeta({
          name: result.originalFilename,
          size: file.size,
          lastModified: file.lastModified,
          fileHash: result.fileHash,
        });
        clearGeneratedOutputs();
        storeAdminWorkspacePointer({
          sourceSchemaId: result.id,
          selectedBusinessObject,
        });
      } catch (err) {
        setRulesError(
          err instanceof Error ? err.message : "Failed to register source schema",
        );
        throw err;
      } finally {
        setUploadingSchema(false);
      }
    },
    [clearGeneratedOutputs, selectedBusinessObject],
  );

  const setSelectedBusinessObject = useCallback(
    (businessObject: string) => {
      setSelectedBusinessObjectState(businessObject);
      setRulesDraft(null);
      setRulesStatus(null);
      setRulesError(null);
      setRulesSourceKey(null);
      setSchemaMappings([]);
      setMappingStatus(null);
      setMappingError(null);
      setMappingSourceKey(null);

      storeAdminWorkspacePointer({
        sourceSchemaId,
        selectedBusinessObject: businessObject,
      });

      if (sourceSchemaId) {
        void updateAdminWorkspaceSelection({
          sourceSchemaId,
          selectedBusinessObject: businessObject,
        }).catch(() => {});
      }
    },
    [sourceSchemaId],
  );

  const generateRules = useCallback(
    async (options?: { force?: boolean }) => {
      setRulesError(null);
      setRulesStatus(null);

      if (!selectedBusinessObject) {
        setRulesError("Select a business object first");
        return;
      }

      const key = buildWorkspaceSourceKey(fileMeta?.fileHash, selectedBusinessObject);
      if (
        !options?.force &&
        key &&
        rulesSourceKey === key &&
        rulesDraft
      ) {
        setRulesStatus("Showing existing rules draft for this file and business object.");
        return;
      }

      if (!sourceSchemaId && !sourceFile) {
        setRulesError("Upload an Excel field metadata file first");
        return;
      }

      setGeneratingRules(true);
      try {
        const result = await generateValidationRules(
          selectedBusinessObject,
          sourceFile,
          {
            sourceSchemaId: sourceSchemaId ?? undefined,
            force: options?.force,
          },
        );
        setRulesDraft(result.rules);
        setRulesSourceKey(key);
        setRulesStatus(
          result.message ||
            (result.cached
              ? "Returned cached rules draft."
              : "Review predefined + AI rules. Nothing is saved until you apply."),
        );
      } catch (err) {
        setRulesError(err instanceof Error ? err.message : "Failed to generate rules");
      } finally {
        setGeneratingRules(false);
      }
    },
    [
      fileMeta?.fileHash,
      rulesDraft,
      rulesSourceKey,
      selectedBusinessObject,
      sourceFile,
      sourceSchemaId,
    ],
  );

  const generateMappings = useCallback(
    async (options?: { force?: boolean }) => {
      setMappingError(null);
      setMappingStatus(null);

      if (!selectedBusinessObject) {
        setMappingError("Select a business object first");
        return;
      }

      const key = buildWorkspaceSourceKey(fileMeta?.fileHash, selectedBusinessObject);
      if (
        !options?.force &&
        key &&
        mappingSourceKey === key &&
        schemaMappings.length > 0
      ) {
        setMappingStatus(
          "Showing existing schema mapping for this file and business object.",
        );
        return;
      }

      if (!sourceSchemaId && !sourceFile) {
        setMappingError("Upload a source schema Excel file first");
        return;
      }

      setGeneratingMappings(true);
      try {
        const result = await generateSchemaMapping(
          selectedBusinessObject,
          sourceFile,
          {
            sourceSchemaId: sourceSchemaId ?? undefined,
            force: options?.force,
          },
        );
        setSchemaMappings(result.mappings);
        setMappingSourceKey(key);
        setMappingStatus(
          result.message ||
            (result.cached
              ? "Returned cached schema mapping."
              : `Mapped ${result.mappings.length} source fields to SAP ${result.sapBusinessObject} metadata.`),
        );
      } catch (err) {
        setMappingError(
          err instanceof Error ? err.message : "Failed to generate mapping",
        );
      } finally {
        setGeneratingMappings(false);
      }
    },
    [
      fileMeta?.fileHash,
      mappingSourceKey,
      schemaMappings.length,
      selectedBusinessObject,
      sourceFile,
      sourceSchemaId,
    ],
  );

  const value = useMemo<AdminWorkspaceContextValue>(
    () => ({
      sourceFile,
      sourceSchemaId,
      fileMeta,
      selectedBusinessObject,
      businessObjectOptions,
      loadingBusinessObjects,
      rulesDraft,
      rulesStatus,
      rulesError,
      rulesSourceKey,
      schemaMappings,
      mappingStatus,
      mappingError,
      mappingSourceKey,
      uploadingSchema,
      generatingRules,
      generatingMappings,
      hydrating,
      registerFile,
      setSelectedBusinessObject,
      generateRules,
      generateMappings,
      setRulesStatus,
      setRulesError,
    }),
    [
      sourceFile,
      sourceSchemaId,
      fileMeta,
      selectedBusinessObject,
      businessObjectOptions,
      loadingBusinessObjects,
      rulesDraft,
      rulesStatus,
      rulesError,
      rulesSourceKey,
      schemaMappings,
      mappingStatus,
      mappingError,
      mappingSourceKey,
      uploadingSchema,
      generatingRules,
      generatingMappings,
      hydrating,
      registerFile,
      setSelectedBusinessObject,
      generateRules,
      generateMappings,
    ],
  );

  return (
    <AdminWorkspaceContext.Provider value={value}>
      {children}
    </AdminWorkspaceContext.Provider>
  );
}

export function useAdminWorkspace() {
  const context = useContext(AdminWorkspaceContext);
  if (!context) {
    throw new Error("useAdminWorkspace must be used within AdminWorkspaceProvider");
  }
  return context;
}

export async function resetAdminWorkspaceSession() {
  clearAdminWorkspaceSession();
  try {
    await clearAdminWorkspace();
  } catch {
    // Best-effort server clear during logout
  }
}
