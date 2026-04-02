"use client";

import { useState } from "react";
import { AssetSelector } from "@/components/AssetSelector";
import {
  ucForYouAssets,
  ucTablesAssets,
  ucViewsAssets,
  ucHierarchy,
  wsForYouAssets,
  wsHierarchy,
  wsNotebooksAssets,
  wsFilesAssets,
  wsQueriesAssets,
  wsAlertsAssets,
  domainForYouAssets,
  domainTablesAssets,
  domainDashboardsAssets,
  domainModelsAssets,
  ucHierarchy as domainHierarchy,
  volumeForYouAssets,
  volumeHierarchy,
  scenarioConfigs,
} from "@/data/mockData";
import type { Asset } from "@/data/mockData";

type Scenario = keyof typeof scenarioConfigs;

export default function Home() {
  const [scenario, setScenario] = useState<Scenario>("uc");
  const [lastAction, setLastAction] = useState<string>("");

  const handleConfirm = (assets: Asset[]) => {
    setLastAction(`Selected: ${assets.map((a) => a.name).join(", ")}`);
  };

  const handleCancel = () => {
    setLastAction("Cancelled");
  };

  const renderSelector = () => {
    switch (scenario) {
      case "uc":
        return (
          <AssetSelector
            key="uc"
            title="Select a data source"
            forYouAssets={ucForYouAssets}
            hierarchy={ucHierarchy}
            typeFilterAssets={{ table: ucTablesAssets, view: ucViewsAssets }}
            selectableTypes={scenarioConfigs.uc.selectableTypes}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        );
      case "workspace":
        return (
          <AssetSelector
            key="workspace"
            title="Open existing asset"
            forYouAssets={wsForYouAssets}
            forYouLabel="Recents"
            hierarchy={wsHierarchy}
            typeFilterAssets={{
              notebook: wsNotebooksAssets,
              file: wsFilesAssets,
              query: wsQueriesAssets,
              alert: wsAlertsAssets,
            }}
            selectableTypes={scenarioConfigs.workspace.selectableTypes}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        );
      case "multiSelect":
        return (
          <AssetSelector
            key="multiSelect"
            title="Add assets to Finance domain"
            forYouAssets={domainForYouAssets}
            hierarchy={domainHierarchy}
            typeFilterAssets={{
              table: domainTablesAssets,
              dashboard: domainDashboardsAssets,
              model: domainModelsAssets,
            }}
            selectableTypes={scenarioConfigs.multiSelect.selectableTypes}
            multiSelect
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        );
      case "volume":
        return (
          <AssetSelector
            key="volume"
            title="Select a volume or folder"
            forYouAssets={volumeForYouAssets}
            hierarchy={volumeHierarchy}
            selectableTypes={scenarioConfigs.volume.selectableTypes}
            volumeMode
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 px-4">
      <div className="w-full max-w-3xl mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Asset Selector Prototype</h1>
        <p className="text-sm text-gray-500 mb-4">
          Interactive prototype showing proposed improvements to the Databricks Asset Selector
        </p>

        <div className="flex gap-2 mb-4">
          {(Object.keys(scenarioConfigs) as Scenario[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setScenario(key);
                setLastAction("");
              }}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors
                ${scenario === key
                  ? "bg-white border-blue-300 text-blue-700 shadow-sm font-medium"
                  : "bg-white/50 border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300"
                }`}
            >
              <div className="font-medium">{scenarioConfigs[key].title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{scenarioConfigs[key].description}</div>
            </button>
          ))}
        </div>

      </div>

      <div className="flex justify-center">
        {renderSelector()}
      </div>

      {lastAction && (
        <div className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
          {lastAction}
        </div>
      )}
    </div>
  );
}
