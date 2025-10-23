import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Download, Search, Info } from "lucide-react";

export default function Guide() {
  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <Sidebar />
      
      <main className="ml-16 md:ml-20 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              User Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Learn how to browse and download games from Zinda Games
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Finding Games
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Use the search bar at the top of the page to find specific games. Simply type the game name 
                  or keywords related to the game you're looking for.
                </p>
                <p className="text-muted-foreground">
                  Browse the homepage to see the latest games added to our library. New games appear first, 
                  making it easy to discover fresh content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-secondary" />
                  Game Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Click on any game card to view detailed information including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Full game description</li>
                  <li>Screenshots and media</li>
                  <li>Minimum system requirements</li>
                  <li>Recommended system requirements</li>
                  <li>Download link</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Downloading Games
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  To download a game:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Browse or search for your desired game</li>
                  <li>Click on the game card to view full details</li>
                  <li>Check the system requirements to ensure compatibility</li>
                  <li>Click the "Download Now" button</li>
                  <li>The download will begin from our trusted sources</li>
                </ol>
                <p className="text-muted-foreground mt-4">
                  Make sure you have enough storage space and meet the minimum system requirements 
                  before downloading.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Use the sidebar on the left to access different sections:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Guide:</strong> This page with helpful information</li>
                  <li><strong>Help:</strong> Get assistance and support</li>
                  <li><strong>Admin:</strong> Admin panel access (administrators only)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
