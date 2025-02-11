"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Sparkles, Package, ArrowUp, ArrowDown } from "lucide-react";

interface Sale {
  product_id: string;
  product_name: string;
  actual_price: string;
  product_link: string;
  avg_sentiment: number;
}

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [data, setData] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("loading");
      try {
        const response = await fetch("http://127.0.0.1:8000/sales", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (response.ok) {
          setData(result);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setStatus("error");
      }
    };

    fetchData();
  }, []);
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (status === "loading") {
    return <div className="text-center text-gray-300">Loading data...</div>;
  }

  if (status === "error") {
    return <div className="text-center text-red-400">Error fetching data.</div>;
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-900 to-gray-950">
      <Card className="bg-gradient-to-r from-emerald-900 to-emerald-800 border-gray-800">
        <div className="absolute inset-0 bg-[url('/api/placeholder/400/100')] opacity-5 mix-blend-overlay" />
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <h2 className="text-2xl font-bold text-gray-100">Latest Sales Data</h2>
              </div>
              <p className="text-emerald-300/80">
                Displaying all recent transactions
              </p>
            </div>
            <Badge 
              variant="outline" 
              className="bg-emerald-500/10 text-emerald-300 border-emerald-600/50 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
            >
              Live Data
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, index) => (
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
                    {truncateText(item.product_name, 30)}
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

                <div className="flex items-center text-sm text-gray-400">
                  <strong className="text-emerald-300">Sentiment Score: </strong>
                  <span className="ml-2 flex items-center">
                    {item.avg_sentiment}
                    {item.avg_sentiment > 0.5 ? (
                      <ArrowUp className="w-4 h-4 text-green-500 ml-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500 ml-1" />
                    )}
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
