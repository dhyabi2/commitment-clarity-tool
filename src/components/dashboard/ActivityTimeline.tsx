import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const ActivityTimeline = ({ data }: { data: any[] }) => {
  const { t } = useLanguage();

  const chartConfig = {
    thoughts: {
      label: t('dashboard.charts.thoughts'),
      color: "#84a98c",
    },
    completedThoughts: {
      label: t('dashboard.charts.completedThoughts'),
      color: "#52796f",
    },
    commitments: {
      label: t('dashboard.charts.commitments'),
      color: "#354f52",
    },
  };

  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <LineChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
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
          <YAxis 
            stroke="#5b8363" 
            fontSize={10} 
            tickMargin={8}
            width={40}
          />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="thoughts"
            stroke="#84a98c"
            strokeWidth={2}
            dot={{ fill: "#84a98c", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name={t('dashboard.charts.activeThoughts')}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="completedThoughts"
            stroke="#52796f"
            strokeWidth={2}
            dot={{ fill: "#52796f", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name={t('dashboard.charts.completedThoughts')}
            animationDuration={1500}
          />
          <Line
            type="monotone"
            dataKey="commitments"
            stroke="#354f52"
            strokeWidth={2}
            dot={{ fill: "#354f52", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name={t('dashboard.charts.commitments')}
            animationDuration={1500}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default ActivityTimeline;