"use client";

import { Check, ChevronRight } from "lucide-react";
import { AssetIcon } from "./Icons";
import type { Asset } from "@/data/mockData";

interface AssetOptionProps {
  asset: Asset;
  selected?: boolean;
  multiSelect?: boolean;
  onClick: () => void;
  showReason?: boolean;
}

export function AssetOption({ asset, selected, multiSelect, onClick, showReason = true }: AssetOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 h-8 text-sm text-left transition-colors rounded-sm cursor-pointer
        ${selected ? "bg-blue-50" : "hover:bg-gray-50"}
      `}
    >
      {multiSelect && (
        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0
          ${selected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
          {selected && <Check size={12} className="text-white" />}
        </div>
      )}
      {!multiSelect && (
        <div className="w-4 shrink-0 flex items-center justify-center">
          {selected && <Check size={14} className="text-blue-600" />}
        </div>
      )}
      <AssetIcon type={asset.type} />
      <span className="truncate font-medium text-gray-900">{asset.name}</span>
      <span className="text-gray-400 text-xs truncate shrink-[5]">{asset.path}</span>
      {showReason && asset.reason && (
        <span className="text-gray-400 text-xs truncate ml-auto shrink-0">{asset.reason}</span>
      )}
    </button>
  );
}

interface HierarchyOptionProps {
  name: string;
  type: "catalog" | "schema" | "folder" | "volume" | "directory";
  onClick: () => void;
  onSelect?: () => void;
  selected?: boolean;
  showSelectButton?: boolean;
  reason?: string;
}

export function HierarchyOption({ name, type, onClick, onSelect, selected, showSelectButton, reason }: HierarchyOptionProps) {
  return (
    <div className={`group w-full flex items-center gap-2 px-3 h-8 text-sm rounded-sm hover:bg-gray-50 ${selected ? "bg-blue-50" : ""}`}>
      <div className="w-4 shrink-0 flex items-center justify-center">
        {selected && <Check size={14} className="text-blue-600" />}
      </div>
      <button onClick={onClick} className="flex items-center gap-2 flex-1 min-w-0">
        <AssetIcon type={type} />
        <span className="truncate font-medium text-gray-900">{name}</span>
        {reason && <span className="text-gray-400 text-xs truncate">{reason}</span>}
      </button>
      {showSelectButton && (
        <button
          onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
          className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 font-medium px-2 py-0.5 rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all shrink-0"
        >
          Select
        </button>
      )}
      <button onClick={onClick} className="shrink-0">
        <ChevronRight size={14} className="text-gray-400" />
      </button>
    </div>
  );
}
