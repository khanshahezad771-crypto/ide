import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  downloadLink: string;
  createdAt: string;
}

export const GameCard = ({ id, title, description, bannerUrl, downloadLink, createdAt }: GameCardProps) => {
  return (
    <Card className="group overflow-hidden bg-card border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,105,225,0.3)]">
      <Link to={`/game/${id}`}>
        <CardHeader className="p-0">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-primary/30">
                {title.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardHeader>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/game/${id}`}>
          <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{format(new Date(createdAt), "MMM dd, yyyy")}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          variant="download"
          size="lg"
          className="w-full"
          onClick={() => window.open(downloadLink, "_blank")}
        >
          <Download className="mr-2 h-5 w-5" />
          Download Now
        </Button>
      </CardFooter>
    </Card>
  );
};
