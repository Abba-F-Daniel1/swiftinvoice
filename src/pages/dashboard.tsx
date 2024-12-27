import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@clerk/clerk-react";
import { DollarSign, Users, FileText, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { isSignedIn } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 12345,
    activeClients: 24,
    pendingInvoices: 7,
    growthPercentage: 15,
    revenueOverview: [
      { name: "Jan", value: 4000 },
      { name: "Feb", value: 3000 },
      { name: "Mar", value: 5000 },
      { name: "Apr", value: 7000 },
      { name: "May", value: 6000 },
    ],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">Please sign in to view the dashboard.</h2>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${dashboardData.totalRevenue.toLocaleString()}`,
      description: "This month",
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Clients",
      value: dashboardData.activeClients,
      description: "Current period",
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Invoices",
      value: dashboardData.pendingInvoices,
      description: "Awaiting payment",
      icon: <FileText className="w-6 h-6" />,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      title: "Growth",
      value: `${dashboardData.growthPercentage}%`,
      description: "Compared to last month",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6"
        >
          Dashboard
        </motion.h1>

        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
        >
          {statCards.map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-8"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.revenueOverview}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#e5e7eb"
                    />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6B7280"
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3B82F6"
                      radius={[6, 6, 0, 0]}
                    >
                      {dashboardData.revenueOverview.map((entry, index) => (
                        <motion.rect
                          initial={{ y: 500, height: 0 }}
                          animate={{ y: 0, height: entry.value / 20 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;