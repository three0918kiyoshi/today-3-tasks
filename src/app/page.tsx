"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type TodoState = {
  tasks: string[];
  done: boolean[];
};

const STORAGE_KEY = "today-3-tasks";
const TEMPLATE_TASKS = ["部屋を5分片付ける", "10分だけ読書する", "明日の準備をする"];
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

// 前回保存データの未完了タスクを優先し、足りない分を固定テンプレで補う
const buildSuggestedTasks = (savedState: TodoState, templates: string[]): string[] => {
  const fromUndone = savedState.tasks.filter((task, index) => {
    return task.trim() !== "" && !savedState.done[index];
  });

  const suggestions = [...fromUndone];

  for (const template of templates) {
    if (suggestions.length >= 3) {
      break;
    }

    if (!suggestions.includes(template)) {
      suggestions.push(template);
    }
  }

  return suggestions.slice(0, 3);
};

export default function Home() {
  const [state, setState] = useState<TodoState>(INITIAL_STATE);
  const [message, setMessage] = useState("");
  const messageTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setState(readStoredState());
    }, 0);

    return () => window.clearTimeout(timerId);
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current !== null) {
        window.clearTimeout(messageTimerRef.current);
      }
    };
  }, []);
  const { tasks, done } = state;

  const showMessage = (text: string) => {
    setMessage(text);

    if (messageTimerRef.current !== null) {
      window.clearTimeout(messageTimerRef.current);
    }

    messageTimerRef.current = window.setTimeout(() => {
      setMessage("");
      messageTimerRef.current = null;
    }, 3000);
  };

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
    showMessage("保存しました");
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
    showMessage("リセットしました");
  };

  const handleSuggest = () => {
    // 入力済みがある場合は、上書き前に確認する
    const hasInput = tasks.some((task) => task.trim() !== "");
    if (hasInput) {
      const shouldOverwrite = window.confirm("入力内容を上書きして提案を反映しますか？");
      if (!shouldOverwrite) {
        return;
      }
    }

    const savedState = readStoredState();
    const suggestedTasks = buildSuggestedTasks(savedState, TEMPLATE_TASKS);
    setState({
      tasks: suggestedTasks,
      done: [false, false, false],
    });
    showMessage("提案を反映しました");
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

        <button type="button" className={styles.secondaryButton} onClick={handleSuggest}>
          提案する
        </button>

        <button type="button" className={styles.primaryButton} onClick={handleSave}>
          保存
        </button>

        {message && <p className={styles.message}>{message}</p>}

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
