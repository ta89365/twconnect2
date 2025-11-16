"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export type FeeRow = {
  category?: string | null;
  serviceName?: string | null;
  fee?: string | null;
  notes?: string | null;
};

export type SubsidiaryPlan = {
  plan?: string | null;
  services?: string[] | null;
  who?: string | null;
  feeJpy?: string | null;
  notes?: string | null;
};

export type FeeCommonRow = {
  name?: string | null;
  details?: string[] | string | null;
  idealFor?: string[] | string | null;
  feeJpy?: string | null;
  notes?: string | null;
};

type TableTitles = {
  subsidiary: string;
  branch: string;
  rep: string;
  accounting: string;
  valueAdded: string;
};

export type HeaderLabels = {
  plan: string;
  serviceDetails: string;
  idealFor: string;
  feeJpy: string;
  category: string;
  service: string;
  fee: string;
  notes: string;
};

type FeesSectionProps = {
  tableTitles: TableTitles;
  hdrSubsidiary: HeaderLabels;
  hdrBranch: HeaderLabels;
  hdrRep: HeaderLabels;
  hdrAccounting: HeaderLabels;
  hdrValueAdded: HeaderLabels;
  hdrFlat: HeaderLabels;
  widthsSubsidiary: number[];
  widthsCommon: number[];
  subsidiaryPlans: SubsidiaryPlan[];
  branchSupport: FeeCommonRow[];
  repOfficeSupport: FeeCommonRow[];
  accountingTaxSupport: FeeCommonRow[];
  valueAddedServices: FeeCommonRow[];
  feesFlat: FeeRow[];
};

/* ---------- 桌機用表格 ---------- */
function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
      {children}
    </div>
  );
}

function TheadBlue({ cols }: { cols: string[] }) {
  return (
    <thead className="bg-[#1C3D5A] text-white">
      <tr>
        {cols.map((c, i) => (
          <th key={i} className="text-left px-5 py-3 font-semibold">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableColgroup({ widthsPct }: { widthsPct: number[] }) {
  return (
    <colgroup>
      {widthsPct.map((w, i) => (
        <col key={i} style={{ width: `${w}%` }} />
      ))}
    </colgroup>
  );
}

/* ---------- helper ---------- */
function toArray(v?: string[] | string | null): string[] {
  if (Array.isArray(v)) return v.filter(Boolean) as string[];
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

function detailsArray(v?: string[] | string | null): string[] {
  return toArray(v);
}

/* ---------- 手機：適合對象方框 ---------- */
function MobileIdealBox({ label, text }: { label: string; text: string }) {
  const textRef = React.useRef<HTMLDivElement | null>(null);
  const [isRightMultiLine, setIsRightMultiLine] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const compute = () => {
      try {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = range.getClientRects();
        const next = rects.length >= 2;
        setIsRightMultiLine((prev) => (prev !== next ? next : prev));
      } catch {
        // ignore
      }
    };

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            requestAnimationFrame(compute);
          })
        : null;
    if (ro) ro.observe(el);

    const mo =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            requestAnimationFrame(compute);
          })
        : null;
    if (mo) mo.observe(el, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    const raf = requestAnimationFrame(compute);
    const fontLoaded = (document as any).fonts?.ready;
    let fontPromise: Promise<any> | undefined;
    if (fontLoaded) {
      fontPromise = fontLoaded.then(() =>
        requestAnimationFrame(compute)
      );
    }

    const onResize = () => requestAnimationFrame(compute);
    window.addEventListener("resize", onResize);

    return () => {
      if (ro) ro.disconnect();
      if (mo) mo.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [text]);

  const labelNode = React.useMemo(() => {
    if (!isRightMultiLine) return label;

    if (label.includes("適合")) {
      const idx = label.indexOf("適合") + 2;
      const top = label.slice(0, idx);
      const bottom = label.slice(idx) || "";
      return (
        <span className="inline-flex flex-col items-center leading-[1.1]">
          <span>{top}</span>
          <span>{bottom}</span>
        </span>
      );
    }

    const first = label.slice(0, 2);
    const second = label.slice(2);
    return (
      <span className="inline-flex flex-col items-center leading-[1.1]">
        <span>{first}</span>
        <span>{second}</span>
      </span>
    );
  }, [isRightMultiLine, label]);

  return (
    <div className="mt-3 flex rounded-md border border-[#1C3D5A]/30 bg-[#F5F9FC] overflow-hidden">
      <div className="w-14 flex-none px-2 py-2 text-[11px] font-medium text-[#1C3D5A] bg-[#E8F1FA] flex items-start justify-center whitespace-nowrap text-center">
        {labelNode}
      </div>
      <div
        ref={textRef}
        className="px-3 py-2 text-[12px] leading-5 text-neutral-800 break-words flex-1"
      >
        {text}
      </div>
    </div>
  );
}

/* ---------- 手機卡片 UI ---------- */

/** 子公司：方案 → 服務內容 → 對象 → 費用 */
function SubsidiaryMobileCard({
  row,
  hdr,
}: {
  row: SubsidiaryPlan;
  hdr: HeaderLabels;
}) {
  const services = row.services ?? [];
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
      <div className="font-semibold text-neutral-900">
        {row.plan ?? ""}
      </div>

      {services.length > 0 && (
        <ul className="mt-3 space-y-1">
          {services.map((s, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="shrink-0 mt-0.5 h-4 w-4 text-[#1C3D5A]" />
              <span className="text-neutral-900">{s}</span>
            </li>
          ))}
        </ul>
      )}

      {row.who && (
        <MobileIdealBox label={hdr.idealFor} text={row.who} />
      )}

      {row.feeJpy && (
        <div className="mt-2 inline-flex items-center rounded-md bg-[#EAF2FB] px-3 py-1 text-[11px] font-semibold text-[#1C3D5A]">
          {row.feeJpy}
        </div>
      )}

      {row.notes && (
        <p className="mt-2 text-xs text-neutral-600">
          {row.notes}
        </p>
      )}
    </div>
  );
}

/** 共用：服務名稱 → 服務內容 → 對象 → 費用 */
function CommonMobileCard({
  row,
  hdr,
}: {
  row: FeeCommonRow;
  hdr: HeaderLabels;
}) {
  const ideal = toArray(row.idealFor).join(" ／ ");
  const details = detailsArray(row.details);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
      <div className="font-semibold text-neutral-900">
        {row.name ?? ""}
      </div>

      {details.length > 0 && (
        <ul className="mt-3 space-y-1">
          {details.map((d, k) => (
            <li key={k} className="flex items-start gap-2">
              <CheckCircle2 className="shrink-0 mt-0.5 h-4 w-4 text-[#1C3D5A]" />
              <span className="break-words">{d}</span>
            </li>
          ))}
        </ul>
      )}

      {ideal && (
        <MobileIdealBox label={hdr.idealFor} text={ideal} />
      )}

      {row.feeJpy && (
        <div className="mt-2 inline-flex items-center rounded-md bg-[#EAF2FB] px-3 py-1 text-[11px] font-semibold text-[#1C3D5A]">
          {row.feeJpy}
        </div>
      )}

      {row.notes && (
        <p className="mt-2 text-xs text-neutral-600 break-words">
          {row.notes}
        </p>
      )}
    </div>
  );
}

/** flat 備援表：類別 → 服務 → 費用 → 備註 */
function FlatMobileCard({
  row,
  hdr,
}: {
  row: FeeRow;
  hdr: HeaderLabels;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
      <div className="font-semibold text-neutral-900">
        {row.category ?? ""}
      </div>

      {row.serviceName && (
        <p className="mt-2 text-neutral-900">
          {row.serviceName}
        </p>
      )}

      {row.fee && (
        <div className="mt-2 inline-flex items-center rounded-md bg-[#EAF2FB] px-3 py-1 text-[11px] font-semibold text-[#1C3D5A]">
          {row.fee}
        </div>
      )}

      {row.notes && (
        <p className="mt-2 text-xs text-neutral-600">
          <span className="opacity-80 mr-1">{hdr.notes}</span>
          {row.notes}
        </p>
      )}
    </div>
  );
}

/* ---------- 主元件 ---------- */

export default function FeesSection({
  tableTitles,
  hdrSubsidiary,
  hdrBranch,
  hdrRep,
  hdrAccounting,
  hdrValueAdded,
  hdrFlat,
  widthsSubsidiary,
  widthsCommon,
  subsidiaryPlans,
  branchSupport,
  repOfficeSupport,
  accountingTaxSupport,
  valueAddedServices,
  feesFlat,
}: FeesSectionProps) {
  const hasFeesNew =
    subsidiaryPlans.length +
      branchSupport.length +
      repOfficeSupport.length +
      accountingTaxSupport.length +
      valueAddedServices.length >
    0;

  return (
    <>
      {/* I. Subsidiary */}
      {subsidiaryPlans.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
            {tableTitles.subsidiary}
          </h3>

          {/* 手機：卡片 */}
          <div className="mt-4 space-y-4 md:hidden">
            {subsidiaryPlans.map((row, i) => (
              <SubsidiaryMobileCard
                key={`sp-m-${i}`}
                row={row}
                hdr={hdrSubsidiary}
              />
            ))}
          </div>

          {/* 桌機：表格 */}
          <div className="hidden md:block">
            <TableShell>
              <table className="min-w-full text-sm table-fixed">
                <TableColgroup widthsPct={widthsSubsidiary} />
                <thead className="bg-[#1C3D5A] text-white">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrSubsidiary.plan}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrSubsidiary.serviceDetails}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrSubsidiary.idealFor}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrSubsidiary.feeJpy}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subsidiaryPlans.map((row, i) => (
                    <tr
                      key={`sp-${i}`}
                      className="border-t border-neutral-200 align-top"
                    >
                      <td className="px-5 py-4 font-semibold text-neutral-900 break-words">
                        <div>{row.plan ?? ""}</div>
                      </td>
                      <td className="px-5 py-4">
                        <ul className="space-y-1">
                          {(row.services ?? []).map((s, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle2 className="shrink-0 mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                              <span className="text-neutral-900">
                                {s}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {row.notes && (
                          <p className="mt-2 text-xs text-neutral-600">
                            {row.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-neutral-800 break-words">
                        {row.who ?? ""}
                      </td>
                      <td className="px-5 py-4 font-semibold text-neutral-900 break-words">
                        {row.feeJpy ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          </div>
        </div>
      )}

      {/* II. Branch */}
      {branchSupport.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
            {tableTitles.branch}
          </h3>

          {/* 手機：卡片 */}
          <div className="mt-4 space-y-4 md:hidden">
            {branchSupport.map((row, i) => (
              <CommonMobileCard
                key={`br-m-${i}`}
                row={row}
                hdr={hdrBranch}
              />
            ))}
          </div>

          {/* 桌機：表格 */}
          <div className="hidden md:block">
            <TableShell>
              <table className="min-w-full text-sm table-fixed">
                <TableColgroup widthsPct={widthsCommon} />
                <TheadBlue
                  cols={[
                    hdrBranch.serviceDetails,
                    hdrBranch.idealFor,
                    hdrBranch.feeJpy,
                  ]}
                />
                <tbody>
                  {branchSupport.map((row, i) => {
                    const ideal = toArray(row.idealFor).join(" ／ ");
                    const details = detailsArray(row.details);
                    return (
                      <tr
                        key={`br-${i}`}
                        className="border-t border-neutral-200 align-top"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-neutral-900 break-words">
                            {row.name ?? ""}
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {details.map((d, k) => (
                              <li
                                key={k}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="shrink-0 mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                <span className="break-words">
                                  {d}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {row.notes && (
                            <p className="mt-2 text-xs text-neutral-600 break-words">
                              {row.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-neutral-800 break-words">
                          {ideal}
                        </td>
                        <td className="px-5 py-4 font-semibold text-neutral-900 break-words">
                          {row.feeJpy ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableShell>
          </div>
        </div>
      )}

      {/* III. Representative */}
      {repOfficeSupport.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
            {tableTitles.rep}
          </h3>

          <div className="mt-4 space-y-4 md:hidden">
            {repOfficeSupport.map((row, i) => (
              <CommonMobileCard
                key={`ro-m-${i}`}
                row={row}
                hdr={hdrRep}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <TableShell>
              <table className="min-w-full text-sm table-fixed">
                <TableColgroup widthsPct={widthsCommon} />
                <TheadBlue
                  cols={[
                    hdrRep.serviceDetails,
                    hdrRep.idealFor,
                    hdrRep.feeJpy,
                  ]}
                />
                <tbody>
                  {repOfficeSupport.map((row, i) => {
                    const ideal = toArray(row.idealFor).join(" ／ ");
                    const details = detailsArray(row.details);
                    return (
                      <tr
                        key={`ro-${i}`}
                        className="border-t border-neutral-200 align-top"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-neutral-900 break-words">
                            {row.name ?? ""}
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {details.map((d, k) => (
                              <li
                                key={k}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="shrink-0 mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                <span className="break-words">
                                  {d}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {row.notes && (
                            <p className="mt-2 text-xs text-neutral-600 break-words">
                              {row.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-neutral-800 break-words">
                          {ideal}
                        </td>
                        <td className="px-5 py-4 font-semibold text-neutral-900 break-words">
                          {row.feeJpy ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableShell>
          </div>
        </div>
      )}

      {/* IV. Accounting & Tax */}
      {accountingTaxSupport.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
            {tableTitles.accounting}
          </h3>

          <div className="mt-4 space-y-4 md:hidden">
            {accountingTaxSupport.map((row, i) => (
              <CommonMobileCard
                key={`at-m-${i}`}
                row={row}
                hdr={hdrAccounting}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <TableShell>
              <table className="min-w-full text-sm table-fixed">
                <TableColgroup widthsPct={widthsCommon} />
                <TheadBlue
                  cols={[
                    hdrAccounting.serviceDetails,
                    hdrAccounting.idealFor,
                    hdrAccounting.feeJpy,
                  ]}
                />
                <tbody>
                  {accountingTaxSupport.map((row, i) => {
                    const ideal = toArray(row.idealFor).join(" ／ ");
                    const details = detailsArray(row.details);
                    return (
                      <tr
                        key={`at-${i}`}
                        className="border-t border-neutral-200 align-top"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-neutral-900 break-words">
                            {row.name ?? ""}
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {details.map((d, k) => (
                              <li
                                key={k}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="shrink-0 mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                <span className="break-words">
                                  {d}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {row.notes && (
                            <p className="mt-2 text-xs text-neutral-600 break-words">
                              {row.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-neutral-800 break-words">
                          {ideal}
                        </td>
                        <td className="px-5 py-4 font-semibold text-neutral-900 break-words">
                          {row.feeJpy ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableShell>
          </div>
        </div>
      )}

      {/* V. Value-Added */}
      {valueAddedServices.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg md:text-xl font-semibold text-neutral-900">
            {tableTitles.valueAdded}
          </h3>

          <div className="mt-4 space-y-4 md:hidden">
            {valueAddedServices.map((row, i) => (
              <CommonMobileCard
                key={`va-m-${i}`}
                row={row}
                hdr={hdrValueAdded}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <TableShell>
              <table className="min-w-full text-sm table-fixed">
                <TableColgroup widthsPct={widthsCommon} />
                <TheadBlue
                  cols={[
                    hdrValueAdded.serviceDetails,
                    hdrValueAdded.idealFor,
                    hdrValueAdded.feeJpy,
                  ]}
                />
                <tbody>
                  {valueAddedServices.map((row, i) => {
                    const ideal = toArray(row.idealFor).join(" ／ ");
                    const details = detailsArray(row.details);
                    return (
                      <tr
                        key={`va-${i}`}
                        className="border-t border-neutral-200 align-top"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-neutral-900 break-words">
                            {row.name ?? ""}
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {details.map((d, k) => (
                              <li
                                key={k}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="shrink-0 mt-0.5 h-4 w-4 text-[#1C3D5A]" />
                                <span className="break-words">
                                  {d}
                                </span>
                              </li>
                            ))}
                          </ul>
                          {row.notes && (
                            <p className="mt-2 text-xs text-neutral-600 break-words">
                              {row.notes}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-neutral-800 break-words">
                          {ideal}
                        </td>
                        <td className="px-5 py-4 font-semibold text-neutral-900 break-words">
                          {row.feeJpy ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TableShell>
          </div>
        </div>
      )}

      {/* 舊 flat fallback */}
      {!hasFeesNew && feesFlat.length > 0 && (
        <div className="mt-6">
          {/* 手機：卡片 */}
          <div className="space-y-4 md:hidden">
            {feesFlat.map((row, idx) => (
              <FlatMobileCard
                key={`fee-m-${idx}`}
                row={row}
                hdr={hdrFlat}
              />
            ))}
          </div>

          {/* 桌機：表格 */}
          <div className="hidden md:block">
            <TableShell>
              <table className="min-w-full text-sm">
                <thead className="bg-[#1C3D5A] text-white">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrFlat.category}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrFlat.service}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrFlat.fee}
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      {hdrFlat.notes}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feesFlat.map((row, idx) => (
                    <tr
                      key={`fee-${idx}`}
                      className="border-t border-neutral-200"
                    >
                      <td className="px-5 py-3">
                        {row.category ?? ""}
                      </td>
                      <td className="px-5 py-3">
                        {row.serviceName ?? ""}
                      </td>
                      <td className="px-5 py-3">
                        {row.fee ?? ""}
                      </td>
                      <td className="px-5 py-3 text-neutral-700">
                        {row.notes ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableShell>
          </div>
        </div>
      )}
    </>
  );
}
