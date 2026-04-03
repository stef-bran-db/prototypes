"use client";

import { useState, useMemo } from "react";
import { Search, RefreshCw, ChevronRight, X, ArrowUpDown, Filter } from "lucide-react";
import { AssetOption, HierarchyOption } from "./AssetOption";
import { AssetIcon } from "./Icons";
import type { Asset, AssetType, HierarchyNode } from "@/data/mockData";

type Section = "forYou" | "all" | string;
type SortMode = "relevance" | "name" | "popularity" | "recent";

interface QuickFilter {
  key: string;
  label: string;
  match: (asset: Asset) => boolean;
}

const quickFiltersForType: Record<string, QuickFilter[]> = {
  table: [
    { key: "recent", label: "Recently queried", match: (a) => /queried/i.test(a.reason ?? "") },
    { key: "popular", label: "Popular", match: (a) => /popular|teammates/i.test(a.reason ?? "") },
    { key: "owned", label: "Owned by me", match: (a) => /finance|product/i.test(a.path) },
    { key: "frequent", label: "Frequently queried", match: (a) => /times this week|teammates/i.test(a.reason ?? "") },
  ],
  view: [
    { key: "recent", label: "Recently queried", match: (a) => /queried/i.test(a.reason ?? "") },
    { key: "popular", label: "Popular", match: (a) => /popular|teammates/i.test(a.reason ?? "") },
    { key: "owned", label: "Owned by me", match: (a) => /finance|product/i.test(a.path) },
  ],
  notebook: [
    { key: "recent", label: "Recently opened", match: (a) => /opened/i.test(a.reason ?? "") },
    { key: "favorited", label: "Favorited", match: (a) => /favorited/i.test(a.reason ?? "") },
    { key: "popular", label: "Popular", match: (a) => /popular/i.test(a.reason ?? "") },
    { key: "owned", label: "Owned by me", match: (a) => /users\/stef/i.test(a.path) },
  ],
  file: [
    { key: "recent", label: "Recently opened", match: (a) => /opened/i.test(a.reason ?? "") },
    { key: "popular", label: "Popular", match: (a) => /popular/i.test(a.reason ?? "") },
    { key: "owned", label: "Owned by me", match: (a) => /users\/stef/i.test(a.path) },
  ],
  query: [
    { key: "recent", label: "Recently run", match: (a) => /run/i.test(a.reason ?? "") },
    { key: "popular", label: "Popular", match: (a) => /popular/i.test(a.reason ?? "") },
    { key: "scheduled", label: "Scheduled", match: (a) => /scheduled/i.test(a.reason ?? "") },
  ],
  alert: [
    { key: "recent", label: "Recently triggered", match: (a) => /triggered/i.test(a.reason ?? "") },
    { key: "popular", label: "Popular", match: (a) => /popular/i.test(a.reason ?? "") },
  ],
  dashboard: [
    { key: "references", label: "References Finance tables", match: (a) => /references/i.test(a.reason ?? "") },
    { key: "popular", label: "Popular", match: (a) => /popular/i.test(a.reason ?? "") },
  ],
  model: [
    { key: "trained", label: "Trained on Finance data", match: (a) => /trained/i.test(a.reason ?? "") },
    { key: "monitors", label: "Monitors Finance data", match: (a) => /monitors/i.test(a.reason ?? "") },
  ],
};

interface AssetSelectorProps {
  title: string;
  forYouAssets: Asset[];
  forYouLabel?: string;
  hierarchy: HierarchyNode[];
  hierarchies?: Record<string, HierarchyNode[]>;
  typeFilterAssets?: Record<string, Asset[]>;
  selectableTypes: AssetType[];
  multiSelect?: boolean;
  volumeMode?: boolean;
  onConfirm?: (selected: Asset[]) => void;
  onCancel?: () => void;
}

const typeLabels: Record<string, string> = {
  table: "Tables",
  view: "Views",
  dashboard: "Dashboards",
  model: "Models",
  notebook: "Notebooks",
  volume: "Volumes",
  file: "Files",
  query: "Queries",
  alert: "Alerts",
};

const sortLabels: Record<SortMode, string> = {
  relevance: "Relevance",
  name: "Name",
  popularity: "Popularity",
  recent: "Recently modified",
};

function sortAssets(assets: Asset[], mode: SortMode): Asset[] {
  if (mode === "relevance") return assets;
  if (mode === "name") return [...assets].sort((a, b) => a.name.localeCompare(b.name));
  if (mode === "popularity") return [...assets].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  if (mode === "recent") return [...assets].reverse();
  return assets;
}

export function AssetSelector({
  title,
  forYouAssets,
  forYouLabel,
  hierarchy,
  hierarchies,
  typeFilterAssets,
  selectableTypes,
  multiSelect = false,
  volumeMode = false,
  onConfirm,
  onCancel,
}: AssetSelectorProps) {
  const [activeSection, setActiveSection] = useState<Section>("forYou");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [hierarchyPath, setHierarchyPath] = useState<HierarchyNode[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<string>>(new Set());

  const isSearching = searchQuery.length > 0;
  const isHierarchyView = activeSection === "all" || activeSection.startsWith("hierarchy:");
  const isTypeView = activeSection !== "forYou" && !isHierarchyView;

  const hierarchyPills = useMemo(() => {
    if (hierarchies) {
      return Object.keys(hierarchies).map((key) => ({
        key: `hierarchy:${key}` as Section,
        label: key,
      }));
    }
    return [{ key: "all" as Section, label: "All" }];
  }, [hierarchies]);

  const activeHierarchy = useMemo(() => {
    if (activeSection.startsWith("hierarchy:")) {
      const key = activeSection.replace("hierarchy:", "");
      return hierarchies?.[key] ?? hierarchy;
    }
    return hierarchy;
  }, [activeSection, hierarchies, hierarchy]);

  const availableQuickFilters = useMemo(() => {
    if (!isTypeView) return [];
    return quickFiltersForType[activeSection] ?? [];
  }, [activeSection, isTypeView]);

  const currentHierarchyChildren = useMemo(() => {
    if (hierarchyPath.length === 0) return activeHierarchy;
    const current = hierarchyPath[hierarchyPath.length - 1];
    return current.children ?? [];
  }, [hierarchy, hierarchyPath]);

  const allSearchableAssets = useMemo(() => {
    const assets: Asset[] = [...forYouAssets];
    if (typeFilterAssets) {
      Object.values(typeFilterAssets).forEach((a) => {
        a.forEach((asset) => {
          if (!assets.find((e) => e.id === asset.id)) assets.push(asset);
        });
      });
    }
    return assets;
  }, [forYouAssets, typeFilterAssets]);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = searchQuery.toLowerCase();
    let pool = allSearchableAssets;

    if (isTypeView && typeFilterAssets?.[activeSection]) {
      pool = typeFilterAssets[activeSection];
      if (activeQuickFilters.size > 0) {
        const filters = (quickFiltersForType[activeSection] ?? []).filter((f) => activeQuickFilters.has(f.key));
        pool = pool.filter((a) => filters.some((f) => f.match(a)));
      }
    }

    return pool.filter(
      (a) => a.name.toLowerCase().includes(q) || a.path.toLowerCase().includes(q)
    );
  }, [searchQuery, isSearching, allSearchableAssets, activeSection, isTypeView, typeFilterAssets, activeQuickFilters]);

  const toggleAsset = (asset: Asset) => {
    if (multiSelect) {
      setSelectedAssets((prev) => {
        const exists = prev.find((a) => a.id === asset.id);
        if (exists) return prev.filter((a) => a.id !== asset.id);
        return [...prev, asset];
      });
    } else {
      setSelectedAssets([asset]);
    }
  };

  const isSelected = (id: string) => selectedAssets.some((a) => a.id === id);

  const toggleQuickFilter = (key: string) => {
    setActiveQuickFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const typePills = useMemo(() => {
    if (!typeFilterAssets) return [];
    const items: { key: Section; label: string }[] = [];
    selectableTypes.forEach((t) => {
      if (typeFilterAssets[t]) {
        items.push({ key: t, label: typeLabels[t] || t });
      }
    });
    return items;
  }, [selectableTypes, typeFilterAssets]);

  const navigateHierarchy = (node: HierarchyNode) => {
    if (node.children && node.children.length > 0) {
      setHierarchyPath((prev) => [...prev, node]);
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    setHierarchyPath((prev) => prev.slice(0, index));
  };

  const filteredTypeAssets = useMemo(() => {
    if (!isTypeView || !typeFilterAssets?.[activeSection]) return [];
    let assets = typeFilterAssets[activeSection];
    if (activeQuickFilters.size > 0) {
      const filters = availableQuickFilters.filter((f) => activeQuickFilters.has(f.key));
      assets = assets.filter((a) => filters.some((f) => f.match(a)));
    }
    return sortAssets(assets, sortMode);
  }, [isTypeView, typeFilterAssets, activeSection, activeQuickFilters, availableQuickFilters, sortMode]);

  const renderContent = () => {
    if (isSearching) {
      return (
        <div className="flex-1 overflow-auto">
          <div className="px-3 py-1.5 text-xs text-gray-500">
            {searchResults.length} results
            {isTypeView && (
              <> in <span className="font-medium">{typeLabels[activeSection] || activeSection}</span></>
            )}
          </div>
          {searchResults.map((asset) => (
            <AssetOption
              key={asset.id}
              asset={asset}
              selected={isSelected(asset.id)}
              multiSelect={multiSelect}
              onClick={() => toggleAsset(asset)}
            />
          ))}
          {searchResults.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      );
    }

    if (activeSection === "forYou") {
      return (
        <div className="flex-1 overflow-auto">
          <div className="px-3 py-1.5 text-xs text-gray-500 font-medium">
            {forYouLabel || "Recommended"} ({forYouAssets.length})
          </div>
          {forYouAssets.map((asset) => {
            if (volumeMode && (asset.type === "volume" || asset.type === "directory")) {
              return (
                <div key={asset.id} className="flex items-center">
                  <HierarchyOption
                    name={asset.name}
                    type={asset.type}
                    onClick={() => {
                      setActiveSection("all");
                      setHierarchyPath([]);
                    }}
                    onSelect={() => toggleAsset(asset)}
                    selected={isSelected(asset.id)}
                    showSelectButton
                    reason={asset.reason}
                  />
                </div>
              );
            }
            return (
              <AssetOption
                key={asset.id}
                asset={asset}
                selected={isSelected(asset.id)}
                multiSelect={multiSelect}
                onClick={() => toggleAsset(asset)}
              />
            );
          })}
        </div>
      );
    }

    if (isHierarchyView) {
      return (
        <div className="flex-1 overflow-auto">
          <div className="px-3 py-1 flex items-center gap-1 text-xs text-gray-500">
            <button onClick={() => navigateToBreadcrumb(0)} className="hover:text-blue-600 hover:underline">
              All catalogs
            </button>
            {hierarchyPath.map((node, i) => (
              <span key={node.id} className="flex items-center gap-1">
                <ChevronRight size={12} />
                <button onClick={() => navigateToBreadcrumb(i + 1)} className="hover:text-blue-600 hover:underline">
                  {node.name}
                </button>
              </span>
            ))}
          </div>
          {currentHierarchyChildren.map((node) => {
            if (node.selectable) {
              return (
                <AssetOption
                  key={node.id}
                  asset={{
                    id: node.id,
                    name: node.name,
                    type: node.type,
                    path: hierarchyPath.map((n) => n.name).join("."),
                  }}
                  selected={isSelected(node.id)}
                  multiSelect={multiSelect}
                  onClick={() =>
                    toggleAsset({
                      id: node.id,
                      name: node.name,
                      type: node.type,
                      path: hierarchyPath.map((n) => n.name).join("."),
                    })
                  }
                  showReason={false}
                />
              );
            }
            if (volumeMode && (node.type === "volume" || node.type === "directory")) {
              return (
                <HierarchyOption
                  key={node.id}
                  name={node.name}
                  type={node.type}
                  onClick={() => navigateHierarchy(node)}
                  onSelect={() =>
                    toggleAsset({
                      id: node.id,
                      name: node.name,
                      type: node.type,
                      path: hierarchyPath.map((n) => n.name).join("/"),
                    })
                  }
                  selected={isSelected(node.id)}
                  showSelectButton
                />
              );
            }
            return (
              <HierarchyOption
                key={node.id}
                name={node.name}
                type={node.type as "catalog" | "schema" | "folder" | "volume" | "directory"}
                onClick={() => navigateHierarchy(node)}
              />
            );
          })}
        </div>
      );
    }

    if (typeFilterAssets?.[activeSection]) {
      return (
        <div className="flex-1 overflow-auto">
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              {filteredTypeAssets.length} {typeLabels[activeSection]?.toLowerCase() || activeSection}
              {activeQuickFilters.size > 0 && (
                <span className="text-gray-400 ml-1">
                  (filtered from {typeFilterAssets[activeSection].length})
                </span>
              )}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-100"
              >
                <ArrowUpDown size={12} />
                {sortLabels[sortMode]}
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 py-1 min-w-[140px]">
                  {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setSortMode(mode); setShowSortMenu(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${sortMode === mode ? "text-blue-600 font-medium" : "text-gray-600"}`}
                    >
                      {sortLabels[mode]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {filteredTypeAssets.map((asset) => (
            <AssetOption
              key={asset.id}
              asset={asset}
              selected={isSelected(asset.id)}
              multiSelect={multiSelect}
              onClick={() => toggleAsset(asset)}
              showReason={false}
            />
          ))}
          {filteredTypeAssets.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-gray-400">
              No results match the active filters
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const renderPillBar = () => {
    const allCorePills = [
      { key: "forYou" as Section, label: "For you" },
      ...hierarchyPills,
    ];

    return (
      <div className="flex items-center flex-nowrap overflow-x-auto scrollbar-hide h-[24px]" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {/* For You pill — collapses when a type is selected */}
        <div
          className="shrink-0"
          style={{
            maxWidth: isTypeView ? 0 : 200,
            opacity: isTypeView ? 0 : 1,
            overflow: "hidden",
            marginRight: isTypeView ? 0 : 4,
            transition: "max-width 0.3s ease, opacity 0.2s ease, margin 0.3s ease",
          }}
        >
          <button
            onClick={() => {
              setActiveSection("forYou");
              setHierarchyPath([]);
              setActiveQuickFilters(new Set());
            }}
            className={`px-2.5 py-0.5 text-xs rounded-full transition-colors whitespace-nowrap
              ${activeSection === "forYou"
                ? "bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
          >
            For you
          </button>
        </div>

        {/* Divider between For You and hierarchy pills */}
        <div
          className="bg-gray-300 shrink-0"
          style={{
            width: isTypeView ? 0 : 1,
            height: 14,
            marginLeft: isTypeView ? 0 : 6,
            marginRight: isTypeView ? 0 : 6,
            opacity: isTypeView ? 0 : 1,
            transition: "all 0.3s ease",
          }}
        />

        {/* Hierarchy pills — collapse when a type is selected */}
        {hierarchyPills.map((pill) => (
          <div
            key={pill.key}
            className="shrink-0"
            style={{
              maxWidth: isTypeView ? 0 : 200,
              opacity: isTypeView ? 0 : 1,
              overflow: "hidden",
              marginRight: isTypeView ? 0 : 4,
              transition: "max-width 0.3s ease, opacity 0.2s ease, margin 0.3s ease",
            }}
          >
            <button
              onClick={() => {
                setActiveSection(pill.key);
                setHierarchyPath([]);
                setActiveQuickFilters(new Set());
              }}
              className={`px-2.5 py-0.5 text-xs rounded-full transition-colors whitespace-nowrap
                ${activeSection === pill.key
                  ? "bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              {pill.label}
            </button>
          </div>
        ))}

        {/* Divider between core and type pills — hide when type is selected */}
        <div
          className="bg-gray-300 shrink-0"
          style={{
            width: isTypeView ? 0 : 1,
            height: 14,
            marginLeft: isTypeView ? 0 : 6,
            marginRight: isTypeView ? 0 : 6,
            opacity: isTypeView ? 0 : 1,
            transition: "all 0.35s ease",
          }}
        />

        {/* Type pills */}
        {typePills.map((pill) => {
          const isActive = activeSection === pill.key;
          const isOtherTypeActive = isTypeView && !isActive;

          return (
            <div
              key={pill.key}
              className="shrink-0"
              style={{
                maxWidth: isOtherTypeActive ? 0 : 200,
                opacity: isOtherTypeActive ? 0 : 1,
                overflow: "hidden",
                marginRight: isOtherTypeActive ? 0 : 4,
                transition: "max-width 0.3s ease, opacity 0.2s ease, margin 0.3s ease",
              }}
            >
              {isActive ? (
                <button
                  onClick={() => {
                    setActiveSection("forYou");
                    setActiveQuickFilters(new Set());
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-200 hover:bg-blue-100 whitespace-nowrap cursor-pointer"
                >
                  <AssetIcon type={pill.key as AssetType} size={11} />
                  {pill.label}
                  <X size={10} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveSection(pill.key);
                    setHierarchyPath([]);
                    setSortMode("relevance");
                    setActiveQuickFilters(new Set());
                  }}
                  className="px-2.5 py-0.5 text-xs rounded-full whitespace-nowrap bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer"
                >
                  {pill.label}
                </button>
              )}
            </div>
          );
        })}

        {/* Divider before type pills — only show when not in type view */}
        {typePills.length > 0 && !isTypeView && (
          <div className="w-0" />
        )}

        {/* Quick filters — appear when a type is selected */}
        {availableQuickFilters.map((filter, i) => (
          <div
            key={filter.key}
            className="shrink-0"
            style={{
              maxWidth: isTypeView ? 200 : 0,
              opacity: isTypeView ? 1 : 0,
              overflow: "hidden",
              marginRight: isTypeView ? 4 : 0,
              transition: "max-width 0.35s ease, opacity 0.3s ease, margin 0.35s ease",
              transitionDelay: isTypeView ? `${(i + 1) * 80}ms` : "0ms",
            }}
          >
            <button
              onClick={() => toggleQuickFilter(filter.key)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full whitespace-nowrap border cursor-pointer
                ${activeQuickFilters.has(filter.key)
                  ? "bg-blue-50 text-blue-700 border-blue-200 font-medium"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              {filter.label}
              {activeQuickFilters.has(filter.key) && <X size={10} />}
            </button>
          </div>
        ))}

        {/* Clear all */}
        {activeQuickFilters.size > 0 && (
          <button
            onClick={() => setActiveQuickFilters(new Set())}
            className="px-2 py-0.5 text-xs text-gray-500 hover:text-gray-700 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-[640px] flex flex-col" style={{ height: "calc(60vh - 50px)", minHeight: 420 }}>
      <div className="px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50">
            <RefreshCw size={14} />
          </button>
        </div>
        {renderPillBar()}
      </div>

      {renderContent()}

      {multiSelect && selectedAssets.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center gap-2 text-xs text-gray-600 h-[40px]">
          <span className="font-medium shrink-0">{selectedAssets.length} selected</span>
          <div className="flex gap-1 flex-1 overflow-x-auto flex-nowrap scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {selectedAssets.map((a) => (
              <span key={a.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-full whitespace-nowrap shrink-0 cursor-pointer hover:border-gray-300" onClick={() => toggleAsset(a)}>
                <AssetIcon type={a.type} size={10} />
                <span className="max-w-[100px] truncate">{a.name}</span>
                <X size={10} className="text-gray-400 hover:text-gray-600" />
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm?.(selectedAssets)}
          disabled={selectedAssets.length === 0}
          className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors
            ${selectedAssets.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          Confirm{multiSelect && selectedAssets.length > 0 ? ` (${selectedAssets.length})` : ""}
        </button>
      </div>
    </div>
  );
}
