import KpiCard from "./KpiCard";

interface KpiItem {
  label: string;
  value: number | string;
  icon?: React.ReactNode;   // antes string
  iconBg?: string;
}

interface KpiGridProps {
  items: KpiItem[];
  columns?: number;
}

export default function KpiGrid({ items, columns = 4 }: KpiGridProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 16,
      marginBottom: 24,
    }}>
      {items.map((item, idx) => (
        <KpiCard
          key={idx}
          label={item.label}
          value={item.value}
          icon={item.icon}
          iconBg={item.iconBg}
        />
      ))}
    </div>
  );
}