"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Users, Trophy, Target, Star } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,274</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,592</div>
            <p className="text-xs text-muted-foreground">+48% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Given</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,083</div>
            <p className="text-xs text-muted-foreground">+36% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={[
                { name: "Jan", users: 400 },
                { name: "Feb", users: 600 },
                { name: "Mar", users: 800 },
                { name: "Apr", users: 1000 },
                { name: "May", users: 1200 },
                { name: "Jun", users: 1400 },
              ]}
              index="name"
              categories={["users"]}
              colors={["#2563eb"]}
              className="h-[300px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[
                { category: "Work", tasks: 1200 },
                { category: "Study", tasks: 900 },
                { category: "Health", tasks: 600 },
                { category: "Fitness", tasks: 800 },
                { category: "Personal", tasks: 1100 },
              ]}
              index="category"
              categories={["tasks"]}
              colors={["#2563eb"]}
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}