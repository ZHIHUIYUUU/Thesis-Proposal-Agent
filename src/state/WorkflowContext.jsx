import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { createInitialWorkflowState, workflowReducer } from "../workflow.js";

const STORAGE_KEY = "graduate-proposal-workbench-state";
const WorkflowContext = createContext(null);

export function WorkflowProvider({ children }) {
  const [state, dispatch] = useReducer(workflowReducer, undefined, loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const value = useContext(WorkflowContext);
  if (!value) {
    throw new Error("useWorkflow must be used within WorkflowProvider");
  }
  return value;
}

function loadInitialState() {
  if (typeof window === "undefined") {
    return createInitialWorkflowState();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...createInitialWorkflowState(), ...JSON.parse(raw) } : createInitialWorkflowState();
  } catch {
    return createInitialWorkflowState();
  }
}
