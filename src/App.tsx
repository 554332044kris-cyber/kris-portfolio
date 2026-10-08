import { useEffect, useMemo, useRef, useState } from "react";
import rawCases from "./cases.json";

type CaseStudy = {
  id: string;
  n?: string;
  brand: string;
  date: string;
  title: string;
  desc: string;
  cats: string[];
  tags: string[];
  image?: string;
  status: string;
  role: string;
  brief: string;
  actions: [string, string][];
  result: string;
  note: string;
  sources: string[];
  gallery: [string, string][];
  gtm: string[];
  featured: boolean;
  contribution?: string;
  choice?: string;
  proof?: string;
  scope?: string;
  visual?: string;
  stats?: [string, string][];
  metricNote?: string;
  flow?: string[];
};

const cases = rawCases as CaseStudy[];
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

const filters = [
  ["featured", "精选 4 个"],
  ["all", "全部 12 个"],
  ["gtm", "产品 GTM"],
  ["brand", "品牌营销"],
  ["global", "海外品牌运营"],
  ["sales", "项目销售"],
  ["b2b", "B 端项目销售"],
];

const insightData = {
  yage: {
    tab: "雅格 · 月进线",
    title: "月进线，从 258 到 735",
    note: "2025 年 3—7 月 · 11 个账号 · 部门汇总",
    rows: [["3 月", 258], ["4 月", 364], ["5 月", 366], ["6 月", 464], ["7 月", 735]] as [string, number][],
    foot: "来源：雅格新媒体数据 3—7 月汇总统计，第 23 页。进线为部门统计，不代表个人成交或去重客户。",
  },
  sales: {
    tab: "礼应如此 · 私信计数",
    title: "内容触达，接上私信互动",
    note: "2026.04.01—06.23 · 19 个账户 · 团队投放汇总",
    rows: [["私信进线", 6622], ["私信开口", 4532]] as [string, number][],
    foot: "总消耗 ¥136,191.53；总消耗 ÷ 进线次数 ≈ ¥20.57/次。两项为平台事件计数，不作为独立客户转化漏斗；不等于有效线索、成交数或 CAC。来源：4—6.23 投流数据总结「聚光」表。",
  },
  projects: {
    tab: "个人 · 项目阶段",
    title: "27 条项目记录，各有推进阶段",
    note: "2026.08.03 · 谢园园个人交接明细 · 时点记录",
    rows: [["选品阶段", 14], ["寄样", 4], ["大货", 4], ["交付", 5]] as [string, number][],
    foot: "各阶段合计 27 条项目记录。不是 27 位独立客户，也不等于成交、验收或回款。来源：项目交接表「7W5项目明细」。",
  },
};

type InsightKey = keyof typeof insightData;

const demoScenes = [
  { image: "editorial-brand.jpg", tab: "使用场景", title: "先让用户看见自己的生活。", body: "以通勤、工作与差旅为内容场景，将产品放入真实任务，帮助用户理解何时使用、为何需要。", caption: "VH 品牌 Newsletter · 职场场景素材" },
  { image: "detail-storage.jpg", tab: "功能表达", title: "把功能，翻译成使用利益。", body: "用分区收纳、工作物品整理与便携场景解释产品价值，让功能信息成为可理解、可比较的选择理由。", caption: "VH 产品资料 · 收纳与功能沟通" },
  { image: "zalando-editorial.jpg", tab: "渠道内容", title: "同一个卖点，适配不同触点。", body: "把产品信息组织为品牌手册、Newsletter 和渠道广告提案，让表达与展示位置相匹配。", caption: "Zalando 原广告提案 · 非投后业绩展示" },
];

const planData = [
  { tab: "01 · 验证表达", phase: "0—30 天 · Message", title: "先验证购买理由。", body: "聚焦一个市场、一类首批客户和一个高频任务。梳理替代方案、产品承诺与证据，将卖点变成可访谈、可测试的表达。", items: ["产出：定位假设、首批客户画像、购买理由与证据清单。", "验证：访谈、内容或落地页测试；先定义通过标准。", "决策：用户是否理解，并愿意采取下一步行动？"] },
  { tab: "02 · 验证渠道", phase: "31—60 天 · Channel", title: "再验证触达路径。", body: "在明确受众与表达后，小范围测试内容、红人或业务开发渠道；使用一致的记录口径，比较有效需求，而非仅看点击或互动。", items: ["产出：渠道测试表、内容 Brief、素材与跟进记录。", "验证：有效线索、询盘质量、销售承接与成本。", "决策：哪条渠道能持续带来团队可承接的真实需求？"] },
  { tab: "03 · 验证商业", phase: "61—90 天 · Commercial", title: "最后验证商业成立。", body: "根据业务类型追踪首批订单、试点或项目推进，同时核对履约成本、退款与支持负担，再决定扩大、调整或停止。", items: ["产出：商业验证复盘、风险清单与后续投入建议。", "验证：收入、毛利与履约；数据缺失时不计算 CAC 或 ROI。", "决策：扩大 Scale / 调整 Pivot / 停止 Stop。"] },
];

const experiences = [
  ["2026.03 — 2026.08", "礼应如此", "销售主管", "14 个矩阵账号的获客运营与 16 人销售团队管理。"],
  ["2025.10 — 2026.02", "跨境电商服务公司", "海外交付经理", "海外社媒运营、KA 客户协同与 40 人交付团队管理。"],
  ["2025.03 — 2025.09", "福州雅格贸易", "新媒体经理", "新媒体团队从 0 到 1，连接矩阵内容、B 端获客与项目跟进。"],
  ["2024.10 — 2025.01", "厦门极地薄荷", "品牌中心 · 品牌总", "品牌视觉升级、Shopify 独立站与小红书内容运营。"],
  ["2023.04 — 2024.10", "厦门柏倍德集团 / VH", "品牌经理", "Victoria Hyde 品牌内容、国内外社媒与跨渠道推广。"],
  ["2020.12 — 2023.02", "天下秀 IMS", "产品 GTM", "红人电商、品牌孵化与供应链产品营销。"],
  ["2018.10 — 2020.11", "新榜", "高级客户经理 SAM", "企业品牌 PR、内容营销全案与跨平台媒介合作。"],
  ["2016.12 — 2018.10", "微播易", "新媒体经理", "品牌商务、新媒体运营、栏目策划与活动执行。"],
];

function Media({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className={`media-fallback ${className}`} role="img" aria-label={`${alt}（素材待补传）`}><span>PROJECT VISUAL</span><strong>{alt}</strong><small>原始图片素材待补传</small></div>;
  return <img className={className} src={asset(src)} alt={alt} loading="lazy" draggable={false} onError={() => setFailed(true)} />;
}

function CaseVisual({ study }: { study: CaseStudy }) {
  if (study.image) return <Media src={study.image} alt={`${study.title}项目素材`} />;
  if (study.id === "sales-system") return <div className="metric-visual"><span>FROM ATTENTION TO OPPORTUNITY</span><strong>6,622</strong><b>团队私信进线次数</b><small>2026.04.01—06.23 · 19 个账户汇总</small></div>;
  if (study.id === "yage") return <div className="metric-visual"><span>CONTENT TO BUSINESS</span><strong>258—735</strong><b>矩阵账号月进线</b><small>2025.03—07 · 11 个账号 · 部门汇总</small></div>;
  if (study.stats?.length) return <div className="metric-visual"><span>{study.brand}</span><strong>{study.stats[0][0]}</strong><b>{study.stats[0][1]}</b><small>{study.tags.join(" · ")}</small></div>;
  return <div className="metric-visual"><span>{study.brand}</span><strong>{study.n ?? "CASE"}</strong><b>{study.tags.join(" · ")}</b><small>{study.date}</small></div>;
}

function App() {
  const [filter, setFilter] = useState("featured");
  const [selected, setSelected] = useState<CaseStudy | null>(null);
  const [lightbox, setLightbox] = useState<[string, string] | null>(null);
  const [insight, setInsight] = useState<InsightKey>("yage");
  const [scene, setScene] = useState(0);
  const [plan, setPlan] = useState(0);
  const openerRef = useRef<HTMLElement | null>(null);
  const lightboxOpenerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);

  const visibleCases = useMemo(() => cases.filter((item) => filter === "featured" ? item.featured : filter === "all" || item.cats.includes(filter)), [filter]);
  const currentInsight = insightData[insight];
  const maxInsight = Math.max(...currentInsight.rows.map((row) => row[1]));

  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();
    for (const name of ["copy", "cut", "contextmenu", "dragstart"]) document.addEventListener(name, prevent);
    return () => { for (const name of ["copy", "cut", "contextmenu", "dragstart"]) document.removeEventListener(name, prevent); };
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.body.classList.add("modal-open");
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !lightbox) setSelected(null); };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.classList.remove("modal-open"); };
  }, [selected, lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    lightboxCloseRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openCase = (study: CaseStudy, element: HTMLElement) => { openerRef.current = element; setSelected(study); };
  const closeCase = () => { setSelected(null); window.setTimeout(() => openerRef.current?.focus(), 0); };
  const openImage = (image: [string, string], element: HTMLElement) => { lightboxOpenerRef.current = element; setLightbox(image); };
  const closeImage = () => { setLightbox(null); window.setTimeout(() => lightboxOpenerRef.current?.focus(), 0); };

  return <>
    <a className="skip-link" href="#work">跳至案例</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Kris 首页">KRIS.</a>
      <nav aria-label="主导航"><a href="#work">案例</a><a href="#gtm">GTM</a><a href="#about">经历</a><a className="nav-cta" href="#contact">联系我</a></nav>
    </header>

    <main id="top">
      <section className="hero wrap">
        <p className="eyebrow">KRIS 谢园园 · BRAND MARKETING / GLOBAL OPERATIONS</p>
        <h1>把产品价值，<br/><em>带进内容与市场。</em></h1>
        <p className="hero-intro">品牌营销与海外运营是我的主线。<br/>从产品表达、内容执行，到有效商机与项目交付。</p>
        <div className="hero-actions"><a className="button dark" href="#work">查看精选案例</a><a className="text-link" href={asset("Kris-Resume.pdf")} download>下载个人简历 <span>↗</span></a></div>
        <div className="hero-note"><span>主要求职方向</span><strong>品牌营销 / 海外品牌运营</strong><span>延伸能力</span><strong>B 端获客 / 项目推进</strong></div>
      </section>

      <section className="proof-grid wrap" aria-label="核心能力与项目证据">
        <article><span>01 / 产品表达</span><h2>把功能讲成<br/>购买理由</h2><p>VH 品牌资料与 AiMoola 场景内容，从 Brief、选题到渠道物料。</p></article>
        <article><span>02 / 内容获客</span><h2>6,622<small> 次</small><br/>团队私信进线</h2><p>2026.04.01—06.23 · 19 个账户团队汇总 · 平台事件计数，非成交数。</p></article>
        <article><span>03 / 项目推进</span><h2>27<small> 条</small><br/>个人项目记录</h2><p>2026.08.03 个人交接明细 · 阶段时点记录，其中 5 条标注交付。</p></article>
      </section>

      <section className="section wrap" id="work">
        <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>项目事实，<br/>比形容词更重要。</h2></div><p>产品表达 → 海外内容 → 矩阵获客 → 项目推进<br/>先看个人职责，再看行动与结果。</p></div>
        <div className="filters" aria-label="按岗位方向筛选案例">{filters.map(([key, label]) => <button key={key} className={filter === key ? "active" : ""} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div>
        <p className="filter-count" aria-live="polite">当前显示 {visibleCases.length} 个案例</p>
        <div className="case-grid">{visibleCases.map((study) => <article className="case-card" key={study.id}>
          <button onClick={(event) => openCase(study, event.currentTarget)} aria-label={`查看案例：${study.title}`}>
            <div className="case-cover"><CaseVisual study={study}/><span className="status">{study.status}</span></div>
            <div className="case-copy"><p>{study.brand} · {study.date}</p><h3>{study.title}</h3><div>{study.desc}</div>{study.proof && <aside><strong>{study.proof}</strong><small>{study.scope}</small></aside>}<footer><span>{study.tags.join(" · ")}</span><b>阅读案例 ＋</b></footer></div>
          </button>
        </article>)}</div>
      </section>

      <section className="section insight-section" aria-labelledby="insight-title">
        <div className="wrap"><div className="section-heading"><div><p className="eyebrow">EVIDENCE / 数据与执行</p><h2 id="insight-title">看见数据，<br/>也看清口径。</h2></div><p>三组真实记录，分别观察渠道触达、私信互动与项目进展。</p></div>
          <div className="tab-row" role="group" aria-label="数据视图">{(Object.keys(insightData) as InsightKey[]).map((key) => <button key={key} className={insight === key ? "active" : ""} aria-pressed={insight === key} onClick={() => setInsight(key)}>{insightData[key].tab}</button>)}</div>
          <div className="chart-panel"><div className="chart-heading"><div><span>当前视图</span><h3>{currentInsight.title}</h3></div><p>{currentInsight.note}</p></div><ul>{currentInsight.rows.map(([label, value]) => <li key={label}><span>{label}</span><div className="bar-track" aria-hidden="true"><i style={{width: `${value / maxInsight * 100}%`}}/></div><strong>{value.toLocaleString("zh-CN")}</strong></li>)}</ul><p className="chart-foot">{currentInsight.foot}</p></div>
        </div>
      </section>

      <section className="section wrap demo-section" aria-labelledby="demo-title">
        <div className="section-heading"><div><p className="eyebrow">PRODUCT STORY / VH 场景演示</p><h2 id="demo-title">从产品功能，<br/>走进使用场景。</h2></div><p>作品集展示交互，使用团队原始项目素材。<br/>非原项目已有 App 功能，也不是 A/B 测试结果。</p></div>
        <div className="demo-grid"><div className="demo-media"><Media src={demoScenes[scene].image} alt={demoScenes[scene].caption}/></div><div className="demo-copy"><div className="tab-row compact">{demoScenes.map((item, index) => <button key={item.tab} className={scene === index ? "active" : ""} aria-pressed={scene === index} onClick={() => setScene(index)}>{item.tab}</button>)}</div><p className="kicker">0{scene + 1} / PRODUCT COMMUNICATION</p><h3>{demoScenes[scene].title}</h3><p>{demoScenes[scene].body}</p><small>{demoScenes[scene].caption} · 团队原始素材</small></div></div>
      </section>

      <section className="section gtm-section" id="gtm"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">BRAND × PRODUCT × GO-TO-MARKET</p><h2>先找到购买理由。<br/>再找到增长路径。</h2></div><p>从项目经验提炼的工作框架，<br/>不是已完成实验。</p></div>
        <div className="gtm-cards"><article><span>01 / POSITIONING</span><h3>为什么选这个产品？</h3><p>从用户任务与替代方案出发，把功能转为使用价值，用产品证据支撑品牌承诺。</p></article><article><span>02 / FIRST CUSTOMERS</span><h3>谁会先买，为什么？</h3><p>聚焦一类可触达、可服务的首批客户，识别触发场景、决策障碍与购买理由。</p></article><article><span>03 / VALIDATION</span><h3>什么能证明有效？</h3><p>从表达测试、渠道验证到订单与交付；用有效需求和商业结果判断下一步投入。</p></article></div>
        <div className="plan"><div className="plan-top"><h3>我的 90 天 GTM 验证思路</h3><p>将附件方法与过往经验结合的工作框架，非历史项目已完成的 90 天实验。具体目标与判断标准需根据产品、市场和资源确定。</p></div><div className="tab-row compact">{planData.map((item, index) => <button key={item.tab} className={plan === index ? "active" : ""} aria-pressed={plan === index} onClick={() => setPlan(index)}>{item.tab}</button>)}</div><div className="plan-panel"><span>{planData[plan].phase}</span><h3>{planData[plan].title}</h3><p>{planData[plan].body}</p><ul>{planData[plan].items.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
      </div></section>

      <section className="section wrap about-section" id="about"><div className="about-intro"><p className="eyebrow">03 / ABOUT KRIS</p><h2>在品牌与生意之间，<br/>把事情推进一步。</h2><p>从内容营销与媒介合作，走到品牌端的内容建设、海外交付，再到 B 端获客与销售管理。我的工作始终围绕一件事：让表达有依据，让协作有推进，让结果可复盘。</p><div className="profile"><Media src="kris.png" alt="Kris 谢园园个人照片"/><div><strong>Kris 谢园园</strong><span>商务英语本科 · 厦门理工学院<br/>中文 / 商务英语</span></div></div></div><div className="timeline">{experiences.map(([date, company, role, text], index) => <article key={`${company}-${date}`}><span>{date}</span><h3>{company}</h3><strong>{role}</strong><p>{text}</p>{index === 4 && <i>北京阶段 · 2016—2023</i>}</article>)}<small>履历与岗位信息据 2026 年 9 月版个人简历整理。</small></div></section>

      <section className="section contact-section" id="contact"><div className="wrap contact-grid"><div><p className="eyebrow">04 / LET’S CONNECT</p><h2>寻找品牌营销与<br/><em>海外运营的新机会。</em></h2><p>擅长产品内容、渠道运营，以及营销与销售协同。</p></div><div className="contact-card"><a className="email" href="mailto:554332044kris@gmail.com">554332044kris@gmail.com</a><a href="tel:18059819013">电话 · 180 5981 9013</a><span>微信 · kristy110yuanyuan</span><div><a className="button light" href="mailto:554332044kris@gmail.com">发送邮件</a><a className="text-link light-text" href={asset("Kris-Resume.pdf")} download>下载简历 ↗</a></div></div></div></section>
    </main>

    <footer className="site-footer wrap"><strong>KRIS.</strong><span>谢园园 · Personal Portfolio</span><span>仅供求职交流 · 基础限制只能减少误复制，无法阻止截图或技术提取。</span></footer>

    {selected && <div className="modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeCase(); }}><section className="case-dialog" role="dialog" aria-modal="true" aria-labelledby="case-title"><button ref={closeRef} className="close" onClick={closeCase} aria-label="关闭案例">×</button><div className="dialog-inner"><p className="eyebrow">CASE {selected.n ?? "—"} / {selected.brand}</p><h2 id="case-title">{selected.title}</h2><div className="detail-meta"><span>{selected.date}</span><span>{selected.status}</span></div><p className="detail-role">{selected.role}</p>
      <section className="responsibility"><div><span>我的职责</span><p>{selected.contribution ?? selected.role}</p></div><div><span>关键工作选择</span><p>{selected.choice ?? selected.brief}</p></div></section>
      {selected.stats?.length && <section className="case-stats">{selected.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}{selected.metricNote && <p>{selected.metricNote}</p>}</section>}
      <section className="detail-block"><span>CONTEXT</span><h3>项目背景</h3><p>{selected.brief}</p></section>
      <section className="detail-block"><span>ACTION</span><h3>行动</h3><div className="actions">{selected.actions.map(([title, text], index) => <article key={title}><b>0{index + 1}</b><div><h4>{title}</h4><p>{text}</p></div></article>)}</div></section>
      <section className="result-block"><span>RESULT</span><h3>结果</h3><p>{selected.result}</p>{selected.scope && <small>{selected.scope}</small>}</section>
      {selected.gallery.length > 0 ? <section className="visuals"><div className="visuals-heading"><h3>项目视觉</h3><span>点击图片查看大图</span></div><div className="gallery">{selected.gallery.map((image, index) => <figure className={index === 0 ? "lead" : ""} key={image[0]}><button onClick={(event) => openImage(image, event.currentTarget)} aria-label={`查看大图：${image[1]}`}><Media src={image[0]} alt={image[1]}/><i>＋</i></button><figcaption>{image[1]}</figcaption></figure>)}</div></section> : <section className="visuals text-visual"><h3>项目视觉</h3><p>该案例在现有资料中以数据与文字记录为主，未另行补造项目图片。</p></section>}
      <details className="gtm-review"><summary>GTM 复盘：人群、渠道与验证</summary>{selected.gtm.map((text, index) => <div key={text}><b>{["01 / 为谁解决问题", "02 / 如何进入市场", "03 / 什么证明有效"][index]}</b><p>{text}</p></div>)}</details>
      <details className="sources"><summary>折叠资料来源</summary><p>{selected.note}</p><ul>{selected.sources.map((source) => <li key={source}>{source}</li>)}</ul></details>
      <a className="button dark" href="#contact" onClick={closeCase}>聊聊相关机会</a>
    </div></section></div>}

    {lightbox && <div className="lightbox" role="dialog" aria-modal="true" aria-label="案例图片预览" onMouseDown={(event) => { if (event.target === event.currentTarget) closeImage(); }}><button ref={lightboxCloseRef} onClick={closeImage} aria-label="关闭大图">×</button><figure><Media src={lightbox[0]} alt={lightbox[1]}/><figcaption>{lightbox[1]}</figcaption></figure></div>}
  </>;
}

export default App;
