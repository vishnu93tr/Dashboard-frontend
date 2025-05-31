import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: Props) {
  return (
    <Card className="rounded-2xl shadow p-4 w-full">
      <CardContent>
        <h4 className="text-md text-muted-foreground">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
