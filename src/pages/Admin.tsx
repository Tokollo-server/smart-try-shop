import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Package, Users, TrendingUp, DollarSign, ShoppingCart, Sparkles, Loader2 } from "lucide-react";
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your store and track performance</p>
        </div>

        {/* AI Insights Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary/20 to-purple-600/20 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription className="text-gray-300">
              Real-time analysis of your store performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingInsights ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : aiInsights ? (
              <div className="space-y-6">
                {/* Best Categories */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Best-Selling Categories
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.bestCategories.map((cat, idx) => (
                      <div key={idx} className="p-3 bg-black/40 rounded-lg border border-primary/20">
                        <p className="font-medium text-primary">{cat.category}</p>
                        <p className="text-sm text-gray-300 mt-1">{cat.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Trends */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Customer Trends
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.customerTrends.map((trend, idx) => (
                      <div key={idx} className="p-3 bg-black/40 rounded-lg border border-primary/20">
                        <p className="font-medium text-blue-400">{trend.trend}</p>
                        <p className="text-sm text-gray-300 mt-1">{trend.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Recommendations */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-400" />
                    Recommended Products to Promote
                  </h3>
                  <div className="space-y-2">
                    {aiInsights.topRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-black/40 rounded-lg border border-primary/20">
                        <p className="font-medium text-purple-400">{rec.product}</p>
                        <p className="text-sm text-gray-300 mt-1">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No insights available
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
                <div className="text-primary">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-400 mt-1">
                  <span className="text-green-400">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-primary">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-primary">Orders</TabsTrigger>
            <TabsTrigger value="products" className="text-white data-[state=active]:bg-primary">Products</TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-primary">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5" />
                    Sales Overview
                  </CardTitle>
                  <CardDescription className="text-gray-400">Your sales performance this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Sales chart will be displayed here
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5" />
                    Top Products
                  </CardTitle>
                  <CardDescription className="text-gray-400">Best selling items this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">Product {i}</p>
                          <p className="text-sm text-gray-400">{50 + i * 10} sales</p>
                        </div>
                        <p className="font-semibold text-white">${(i * 1000).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Orders</CardTitle>
                <CardDescription className="text-gray-400">Latest orders from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-8">
                  Order management interface will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Product Management</CardTitle>
                <CardDescription className="text-gray-400">Manage your product catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center py-8">
                  Product management interface will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">AI-Powered Analytics</CardTitle>
                <CardDescription className="text-gray-400">Insights and predictions for your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-black/40 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2 text-white">Sales Predictions</h3>
                    <p className="text-sm text-gray-300">
                      Based on current trends, we predict 15% growth in the next month
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2 text-white">Customer Behavior</h3>
                    <p className="text-sm text-gray-300">
                      Peak shopping hours: 6-9 PM | Most popular category: Women's Fashion
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2 text-white">Inventory Recommendations</h3>
                    <p className="text-sm text-gray-300">
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
