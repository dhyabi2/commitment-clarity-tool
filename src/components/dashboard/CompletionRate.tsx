import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#84a98c", "#e6ebe7"];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "#84a98c",
  },
  pending: {
    label: "Pending",
    color: "#e6ebe7",
  },
};

const CompletionRate = ({ completionRate }: { completionRate: number }) => {
  const data = [
    { name: "Completed", value: completionRate },
    { name: "Pending", value: 100 - completionRate },
  ];

  return (
    <div className="h-[200px] md:h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={60}
            fill="#84a98c"
            dataKey="value"
            animationDuration={1500}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartTooltip />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default CompletionRate;