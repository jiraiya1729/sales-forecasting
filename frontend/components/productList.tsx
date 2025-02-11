import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Sparkles, Package } from "lucide-react";

interface Product {
  product_id: string;
  product_name: string;
  actual_price: string;
  product_link: string;
}

interface ProductListProps {
  products: Product[];
}

export default function DarkProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header Banner */}
      <Card className="bg-gradient-to-r from-emerald-900 to-emerald-800 border-gray-800">
        <div className="absolute inset-0 bg-[url('/api/placeholder/400/100')] opacity-5 mix-blend-overlay" />
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold text-gray-100">Top Recommended Products</h2>
              </div>
              <p className="text-emerald-300/80">
                Showcasing {products.length} premium selections
              </p>
            </div>
            <Badge 
              variant="outline" 
              className="bg-emerald-500/10 text-emerald-300 border-emerald-600/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
            >
              Curated Selection
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((item, index) => (
          <Card 
            key={index} 
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl 
                     hover:shadow-emerald-900/20 hover:-translate-y-1 bg-gray-900 border-gray-800"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/0 to-emerald-900/20 opacity-0 
                          group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h3 className="font-semibold text-gray-100 text-lg truncate group-hover:text-emerald-300 transition-colors">
                      {item.product_name}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="shrink-0 bg-gray-800 text-emerald-400 border-gray-700">
                    #{item.product_id}
                  </Badge>
                </div>

                <div className="flex items-center">
                  <span className="text-lg font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    {item.actual_price}
                  </span>
                </div>

                <a
                  href={item.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-emerald-400 hover:text-emerald-300 
                           font-medium transition-all duration-300 relative overflow-hidden group/link"
                >
                  <span className="relative">
                    <span className="group-hover/link:translate-y-[-100%] transition-transform duration-300 inline-block">
                      View Product
                    </span>
                    <span className="absolute left-0 translate-y-[100%] group-hover/link:translate-y-0 transition-transform duration-300">
                      Explore Now
                    </span>
                  </span>
                  <ExternalLink className="w-4 h-4 ml-2 transition-all duration-300 
                                       group-hover/link:translate-x-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}