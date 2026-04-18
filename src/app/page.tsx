import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>今日やること3つ</h1>

        <div className={styles.inputs}>
          <input type="text" placeholder="タスク1" aria-label="タスク1" />
          <input type="text" placeholder="タスク2" aria-label="タスク2" />
          <input type="text" placeholder="タスク3" aria-label="タスク3" />
        </div>

        <button type="button" className={styles.primaryButton}>
          保存
        </button>

        <div className={styles.checks}>
          <label>
            <input type="checkbox" /> タスク1 完了
          </label>
          <label>
            <input type="checkbox" /> タスク2 完了
          </label>
          <label>
            <input type="checkbox" /> タスク3 完了
          </label>
        </div>

        <button type="button" className={styles.secondaryButton}>
          リセット
        </button>
      </main>
    </div>
  );
}
