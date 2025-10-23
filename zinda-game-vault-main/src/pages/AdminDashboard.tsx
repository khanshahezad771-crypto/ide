import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, LogOut, TrendingUp, Eye, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ daily: 0, weekly: 0 });
  const navigate = useNavigate();
  const { toast } = useToast();

  const [gameData, setGameData] = useState({
    title: "",
    description: "",
    minRequirements: "",
    recommendedRequirements: "",
    downloadLink: "",
    bannerFile: null as File | null,
    screenshots: [] as File[],
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/admin/login");
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      toast({
        title: "Unauthorized",
        description: "Admin access required",
        variant: "destructive",
      });
      navigate("/admin/login");
      return;
    }

    setUser(user);
  };

  const fetchStats = async () => {
    try {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const { data: dailyData } = await supabase
        .from('traffic_logs')
        .select('page_views')
        .eq('visit_date', today.toISOString().split('T')[0])
        .single();

      const { data: weeklyData } = await supabase
        .from('traffic_logs')
        .select('page_views')
        .gte('visit_date', weekAgo.toISOString().split('T')[0]);

      const dailyViews = dailyData?.page_views || 0;
      const weeklyViews = weeklyData?.reduce((sum, day) => sum + day.page_views, 0) || 0;

      setStats({ daily: dailyViews, weekly: weeklyViews });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'screenshots') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'banner') {
      setGameData({ ...gameData, bannerFile: files[0] });
    } else {
      setGameData({ ...gameData, screenshots: Array.from(files) });
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('game-assets')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('game-assets')
      .getPublicUrl(path);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameData.title || !gameData.description || !gameData.downloadLink) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let bannerUrl = null;
      const screenshotUrls: string[] = [];

      if (gameData.bannerFile) {
        const bannerPath = `banners/${Date.now()}_${gameData.bannerFile.name}`;
        bannerUrl = await uploadFile(gameData.bannerFile, bannerPath);
      }

      for (const screenshot of gameData.screenshots) {
        const screenshotPath = `screenshots/${Date.now()}_${screenshot.name}`;
        const url = await uploadFile(screenshot, screenshotPath);
        screenshotUrls.push(url);
      }

      const { error } = await supabase.from('games').insert({
        title: gameData.title,
        description: gameData.description,
        banner_url: bannerUrl,
        screenshots: screenshotUrls,
        min_requirements: gameData.minRequirements,
        recommended_requirements: gameData.recommendedRequirements,
        download_link: gameData.downloadLink,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Game uploaded successfully!",
      });

      setGameData({
        title: "",
        description: "",
        minRequirements: "",
        recommendedRequirements: "",
        downloadLink: "",
        bannerFile: null,
        screenshots: [],
      });

      fetchStats();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <Sidebar />
      
      <main className="ml-16 md:ml-20 p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="upload">Upload Game</TabsTrigger>
              <TabsTrigger value="stats">Traffic Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Daily Traffic
                    </CardTitle>
                    <CardDescription>Views today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-primary">{stats.daily}</p>
                  </CardContent>
                </Card>

                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      Weekly Traffic
                    </CardTitle>
                    <CardDescription>Views in the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-secondary">{stats.weekly}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Upload New Game
                  </CardTitle>
                  <CardDescription>
                    Fill in the game details and upload assets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Game Title *</Label>
                      <Input
                        id="title"
                        value={gameData.title}
                        onChange={(e) => setGameData({ ...gameData, title: e.target.value })}
                        className="bg-card border-primary/30"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={gameData.description}
                        onChange={(e) => setGameData({ ...gameData, description: e.target.value })}
                        className="bg-card border-primary/30 min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="banner">Game Banner</Label>
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'banner')}
                        className="bg-card border-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="screenshots">Screenshots</Label>
                      <Input
                        id="screenshots"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, 'screenshots')}
                        className="bg-card border-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minReq">Minimum Requirements</Label>
                      <Textarea
                        id="minReq"
                        value={gameData.minRequirements}
                        onChange={(e) => setGameData({ ...gameData, minRequirements: e.target.value })}
                        className="bg-card border-primary/30"
                        placeholder="OS: Windows 10&#10;Processor: Intel Core i5&#10;Memory: 8 GB RAM"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recReq">Recommended Requirements</Label>
                      <Textarea
                        id="recReq"
                        value={gameData.recommendedRequirements}
                        onChange={(e) => setGameData({ ...gameData, recommendedRequirements: e.target.value })}
                        className="bg-card border-primary/30"
                        placeholder="OS: Windows 11&#10;Processor: Intel Core i7&#10;Memory: 16 GB RAM"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="download">Download Link *</Label>
                      <Input
                        id="download"
                        type="url"
                        value={gameData.downloadLink}
                        onChange={(e) => setGameData({ ...gameData, downloadLink: e.target.value })}
                        className="bg-card border-primary/30"
                        placeholder="https://example.com/game-download"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="gaming"
                      size="lg"
                      className="w-full"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Game
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
