import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";

const chartConfig = {
  thoughts: {
    label: "Thoughts",
    color: "#84a98c",
  },
  commitments: {
    label: "Commitments",
    color: "#5b8363",
  },
};

const ActivityTimeline = ({ data }: { data: any[] }) => (
  <div className="h-[250px] md:h-[300px] w-full">
    <ChartContainer config={chartConfig}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="date"
          stroke="#5b8363"
          fontSize={10}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <YAxis stroke="#5b8363" fontSize={10} tickMargin={8} />
        <ChartTooltip />
        <Line
          type="monotone"
          dataKey="thoughts"
          stroke="#84a98c"
          strokeWidth={2}
          dot={{ fill: "#84a98c", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          name="Thoughts"
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="commitments"
          stroke="#5b8363"
          strokeWidth={2}
          dot={{ fill: "#5b8363", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
          name="Commitments"
          animationDuration={1500}
        />
      </LineChart>
    </ChartContainer>
  </div>
);

export default ActivityTimeline;