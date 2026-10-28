import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Package, Users, TrendingUp, DollarSign, ShoppingCart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIInsight {
  bestCategories: Array<{ category: string; insight: string }>;
  customerTrends: Array<{ trend: string; detail: string }>;
  topRecommendations: Array<{ product: string; reason: string }>;
}

const Admin = () => {
  const navigate = useNavigate();
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("Please sign in to access the admin dashboard");
          navigate('/auth');
          return;
        }

        setIsAuthenticated(true);

        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleError) {
          console.error('Error checking admin role:', roleError);
          toast.error("Error checking permissions");
          navigate('/');
          return;
        }

        if (!roleData) {
          toast.error("You don't have permission to access the admin dashboard");
          navigate('/');
          return;
        }

        setIsAdmin(true);
        setLoading(false);
        fetchAIInsights();
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error("Authentication error");
        navigate('/auth');
      }
    };

    checkAuthAndRole();
  }, [navigate]);

  const fetchAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-insights');
      
      if (error) throw error;
      
      setAiInsights(data);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-bold tracking-tight text-4xl md:text-5xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and track performance</p>
        </div>

        {/* AI Insights Card */}
        <Card className="mb-8 bg-secondary border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Real-time analysis of your store performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingInsights ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : aiInsights ? (
              <div className="space-y-6">
                {/* Best Categories */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-700" />
                    Best-Selling Categories
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.bestCategories.map((cat, idx) => (
                      <div key={idx} className="p-3 bg-background rounded-lg border border-border">
                        <p className="font-medium text-accent">{cat.category}</p>
                        <p className="text-sm text-muted-foreground mt-1">{cat.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Trends */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-700" />
                    Customer Trends
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.customerTrends.map((trend, idx) => (
                      <div key={idx} className="p-3 bg-background rounded-lg border border-border">
                        <p className="font-medium text-sky-700">{trend.trend}</p>
                        <p className="text-sm text-muted-foreground mt-1">{trend.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Recommendations */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent" />
                    Recommended Products to Promote
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.topRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-background rounded-lg border border-border">
                        <p className="font-medium text-accent">{rec.product}</p>
                        <p className="text-sm text-muted-foreground mt-1">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No insights available
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="text-accent">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-700">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Orders</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Products</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Sales Overview
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">Your sales performance this month</CardDescription>
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
                  <CardDescription className="text-muted-foreground">Best selling items this month</CardDescription>
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
                <CardDescription className="text-muted-foreground">Latest orders from your store</CardDescription>
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
                <CardDescription className="text-muted-foreground">Manage your product catalog</CardDescription>
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
                <CardTitle>Analytics</CardTitle>
                <CardDescription className="text-muted-foreground">Insights and predictions for your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">Sales Predictions</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on current trends, we predict 15% growth in the next month
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h3 className="font-semibold mb-2">Customer Behavior</h3>
                    <p className="text-sm text-muted-foreground">
                      Peak shopping hours: 6-9 PM | Most popular category: Women's Fashion
                    </p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
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
