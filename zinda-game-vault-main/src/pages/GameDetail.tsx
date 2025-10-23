import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Monitor, Cpu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setGame(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <Sidebar />
        <main className="ml-16 md:ml-20 flex items-center justify-center min-h-[calc(100vh-73px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchQuery="" onSearchChange={() => {}} />
        <Sidebar />
        <main className="ml-16 md:ml-20 flex items-center justify-center min-h-[calc(100vh-73px)]">
          <p className="text-2xl text-muted-foreground">Game not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <Sidebar />
      
      <main className="ml-16 md:ml-20">
        <div className="container mx-auto px-4 py-8">
          {/* Banner Section */}
          {game.banner_url && (
            <div className="relative h-[400px] rounded-xl overflow-hidden mb-8 shadow-[0_0_40px_rgba(65,105,225,0.3)]">
              <img
                src={game.banner_url}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {game.title}
                </h1>
                <Button
                  variant="download"
                  size="lg"
                  onClick={() => window.open(game.download_link, "_blank")}
                  className="shadow-[0_0_40px_rgba(65,105,225,0.5)]"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-2xl">About This Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {game.description}
                  </p>
                </CardContent>
              </Card>

              {/* Screenshots */}
              {game.screenshots && game.screenshots.length > 0 && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-2xl">Screenshots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {game.screenshots.map((screenshot: string, index: number) => (
                        <img
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="rounded-lg w-full h-auto hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[0_0_20px_rgba(65,105,225,0.2)]"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* System Requirements */}
            <div className="space-y-6">
              {game.min_requirements && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-primary" />
                      Minimum Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm text-muted-foreground whitespace-pre-line font-sans">
                      {game.min_requirements}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {game.recommended_requirements && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-secondary" />
                      Recommended Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm text-muted-foreground whitespace-pre-line font-sans">
                      {game.recommended_requirements}
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Button
                variant="gaming"
                size="lg"
                className="w-full"
                onClick={() => window.open(game.download_link, "_blank")}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Game
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
