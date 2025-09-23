import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("shadow-card hover:shadow-hover transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={cn(
                "text-xs font-medium",
                changeType === "positive" && "text-success",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground"
              )}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="w-12 h-12 bg-gradient-card rounded-lg flex items-center justify-center shadow-neumorphic">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}