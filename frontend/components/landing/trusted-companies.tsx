"use client";

import { motion } from "framer-motion";
import { trustedCompanies } from "@/lib/demo-data";

export function TrustedCompanies() {
  return (
    <section className="py-12 border-y border-border/40 bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Trusted by professionals from leading companies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {trustedCompanies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-bold text-lg">
                {company.logo}
              </div>
              <span className="font-medium hidden sm:inline">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
