# AI Infra 圖解學院

繁體中文互動教學網站：從 AI 供應鏈，走進晶圓製程與成本會計。

- [任務一：AI 基礎建設](https://chabon6.github.io/ai-infra-academy/)
- [任務二：台積電製程與成本](https://chabon6.github.io/ai-infra-academy/tsmc-cost/)

## 內容與互動

兩篇共 12 個可旋轉、縮放、點選及拆解的 3D 場景。部件按鈕提供鍵盤與 WebGL 不可用時的替代入口。模型是技術概念示意，不是實際產品比例、設備光路、廠房配置或生產配方。

**AI 基礎建設**：31 組名詞，涵蓋晶圓、N2、CoWoS、HBM、IC 載板、ABF、PCB、CCL、玻纖布、銅箔、鑽孔、Vera Rubin、機櫃、高速互連、光通訊、800V HVDC、供電及液冷。每組說明台積電與 NVIDIA 的角色、研究問題、常見誤解、台股領域代表和來源。另含 54V／800V 電流實驗與封裝結構互動。

**製程與成本**：62 個條目，涵蓋製程、原材料、化學品、設備、耗材、廠務、公用系統、人員，以及 CAPEX、CIP、折舊、成本池、BOM、routing、WIP、標準成本、正常產能、良率、委外及客供料等。成本模擬可調整產量、良率、固定及變動成本；交易情境展示成本流轉。

## 證據與限制

資料查閱日：2026-09-08。

1. **公司揭露**：台積電 2025 年報及公司技術資料。公開財務使用合併口徑，原表仟元換算為新台幣十億元。
2. **原廠技術**：NVIDIA、ASML、Lam Research、Merck、Entegris、KLA 等，以及台股公司公開產品資料。
3. **會計教學**：IFRS Foundation 概述、AASB 102 對應 IAS 2 的正常產能等原則。歸集及情境皆為教學推演，不冒充台積電內部科目或實際單片成本。

台積電年報的主要原料供應商以代號列示。代表公司依公開產品領域列舉，**不是特定平台／節點的已驗證供應商名單**。未將付費研究的搜尋摘要、未讀取報告或供應商自身毛利拼接為台積電成本占比。具體分錄須核對交易實質、合約及適用準則。

800V、Rubin 等具時效內容清楚標示官方發布日期與當時路線圖，不把計畫等同全面出貨。所有互動模擬數值為假設，不是投資建議或報價。

## 設計研究與套件

建立前參考 [Bruno Simon 的 3D 網站](https://bruno-simon.com/)、[Bartosz Ciechanowski 的 Mechanical Watch](https://ciechanow.ski/mechanical-watch/)、[Three.js examples](https://threejs.org/examples/) 與 [React Three Fiber 生態系](https://r3f.docs.pmnd.rs/)。採用自由旋轉、部件選取、拆解滑桿與同步文字的教學方式；未複製他人的素材、模型或版面。

實作使用 **Three.js 0.180.0 + OrbitControls**，隨站附帶固定版本與 MIT 授權，不依賴外部 CDN。原創幾何依教學對象生成，重複部件以 InstancedMesh 合批；限制像素倍率，畫面離開可視區時停止渲染。支援行動版、鍵盤、減少動態效果偏好與文字替代入口。

## 手機閱讀與操作

同一網址依螢幕與觸控能力調整，不需切換到另一個手機站。以 iPhone 直向閱讀為優先，並保留橫向安全邊界。

- 預設可直接滑過模型區域；點「操作 3D」後，單指旋轉、雙指縮放。點「完成操作」恢復滑頁。
- 手機點選部件會先開啟底部解說面板，再由面板深入下一層。可關閉後回到原本位置；不支援原生 dialog 的瀏覽器保留頁內解說。
- 主要按鈕與滑桿保留至少 44 CSS px 的觸控高度，搜尋與數值欄位使用 16px 字級。保留頁面放大能力。
- 成本假設可拖曳或輸入數值；編輯時上方保留每片存貨成本與每顆良品經濟成本的摘要，計算邊界與完整公式仍在結果區。
- 運用安全區域與動態視窗高度，降低瀏海、Home 指示條及 Safari 工具列遮擋的影響。

參考：[WebKit iPhone 安全區域](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)、[MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)、[原生 dialog](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)。

## 簡明語言編修

依 [ISO 24495-1:2023](https://www.iso.org/standard/78907.html) 的公開原則與 [International Plain Language Federation 說明](https://www.iplfederation.org/iso-standard/) 微調文案，讓目標讀者較容易找到、理解及運用需要的資訊。以部件用途開頭、縮寫加解釋、拆分長句，並保留來源、技術條件與會計適用限制。這是編輯原則的應用，不是 ISO 認證或完整符合性聲明。

## 結構與維護

- `dist/index.html`, `dist/data.js`, `dist/app.js`：任務一。
- `dist/tsmc-cost/`：任務二。
- `dist/scene.js`, `dist/cost-scenes.js`：共用 3D 場景與製程模型。
- `dist/mobile.css`, `dist/mobile.js`：兩篇共用的觸控、手機排版、部件面板與試算輸入。
- `dist/vendor/`：固定版本 Three.js。
- `scripts/validate.mjs`：資料、資產、公式及 3D 幾何檢查。

沒有編譯步驟、後端、追蹤碼或個人資料收集。以靜態 HTTP 伺服器提供 `dist/` 即可。ES modules 需要 HTTP／HTTPS，請勿直接以 `file://` 開 HTML。

```sh
npm test
python -m http.server 8000 --directory dist
```

## GitHub Pages

`.github/workflows/pages.yml` 在推送 `main` 或手動執行時驗證並部署 `dist/`。GitHub Pages 的發布來源需在 **Settings → Pages → Build and deployment → Source** 設為 **GitHub Actions**。如果新 repo 尚未啟用 Pages，先設定一次，再重跑 Publish AI Infra Academy 工作流程即可；後續推送自動更新。

來源連結維護在兩份 `data.js`，更新技術時應同步更新查閱日期、路線圖語氣與對應來源。網站文字與圖形均以教學用途為主；第三方商標與文件仍屬原權利人。
