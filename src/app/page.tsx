"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type TodoState = {
  tasks: string[];
  done: boolean[];
};

const STORAGE_KEY = "today-3-tasks";
const HISTORY_STORAGE_KEY = "today-3-tasks-history";
const TEMPLATE_TASKS = [
  "最重要の開発タスクを1つ進める",
  "画面や機能を1つだけ修正する",
  "15分だけ実装を進める",
  "未完了タスクを1つ片付ける",
  "動作確認をして不具合を1つ見つける",
  "不具合を1つ修正する",
  "次にやる作業を3つに整理する",
  "公開中アプリを実際に使って改善点を1つ記録する",
  "GitHubの作業内容を1つ反映する",
  "今日の結果を短くメモする",
];
const DEVELOPMENT_TEMPLATE_TASKS = [
  "最重要の開発タスクを1つ進める",
  "画面や機能を1つだけ修正する",
  "15分だけ実装を進める",
  "動作確認をして不具合を1つ見つける",
  "不具合を1つ修正する",
  "GitHubの作業内容を1つ反映する",
];
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

const shuffle = (items: string[]): string[] => {
  const copied = [...items];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
};

const buildSuggestedTasks = (storedState: TodoState): string[] => {
  const picked: string[] = [];

  // 前回保存済みの未完了タスクを優先して候補に入れる
  storedState.tasks.forEach((task, index) => {
    const trimmedTask = task.trim();
    if (picked.length >= 3) {
      return;
    }
    if (!storedState.done[index] && trimmedTask !== "" && !picked.includes(trimmedTask)) {
      picked.push(trimmedTask);
    }
  });

  // 不足分だけ固定テンプレ候補で補完する（重複は除外）
  const shuffledDevelopment = shuffle(DEVELOPMENT_TEMPLATE_TASKS);
  for (const task of shuffledDevelopment) {
    if (picked.length >= 3) {
      break;
    }
    if (!picked.includes(task)) {
      picked.push(task);
    }
  }

  const shuffledAll = shuffle(TEMPLATE_TASKS);
  for (const task of shuffledAll) {
    if (picked.length >= 3) {
      break;
    }
    if (!picked.includes(task)) {
      picked.push(task);
    }
  }

  return picked.slice(0, 3);
};

type TodoHistoryItem = {
  id: string;
  date: string;
  tasks: string[];
  checkedStates: boolean[];
  savedAt: string;
};

const readStoredHistory = (): TodoHistoryItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => {
      return (
        item &&
        typeof item.id === "string" &&
        typeof item.date === "string" &&
        Array.isArray(item.tasks) &&
        Array.isArray(item.checkedStates) &&
        typeof item.savedAt === "string"
      );
    });
  } catch {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return [];
  }
};

const saveHistoryEntry = (todoState: TodoState) => {
  // 空文字のみの状態は履歴に追加しない
  const hasAnyTask = todoState.tasks.some((task) => task.trim() !== "");
  if (!hasAnyTask) {
    return;
  }

  const now = new Date();
  const historyItem: TodoHistoryItem = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2)}`,
    date: now.toISOString().slice(0, 10),
    tasks: [...todoState.tasks],
    checkedStates: [...todoState.done],
    savedAt: now.toISOString(),
  };

  const history = readStoredHistory();
  // 新しい履歴が先頭になるように保存
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([historyItem, ...history]));
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
    saveHistoryEntry(state);
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

    const storedState = readStoredState();
    const suggestedTasks = buildSuggestedTasks(storedState);
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
