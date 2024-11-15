import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const DailyActivity = ({ data }: { data: any[] }) => {
  const { t } = useLanguage();

  const chartConfig = {
    thoughts: {
      label: t('dashboard.charts.thoughts'),
      color: "#84a98c",
    },
    commitments: {
      label: t('dashboard.charts.commitments'),
      color: "#5b8363",
    },
  };

  return (
    <div className="h-[200px] md:h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <BarChart data={data.slice(-7)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          <Bar
            dataKey="thoughts"
            fill="#84a98c"
            name={t('dashboard.charts.thoughts')}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
          <Bar
            dataKey="commitments"
            fill="#5b8363"
            name={t('dashboard.charts.commitments')}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default DailyActivity;