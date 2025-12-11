import { useState, useRef } from "react";
import Table from "./Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../types/product";
import { exportToJSON, exportToXLS, exportToShopifyCSV } from "../utils/export";
import toast from "react-hot-toast";
import { Upload, X, FileText, Settings, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import CustomExportModal from "./CustomExportModal";

interface TableSectionProps {
  products: Product[];
  allProducts: Product[];
  columns: ColumnDef<Product>[];
  isLoading: boolean;
  onProductClick: (product: Product) => void;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  productNameFilter?: string[];
  onProductNameFilterChange?: (filter: string[]) => void;
}

export default function TableSection({ 
  products, 
  allProducts,
  columns, 
  isLoading, 
  onProductClick, 
  rowSelection, 
  onRowSelectionChange,
  productNameFilter = [],
  onProductNameFilterChange
}: TableSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [showCustomExportModal, setShowCustomExportModal] = useState(false);
  const [missingProductNames, setMissingProductNames] = useState<string[]>([]);
  const [showMissingNames, setShowMissingNames] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only accept text files
    if (!file.type.includes("text") && !file.name.endsWith(".txt")) {
      toast.error("Please upload a text file (.txt)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Split by newlines and filter out empty lines
        const productNames = content
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        if (productNames.length === 0) {
          toast.error("The file appears to be empty or has no valid product names");
          return;
        }

        if (onProductNameFilterChange) {
          // Find missing product names (names not found in allProducts)
          const productTitles = new Set(
            allProducts.map(p => p.title.toLowerCase().trim())
          );
          const missing = productNames.filter(
            name => !productTitles.has(name.toLowerCase().trim())
          );
          
          setMissingProductNames(missing);
          onProductNameFilterChange(productNames);
          setUploadedFileName(file.name);
          
          const foundCount = productNames.length - missing.length;
          if (missing.length > 0) {
            toast.success(
              `Loaded ${productNames.length} product name(s). ${foundCount} found, ${missing.length} missing.`,
              { duration: 5000 }
            );
          } else {
            toast.success(`Loaded ${productNames.length} product name(s) from file`);
          }
        }
      } catch (error) {
        toast.error("Failed to read the file. Please ensure it's a valid text file.");
        console.error("File read error:", error);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the file");
    };

    reader.readAsText(file);
  };

  const handleClearFilter = () => {
    if (onProductNameFilterChange) {
      onProductNameFilterChange([]);
      setUploadedFileName("");
      setMissingProductNames([]);
      setShowMissingNames(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Product name filter cleared");
    }
  };

  const getSelectedProducts = (): Product[] => {
    if (!rowSelection || Object.keys(rowSelection).length === 0) {
      return [];
    }
    return products.filter((product) => rowSelection[String(product.id)]);
  };

  const handleExport = (format: "json" | "xls" | "shopify") => {
    const selectedProducts = getSelectedProducts();
    const productsToExport = selectedProducts.length > 0 ? selectedProducts : products;
    
    // Determine filename based on what's being exported
    let filename: string;
    if (selectedProducts.length > 0) {
      filename = `selected-products-${new Date().toISOString().split("T")[0]}`;
    } else if (productNameFilter.length > 0) {
      filename = `filtered-products-${new Date().toISOString().split("T")[0]}`;
    } else {
      filename = `all-products-${new Date().toISOString().split("T")[0]}`;
    }

    try {
      switch (format) {
        case "json":
          exportToJSON(productsToExport, filename);
          toast.success(`Exported ${productsToExport.length} product(s) to JSON`);
          break;
        case "xls":
          exportToXLS(productsToExport, filename);
          toast.success(`Exported ${productsToExport.length} product(s) to Excel`);
          break;
        case "shopify":
          exportToShopifyCSV(productsToExport, filename);
          toast.success(`Exported ${productsToExport.length} product(s) to Shopify CSV`);
          break;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    }
  };

  const selectedCount = rowSelection ? Object.values(rowSelection).filter(Boolean).length : 0;

  return (
    <div className="relative bg-gradient-to-b from-blue-900 via-gray-900 to-gray-900 min-h-screen py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
          {/* Advanced Options - Mobile Only */}
          <div className="mb-4 sm:hidden">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-white/10 hover:bg-gray-700/40 transition-colors"
            >
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Options
              </span>
              {showAdvancedOptions ? (
                <ChevronUp className="w-4 h-4 text-white/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/60" />
              )}
            </button>
            {showAdvancedOptions && (
              <div className="mt-2 space-y-4">
                {/* Filter by Product Names Section - Mobile */}
                <div className="p-4 bg-gray-700/30 rounded-lg border border-white/10">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-white mb-2">
                        Filter by Product Names (Upload Text File)
                      </label>
                      <p className="text-xs text-white/60 mb-3">
                        Upload a text file with one product name per line. Only matching products will be shown.
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".txt,text/plain"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="product-names-file-input"
                        />
                        <label
                          htmlFor="product-names-file-input"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors cursor-pointer border border-blue-400/20 text-sm font-medium"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Product Names</span>
                        </label>
                        {productNameFilter.length > 0 && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-400/20 text-sm">
                            <FileText className="w-4 h-4" />
                            <span>
                              {uploadedFileName || `${productNameFilter.length} name(s) loaded`}
                            </span>
                            <button
                              onClick={handleClearFilter}
                              className="ml-2 p-1 hover:bg-green-500/30 rounded transition-colors"
                              title="Clear filter"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        {productNameFilter.length > 0 && missingProductNames.length > 0 && (
                          <button
                            onClick={() => setShowMissingNames(!showMissingNames)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg border border-yellow-400/20 text-sm transition-colors"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{missingProductNames.length} missing product(s)</span>
                            {showMissingNames ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    {productNameFilter.length > 0 && (
                      <div className="text-sm text-white/80">
                        <span className="font-semibold text-blue-400">{products.length}</span> of{" "}
                        <span className="font-semibold">{productNameFilter.length}</span> products found
                      </div>
                    )}
                  </div>
                  {/* Missing Products List - Mobile */}
                  {showMissingNames && missingProductNames.length > 0 && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Missing Product Names ({missingProductNames.length})
                        </h4>
                        <button
                          onClick={() => {
                            const text = missingProductNames.join('\n');
                            navigator.clipboard.writeText(text);
                            toast.success('Missing product names copied to clipboard');
                          }}
                          className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                        >
                          Copy all
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {missingProductNames.map((name, index) => (
                          <div
                            key={index}
                            className="text-sm text-yellow-300/80 py-1 px-2 bg-yellow-500/5 rounded border border-yellow-400/10"
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Export Section - Mobile */}
                <div className="p-4 bg-gray-700/30 rounded-lg border border-white/10">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-1">
                        Custom Export
                      </label>
                      <p className="text-xs text-white/60">
                        Create custom CSV/Excel with your own field mappings
                      </p>
                    </div>
                    <button
                      onClick={() => setShowCustomExportModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors border border-purple-400/20 text-sm font-medium w-full"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Custom Export</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* File Upload Section - Desktop */}
          <div className="mb-4 space-y-4 hidden sm:block">
            <div className="p-4 bg-gray-700/30 rounded-lg border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Filter by Product Names (Upload Text File)
                  </label>
                  <p className="text-xs text-white/60">
                    Upload a text file with one product name per line. Only matching products will be shown.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="product-names-file-input"
                  />
                  <label
                    htmlFor="product-names-file-input"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors cursor-pointer border border-blue-400/20 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Product Names</span>
                  </label>
                  {productNameFilter.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-400/20 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>
                        {uploadedFileName || `${productNameFilter.length} name(s) loaded`}
                      </span>
                      <button
                        onClick={handleClearFilter}
                        className="ml-2 p-1 hover:bg-green-500/30 rounded transition-colors"
                        title="Clear filter"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {productNameFilter.length > 0 && missingProductNames.length > 0 && (
                    <button
                      onClick={() => setShowMissingNames(!showMissingNames)}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg border border-yellow-400/20 text-sm transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{missingProductNames.length} missing product(s)</span>
                      {showMissingNames ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              {productNameFilter.length > 0 && (
                <div className="mt-3 text-sm text-white/80">
                  <span className="font-semibold text-blue-400">{products.length}</span> of{" "}
                  <span className="font-semibold">{productNameFilter.length}</span> products found
                </div>
              )}
              {/* Missing Products List */}
              {showMissingNames && missingProductNames.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Missing Product Names ({missingProductNames.length})
                    </h4>
                    <button
                      onClick={() => {
                        const text = missingProductNames.join('\n');
                        navigator.clipboard.writeText(text);
                        toast.success('Missing product names copied to clipboard');
                      }}
                      className="text-xs text-yellow-400 hover:text-yellow-300 underline"
                    >
                      Copy all
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {missingProductNames.map((name, index) => (
                      <div
                        key={index}
                        className="text-sm text-yellow-300/80 py-1 px-2 bg-yellow-500/5 rounded border border-yellow-400/10"
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Export Section */}
            <div className="p-4 bg-gray-700/30 rounded-lg border border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-sm font-semibold text-white mb-1">
                    Custom Export
                  </label>
                  <p className="text-xs text-white/60">
                    Create custom CSV/Excel with your own field mappings
                  </p>
                </div>
                <button
                  onClick={() => setShowCustomExportModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors border border-purple-400/20 text-sm font-medium w-full sm:w-auto"
                >
                  <Settings className="w-4 h-4" />
                  <span>Custom Export</span>
                </button>
              </div>
            </div>
          </div>

          <Table
            data={products}
            columns={columns}
            pageSize={10}
            isLoading={isLoading}
            darkMode={true}
            onRowClick={onProductClick}
            rowSelection={rowSelection}
            onRowSelectionChange={onRowSelectionChange}
            getRowId={(row) => String(row.id)}
            onExport={handleExport}
            selectedCount={selectedCount}
          />
        </div>
      </div>

      {/* Custom Export Modal */}
      {showCustomExportModal && (
        <CustomExportModal
          products={products}
          onClose={() => setShowCustomExportModal(false)}
        />
      )}
    </div>
  );
}
