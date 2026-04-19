"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type TodoState = {
  tasks: string[];
  done: boolean[];
};

const STORAGE_KEY = "today-3-tasks";
const INITIAL_STATE: TodoState = {
  tasks: ["", "", ""],
  done: [false, false, false],
};

const readStoredState = (): TodoState => {
  if (typeof window === "undefined") {
    return INITIAL_STATE;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return INITIAL_STATE;
  }

  try {
    const parsed = JSON.parse(saved) as Partial<TodoState>;
    if (
      Array.isArray(parsed.tasks) &&
      parsed.tasks.length === 3 &&
      Array.isArray(parsed.done) &&
      parsed.done.length === 3
    ) {
      return {
        tasks: parsed.tasks.map((task) => String(task)),
        done: parsed.done.map((value) => Boolean(value)),
      };
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return INITIAL_STATE;
};

export default function Home() {
  const [state, setState] = useState<TodoState>(INITIAL_STATE);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setState(readStoredState());
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);
  const { tasks, done } = state;

  const handleTaskChange = (index: number, value: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => (i === index ? value : task)),
    }));
  };

  const handleDoneChange = (index: number, value: boolean) => {
    setState((prev) => ({
      ...prev,
      done: prev.done.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>今日やること3つ</h1>

        <div className={styles.inputs}>
          {tasks.map((task, index) => (
            <input
              key={`task-${index + 1}`}
              type="text"
              placeholder={`タスク${index + 1}`}
              aria-label={`タスク${index + 1}`}
              value={task}
              onChange={(event) => handleTaskChange(index, event.target.value)}
            />
          ))}
        </div>

        <button type="button" className={styles.primaryButton} onClick={handleSave}>
          保存
        </button>

        <div className={styles.checks}>
          {done.map((checked, index) => (
            <label key={`check-${index + 1}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => handleDoneChange(index, event.target.checked)}
              />{" "}
              タスク{index + 1} 完了
            </label>
          ))}
        </div>

        <button type="button" className={styles.secondaryButton} onClick={handleReset}>
          リセット
        </button>
      </main>
    </div>
  );
}
