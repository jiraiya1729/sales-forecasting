"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileType, Table } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DarkUploadComponent from "@/components/uploadComponent";
import DarkProductList from "@/components/productList";

export default function UploadPage() {
  const [products, setProducts] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadSuccess = (data: any) => {
    setProducts(data);
  };

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
              className={`
                transition-all duration-500 ease-in-out
                ${products.length === 0 
                  ? "min-h-[calc(100vh-6rem)] flex items-center justify-center" 
                  : "mb-8"}
              `}
            >
              <Card className="w-full max-w-4xl mx-auto bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Product Data Upload
                    </h1>
                    <p className="text-slate-400 mt-2">
                      Upload your product data file to begin analysis
                    </p>
                  </div>

                  {products.length === 0 && (
                    <div className="text-center space-y-4 mb-6">
                      <div className="flex justify-center space-x-4">
                        <Upload className="w-6 h-6 text-slate-400" />
                        <FileType className="w-6 h-6 text-slate-400" />
                        <Table className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-400">
                        Supported formats: CSV
                      </p>
                    </div>
                  )}

                  <DarkUploadComponent 
                    onUploadSuccess={handleUploadSuccess}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

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