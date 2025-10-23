import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, AlertCircle, MessageCircle, Shield } from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery="" onSearchChange={() => {}} />
      <Sidebar />
      
      <main className="ml-16 md:ml-20 p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Help & Support
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions and get assistance
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Are the games free to download?</h3>
                  <p className="text-muted-foreground">
                    Yes, all games on Zinda Games are available for free download. However, please respect 
                    the original creators and support them if you enjoy their games.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">How do I know if a game will run on my PC?</h3>
                  <p className="text-muted-foreground">
                    Each game page includes both minimum and recommended system requirements. Compare these 
                    with your PC specifications to ensure compatibility.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Why is my download slow?</h3>
                  <p className="text-muted-foreground">
                    Download speeds depend on your internet connection and the source server. Try downloading 
                    during off-peak hours for better speeds, or check your internet connection.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">What file formats are the games in?</h3>
                  <p className="text-muted-foreground">
                    Games are typically provided in compressed formats (ZIP, RAR) or as installers (EXE). 
                    You'll need appropriate software to extract and install them.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-secondary" />
                  Troubleshooting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Game won't start</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Verify your system meets the minimum requirements</li>
                    <li>Update your graphics drivers</li>
                    <li>Run the game as administrator</li>
                    <li>Install required redistributables (DirectX, Visual C++)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Download link not working</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Try refreshing the page</li>
                    <li>Clear your browser cache</li>
                    <li>Try a different browser</li>
                    <li>Check if the download source is temporarily unavailable</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Safety & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We strive to provide safe download links, but we recommend:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Keep your antivirus software updated</li>
                  <li>Scan downloaded files before opening</li>
                  <li>Download only from trusted sources</li>
                  <li>Be cautious of any requests for personal information</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-secondary" />
                  Still Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you couldn't find the answer to your question, please check back later for updates 
                  or look for community forums related to the specific game you're interested in.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
