# AGENTS.md

## Project

today-3-tasks

今日やること 3 つを決める超簡易 TODO アプリ

---

## Objective

小さく完成させる個人開発 1 本目。

PC で初期構築済み。
今後はスマホ中心で、Codex + GitHub + Vercel で改善・公開する。

---

## Highest Priority

開発メイン、発信サブ。

迷ったら必ず以下優先順位で判断する。

1. 開発（機能完成）
2. バグ修正
3. 公開維持
4. UX 改善
5. 発信ネタ化

---

## How To Work

作業開始時は必ず `CHECKLIST.md` を確認すること。

未完了の最上位ステップから着手すること。

勝手に次フェーズへ進まないこと。

---

## MVP Scope

実装対象は以下のみ。

-   タスク 3 件入力
-   保存ボタン
-   チェック完了管理
-   リセット
-   localStorage 保存
-   再読み込み復元
-   スマホで使いやすい UI

---

## Out of Scope

以下は実装禁止。

-   ログイン
-   DB
-   Supabase
-   AI 提案
-   通知
-   カレンダー
-   複数日管理
-   課金
-   API 化
-   状態管理ライブラリ追加

---

## Technical Rules

-   Next.js existing structure keep
-   src/app/page.tsx 優先
-   必要最小限の useState/useEffect のみ可
-   外部ライブラリ追加禁止
-   TypeScript error 禁止
-   build break 禁止

---

## Output Rules

毎回この形式で報告すること。

1. 着手ステップ
2. 実装内容
3. 変更ファイル
4. 動作確認方法
5. commit message 案
6. 次の推奨 1 手

---

## Safety Rules

不明点は推測実装しない。

仕様不足なら質問する。

大きな変更前は理由を書く。

---

## Git Rules

1 タスク 1commit 推奨。

commit message は短く明確に。

例:
feat: add todo input UI
feat: add localStorage persistence
fix: reset button behavior

---

## Deployment Rules

main 反映後、Vercel 確認を促すこと。
