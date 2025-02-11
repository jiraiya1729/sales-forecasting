"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, ChevronRight, BarChart2, Table2, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DarkUploadComponent from "@/components/uploadComponent";
import DarkProductList from "@/components/productList";

export default function UploadPage() {
  const [products, setProducts] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadSuccess = (data: any) => {
    setProducts(data);
  };

  const features = [
    {
      icon: <FileSpreadsheet className="w-8 h-8 text-blue-400" />,
      title: "CSV Format Support",
      description: "Upload your product data in CSV format for quick analysis"
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-cyan-400" />,
      title: "Instant Analytics",
      description: "Get immediate insights about your product data"
    },
    {
      icon: <Table2 className="w-8 h-8 text-indigo-400" />,
      title: "Organized View",
      description: "View your data in a clean, sortable table format"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
      
      <div className="relative">
        <div className="p-6 md:p-8 lg:p-12">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Card className="w-full max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Product Data Upload
                    </h1>
                    <p className="text-slate-400 mt-2">
                      Upload your CSV file to begin product analysis
                    </p>
                  </div>

                  <div className="text-center space-y-4 mb-6">
                    <div className="flex justify-center">
                      <FileText className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-sm text-slate-400">
                      Supported format: CSV only
                    </p>
                  </div>

                  <DarkUploadComponent 
                    onUploadSuccess={handleUploadSuccess}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {products.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-4xl mx-auto mt-12"
            >
              {/* Features Section */}
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card 
                    key={index} 
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="bg-slate-700/50 w-16 h-16 rounded-lg flex items-center justify-center">
                          {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-100">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* How It Works Section */}
              <Card className="mt-12 bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 text-slate-100">
                    How It Works
                  </h2>
                  <div className="space-y-4">
                    {[
                      "Prepare your product data in CSV format",
                      "Upload your file using the drag & drop zone or file picker",
                      "View your analyzed data in an organized table format"
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 text-slate-300">
                        <ChevronRight className="w-4 h-4 text-blue-400" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <AnimatePresence>
            {products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-7xl mx-auto"
              >
                <DarkProductList products={products} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}