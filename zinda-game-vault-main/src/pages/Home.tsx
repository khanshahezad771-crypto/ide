import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroBanner from "@/assets/hero-banner.jpg";

const GAMES_PER_PAGE = 6;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchGames();
    trackVisit();
  }, [currentPage, searchQuery]);

  const trackVisit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existing } = await supabase
        .from('traffic_logs')
        .select('*')
        .eq('visit_date', today)
        .single();

      if (existing) {
        await supabase
          .from('traffic_logs')
          .update({ page_views: existing.page_views + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('traffic_logs')
          .insert({ visit_date: today, page_views: 1 });
      }
    } catch (error) {
      console.error('Error tracking visit:', error);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('games')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * GAMES_PER_PAGE;
      const to = from + GAMES_PER_PAGE - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setGames(data || []);
      setTotalPages(Math.ceil((count || 0) / GAMES_PER_PAGE));
    } catch (error: any) {
      toast({
        title: "Error fetching games",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <Sidebar />
      
      <main className="ml-16 md:ml-20">
        {/* Hero Section */}
        <section className="relative h-[400px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroBanner})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Latest PC Games
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Download the newest and most exciting games for your PC
              </p>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-muted-foreground">
                {searchQuery ? "No games found matching your search" : "No games available yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    title={game.title}
                    description={game.description}
                    bannerUrl={game.banner_url}
                    downloadLink={game.download_link}
                    createdAt={game.created_at}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
