"use client";

import React, { useMemo, useState } from "react";
import { Building2, Landmark, Scale, BadgeCheck, Globe2, FileText, Calculator, Handshake, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Brand constants
const BRAND_BLUE = "#1C3D5A"; // HEX required

// --- Content ---------------------------------------------------------------
// Structured multilingual content based on the user's source text
// Languages: zh, jp, en

type Lang = "zh" | "jp" | "en";

type Challenge = {
  icon: keyof typeof iconMap;
  title: string;
  desc: string;
  tipLabel: string; // label like 重點建議 / ポイント / Tip
  tip: string;
};

type Feature = { icon?: string; text: string };

type PageBundle = {
  heroTitle: string;
  heroSubtitle: string;
  intro: string[]; // paragraphs
  challenges: Challenge[];
  conclusionTitle: string;
  conclusion: string[]; // paragraphs
  featuresTitle: string;
  features: Feature[];
  contactTitle: string;
  contactBullets: string[];
  linkedinLabel: string;
  lineLabel: string;
};

const iconMap = {
  "building-2": Building2,
  landmark: Landmark,
  scale: Scale,
  "badge-check": BadgeCheck,
  "globe-2": Globe2,
  "file-text": FileText,
  calculator: Calculator,
  handshake: Handshake,
  sparkles: Sparkles,
};

const CONTENT: Record<Lang, PageBundle> = {
  zh: {
    heroTitle:
      "🇹🇼 日本企業在台灣進出時最容易卡關的五個地方｜台灣設立公司與市場拓展指南",
    heroSubtitle: "公司設立、銀行開戶、稅務與勞動制度、商務文化一次看懂",
    intro: [
      "近年來，越來越多日本企業將「台灣進出」視為海外擴展的重要第一步。距離近、文化相近、商業環境穩定，加上政府積極吸引外資，讓台灣看似是一個「容易開始」的市場。",
      "然而，實際落地後，許多企業才發現：台灣雖然友善，但在公司設立、銀行開戶、稅務會計、勞動法規與商務文化上，都存在不少與日本不同的細節。這些差異若未事先理解與規劃，往往會讓整個進程延誤甚至卡關。",
      "本篇文章整理出日本企業在台灣設立公司與經營時最容易遇到的五個難點，希望幫助企業更順利地進入台灣市場。",
    ],
    challenges: [
      {
        icon: "building-2",
        title: "① 公司設立流程與組織型態選擇不明確",
        desc:
          "台灣的公司登記制度與日本不同。企業需在子公司、分公司、或代表處之間做出選擇，三者在法律責任、稅務處理與發票開立上差異極大。常見錯誤是以為代表處可營業，結果無法開立統一發票或簽署契約，只能重新登記。",
        tipLabel: "重點建議",
        tip: "事前根據實際業務模式、資金流與營業需求，確認最合適的設立方式。",
      },
      {
        icon: "landmark",
        title: "② 銀行開戶審查嚴格且標準不一致",
        desc:
          "外資企業在台灣開戶常遇到不同銀行與分行要求不一、代表人不在台須追加文件、審查時間過長、營運計畫書不被接受等問題。",
        tipLabel: "重點建議",
        tip: "事前了解各銀行外資開戶政策，準備中英對照文件、營運說明及公司背景資料，選擇熟悉外資業務的銀行。",
      },
      {
        icon: "calculator",
        title: "③ 稅務與會計制度差異造成誤解",
        desc:
          "台灣與日本在費用認列、折舊方式、源泉扣繳、電子發票制度等差異明顯。沿用日本會計邏輯容易出錯，可能導致補稅或罰款。台灣常用鼎新、正航、鉅茂等系統，或 Xero、QuickBooks Online 等，較符合在地需求。",
        tipLabel: "重點建議",
        tip: "導入符合台灣稅制的會計系統，並由熟悉雙語與跨國會計的顧問建立帳務流程，降低稅務風險。",
      },
      {
        icon: "badge-check",
        title: "④ 勞動制度與保險規定的不熟悉",
        desc:
          "台灣對勞工保護嚴格。聘僱人員需加入勞保與健保，並遵守《勞基法》關於工時、加班與資遣預告的規定，否則可能受罰或影響信用。",
        tipLabel: "重點建議",
        tip: "了解台灣勞動制度基本架構，或委託可日語溝通且熟悉制度的顧問協助。",
      },
      {
        icon: "handshake",
        title: "⑤ 商務文化與溝通習慣的差異",
        desc:
          "台日文化相近但商務節奏與溝通方式不同。台灣常先建立信任關係，再推進契約。即使語言無礙，也可能因文化細節誤解而受阻。",
        tipLabel: "重點建議",
        tip: "與熟悉兩地文化與商務禮儀的顧問合作，能更快適應在地節奏。",
      },
    ],
    conclusionTitle: "💬 結語｜跨國經營，是一段理解與信任的旅程",
    conclusion: [
      "海外拓展不只是文件流程，更是一場文化理解與信任建立的過程。每家企業的情況都不同，但共通點是需要有人真正理解你，並能在語言與制度之間架起橋樑。",
      "這也是我創立 Taiwan Connect 的原因。我們不追求誇大的承諾，只提供真實、透明、可執行的建議，陪你一步步踏實走進台灣市場。",
    ],
    featuresTitle: "🟢 Taiwan Connect 的優勢",
    features: [
      { icon: "💼", text: "一站式支援：公司設立、稅務顧問、簽證、人事制度全方位服務" },
      { icon: "🌐", text: "三語對應（日・英・中），跨文化溝通零障礙" },
      { icon: "🤝", text: "透明收費與持續追蹤，讓企業安心落地" },
      { icon: "💡", text: "專注日本企業與外資客戶的實務需求" },
    ],
    contactTitle: "📩 想了解更多台灣市場資訊？",
    contactBullets: [
      "👉 linkedin.com/company/twconnects",
      "💬 LINE 諮詢：@030qreji",
    ],
    linkedinLabel: "LinkedIn",
    lineLabel: "LINE",
  },
  jp: {
    heroTitle: "🇯🇵 日本企業が台湾進出でつまずきやすい5つのポイント",
    heroSubtitle: "― 台湾での会社設立・税務・文化理解ガイド ―",
    intro: [
      "近年、多くの日本企業が台湾進出を海外展開の第一歩として選んでいます。地理的にも文化的にも近く、ビジネス環境も安定しており、始めやすい市場と感じる企業も多いでしょう。",
      "しかし実際に会社設立や事業展開を進めると、銀行口座開設、会計・税務、労務管理、商習慣などで日本とは違う壁に直面するケースが少なくありません。",
      "本記事では、台湾進出で特につまずきやすい5つのポイントを整理しました。事前理解がスムーズな市場参入につながります。",
    ],
    challenges: [
      {
        icon: "building-2",
        title: "① 会社設立の形態選択があいまい",
        desc:
          "子会社・支店・駐在員事務所で法的責任や税務が大きく異なります。駐在員事務所では営業や請求書発行ができず、再登記が必要になるケースもあります。",
        tipLabel: "ポイント",
        tip: "ビジネスモデルと資金の流れを明確にし、最適な法人形態を選ぶことが第一歩です。",
      },
      {
        icon: "landmark",
        title: "② 銀行口座開設の審査が厳格で基準が統一されていない",
        desc:
          "銀行や支店によって求められる書類や審査期間が異なります。代表者が台湾在住でない場合、追加資料を求められることがあります。",
        tipLabel: "ポイント",
        tip: "各銀行の外資対応ポリシーを確認し、中英対照の事業計画書や会社概要を準備しておくとスムーズです。",
      },
      {
        icon: "calculator",
        title: "③ 税務・会計制度の違いによる混乱",
        desc:
          "費用計上、減価償却、源泉徴収、電子インボイスなどの基準が日本と異なります。台湾では鼎新・正航・鉅茂のほか Xero や QBO も広く使われています。",
        tipLabel: "ポイント",
        tip: "台湾税制に対応した会計ソフトを導入し、双方向でコミュニケーションできる税務顧問と連携しましょう。",
      },
      {
        icon: "badge-check",
        title: "④ 労働・社会保険制度への理解不足",
        desc:
          "採用時の労働保険・健康保険加入、労働時間や残業、退職通知など厳格な管理が求められます。違反は罰金や信用低下の恐れがあります。",
        tipLabel: "ポイント",
        tip: "労基法の基本を理解するか、日本語対応の現地コンサルタントに依頼することでリスクを減らせます。",
      },
      {
        icon: "handshake",
        title: "⑤ ビジネス文化とコミュニケーションの違い",
        desc:
          "台湾では契約よりも先に信頼関係を築く文化が根付いており、柔軟性と人とのつながりが重視されます。",
        tipLabel: "ポイント",
        tip: "両国文化を理解し橋渡しできる信頼できるパートナーを持つことが成功の鍵です。",
      },
    ],
    conclusionTitle: "💬 まとめ：国を越えた経営は「理解」と「信頼」の積み重ね",
    conclusion: [
      "海外進出は単なる制度対応ではなく、人と文化の理解から始まる旅です。制度と言語の両方を理解してくれる存在が不可欠です。",
      "私たち Taiwan Connect は誠実で実務的なサポートで、安心して次の一歩を踏み出せるよう伴走します。",
    ],
    featuresTitle: "🟢 Taiwan Connect の特徴",
    features: [
      { icon: "💼", text: "ワンストップ支援：会社設立・税務・ビザ・人事など総合サポート" },
      { icon: "🌐", text: "三言語対応（日・英・中）で文化・制度の違いを橋渡し" },
      { icon: "🤝", text: "透明な料金・丁寧なフォローアップで安心" },
      { icon: "💡", text: "日本企業・外資企業に特化した実務支援" },
    ],
    contactTitle: "📩 ご相談・お問い合わせ",
    contactBullets: [
      "👉 linkedin.com/company/twconnects",
      "💬 LINE公式：@030qreji",
    ],
    linkedinLabel: "LinkedIn",
    lineLabel: "LINE",
  },
  en: {
    heroTitle:
      "5 Common Pitfalls Japanese Companies Face When Expanding into Taiwan",
    heroSubtitle:
      "A Practical Guide to Company Setup, Tax, and Business Culture in Taiwan",
    intro: [
      "In recent years, many Japanese companies have chosen Taiwan as their first destination for overseas expansion due to proximity, cultural familiarity, and a stable business environment.",
      "Yet once the process begins, teams often face obstacles across registration, bank onboarding, accounting, taxation, labor rules, and communication.",
      "Here are five common pitfalls and practical pointers to help you move forward with confidence.",
    ],
    challenges: [
      {
        icon: "building-2",
        title: "① Unclear Choice of Legal Entity",
        desc:
          "Your entity type — subsidiary, branch, or representative office — drives legal and tax responsibilities. A frequent mistake is starting with a representative office that cannot issue invoices or sign contracts, which leads to re-registration.",
        tipLabel: "Tip",
        tip: "Clarify your model and cash flow before deciding the entity type to avoid rework.",
      },
      {
        icon: "landmark",
        title: "② Strict and Inconsistent Bank Account Screening",
        desc:
          "Criteria vary by bank and even by branch. If the legal representative does not reside in Taiwan, additional documents and long review times are common.",
        tipLabel: "Tip",
        tip: "Research policies for foreign-owned companies and prepare bilingual plans and profiles in advance.",
      },
      {
        icon: "calculator",
        title: "③ Confusion About Tax and Accounting Systems",
        desc:
          "Expense recognition, depreciation, withholding tax, and e-invoicing follow local standards. Local systems like Dingxin, Cheng-Hang, Jumo, or global tools like Xero and QBO align with Taiwan compliance.",
        tipLabel: "Tip",
        tip: "Adopt Taiwan-compliant software and work with bilingual advisors familiar with both sides.",
      },
      {
        icon: "badge-check",
        title: "④ Limited Understanding of Labor and Social Insurance",
        desc:
          "Employers must register for labor and health insurance and comply with the Labor Standards Act including overtime and termination rules.",
        tipLabel: "Tip",
        tip: "Learn the basics or retain a local consultant to minimize risk.",
      },
      {
        icon: "handshake",
        title: "⑤ Cultural and Communication Differences",
        desc:
          "In Taiwan, trust and personal relationships often precede contracts. Even with language fluency, cultural nuance can slow cooperation.",
        tipLabel: "Tip",
        tip: "Work with partners who understand both cultures and can bridge communication.",
      },
    ],
    conclusionTitle: "💬 Conclusion: Cross-Border Business Is Built on Understanding and Trust",
    conclusion: [
      "Expansion is not just paperwork. It is about people, culture, and connection. You need a partner who understands both the system and your perspective.",
      "Taiwan Connect focuses on sincere, transparent, and practical support so you can take each step with clarity and confidence.",
    ],
    featuresTitle: "🟢 Why Choose Taiwan Connect",
    features: [
      { icon: "💼", text: "One-stop support for company setup, taxation, visas, and HR" },
      { icon: "🌐", text: "Trilingual communication for smooth cultural and regulatory navigation" },
      { icon: "🤝", text: "Transparent pricing and ongoing follow-up" },
      { icon: "💡", text: "Specialized in Japanese and foreign businesses" },
    ],
    contactTitle: "📩 Learn more or start a conversation",
    contactBullets: [
      "👉 linkedin.com/company/twconnects",
      "💬 LINE (Japanese support): @030qreji",
    ],
    linkedinLabel: "LinkedIn",
    lineLabel: "LINE",
  },
};

// --- UI Helpers ------------------------------------------------------------

const LangToggle: React.FC<{ value: Lang; onChange: (l: Lang) => void }> = ({ value, onChange }) => {
  const btn = "px-4 py-2 rounded-xl text-sm font-medium transition-colors";
  return (
    <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-white/10 backdrop-blur">
      {(["zh", "jp", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          className={
            btn +
            (value === l
              ? " bg-white text-slate-900"
              : " text-white/90 hover:bg-white/20")
          }
          onClick={() => onChange(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className = "", children }) => (
  <div className={`rounded-2xl shadow-lg p-6 md:p-8 bg-white/10 border border-white/10 ${className}`}>
    {children}
  </div>
);

const FeaturePill: React.FC<{ icon?: string; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/10 border border-white/10">
    <span className="text-xl" aria-hidden>{icon ?? "•"}</span>
    <span className="leading-snug">{text}</span>
  </div>
);

// --- Page Component --------------------------------------------------------

export default function ClientChallengesPage() {
  const [lang, setLang] = useState<Lang>("zh");
  const data = CONTENT[lang];

  const IconGrid = useMemo(() => {
    return data.challenges.map((c, idx) => {
      const Icon = iconMap[c.icon];
      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: idx * 0.05 }}
        >
          <Card className="h-full">
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-2xl bg-white/15 p-3 border border-white/10">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-semibold">{c.title}</h3>
                <p className="text-white/95 leading-relaxed">{c.desc}</p>
                <div className="mt-2 rounded-xl bg-white/5 p-4 border border-white/10">
                  <p className="font-semibold mb-1">{c.tipLabel}</p>
                  <p className="text-white/95 leading-relaxed">{c.tip}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    });
  }, [data.challenges]);

  return (
    <div style={{ backgroundColor: BRAND_BLUE }} className="min-h-screen text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 md:pt-20 md:pb-12">
          <div className="flex items-start justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-4 md:space-y-5">
              <h1 className="text-2xl md:text-4xl font-bold leading-snug">{data.heroTitle}</h1>
              <p className="text-white/90 text-base md:text-lg">{data.heroSubtitle}</p>
            </motion.div>
            <LangToggle value={lang} onChange={setLang} />
          </div>
          <div className="mt-8 grid gap-4">
            {data.intro.map((p, i) => (
              <p className="text-white/95 leading-relaxed" key={i}>{p}</p>
            ))}
          </div>
        </div>
        {/* subtle gradient overlay for depth */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </section>

      {/* Challenges */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {IconGrid}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/0 via-white/25 to-white/0" />
      </section>

      {/* Conclusion */}
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <Card>
            <h2 className="text-xl md:text-2xl font-bold mb-4">{data.conclusionTitle}</h2>
            <div className="space-y-3">
              {data.conclusion.map((p, i) => (
                <p className="text-white/95 leading-relaxed" key={i}>{p}</p>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <h3 className="text-lg md:text-xl font-semibold mb-5">{data.featuresTitle}</h3>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {data.features.map((f, i) => (
              <FeaturePill key={i} icon={f.icon} text={f.text} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h4 className="text-lg md:text-xl font-semibold mb-2">{data.contactTitle}</h4>
                <ul className="list-disc list-inside space-y-1 text-white/95">
                  {data.contactBullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/twconnects"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold border border-white/10 hover:opacity-90"
                >
                  {data.linkedinLabel}
                </a>
                <a
                  href="https://line.me/R/ti/p/@030qreji"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20"
                >
                  {data.lineLabel}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
