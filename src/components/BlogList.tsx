import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "./ui/Card";
import { Link } from "wouter";
import { Calendar, Clock, User } from "lucide-react";
import type { Blog } from "../types/types";


// Props interface
interface BlogListProps {
  searchQuery?: string;
}

// Single blog card component
function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link key={blog.id} href={`/blog/${blog.id}`} data-testid={`link-blog-${blog.id}`}>
      <Card className="bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardContent className="p-0">
          <img 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="w-full h-48 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
          />
          <div className="p-6">
            <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full mb-3">
              {blog.category}
            </span>
            <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
              {blog.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {blog.description}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{blog.publishedAt}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Loading skeleton component
function BlogSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-0">
        <div className="w-full h-48 bg-muted rounded-t-lg"></div>
        <div className="p-6 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-full"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
          <div className="flex items-center space-x-4 pt-2">
            <div className="h-3 bg-muted rounded w-20"></div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty / error component
function BlogEmpty({ title, message }: { title: string; message: string }) {
  return (
    <section className="py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-xl text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}

// Main BlogList component
export function BlogList({ searchQuery }: BlogListProps) {
  const { data: blogs, isLoading, error } = useQuery<Blog[]>({
    queryKey: searchQuery ? ["/api/blogs", { search: searchQuery }] : ["/api/blogs"],
    queryFn: () => {
      const url = searchQuery 
        ? `/api/blogs?search=${encodeURIComponent(searchQuery)}`
        : '/api/blogs';
      return fetch(url).then(r => r.json());
    }
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Blog Posts"}
            </h2>
            <p className="text-xl text-muted-foreground">
              {searchQuery ? "Finding relevant articles..." : "Discover insightful articles and stories"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return <BlogEmpty title="Latest Blog Posts" message="Failed to load blog posts. Please try again later." />;
  }

  if (!blogs || blogs.length === 0) {
    return (
      <BlogEmpty
        title={searchQuery ? `No Results for "${searchQuery}"` : "No Blog Posts Found"}
        message={searchQuery ? "Try searching with different keywords." : "Check back later for new content."}
      />
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Blog Posts"}
          </h2>
          <p className="text-xl text-muted-foreground">
            {searchQuery ? `Found ${blogs.length} articles` : "Discover insightful articles and stories"}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
