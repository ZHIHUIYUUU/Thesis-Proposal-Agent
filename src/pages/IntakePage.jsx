import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collections, dataOptions, degreeOptions, methodOptions } from "../data.js";
import { useWorkflow } from "../state/WorkflowContext.jsx";
import { isIntakeComplete } from "../workflow.js";

export default function IntakePage() {
  const { state, dispatch } = useWorkflow();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    degreeLevel: state.intake.degreeLevel || "master",
    collection: state.intake.collection || "engineering",
    subfield: state.intake.subfield || "mechanical-engineering",
    method: state.intake.method || "experiment-simulation",
    dataCondition: state.intake.dataCondition || "public-simulation",
    advisorPreference: state.intake.advisorPreference || "偏工程应用、可完成性和规范开题。",
    studentProfile: state.intake.studentProfile || "会基础 Python，能读英文文献，希望题目不要太虚。",
    multiLevel: Boolean(state.intake.multiLevel),
  }));
  const subfieldOptions = useMemo(() => Object.entries(collections[form.collection]?.subfields || {}), [form.collection]);
  const complete = isIntakeComplete(form);

  function updateField(key, value) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "collection") {
        next.subfield = Object.keys(collections[value]?.subfields || {})[0] || "";
      }
      return next;
    });
  }

  function submit(event) {
    event.preventDefault();
    dispatch({ type: "UPDATE_INTAKE", payload: form });
    if (complete) {
      navigate("/routing");
    }
  }

  return (
    <section className="page-grid intake-page">
      <div className="page-card">
        <span className="eyebrow">Step 1</span>
        <h2>需求采集</h2>
        <p className="page-lead">先把学生层次、学科、方法传统和数据条件说清楚。后面的路由、候选、文献和开题包都以这里为准。</p>
      </div>

      <form className="page-card form-panel" onSubmit={submit}>
        <div className="form-grid">
          <label>
            <span>培养层次</span>
            <select value={form.degreeLevel} onChange={(event) => updateField("degreeLevel", event.target.value)}>
              {degreeOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>大学科集合</span>
            <select value={form.collection} onChange={(event) => updateField("collection", event.target.value)}>
              {Object.entries(collections).map(([value, item]) => (
                <option key={value} value={value}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>二级学科</span>
            <select value={form.subfield} onChange={(event) => updateField("subfield", event.target.value)}>
              {subfieldOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>方法传统</span>
            <select value={form.method} onChange={(event) => updateField("method", event.target.value)}>
              {methodOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>数据条件</span>
            <select value={form.dataCondition} onChange={(event) => updateField("dataCondition", event.target.value)}>
              {dataOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span>导师偏好</span>
          <textarea rows="3" value={form.advisorPreference} onChange={(event) => updateField("advisorPreference", event.target.value)} />
        </label>
        <label>
          <span>学生画像</span>
          <textarea rows="4" value={form.studentProfile} onChange={(event) => updateField("studentProfile", event.target.value)} />
        </label>
        <label className="check-line">
          <input type="checkbox" checked={form.multiLevel} onChange={(event) => updateField("multiLevel", event.target.checked)} />
          <span>同时生成专科/本科/硕士/博士四级版本</span>
        </label>

        <div className="action-row">
          <button className="primary-button" type="submit" disabled={!complete}>
            生成路由卡
          </button>
          {!complete && <span className="hint-text">请补齐导师偏好和学生画像。</span>}
        </div>
      </form>
    </section>
  );
}
