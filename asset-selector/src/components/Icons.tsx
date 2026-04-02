"use client";

import {
  Table2,
  Eye,
  HardDrive,
  FileText,
  LayoutDashboard,
  Brain,
  Folder,
  File,
  Database,
  Layers,
  FolderOpen,
  AppWindow,
  Cog,
} from "lucide-react";
import type { AssetType } from "@/data/mockData";

const iconMap: Record<AssetType, React.ComponentType<{ size?: number; className?: string }>> = {
  table: Table2,
  view: Eye,
  volume: HardDrive,
  notebook: FileText,
  dashboard: LayoutDashboard,
  model: Brain,
  folder: Folder,
  file: File,
  catalog: Database,
  schema: Layers,
  directory: FolderOpen,
  app: AppWindow,
  job: Cog,
  query: Database,
  alert: FileText,
};

const colorMap: Record<AssetType, string> = {
  table: "text-blue-500",
  view: "text-purple-500",
  volume: "text-amber-500",
  notebook: "text-orange-500",
  dashboard: "text-green-500",
  model: "text-pink-500",
  folder: "text-yellow-600",
  file: "text-gray-500",
  catalog: "text-indigo-500",
  schema: "text-teal-500",
  directory: "text-yellow-600",
  app: "text-cyan-500",
  job: "text-gray-600",
  query: "text-blue-600",
  alert: "text-red-500",
};

export function AssetIcon({ type, size = 16 }: { type: AssetType; size?: number }) {
  const Icon = iconMap[type];
  const color = colorMap[type];
  return <Icon size={size} className={color} />;
}
