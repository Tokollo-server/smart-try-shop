import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Package, Users, TrendingUp, DollarSign, ShoppingCart } from "lucide-react";

const Admin = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "$12,543",
      change: "+12.5%",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Orders",
      value: "143",
      change: "+8.2%",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Products",
      value: "87",
      change: "+3 new",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Customers",
      value: "1,234",
      change: "+23%",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and track performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="text-primary">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sales Overview
                  </CardTitle>
                  <CardDescription>Your sales performance this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Sales chart will be displayed here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top Products
                  </CardTitle>
                  <CardDescription>Best selling items this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Product {i}</p>
                          <p className="text-sm text-muted-foreground">{50 + i * 10} sales</p>
                        </div>
                        <p className="font-semibold">${(i * 1000).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Order management interface will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Product management interface will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Analytics</CardTitle>
                <CardDescription>Insights and predictions for your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Sales Predictions</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on current trends, we predict 15% growth in the next month
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Customer Behavior</h3>
                    <p className="text-sm text-muted-foreground">
                      Peak shopping hours: 6-9 PM | Most popular category: Women's Fashion
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Inventory Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      Restock suggested for 3 items | New trending products identified
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
