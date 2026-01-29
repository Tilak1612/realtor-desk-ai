import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { breadcrumbSchema } from '@/lib/structuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export const BreadcrumbNav = ({ items, currentPage }: BreadcrumbNavProps) => {
  // Build breadcrumb items including home and current page
  const allItems = [
    { name: 'Home', url: '/' },
    ...items,
    { name: currentPage, url: '' } // Current page has no link
  ];

  // Generate structured data for SEO
  const structuredData = breadcrumbSchema(
    allItems.filter(item => item.url).map(item => ({
      name: item.name,
      url: item.url
    }))
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <li className="flex items-center gap-2">
            <Link 
              to="/" 
              className="hover:text-primary transition-colors flex items-center gap-1"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
          </li>
          
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              <Link 
                to={item.url} 
                className="hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
              <ChevronRight className="w-4 h-4" />
            </li>
          ))}
          
          <li className="text-foreground font-medium" aria-current="page">
            {currentPage}
          </li>
        </ol>
      </nav>
    </>
  );
};
